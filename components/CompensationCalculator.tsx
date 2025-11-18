
import React, { useState, useEffect } from 'react';
import { Personnel } from '../types';

interface CompensationCalculatorProps {
    onClose: () => void;
    allPersonnel: Personnel[];
}

const CompensationCalculator: React.FC<CompensationCalculatorProps> = ({ onClose, allPersonnel }) => {
    const [selectedPersonnelId, setSelectedPersonnelId] = useState('');
    const [terminationDate, setTerminationDate] = useState(new Date().toISOString().split('T')[0]);
    const [grossSalary, setGrossSalary] = useState(0);
    const [additionalBenefits, setAdditionalBenefits] = useState(0); // Yemek, Yol vs. (Aylık)
    const [severanceCeiling, setSeveranceCeiling] = useState(41828.42); // 2025 H1 Tavanı (Örnek)
    const [result, setResult] = useState<any>(null);

    useEffect(() => {
        if (allPersonnel.length > 0) {
            const p = allPersonnel[0];
            setSelectedPersonnelId(p.id);
            setGrossSalary(p.baseSalary || 0);
        }
    }, [allPersonnel]);

    const handlePersonnelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const id = e.target.value;
        setSelectedPersonnelId(id);
        const p = allPersonnel.find(per => per.id === id);
        if (p) {
            setGrossSalary(p.baseSalary || 0);
        }
    };

    const calculate = () => {
        const personnel = allPersonnel.find(p => p.id === selectedPersonnelId);
        if (!personnel || !personnel.iseGirisTarihi) {
            alert('Personel veya işe giriş tarihi bulunamadı.');
            return;
        }

        const startDate = new Date(personnel.iseGirisTarihi);
        const endDate = new Date(terminationDate);

        if (endDate < startDate) {
            alert('Çıkış tarihi giriş tarihinden önce olamaz.');
            return;
        }

        // 1. Hizmet Süresi Hesabı
        const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
        const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        // Basit yıl hesabı (Tam mantık için daha detaylı date-fns vb kullanılabilir ama bu yeterli)
        const years = Math.floor(totalDays / 365);
        const remainingDaysAfterYears = totalDays % 365;
        const months = Math.floor(remainingDaysAfterYears / 30);
        const days = remainingDaysAfterYears % 30;

        // 2. Kıdem Tazminatı Hesabı
        const giydirilmisUcret = grossSalary + additionalBenefits;
        const kidemEsasUcret = Math.min(giydirilmisUcret, severanceCeiling);
        
        const grossSeverance = (kidemEsasUcret * years) + 
                               (kidemEsasUcret / 12 * months) + 
                               (kidemEsasUcret / 365 * days);
        
        const stampTaxRate = 0.00759;
        const stampTaxSeverance = grossSeverance * stampTaxRate;
        const netSeverance = grossSeverance - stampTaxSeverance;

        // 3. İhbar Tazminatı Hesabı
        let noticeWeeks = 0;
        if (totalDays < 180) noticeWeeks = 2; // 6 aydan az
        else if (totalDays < 540) noticeWeeks = 4; // 1.5 yıldan az
        else if (totalDays < 1080) noticeWeeks = 6; // 3 yıldan az
        else noticeWeeks = 8; // 3 yıldan fazla

        const noticePayBase = giydirilmisUcret; // İhbar tavanı yoktur, brüt üzerinden
        const grossNoticePay = (noticePayBase / 30) * (noticeWeeks * 7);
        
        const incomeTaxRate = 0.15; // %15 varsayılan dilim
        const incomeTaxNotice = grossNoticePay * incomeTaxRate;
        const stampTaxNotice = grossNoticePay * stampTaxRate;
        const netNoticePay = grossNoticePay - incomeTaxNotice - stampTaxNotice;

        setResult({
            startDate: personnel.iseGirisTarihi,
            endDate: terminationDate,
            tenure: `${years} Yıl, ${months} Ay, ${days} Gün`,
            kidemEsasUcret,
            grossSeverance,
            stampTaxSeverance,
            netSeverance,
            noticeWeeks,
            grossNoticePay,
            incomeTaxNotice,
            stampTaxNotice,
            netNoticePay,
            totalNet: netSeverance + netNoticePay
        });
    };

    const handlePrint = () => {
        const printContent = document.getElementById('calc-result');
        if (!printContent) return;
        
        const win = window.open('', '', 'width=800,height=600');
        win?.document.write(`
            <html>
            <head>
                <title>Tazminat Hesaplama Tablosu</title>
                <style>
                    body { font-family: 'Segoe UI', sans-serif; padding: 20px; }
                    table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                    th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
                    th { background-color: #f0f0f0; }
                    .header { text-align: center; border-bottom: 2px solid #ce1e1e; margin-bottom: 20px; }
                    .section { margin-top: 20px; }
                    .total { font-weight: bold; font-size: 1.2em; background-color: #e6f7ff; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h2>KIDEM VE İHBAR TAZMİNATI HESAPLAMA TABLOSU</h2>
                    <p>CNK KESİCİ TAKIMLAR A.Ş.</p>
                </div>
                ${printContent.innerHTML}
                <br/>
                <p><strong>Düzenleyen:</strong> ........................................... <strong>İmza:</strong> .................</p>
            </body>
            </html>
        `);
        win?.document.close();
        win?.focus();
        setTimeout(() => win?.print(), 500);
    };

    const formatMoney = (amount: number) => {
        return amount.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded shadow-lg w-[800px] max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4 border-b pb-2">
                    <h2 className="text-lg font-bold text-gray-800">Kıdem ve İhbar Tazminatı Hesaplama</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-red-500 font-bold text-xl">&times;</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 border rounded">
                    <div>
                        <label className="block text-sm font-bold mb-1">Personel Seçimi</label>
                        <select className="w-full border p-2 rounded" value={selectedPersonnelId} onChange={handlePersonnelChange}>
                            {allPersonnel.map(p => <option key={p.id} value={p.id}>{p.adSoyad}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-1">İşten Çıkış Tarihi</label>
                        <input type="date" className="w-full border p-2 rounded" value={terminationDate} onChange={e => setTerminationDate(e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-1">Aylık Brüt Çıplak Ücret (TL)</label>
                        <input type="number" className="w-full border p-2 rounded" value={grossSalary} onChange={e => setGrossSalary(parseFloat(e.target.value))} />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-1">Aylık Yan Haklar (Yol+Yemek vb.)</label>
                        <input type="number" className="w-full border p-2 rounded" value={additionalBenefits} onChange={e => setAdditionalBenefits(parseFloat(e.target.value))} />
                        <p className="text-xs text-gray-500">Kıdem tazminatı "Giydirilmiş Ücret" üzerinden hesaplanır.</p>
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-1">Kıdem Tazminatı Tavanı</label>
                        <input type="number" className="w-full border p-2 rounded" value={severanceCeiling} onChange={e => setSeveranceCeiling(parseFloat(e.target.value))} />
                        <p className="text-xs text-gray-500">2025 yılı 1. dönem tavanı varsayılan olarak gelmiştir.</p>
                    </div>
                </div>

                <div className="flex justify-end space-x-2 mb-4">
                    <button onClick={calculate} className="px-6 py-2 bg-green-600 text-white font-bold rounded hover:bg-green-700 shadow">HESAPLA</button>
                </div>

                {result && (
                    <div id="calc-result" className="border p-4 bg-white">
                        <h3 className="font-bold text-center border-b pb-2 mb-4 bg-gray-100 p-2">HESAPLAMA SONUÇLARI</h3>
                        
                        <div className="mb-6">
                            <h4 className="font-bold text-blue-800 mb-2">1. HİZMET SÜRESİ BİLGİLERİ</h4>
                            <table className="w-full text-sm border">
                                <tbody>
                                    <tr><td className="font-semibold bg-gray-50 w-1/3">İşe Giriş Tarihi</td><td>{new Date(result.startDate).toLocaleDateString('tr-TR')}</td></tr>
                                    <tr><td className="font-semibold bg-gray-50">İşten Çıkış Tarihi</td><td>{new Date(result.endDate).toLocaleDateString('tr-TR')}</td></tr>
                                    <tr><td className="font-semibold bg-gray-50">Toplam Hizmet Süresi</td><td>{result.tenure}</td></tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="mb-6">
                            <h4 className="font-bold text-blue-800 mb-2">2. KIDEM TAZMİNATI HESABI</h4>
                            <table className="w-full text-sm border">
                                <tbody>
                                    <tr><td className="font-semibold bg-gray-50 w-1/3">Hesaba Esas Ücret (Tavan Kontrollü)</td><td>{formatMoney(result.kidemEsasUcret)}</td></tr>
                                    <tr><td className="font-semibold bg-gray-50">Brüt Kıdem Tazminatı</td><td>{formatMoney(result.grossSeverance)}</td></tr>
                                    <tr><td className="font-semibold bg-gray-50">Damga Vergisi (%0.759)</td><td className="text-red-600">-{formatMoney(result.stampTaxSeverance)}</td></tr>
                                    <tr className="bg-green-50"><td className="font-bold">NET KIDEM TAZMİNATI</td><td className="font-bold text-green-700">{formatMoney(result.netSeverance)}</td></tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="mb-6">
                            <h4 className="font-bold text-blue-800 mb-2">3. İHBAR TAZMİNATI HESABI</h4>
                            <table className="w-full text-sm border">
                                <tbody>
                                    <tr><td className="font-semibold bg-gray-50 w-1/3">İhbar Süresi</td><td>{result.noticeWeeks} Hafta</td></tr>
                                    <tr><td className="font-semibold bg-gray-50">Brüt İhbar Tazminatı</td><td>{formatMoney(result.grossNoticePay)}</td></tr>
                                    <tr><td className="font-semibold bg-gray-50">Gelir Vergisi (%15 Tahmini)</td><td className="text-red-600">-{formatMoney(result.incomeTaxNotice)}</td></tr>
                                    <tr><td className="font-semibold bg-gray-50">Damga Vergisi (%0.759)</td><td className="text-red-600">-{formatMoney(result.stampTaxNotice)}</td></tr>
                                    <tr className="bg-green-50"><td className="font-bold">NET İHBAR TAZMİNATI</td><td className="font-bold text-green-700">{formatMoney(result.netNoticePay)}</td></tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="text-right text-xl font-bold bg-blue-600 text-white p-3 rounded">
                            ÖDENECEK TOPLAM NET TUTAR: {formatMoney(result.totalNet)}
                        </div>
                    </div>
                )}

                {result && (
                    <div className="flex justify-end mt-4 border-t pt-4">
                         <button onClick={handlePrint} className="px-6 py-2 bg-indigo-600 text-white font-bold rounded hover:bg-indigo-700 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
                            </svg>
                            YAZDIR / PDF
                         </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CompensationCalculator;
