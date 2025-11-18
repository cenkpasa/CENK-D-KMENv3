
import React, { useMemo } from 'react';
import type { Personnel, LeaveRecord } from '../types';
import { DatabaseService } from '../services/databaseService';

interface LeaveManagementProps {
    allPersonnel: Personnel[];
    onUpdate: () => void;
}

const LeaveManagement: React.FC<LeaveManagementProps> = ({ allPersonnel, onUpdate }) => {
    
    const pendingRequests = useMemo(() => {
        const requests: (LeaveRecord & { adSoyad: string })[] = [];
        allPersonnel.forEach(p => {
            p.leaves.forEach(l => {
                if (l.status === 'pending') {
                    requests.push({ ...l, adSoyad: p.adSoyad });
                }
            });
        });
        return requests.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
    }, [allPersonnel]);

    const handleApprove = (leave: LeaveRecord & { adSoyad: string }) => {
        if(window.confirm(`${leave.adSoyad} isimli personelin izin talebini onaylamak istediğinizden emin misiniz?`)){
            DatabaseService.updateLeaveStatus(leave.id, leave.personnelId, 'approved');
            onUpdate();
        }
    };

    const handleReject = (leave: LeaveRecord & { adSoyad: string }) => {
         if(window.confirm(`${leave.adSoyad} isimli personelin izin talebini reddetmek istediğinizden emin misiniz?`)){
            DatabaseService.updateLeaveStatus(leave.id, leave.personnelId, 'rejected');
            onUpdate();
        }
    };

    return (
        <div className="p-2 border bg-gray-200 shadow-inner">
            <h2 className="font-bold border-b pb-1 mb-2 text-gray-800">BEKLEYEN İZİN TALEPLERİ</h2>
            {pendingRequests.length > 0 ? (
                <div className="h-48 overflow-y-auto bg-white border border-gray-400">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-gray-100 sticky top-0 z-10 shadow-sm">
                            <tr>
                                <th className="p-2 border-b font-bold text-gray-700">Personel</th>
                                <th className="p-2 border-b font-bold text-gray-700">Başlangıç</th>
                                <th className="p-2 border-b font-bold text-gray-700">Bitiş</th>
                                <th className="p-2 border-b font-bold text-gray-700">Gün</th>
                                <th className="p-2 border-b font-bold text-gray-700">Tür</th>
                                <th className="p-2 border-b font-bold text-gray-700">Açıklama</th>
                                <th className="p-2 border-b font-bold text-gray-700 text-center">Eylemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pendingRequests.map(req => (
                                <tr key={req.id} className="hover:bg-yellow-50 transition-colors border-b last:border-b-0">
                                    <td className="p-2 font-semibold text-blue-800">{req.adSoyad}</td>
                                    <td className="p-2">{new Date(req.startDate).toLocaleDateString('tr-TR')}</td>
                                    <td className="p-2">{new Date(req.endDate).toLocaleDateString('tr-TR')}</td>
                                    <td className="p-2 font-bold">{req.kacGun}</td>
                                    <td className="p-2">{req.izinCesidi}</td>
                                    <td className="p-2 truncate max-w-[150px]" title={req.aciklama}>{req.aciklama}</td>
                                    <td className="p-2 text-center whitespace-nowrap">
                                        <button onClick={() => handleApprove(req)} className="px-2 py-1 text-xs bg-green-500 text-white rounded border border-green-600 hover:bg-green-600 mr-1 shadow-sm">Onayla</button>
                                        <button onClick={() => handleReject(req)} className="px-2 py-1 text-xs bg-red-500 text-white rounded border border-red-600 hover:bg-red-600 shadow-sm">Reddet</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="text-center text-gray-500 py-6 bg-white border border-gray-300 flex items-center justify-center italic rounded-sm">
                    <span className="mr-2">✓</span> Şu anda onay bekleyen izin talebi bulunmamaktadır.
                </div>
            )}
        </div>
    );
};

export default LeaveManagement;
