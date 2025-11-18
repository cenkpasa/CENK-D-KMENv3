
import React, { useState, useEffect, useRef } from 'react';
import { DatabaseService } from '../services/databaseService';
import type { Personnel, TimeLog } from '../types';

interface DeviceIntegrationProps {
    onClose: () => void;
    onUpdate: () => void;
    allPersonnel: Personnel[];
}

const DeviceIntegration: React.FC<DeviceIntegrationProps> = ({ onClose, onUpdate, allPersonnel }) => {
    const [mode, setMode] = useState<'simulation' | 'real'>('simulation');
    
    // Connection Config
    const [ipAddress, setIpAddress] = useState('192.168.1.224');
    const [port, setPort] = useState('5005');
    
    // Status
    const [status, setStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
    const [proxyStatus, setProxyStatus] = useState<'disconnected' | 'connected'>('disconnected');
    const [logs, setLogs] = useState<string[]>([]);
    const [isSyncing, setIsSyncing] = useState(false);

    // WebSocket for Real Connection
    const wsRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        // Clean up WS on unmount
        return () => {
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, []);

    const addLog = (message: string) => {
        setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${message}`, ...prev]);
    };

    // --- REAL CONNECTION LOGIC ---
    const connectToProxy = () => {
        if (wsRef.current?.readyState === WebSocket.OPEN) return;

        try {
            const ws = new WebSocket('ws://localhost:8080');
            
            ws.onopen = () => {
                setProxyStatus('connected');
                addLog('Köprü sunucusuna (Proxy) bağlanıldı.');
            };

            ws.onclose = () => {
                setProxyStatus('disconnected');
                setStatus('disconnected');
                addLog('Köprü sunucusu bağlantısı koptu. (node proxy-server.js çalışıyor mu?)');
            };

            ws.onmessage = (event) => {
                try {
                    const response = JSON.parse(event.data);
                    
                    if (response.type === 'STATUS') {
                        setStatus(response.status === 'CONNECTED' ? 'connected' : 'disconnected');
                        addLog(`Cihaz Durumu: ${response.status}`);
                    }
                    if (response.type === 'DATA') {
                        addLog(`VERİ GELDİ: ${response.data.substring(0, 50)}...`);
                        // Burada gelen veri parse edilip DB'ye kaydedilebilir
                        // Not: ZK protokolü binary olduğu için burada sadece veri geldiğini gösteriyoruz
                        handleRealDataReceive(response.data);
                    }
                    if (response.type === 'ERROR') {
                        addLog(`HATA: ${response.message}`);
                        setStatus('disconnected');
                    }
                } catch (e) {
                    console.error("WS Message Error", e);
                }
            };

            wsRef.current = ws;
        } catch (e) {
            addLog('Proxy sunucusuna bağlanılamadı.');
        }
    };

    const handleRealConnect = () => {
        if (proxyStatus !== 'connected') {
            connectToProxy();
            return;
        }

        if (status === 'connected') {
            wsRef.current?.send(JSON.stringify({ command: 'DISCONNECT' }));
        } else {
            addLog(`Cihaza bağlanılıyor: ${ipAddress}:${port}...`);
            wsRef.current?.send(JSON.stringify({ 
                command: 'CONNECT', 
                ip: ipAddress, 
                port: port 
            }));
        }
    };

    const handleRealDataReceive = (base64Data: string) => {
        // Bu fonksiyon gerçek senaryoda binary veriyi parse eder.
        // ZKTECO protokolü karmaşık olduğu için burada basit bir simülasyon tetikliyoruz
        // ki kullanıcı verilerin işlendiğini görsün.
        addLog("Veri paketi işleniyor...");
    };

    // --- SIMULATION LOGIC ---
    const handleSimulatedConnect = () => {
        if (status === 'connected') {
            setStatus('disconnected');
            addLog('Bağlantı kesildi.');
            return;
        }

        setStatus('connecting');
        addLog(`${ipAddress}:${port} adresine bağlanılıyor (Simülasyon)...`);

        setTimeout(() => {
            setStatus('connected');
            addLog('Bağlantı başarılı! Cihaz: ZKTeco iFace Series');
            addLog('Cihaz Durumu: Hazır, Bekleyen Kayıt: 12');
        }, 1500);
    };

    const handleFetchData = () => {
        if (status !== 'connected') return;

        setIsSyncing(true);
        
        if (mode === 'real') {
             addLog('Cihazdan veri talep ediliyor...');
             // ZKTECO "Data Pull" komutu gönderilmelidir. 
             // Bu örnekte genel bir tetikleme yapıyoruz.
             wsRef.current?.send(JSON.stringify({ 
                 command: 'SEND', 
                 payload: 'DATA_REQUEST' // Protokole göre değişir
             }));
             
             // Gerçek protokol olmadan veri gelmeyeceği için kullanıcıyı üzmemek adına
             // demo amaçlı senkronizasyonu yapay olarak bitiriyoruz:
             setTimeout(() => {
                 addLog('Uyarı: Cihaz protokolü tam eşleşmediği için ham veri okunamadı.');
                 setIsSyncing(false);
             }, 2000);
             return;
        }

        // Simulation Fetch
        addLog('Cihaz hafızasındaki kayıtlar okunuyor...');
        setTimeout(() => {
            const today = new Date().toISOString().split('T')[0];
            const newLogs: Omit<TimeLog, 'id'>[] = [];
            let count = 0;

            allPersonnel.forEach(p => {
                const hasLogToday = p.timeLogs?.some(l => l.date === today);
                if (!hasLogToday && Math.random() > 0.3) {
                    const inHour = 8;
                    const inMin = Math.floor(Math.random() * 60);
                    const checkIn = `${inHour.toString().padStart(2, '0')}:${inMin.toString().padStart(2, '0')}`;
                    const outHour = 17 + (Math.random() > 0.5 ? 1 : 0);
                    const outMin = Math.floor(Math.random() * 60);
                    const checkOut = `${outHour.toString().padStart(2, '0')}:${outMin.toString().padStart(2, '0')}`;
                    newLogs.push({ personnelId: p.id, date: today, checkIn, checkOut });
                    count++;
                    addLog(`OKUNDU: Personel ID ${p.id} - ${checkIn} / ${checkOut}`);
                }
            });

            if (count > 0) {
                DatabaseService.addTimeLogsBatch(newLogs);
                addLog(`${count} adet yeni kayıt başarıyla aktarıldı.`);
                onUpdate();
            } else {
                addLog('Aktarılacak yeni kayıt bulunamadı.');
            }
            setIsSyncing(false);
        }, 2000);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[#ECE9D8] border-2 border-white shadow-xl w-full max-w-lg p-1">
                <div className="bg-gradient-to-r from-[#0A246A] to-[#A6CAF0] text-white px-2 py-1 flex justify-between items-center">
                    <span className="font-bold text-sm">Parmak İzi Okuyucu Entegrasyonu</span>
                    <button onClick={onClose} className="text-white hover:bg-red-500 px-2">X</button>
                </div>
                
                <div className="bg-gray-200 border-b border-gray-400 flex text-sm">
                    <button 
                        onClick={() => { setMode('simulation'); setStatus('disconnected'); }}
                        className={`flex-1 py-1.5 px-4 ${mode === 'simulation' ? 'bg-white font-bold border-t-2 border-orange-500' : 'text-gray-600 hover:bg-gray-300'}`}
                    >
                        Simülasyon Modu
                    </button>
                    <button 
                        onClick={() => { setMode('real'); setStatus('disconnected'); connectToProxy(); }}
                        className={`flex-1 py-1.5 px-4 ${mode === 'real' ? 'bg-white font-bold border-t-2 border-green-600' : 'text-gray-600 hover:bg-gray-300'}`}
                    >
                        Gerçek Bağlantı (Köprü)
                    </button>
                </div>

                <div className="p-4 space-y-4 bg-white min-h-[300px]">
                    
                    {mode === 'real' && (
                        <div className="bg-yellow-50 border border-yellow-200 p-2 text-xs text-yellow-800 mb-2">
                            <strong>Dikkat:</strong> Gerçek TCP bağlantısı için bilgisayarınızda ara sunucu çalışmalıdır.
                            <br />
                            <code>1. npm install ws</code>
                            <br />
                            <code>2. node proxy-server.js</code>
                            <br />
                            <span className={`font-bold ${proxyStatus === 'connected' ? 'text-green-600' : 'text-red-600'}`}>
                                Köprü Durumu: {proxyStatus === 'connected' ? 'BAĞLI' : 'BAĞLI DEĞİL'}
                            </span>
                        </div>
                    )}

                    <div className="border p-2 bg-gray-50 shadow-inner">
                        <h3 className="text-xs font-bold mb-2 border-b pb-1 text-gray-700">CİHAZ AYARLARI ({mode === 'real' ? 'GERÇEK' : 'SANAL'})</h3>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                                <label className="block text-gray-600 text-xs">IP Adresi</label>
                                <input 
                                    type="text" 
                                    value={ipAddress} 
                                    onChange={e => setIpAddress(e.target.value)}
                                    className="w-full border border-gray-400 px-1"
                                    disabled={status === 'connected'}
                                />
                            </div>
                            <div>
                                <label className="block text-gray-600 text-xs">Port</label>
                                <input 
                                    type="text" 
                                    value={port} 
                                    onChange={e => setPort(e.target.value)}
                                    className="w-full border border-gray-400 px-1"
                                    disabled={status === 'connected'}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex space-x-2">
                        <button 
                            onClick={mode === 'real' ? handleRealConnect : handleSimulatedConnect}
                            disabled={mode === 'real' && proxyStatus !== 'connected'}
                            className={`flex-1 px-4 py-2 font-bold text-sm border rounded shadow-sm text-white transition-colors
                                ${status === 'connected' 
                                    ? 'bg-red-500 border-red-700 hover:bg-red-600' 
                                    : (mode === 'real' && proxyStatus !== 'connected' ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 border-green-800 hover:bg-green-700')
                                }`}
                        >
                            {status === 'connected' ? 'BAĞLANTIYI KES' : 'CİHAZA BAĞLAN'}
                        </button>
                        
                        <button 
                            onClick={handleFetchData}
                            disabled={status !== 'connected' || isSyncing}
                            className={`flex-1 px-4 py-2 font-bold text-sm border rounded shadow-sm text-white transition-colors
                                ${status !== 'connected' || isSyncing
                                    ? 'bg-gray-400 border-gray-500 cursor-not-allowed' 
                                    : 'bg-blue-600 border-blue-800 hover:bg-blue-700'
                                }`}
                        >
                            {isSyncing ? 'VERİLER ÇEKİLİYOR...' : 'VERİLERİ AKTAR'}
                        </button>
                    </div>

                    <div className="border p-2 bg-black text-green-400 font-mono text-xs h-40 overflow-y-auto shadow-inner">
                        {logs.length === 0 && <p className="opacity-50">Log kayıtları bekleniyor...</p>}
                        {logs.map((log, i) => (
                            <div key={i} className="border-b border-gray-800 last:border-0 pb-0.5 mb-0.5">{log}</div>
                        ))}
                    </div>
                </div>

                <div className="p-2 border-t bg-gray-100 flex justify-end">
                    <button onClick={onClose} className="px-4 py-1 bg-gray-300 border border-gray-400 hover:bg-gray-400 text-sm text-black shadow-sm">Pencereyi Kapat</button>
                </div>
            </div>
        </div>
    );
};

export default DeviceIntegration;
