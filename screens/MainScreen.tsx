
import React, { useState, useEffect, useCallback, useContext } from 'react';
import type { Personnel } from '../types';
import { DatabaseService } from '../services/databaseService';
import PersonnelTable from '../components/PersonnelTable';
import PersonnelDetails from '../components/PersonnelDetails';
import LeaveTracker from '../components/LeaveTracker';
import TimeLogTracker from '../components/TimeLogTracker';
import Reporting from '../components/Reporting';
import UserManagementScreen from './UserManagementScreen';
import LeaveManagement from '../components/LeaveManagement';
import DeviceIntegration from '../components/DeviceIntegration';
import DocumentGenerator from '../components/DocumentGenerator';
import Dashboard from '../components/Dashboard';
import CompensationCalculator from '../components/CompensationCalculator';
import { AppContext } from '../contexts/AppContext';

const MainScreen: React.FC = () => {
    const [personnelList, setPersonnelList] = useState<Personnel[]>([]);
    const [allPersonnelForReport, setAllPersonnelForReport] = useState<Personnel[]>([]);
    const [selectedPersonnel, setSelectedPersonnel] = useState<Personnel | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showUserManagement, setShowUserManagement] = useState(false);
    const [showDeviceIntegration, setShowDeviceIntegration] = useState(false);
    const [showDocGenerator, setShowDocGenerator] = useState(false);
    const [showCompensationCalc, setShowCompensationCalc] = useState(false);
    const { currentUser, logout } = useContext(AppContext);

    const loadPersonnel = useCallback(() => {
        const allData = DatabaseService.getPersonnel();
        
        // Security: Only admins get the full list for reporting
        if (currentUser?.role === 'admin') {
            setAllPersonnelForReport(allData);
        } else {
            setAllPersonnelForReport([]);
        }

        let displayData: Personnel[] = [];
        if (currentUser?.role === 'user' && currentUser.personnelId) {
            // Security: Users strictly see ONLY their own record
            displayData = allData.filter(p => p.id === currentUser.personnelId);
        } else if (currentUser?.role === 'admin') {
            displayData = allData;
        }
        
        setPersonnelList(displayData);

        // Auto-select logic
        if (displayData.length > 0) {
            // If a user is already selected, check if they are still in the allowed list
            const currentSelectionExists = selectedPersonnel && displayData.some(p => p.id === selectedPersonnel.id);
            if (!currentSelectionExists) {
                setSelectedPersonnel(displayData[0]);
            }
        } else {
            setSelectedPersonnel(null);
        }
    }, [currentUser, selectedPersonnel]);

    useEffect(() => {
        loadPersonnel();
    }, [loadPersonnel]);

    const handleSelectPersonnel = (personnel: Personnel) => {
        setSelectedPersonnel(personnel);
    };

    const handleDataUpdate = () => {
        loadPersonnel();
        if (selectedPersonnel) {
             const allData = DatabaseService.getPersonnel();
             const updatedSelected = allData.find(p => p.id === selectedPersonnel.id);
             setSelectedPersonnel(updatedSelected || null);
        }
    };

    const handleBackup = () => {
        DatabaseService.triggerBackupDownload();
        alert('Veritabanı yedeği başarıyla indirildi.');
    };
    
    const handleRestore = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            if (!window.confirm('Mevcut veritabanını yedekten geri yüklemek istediğinizden emin misiniz? Bu işlem geri alınamaz.')) {
                return;
            }
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target?.result;
                if (typeof result === 'string') {
                    const { success, message } = DatabaseService.restoreData(result);
                    alert(message);
                    if (success) {
                        loadPersonnel();
                    }
                }
            };
            reader.readAsText(file);
            event.target.value = '';
        }
    };

    const handlePdfUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            // Basic validation
            if (file.type !== 'application/pdf') {
                alert('Lütfen geçerli bir PDF dosyası seçin.');
                return;
            }
            
            if (!window.confirm(`${file.name} dosyasından personel verileri okunup veritabanına eklenecek veya güncellenecek. Devam edilsin mi?`)) {
                return;
            }

            try {
                const result = await DatabaseService.importFromPdf(file);
                alert(result.message);
                if (result.success) {
                    loadPersonnel();
                    if (result.personnel) {
                        setSelectedPersonnel(result.personnel);
                    }
                }
            } catch (error) {
                alert('İşlem sırasında bir hata oluştu.');
            }
            event.target.value = ''; // Reset input
        }
    };
    
    const filteredPersonnel = personnelList.filter(p =>
        p.adSoyad.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sicilNo.includes(searchTerm) ||
        p.id.includes(searchTerm)
    );

    return (
        <div className="p-2 min-h-screen bg-[#ECE9D8] text-black text-sm">
             <div className="flex justify-between items-center bg-gradient-to-b from-[#0A246A] to-[#A6CAF0] p-1 text-white shadow-md">
                 <div className="flex items-center space-x-3">
                    <img src="https://i.hizliresim.com/5u6673s.png" alt="Logo" className="h-10 bg-white rounded p-0.5" />
                    <div>
                        <h1 className="font-bold text-lg leading-tight">CNK KESİCİ TAKIMLAR</h1>
                        <span className="text-xs opacity-90">PERSONEL RAPOR - İZİN TAKİP PROGRAMI</span>
                    </div>
                 </div>
                 <div className="flex items-center space-x-2">
                    {currentUser?.role === 'admin' && (
                        <>
                             <label className="cursor-pointer px-3 py-1 bg-orange-500 hover:bg-orange-600 rounded border border-orange-700 flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                </svg>
                                PDF'den Oku
                                <input type="file" onChange={handlePdfUpload} className="hidden" accept="application/pdf" />
                            </label>
                            <button onClick={() => setShowDocGenerator(true)} className="px-3 py-1 bg-indigo-500 hover:bg-indigo-600 rounded border border-indigo-700 flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                </svg>
                                Belge Oluştur
                            </button>
                            <button onClick={() => setShowCompensationCalc(true)} className="px-3 py-1 bg-teal-600 hover:bg-teal-700 rounded border border-teal-800 flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Tazminat Hesapla
                            </button>
                            <button onClick={() => setShowDeviceIntegration(true)} className="px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded border border-purple-800 flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                                </svg>
                                Cihaz
                            </button>
                            <button onClick={() => setShowUserManagement(true)} className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded border border-green-800">Kullanıcılar</button>
                            <button onClick={handleBackup} className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded border border-blue-800">Yedekle</button>
                            <label className="cursor-pointer px-3 py-1 bg-yellow-500 hover:bg-yellow-600 rounded border border-yellow-700">
                                Geri Yükle
                                <input type="file" onChange={handleRestore} className="hidden" accept=".json,application/json" />
                            </label>
                        </>
                    )}
                    <button onClick={logout} className="px-3 py-1 bg-red-500 hover:bg-red-600 rounded border border-red-700">Çıkış</button>
                </div>
            </div>
            
            {showCompensationCalc && currentUser?.role === 'admin' && (
                <CompensationCalculator 
                    onClose={() => setShowCompensationCalc(false)}
                    allPersonnel={allPersonnelForReport}
                />
            )}

            {showDeviceIntegration && currentUser?.role === 'admin' && (
                <DeviceIntegration 
                    onClose={() => setShowDeviceIntegration(false)} 
                    onUpdate={handleDataUpdate}
                    allPersonnel={allPersonnelForReport}
                />
            )}

            {showDocGenerator && currentUser?.role === 'admin' && (
                <DocumentGenerator
                    onClose={() => setShowDocGenerator(false)}
                    allPersonnel={allPersonnelForReport}
                />
            )}

            {showUserManagement && currentUser?.role === 'admin' ? (
                <UserManagementScreen onClose={() => setShowUserManagement(false)} onUpdate={handleDataUpdate} />
            ) : (
            <>
                {currentUser?.role === 'admin' && <Dashboard personnelList={allPersonnelForReport} />}

                <div className="mt-2 p-2 border bg-gray-200 shadow-inner">
                    <PersonnelTable
                        personnelList={filteredPersonnel}
                        onSelectPersonnel={handleSelectPersonnel}
                        selectedPersonnelId={selectedPersonnel?.id || ''}
                    />
                </div>

                {currentUser?.role === 'admin' && (
                    <div className="mt-2 p-2 border bg-gray-200 shadow-inner flex items-center space-x-2">
                        <label className="font-bold">PERSONEL ARA:</label>
                        <input 
                            type="text" 
                            className="border border-gray-400 px-2 py-1 w-64 bg-white" 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button className="px-4 py-1 bg-gray-300 border border-gray-400 rounded shadow-sm hover:bg-gray-400" onClick={() => setSearchTerm('')}>TÜM PERSONELLER</button>
                    </div>
                )}
                
                {currentUser?.role === 'admin' && (
                    <div className="mt-2">
                        <LeaveManagement allPersonnel={allPersonnelForReport} onUpdate={handleDataUpdate} />
                    </div>
                )}


                <div className="mt-2 grid grid-cols-1 lg:grid-cols-2 gap-2">
                    <div className="flex flex-col gap-2">
                        {selectedPersonnel && <LeaveTracker personnel={selectedPersonnel} onUpdate={handleDataUpdate} />}
                        {selectedPersonnel && <TimeLogTracker personnel={selectedPersonnel} onUpdate={handleDataUpdate} />}
                        <Reporting personnelList={currentUser?.role === 'admin' ? allPersonnelForReport : personnelList} />
                    </div>
                    {selectedPersonnel && <PersonnelDetails personnel={selectedPersonnel} onUpdate={handleDataUpdate} />}
                </div>
                <div className="mt-2 p-2 border bg-gray-200 shadow-inner text-xs text-gray-600">
                    <strong>Not:</strong> Programı kullanırken önce öğretmen seçimini daha sonra tarih, izin çeşidini ve gün sayısını yazıp, KAYDET düğmesine tıklamanız gerekmektedir.
                </div>
            </>
            )}
        </div>
    );
};

export default MainScreen;
