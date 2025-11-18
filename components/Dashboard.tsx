
import React, { useState, useEffect } from 'react';
import { Personnel } from '../types';

interface DashboardProps {
    personnelList: Personnel[];
}

const Dashboard: React.FC<DashboardProps> = ({ personnelList }) => {
    const [stats, setStats] = useState({
        present: 0,
        late: 0,
        absent: 0,
        total: 0
    });
    const [lastUpdated, setLastUpdated] = useState(new Date());

    useEffect(() => {
        const calculateStats = () => {
            const todayStr = new Date().toISOString().split('T')[0];
            const now = new Date();
            const workStartHour = 8;
            const workStartMinute = 45; // Grace period 15 mins from 08:30

            let present = 0;
            let late = 0;
            let absent = 0;

            personnelList.forEach(p => {
                const log = p.timeLogs?.find(l => l.date === todayStr);
                
                if (log) {
                    present++;
                    const [h, m] = log.checkIn.split(':').map(Number);
                    if (h > workStartHour || (h === workStartHour && m > workStartMinute)) {
                        late++;
                    }
                } else {
                    absent++;
                }
            });

            setStats({
                present,
                late,
                absent,
                total: personnelList.length
            });
            setLastUpdated(new Date());
        };

        calculateStats();
        // Refresh every minute
        const interval = setInterval(calculateStats, 60000);
        return () => clearInterval(interval);
    }, [personnelList]);

    const handleSendEmailReport = () => {
        const todayStr = new Date().toISOString().split('T')[0];
        const todayDisplay = new Date().toLocaleDateString('tr-TR');
        
        const absents = personnelList.filter(p => !p.timeLogs?.some(l => l.date === todayStr));
        const lates = personnelList.filter(p => {
            const log = p.timeLogs?.find(l => l.date === todayStr);
            if (!log) return false;
            const [h, m] = log.checkIn.split(':').map(Number);
            return (h > 8 || (h === 8 && m > 45));
        });

        let body = `Sayın Cenk Dikmen,\n\n${todayDisplay} Tarihli Günlük Personel Devam Raporu:\n\n`;
        
        body += `TOPLAM PERSONEL: ${personnelList.length}\n`;
        body += `GELEN: ${stats.present}\n`;
        body += `GELMEYEN: ${stats.absent}\n`;
        body += `GEÇ KALAN: ${stats.late}\n\n`;
        
        if (lates.length > 0) {
            body += "--- GEÇ KALANLAR ---\n";
            lates.forEach(p => {
                const log = p.timeLogs?.find(l => l.date === todayStr);
                body += `- ${p.adSoyad} (Giriş: ${log?.checkIn})\n`;
            });
            body += "\n";
        }

        if (absents.length > 0) {
            body += "--- GELMEYENLER ---\n";
            absents.forEach(p => {
                body += `- ${p.adSoyad}\n`;
            });
        }

        const subject = `Günlük Personel Raporu - ${todayDisplay}`;
        window.location.href = `mailto:cenk@cnkkesicitakim.com.tr?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    };

    return (
        <div className="bg-white border border-gray-300 p-2 shadow-sm mb-2">
            <div className="flex justify-between items-center border-b pb-2 mb-2">
                <div>
                    <h2 className="font-bold text-gray-800 text-sm">CANLI PERSONEL DURUMU</h2>
                    <p className="text-[10px] text-gray-500">Son Güncelleme: {lastUpdated.toLocaleTimeString()}</p>
                </div>
                <button 
                    onClick={handleSendEmailReport}
                    className="px-3 py-1 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded shadow flex items-center gap-1"
                >
                    <span>📧</span> RAPORU MAİL AT
                </button>
            </div>
            
            <div className="grid grid-cols-4 gap-2 text-center">
                <div className="bg-blue-50 p-2 rounded border border-blue-200">
                    <span className="block text-xl font-bold text-blue-700">{stats.total}</span>
                    <span className="text-[10px] text-blue-600 font-bold uppercase">Toplam</span>
                </div>
                <div className="bg-green-50 p-2 rounded border border-green-200">
                    <span className="block text-xl font-bold text-green-700">{stats.present}</span>
                    <span className="text-[10px] text-green-600 font-bold uppercase">İçerde</span>
                </div>
                <div className="bg-yellow-50 p-2 rounded border border-yellow-200">
                    <span className="block text-xl font-bold text-yellow-700">{stats.late}</span>
                    <span className="text-[10px] text-yellow-600 font-bold uppercase">Geç Kalan</span>
                </div>
                <div className="bg-red-50 p-2 rounded border border-red-200">
                    <span className="block text-xl font-bold text-red-700">{stats.absent}</span>
                    <span className="text-[10px] text-red-600 font-bold uppercase">Gelmeyen</span>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
