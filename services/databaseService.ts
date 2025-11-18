
import type { User, Personnel, LeaveRecord, TimeLog } from '../types';
import { samplePersonnel } from './sampleData';

// Declare global variable for library loaded via CDN
declare const pdfjsLib: any;

const DB_VERSION = 2; // Incremented version to force refresh
const DB_VERSION_KEY = 'personnel_app_db_version';
const USERS_KEY = 'personnel_app_users';
const PERSONNEL_KEY = 'personnel_app_personnel';

// Helper to calculate days between two dates
const calculateDays = (startDate: string, endDate: string): number => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || end < start) return 0;
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Inclusive
    return diffDays;
};

// Helper to parse Turkish Date (DD.MM.YYYY) to ISO (YYYY-MM-DD)
const parseTurkishDate = (dateStr: string): string | null => {
    const parts = dateStr.split('.');
    if (parts.length === 3) {
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return null;
};

export class DatabaseService {
    public static initDB() {
        const dbVersion = parseInt(localStorage.getItem(DB_VERSION_KEY) || '0', 10);

        // Reset DB if version mismatch to load new real data
        if (dbVersion < DB_VERSION) {
            // Initial setup
            const adminUser: User = { id: 1, username: 'admin', password: '1234', role: 'admin' };
            // Link standard user to Ahmet Küçükateş (from sampleData)
            const standardUser: User = { id: 2, username: 'ahmet', password: '1234', role: 'user', personnelId: '10909274686' };
            
            localStorage.setItem(USERS_KEY, JSON.stringify([adminUser, standardUser]));
            localStorage.setItem(PERSONNEL_KEY, JSON.stringify(samplePersonnel));
            localStorage.setItem(DB_VERSION_KEY, String(DB_VERSION));
        }
    }
    
    // User Management
    public static getUsers(): User[] {
        return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    }
    
    public static findUser(username: string): User | undefined {
        return this.getUsers().find(u => u.username === username);
    }
    
    public static createUser(user: Omit<User, 'id'>): User {
        const users = this.getUsers();
        const newUser: User = { ...user, id: Date.now() };
        users.push(newUser);
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
        return newUser;
    }

    public static updateUser(user: User): User {
        const users = this.getUsers();
        const index = users.findIndex(u => u.id === user.id);
        if (index !== -1) {
            users[index] = { ...users[index], ...user };
            localStorage.setItem(USERS_KEY, JSON.stringify(users));
            return users[index];
        }
        throw new Error('User not found');
    }

    public static deleteUser(userId: number): void {
        let users = this.getUsers();
        users = users.filter(u => u.id !== userId);
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
    
    // Personnel Management
    public static getPersonnel(): Personnel[] {
        return JSON.parse(localStorage.getItem(PERSONNEL_KEY) || '[]');
    }
    
    public static getPersonnelById(id: string): Personnel | undefined {
        return this.getPersonnel().find(p => p.id === id);
    }
    
    public static savePersonnel(personnel: Personnel): Personnel {
        let personnelList = this.getPersonnel();
        const existingIndex = personnelList.findIndex(p => p.id === personnel.id);

        if (existingIndex > -1) {
            personnelList[existingIndex] = personnel;
        } else {
            personnelList.push(personnel);
        }
        localStorage.setItem(PERSONNEL_KEY, JSON.stringify(personnelList));
        return personnel;
    }

    public static deletePersonnel(id: string): void {
        let personnelList = this.getPersonnel();
        personnelList = personnelList.filter(p => p.id !== id);
        localStorage.setItem(PERSONNEL_KEY, JSON.stringify(personnelList));
    }

    // Import from PDF Logic
    public static async importFromPdf(file: File): Promise<{ success: boolean, message: string, personnel?: Personnel }> {
        try {
            if (!pdfjsLib) {
                return { success: false, message: 'PDF kütüphanesi yüklenemedi.' };
            }

            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
            
            // Extract text from the first page
            const page = await pdf.getPage(1);
            const textContent = await page.getTextContent();
            const items = textContent.items.map((item: any) => item.str);
            const fullText = items.join(' '); 

            // --- PARSING LOGIC START ---
            
            // 1. Extract TC NO (11 digits)
            const tcMatch = fullText.match(/\b[1-9][0-9]{10}\b/);
            const tcNo = tcMatch ? tcMatch[0] : null;

            if (!tcNo) {
                return { success: false, message: 'PDF dosyasında T.C. Kimlik Numarası bulunamadı.' };
            }

            // 2. Extract Name
            let name = "";
            // Try finding "Adı Soyadı" and grabbing subsequent text
            const nameHeaderIndex = items.findIndex((s: string) => s.includes("Adı Soyadı") || s.includes("ADI SOYADI") || s.includes("Adı-Soyadı"));
            if (nameHeaderIndex !== -1 && items[nameHeaderIndex + 1]) {
                name = items[nameHeaderIndex + 1].trim();
            }
            if (!name || name.length < 3) name = "BİLİNMEYEN PERSONEL"; 

            // 3. Extract Entry Date (İşe Giriş)
            let entryDate: string | undefined = undefined;
            const dateRegex = /(\d{2})\.(\d{2})\.(\d{4})/;
            const entryIndex = items.findIndex((s: string) => s.includes("İşe Giriş") || s.includes("Giriş Tarihi"));
            
            if (entryIndex !== -1) {
                for (let i = 1; i < 10; i++) {
                    const match = items[entryIndex + i]?.match(dateRegex);
                    if (match) {
                        const parsed = parseTurkishDate(match[0]);
                        if (parsed) entryDate = parsed;
                        break;
                    }
                }
            }

            // 4. Extract Salary
            let salary = 0;
            const salaryHeaders = ["Net Ödenen", "Ödenecek Tutar", "Net Ücret", "Ele Geçen"];
            for (const header of salaryHeaders) {
                 const idx = items.findIndex((s: string) => s.includes(header));
                 if (idx !== -1) {
                     for (let i = 1; i < 20; i++) { 
                         const val = items[idx + i];
                         if (val && /[\d\.,]+/.test(val)) {
                             const cleanVal = val.replace(/\./g, '').replace(',', '.');
                             const num = parseFloat(cleanVal);
                             if (!isNaN(num) && num > 1000) { 
                                 salary = num;
                                 break;
                             }
                         }
                     }
                     if (salary > 0) break;
                 }
            }
            
            // 5. Extract SGK No
            let sgkNo = "";
            const sgkMatch = fullText.match(/\b\d{13}\b/) || fullText.match(/\b\d{9,13}\b/); 
            if (sgkMatch && sgkMatch[0] !== tcNo) sgkNo = sgkMatch[0];

            // 6. Extract Phone Number (Improved)
            let phone = "";
            const phoneRegex = /(0\s?5\d{2})\s?\d{3}\s?\d{2}\s?\d{2}/;
            const phoneMatch = fullText.match(phoneRegex);
            if (phoneMatch) {
                phone = phoneMatch[0].replace(/\s/g, '');
            }

            // 7. Extract Address (Heuristic)
            let address = "";
            const addrIndex = items.findIndex((s: string) => s.toLowerCase().includes('adres') || s.toLowerCase().includes('ikametgah'));
            if (addrIndex !== -1) {
                // Grab next few lines
                let extractedAddr = "";
                for(let i = 1; i < 5; i++) {
                    const part = items[addrIndex + i];
                    if (part && part.length > 5) {
                        extractedAddr += part + " ";
                    }
                }
                address = extractedAddr.trim();
            }

            // 8. Extract Job Title (Unvan/Görevi)
            let jobTitle = "Personel";
            const jobIndex = items.findIndex((s: string) => s.toLowerCase().includes('görevi') || s.toLowerCase().includes('unvanı') || s.toLowerCase().includes('ünvanı'));
            if (jobIndex !== -1 && items[jobIndex + 1]) {
                jobTitle = items[jobIndex + 1].trim();
            }


            // --- DATABASE UPSERT ---
            let personnelList = this.getPersonnel();
            const existingIndex = personnelList.findIndex(p => p.id === tcNo);
            
            let savedPersonnel: Personnel;

            if (existingIndex > -1) {
                const p = personnelList[existingIndex];
                if (entryDate) p.iseGirisTarihi = entryDate;
                if (salary > 0) {
                     p.baseSalary = salary; 
                     p.hourlyRate = salary / 225; 
                }
                if (sgkNo) p.sgkNo = sgkNo;
                if (name && name !== "BİLİNMEYEN PERSONEL") p.adSoyad = name;
                if (phone) p.telefon = phone;
                if (address) p.adres = address;
                if (jobTitle && jobTitle !== "Personel") p.gorevi = jobTitle;

                personnelList[existingIndex] = p;
                savedPersonnel = p;
            } else {
                savedPersonnel = {
                    id: tcNo,
                    sicilNo: Math.floor(Math.random() * 10000).toString(),
                    adSoyad: name,
                    gorevi: jobTitle,
                    iseGirisTarihi: entryDate,
                    baseSalary: salary,
                    hourlyRate: salary > 0 ? salary / 225 : 0,
                    sgkNo: sgkNo,
                    telefon: phone,
                    adres: address,
                    leaves: [],
                    timeLogs: [],
                    bonuses: [],
                    deductions: [],
                    documents: []
                };
                personnelList.push(savedPersonnel);
            }

            localStorage.setItem(PERSONNEL_KEY, JSON.stringify(personnelList));
            return { success: true, message: `Personel (${tcNo}) verileri PDF'den başarıyla çekildi.`, personnel: savedPersonnel };

        } catch (error) {
            console.error("PDF Import Error:", error);
            return { success: false, message: 'PDF okuma hatası: ' + (error instanceof Error ? error.message : String(error)) };
        }
    }
    
    // Leave Management
    public static addLeave(leaveRequest: Omit<LeaveRecord, 'id' | 'status' | 'kacGun'>): LeaveRecord {
        const personnel = this.getPersonnelById(leaveRequest.personnelId);
        if (!personnel) throw new Error("Personnel not found");

        const newLeave: LeaveRecord = { 
            ...leaveRequest, 
            id: `leave_${Date.now()}`,
            status: 'pending',
            kacGun: calculateDays(leaveRequest.startDate, leaveRequest.endDate)
        };
        personnel.leaves.push(newLeave);
        this.savePersonnel(personnel);
        return newLeave;
    }

    public static updateLeaveStatus(leaveId: string, personnelId: string, status: 'approved' | 'rejected'): LeaveRecord {
        const personnel = this.getPersonnelById(personnelId);
        if (!personnel) throw new Error("Personnel not found for status update");

        const leaveIndex = personnel.leaves.findIndex(l => l.id === leaveId);
        if (leaveIndex === -1) throw new Error("Leave record not found");

        personnel.leaves[leaveIndex].status = status;
        this.savePersonnel(personnel);
        return personnel.leaves[leaveIndex];
    }

    // Time Log Management
    public static addTimeLog(log: Omit<TimeLog, 'id'>): TimeLog {
        const personnel = this.getPersonnelById(log.personnelId);
        if (!personnel) throw new Error("Personnel not found");

        const newLog: TimeLog = { ...log, id: `log_${Date.now()}` };
        if(!personnel.timeLogs) personnel.timeLogs = [];
        personnel.timeLogs.push(newLog);
        this.savePersonnel(personnel);
        return newLog;
    }

    public static updateTimeLog(updatedLog: TimeLog): TimeLog {
        const personnel = this.getPersonnelById(updatedLog.personnelId);
        if (!personnel) throw new Error("Personnel not found for time log update");
    
        const logIndex = personnel.timeLogs.findIndex(l => l.id === updatedLog.id);
        if (logIndex === -1) throw new Error("Time log record not found");
    
        personnel.timeLogs[logIndex] = updatedLog;
        this.savePersonnel(personnel);
        return personnel.timeLogs[logIndex];
    }
    
    public static deleteTimeLog(logId: string, personnelId: string): void {
        const personnel = this.getPersonnelById(personnelId);
        if (!personnel) throw new Error("Personnel not found for time log deletion");
    
        personnel.timeLogs = personnel.timeLogs.filter(l => l.id !== logId);
        this.savePersonnel(personnel);
    }
    
    // Batch Import (e.g. from Device)
    public static addTimeLogsBatch(logs: Omit<TimeLog, 'id'>[]): void {
        let personnelList = this.getPersonnel();
        let updated = false;

        logs.forEach(log => {
            const pIndex = personnelList.findIndex(p => p.id === log.personnelId);
            if (pIndex !== -1) {
                const newLog: TimeLog = { ...log, id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` };
                if (!personnelList[pIndex].timeLogs) personnelList[pIndex].timeLogs = [];
                personnelList[pIndex].timeLogs.push(newLog);
                updated = true;
            }
        });

        if (updated) {
            localStorage.setItem(PERSONNEL_KEY, JSON.stringify(personnelList));
        }
    }

    // Backup & Restore
    public static backupData(): string {
        const data = {
            version: DB_VERSION,
            users: this.getUsers(),
            personnel: this.getPersonnel(),
        };
        return JSON.stringify(data, null, 2);
    }

    public static triggerBackupDownload(): void {
        try {
            const jsonData = this.backupData();
            const blob = new Blob([jsonData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            const date = new Date().toISOString().slice(0, 10);
            a.download = `personnel_db_backup_${date}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Backup failed:", error);
            alert("Yedekleme sırasında bir hata oluştu.");
        }
    }

    public static restoreData(jsonData: string): { success: boolean, message: string } {
        try {
            const data = JSON.parse(jsonData);
            if (data.users && data.personnel) {
                localStorage.setItem(USERS_KEY, JSON.stringify(data.users));
                localStorage.setItem(PERSONNEL_KEY, JSON.stringify(data.personnel));
                localStorage.setItem(DB_VERSION_KEY, String(data.version || DB_VERSION));
                return { success: true, message: 'Veritabanı başarıyla geri yüklendi. Değişiklikleri görmek için lütfen sayfayı yenileyin.' };
            } else {
                throw new Error('Invalid backup file format');
            }
        } catch (error) {
            console.error("Restore failed:", error);
            const message = error instanceof Error ? error.message : 'Bilinmeyen bir hata oluştu.';
            return { success: false, message: `Geri yükleme başarısız oldu: ${message}` };
        }
    }
}
