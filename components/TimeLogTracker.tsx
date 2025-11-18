
import React, { useState, useMemo, useEffect, useContext } from 'react';
import type { Personnel, TimeLog } from '../types';
import { DatabaseService } from '../services/databaseService';
import { AppContext } from '../contexts/AppContext';

interface TimeLogTrackerProps {
    personnel: Personnel;
    onUpdate: () => void;
}

const calculateDuration = (checkIn: string, checkOut: string): number => {
    if (!checkIn || !checkOut) return 0;
    try {
        const [inHours, inMinutes] = checkIn.split(':').map(Number);
        let [outHours, outMinutes] = checkOut.split(':').map(Number);
        
        let totalInMinutes = inHours * 60 + inMinutes;
        let totalOutMinutes = outHours * 60 + outMinutes;
        
        // Handle overnight shifts
        if (totalOutMinutes < totalInMinutes) {
            totalOutMinutes += 24 * 60; // Add 24 hours in minutes
        }
        
        const diffMinutes = totalOutMinutes - totalInMinutes;
        
        return diffMinutes / 60; // Convert minutes to hours
    } catch(e) {
        console.error("Error calculating duration:", e);
        return 0;
    }
};

const calculatePeriodStats = (logs: TimeLog[]) => {
    let totalWorked = 0;
    const uniqueDays = new Set<string>();

    logs.forEach(log => {
        totalWorked += calculateDuration(log.checkIn, log.checkOut);
        uniqueDays.add(log.date);
    });

    const workDaysCount = uniqueDays.size;
    const requiredHours = workDaysCount * 8; 
    
    const overtime = Math.max(0, totalWorked - requiredHours);
    const undertime = Math.max(0, requiredHours - totalWorked);

    return { totalWorked, requiredHours, overtime, undertime, workDaysCount };
};

const getDayName = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('tr-TR', { weekday: 'long' });
};

const getDefaultTimes = (dateStr: string) => {
    const date = new Date(dateStr);
    const day = date.getDay(); // 0 = Sunday, 6 = Saturday
    
    const checkIn = '08:30';
    let checkOut = '18:00';
    
    if (day === 6) { // Saturday
        checkOut = '14:30';
    }
    
    return { checkIn, checkOut };
};

const TimeLogTracker: React.FC<TimeLogTrackerProps> = ({ personnel, onUpdate }) => {
    const { currentUser } = useContext(AppContext);
    const isAdmin = currentUser?.role === 'admin';
    
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];
    const todayStr = today.toISOString().split('T')[0];

    // Initial defaults based on today's date
    const initialDefaults = getDefaultTimes(todayStr);
    const defaultLogState = { date: todayStr, checkIn: initialDefaults.checkIn, checkOut: initialDefaults.checkOut };

    const [formData, setFormData] = useState(defaultLogState);
    const [selectedLogId, setSelectedLogId] = useState<string | null>(null);
    
    // Filter State
    const [filterStart, setFilterStart] = useState(firstDayOfMonth);
    const [filterEnd, setFilterEnd] = useState(lastDayOfMonth);

    useEffect(() => {
        handleClearSelection();
        // Reset filters when personnel changes
        setFilterStart(firstDayOfMonth);
        setFilterEnd(lastDayOfMonth);
    }, [personnel]);
    
    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Security: Non-admins can only log for today
        if (!isAdmin && e.target.value !== todayStr) {
            alert('Geçmiş veya gelecek tarihe kayıt giremezsiniz.');
            return;
        }

        const newDate = e.target.value;
        if (!selectedLogId) {
            const defaults = getDefaultTimes(newDate);
            setFormData({
                ...formData,
                date: newDate,
                checkIn: defaults.checkIn,
                checkOut: defaults.checkOut
            });
        } else {
            setFormData({ ...formData, date: newDate });
        }
    };

    const handleSelectLog = (log: TimeLog) => {
        // Non-admins cannot select/edit existing logs, effectively preventing modification/deletion
        if (!isAdmin) {
            return;
        }
        setSelectedLogId(log.id);
        setFormData({
            date: log.date,
            checkIn: log.checkIn,
            checkOut: log.checkOut
        });
    };
    
    const handleClearSelection = () => {
        setSelectedLogId(null);
        // Reset to today's defaults
        const defaults = getDefaultTimes(todayStr);
        setFormData({ date: todayStr, checkIn: defaults.checkIn, checkOut: defaults.checkOut });
    };

    const handleSaveTimeLog = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Double check date security
        if (!isAdmin && formData.date !== todayStr) {
            alert("Sadece bugün için giriş yapabilirsiniz.");
            return;
        }

        if (!formData.date || !formData.checkIn || !formData.checkOut) {
            alert('Lütfen tüm alanları doldurun.');
            return;
        }

        if (selectedLogId) {
            if(!isAdmin) {
                alert("Kayıt güncelleme yetkiniz yok.");
                return;
            }
            DatabaseService.updateTimeLog({
                id: selectedLogId,
                personnelId: personnel.id,
                ...formData
            });
            alert('Giriş/Çıkış saati güncellendi.');
        } else {
            DatabaseService.addTimeLog({
                personnelId: personnel.id,
                ...formData
            });
            alert('Giriş/Çıkış saati eklendi.');
        }
        
        onUpdate();
        handleClearSelection();
    };

    const handleDeleteLog = () => {
        if (!isAdmin) {
            alert('Silme yetkiniz yok.');
            return;
        }
        if (!selectedLogId) {
            alert("Lütfen silmek için bir kayıt seçin.");
            return;
        }
        if (window.confirm("Seçili zaman kaydını silmek istediğinizden emin misiniz?")) {
            DatabaseService.deleteTimeLog(selectedLogId, personnel.id);
            onUpdate();
            alert('Kayıt silindi.');
            handleClearSelection();
        }
    };

    const timeLogs = personnel.timeLogs || [];

    const filteredLogs = useMemo(() => {
        return timeLogs.filter(log => 
            log.date >= filterStart && log.date <= filterEnd
        ).sort((a, b) => b.date.localeCompare(a.date));
    }, [timeLogs, filterStart, filterEnd]);

    const stats = useMemo(() => {
        return calculatePeriodStats(filteredLogs);
    }, [filteredLogs]);

    // Get Today's Log
    const todaysLog = timeLogs.find(log => log.date === todayStr);

    return (
        <div className="p-2 border bg-gray-200 shadow-inner">
            <div className="flex justify-between items-center border-b pb-1 mb-2">
                <h2 className="font-bold">GÜNLÜK GİRİŞ-ÇIKIŞ SAATLERİ</h2>
                {todaysLog && (
                    <div className="text-xs bg-green-100 border border-green-400 px-2 py-0.5 rounded text-green-800 font-bold animate-pulse">
                        🟢 Bugün Giriş: {todaysLog.checkIn}
                    </div>
                )}
                {!todaysLog && (
                    <div className="text-xs bg-red-100 border border-red-400 px-2 py-0.5 rounded text-red-800 font-bold">
                        🔴 Bugün Giriş Yok
                    </div>
                )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left Side: Form */}
                <div>
                    <h3 className="font-semibold mb-1">{selectedLogId ? 'Kaydı Düzenle' : 'Yeni Giriş Ekle'}</h3>
                    <form onSubmit={handleSaveTimeLog} className="space-y-2">
                        <div className="grid grid-cols-3 items-center">
                            <label htmlFor="log-date">Tarih:</label>
                            <input
                                id="log-date"
                                type="date"
                                value={formData.date}
                                onChange={handleDateChange}
                                className={`col-span-2 border border-gray-400 px-1 bg-white ${!isAdmin ? 'bg-gray-100' : ''}`}
                                readOnly={!isAdmin} // Standard users locked to today
                            />
                        </div>
                        <div className="col-span-3 text-right text-xs text-gray-500 mb-1 pr-1">
                            {getDayName(formData.date)}
                        </div>
                        <div className="grid grid-cols-3 items-center">
                            <label htmlFor="log-checkin">Giriş Saati:</label>
                            <input
                                id="log-checkin"
                                type="time"
                                value={formData.checkIn}
                                onChange={e => setFormData({ ...formData, checkIn: e.target.value })}
                                className="col-span-2 border border-gray-400 px-1 bg-white"
                            />
                        </div>
                        <div className="grid grid-cols-3 items-center">
                            <label htmlFor="log-checkout">Çıkış Saati:</label>
                            <input
                                id="log-checkout"
                                type="time"
                                value={formData.checkOut}
                                onChange={e => setFormData({ ...formData, checkOut: e.target.value })}
                                className="col-span-2 border border-gray-400 px-1 bg-white"
                            />
                        </div>
                        <div className="flex justify-end space-x-2 pt-1">
                             <button type="button" onClick={handleClearSelection} className="px-4 py-1 bg-gray-300 border border-gray-400 rounded shadow-sm hover:bg-gray-400">Yeni</button>
                             <button type="submit" className="px-4 py-1 bg-blue-500 text-white font-semibold border border-blue-600 rounded shadow-sm hover:bg-blue-600">
                                {selectedLogId ? 'Güncelle' : 'Ekle'}
                             </button>
                             {selectedLogId && isAdmin && (
                                <button type="button" onClick={handleDeleteLog} className="px-4 py-1 bg-red-500 text-white border border-red-600 rounded shadow-sm hover:bg-red-600">
                                    Sil
                                </button>
                             )}
                        </div>
                    </form>
                </div>

                {/* Right Side: List and Stats */}
                <div className="flex flex-col h-full">
                     <div className="mb-2 bg-gray-100 p-1 border border-gray-300 text-xs">
                        <div className="flex space-x-2 mb-1 items-center">
                            <span>Filtre:</span>
                            <input type="date" value={filterStart} onChange={e => setFilterStart(e.target.value)} className="border px-1 w-24"/>
                            <span>-</span>
                            <input type="date" value={filterEnd} onChange={e => setFilterEnd(e.target.value)} className="border px-1 w-24"/>
                        </div>
                        <div className="grid grid-cols-2 gap-x-2 font-semibold">
                            <span className="text-blue-800">Çalışma: {stats.totalWorked.toFixed(2)} sa</span>
                            <span className="text-gray-600">Gün: {stats.workDaysCount}</span>
                            <span className="text-green-600">Fazla M: {stats.overtime.toFixed(2)} sa</span>
                            <span className="text-red-600">Eksik Ç: {stats.undertime.toFixed(2)} sa</span>
                        </div>
                     </div>

                    <div className="flex-1 overflow-y-auto border bg-white p-1 h-40">
                        {filteredLogs.length > 0 ? (
                            <ul className="text-xs">
                                {filteredLogs.map(log => (
                                    <li 
                                        key={log.id} 
                                        onClick={() => handleSelectLog(log)}
                                        className={`border-b last:border-b-0 py-1 flex justify-between items-center ${isAdmin ? 'cursor-pointer hover:bg-blue-100' : ''} ${selectedLogId === log.id ? 'bg-blue-600 text-white hover:bg-blue-700' : ''}`}
                                    >
                                       <span className="px-1">
                                           <strong>{new Date(log.date).toLocaleDateString('tr-TR')} ({getDayName(log.date)})</strong>: {log.checkIn} - {log.checkOut}
                                       </span>
                                       <span className={`font-semibold px-1 ${selectedLogId === log.id ? 'text-white' : 'text-blue-700'}`}>
                                            ({calculateDuration(log.checkIn, log.checkOut).toFixed(2)} sa)
                                       </span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-center text-gray-500 mt-4">Bu tarih aralığında kayıt yok.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TimeLogTracker;
