
import React, { useState, useEffect } from 'react';
import { Personnel } from '../types';
import { documentTemplates } from './DocumentTemplates';

// Declare html2pdf globally if loaded via CDN
declare const html2pdf: any;

interface DocumentGeneratorProps {
    onClose: () => void;
    allPersonnel: Personnel[];
}

const DocumentGenerator: React.FC<DocumentGeneratorProps> = ({ onClose, allPersonnel }) => {
    const [selectedTemplateId, setSelectedTemplateId] = useState(documentTemplates[0].id);
    const [selectedPersonnelId, setSelectedPersonnelId] = useState(allPersonnel[0]?.id || '');
    const [dynamicValues, setDynamicValues] = useState<Record<string, string>>({});
    const [isPdfLoading, setIsPdfLoading] = useState(false);

    // Load html2pdf library dynamically
    useEffect(() => {
        const script = document.createElement('script');
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
        script.async = true;
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        }
    }, []);

    useEffect(() => {
        setDynamicValues({});
    }, [selectedTemplateId]);

    const generateContent = () => {
        const template = documentTemplates.find(t => t.id === selectedTemplateId);
        const personnel = allPersonnel.find(p => p.id === selectedPersonnelId);

        if (!template || !personnel) return null;

        let content = template.content;
        const today = new Date().toLocaleDateString('tr-TR');

        const COMPANY_HEADER_HTML = `
            <div style="border-bottom: 2px solid #ce1e1e; padding-bottom: 10px; margin-bottom: 20px; font-family: 'Segoe UI', Tahoma, sans-serif;">
                <table style="width: 100%; border: none;">
                    <tr>
                        <td style="width: 25%; vertical-align: middle; text-align:center;">
                            <img src="https://i.hizliresim.com/5u6673s.png" style="max-height: 90px; max-width: 100%;" alt="CNK Logo" />
                        </td>
                        <td style="width: 75%; text-align: right; font-size: 10px; color: #333; line-height: 1.3;">
                            <h3 style="margin: 0 0 5px 0; color: #ce1e1e; font-size: 14px; font-weight: 800;">CNK KESİCİ TAKIMLAR ENDÜSTRİ TEKNİK HIRD. SAN TİC. A.Ş</h3>
                            <p style="margin: 0;">İVEDİK OSB PROTED PARK İŞ MERKEZİ No:151 06378 YENİMAHALLE/ ANKARA</p>
                            <p style="margin: 0;">Tel: 0312 396 44 42 | Fax: 0312 396 44 41</p>
                            <p style="margin: 0;">Web: www.cnkkesicitakim.com.tr | E-Posta: info@cnkkesicitakim.com.tr</p>
                            <p style="margin: 0;">Vergi Dairesi: İVEDİK | VKN: 2111449380</p>
                            <p style="margin: 0;">MERSİS NO: 0211144938000001 | TİC.SİC.NO: 496843</p>
                        </td>
                    </tr>
                </table>
            </div>
        `;

        content = content.replace('{{HEADER}}', COMPANY_HEADER_HTML);
        content = content.replace(/{{AD_SOYAD}}/g, personnel.adSoyad);
        content = content.replace(/{{TC_NO}}/g, personnel.id);
        content = content.replace(/{{SICIL_NO}}/g, personnel.sicilNo || '.......');
        content = content.replace(/{{GOREVI}}/g, personnel.gorevi || 'Personel');
        content = content.replace(/{{TARIH}}/g, today);
        content = content.replace(/{{ISE_GIRIS}}/g, personnel.iseGirisTarihi ? new Date(personnel.iseGirisTarihi).toLocaleDateString('tr-TR') : '.....');
        content = content.replace(/{{ADRES}}/g, '...........................................................');

        if (template.dynamicFields) {
            template.dynamicFields.forEach(field => {
                let value = dynamicValues[field.key] || '....................';
                if (field.key === 'ESYALAR' && (template.id === 'zimmet_tutanagi' || template.id === 'zimmet_iade')) {
                    const items = value.split('\n').filter(item => item.trim() !== '');
                    let rowsHtml = '';
                    if (items.length === 0) {
                        rowsHtml = `<tr><td style="border: 1px solid black; padding: 10px; text-align:center;">1</td><td style="border: 1px solid black; padding: 10px;">.................................................................</td></tr>`;
                    } else {
                        items.forEach((item, index) => {
                            rowsHtml += `<tr><td style="border: 1px solid black; padding: 10px; text-align:center;">${index + 1}</td><td style="border: 1px solid black; padding: 10px;">${item}</td></tr>`;
                        });
                    }
                    content = content.replace('{{ZIMMET_ROWS}}', rowsHtml);
                } else {
                    if (field.type === 'date' && value !== '....................') {
                        try { value = new Date(value).toLocaleDateString('tr-TR'); } catch(e) {}
                    }
                    const regex = new RegExp(`{{${field.key}}}`, 'g');
                    content = content.replace(regex, value);
                }
            });
        }
        return content;
    };

    const handlePrint = () => {
        const content = generateContent();
        if (!content) {
            alert('Lütfen şablon ve personel seçiniz.');
            return;
        }
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(`
                <html>
                    <head>
                        <title>Yazdır</title>
                        <style>
                            @media print { @page { margin: 1cm; } body { -webkit-print-color-adjust: exact; } }
                            body { font-family: 'Times New Roman', serif; font-size: 11pt; color: #000; }
                            table { width: 100%; border-collapse: collapse; }
                            p { margin-bottom: 10px; }
                        </style>
                    </head>
                    <body>${content}</body>
                </html>
            `);
            printWindow.document.close();
            printWindow.focus();
            setTimeout(() => printWindow.print(), 500);
        }
    };

    const handleDownloadPdf = () => {
        if (typeof html2pdf === 'undefined') {
            alert('PDF modülü yükleniyor, lütfen biraz bekleyip tekrar deneyin.');
            return;
        }
        const content = generateContent();
        if (!content) {
            alert('Şablon yüklenemedi.');
            return;
        }

        setIsPdfLoading(true);
        const element = document.createElement('div');
        element.innerHTML = content;
        element.style.width = '800px'; // Force standard width for PDF
        element.style.padding = '20px';
        element.style.fontFamily = "'Times New Roman', serif";
        document.body.appendChild(element); // Needs to be in DOM

        const opt = {
            margin: 10,
            filename: `belge_${new Date().toISOString().slice(0,10)}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(element).save().then(() => {
            document.body.removeChild(element);
            setIsPdfLoading(false);
        });
    };

    const currentTemplate = documentTemplates.find(t => t.id === selectedTemplateId);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded shadow-lg w-[600px] max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4 border-b pb-2">
                    <h2 className="text-lg font-bold text-gray-800">İK Belge ve Tutanak Oluşturucu</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-red-500 font-bold text-xl">&times;</button>
                </div>
                
                <div className="mb-4">
                    <label className="block text-sm font-bold text-gray-700 mb-1">Belge Şablonu Seçiniz:</label>
                    <select 
                        className="w-full border border-gray-300 p-2 rounded bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        value={selectedTemplateId}
                        onChange={(e) => setSelectedTemplateId(e.target.value)}
                    >
                        {documentTemplates.map(t => (
                            <option key={t.id} value={t.id}>{t.title}</option>
                        ))}
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-bold text-gray-700 mb-1">Personel Seçiniz:</label>
                    <select 
                        className="w-full border border-gray-300 p-2 rounded bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        value={selectedPersonnelId}
                        onChange={(e) => setSelectedPersonnelId(e.target.value)}
                    >
                        {allPersonnel.map(p => (
                            <option key={p.id} value={p.id}>{p.adSoyad} - {p.gorevi}</option>
                        ))}
                    </select>
                </div>

                {/* Dynamic Fields Section */}
                {currentTemplate?.dynamicFields && currentTemplate.dynamicFields.length > 0 && (
                    <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded shadow-inner">
                        <h3 className="text-sm font-bold text-blue-800 mb-3 border-b border-blue-200 pb-1">Gerekli Bilgileri Doldurunuz</h3>
                        <div className="grid gap-3">
                            {currentTemplate.dynamicFields.map(field => (
                                <div key={field.key}>
                                    <label className="block text-xs font-bold mb-1 text-gray-700">{field.label}:</label>
                                    {field.type === 'textarea' ? (
                                        <textarea
                                            className="w-full border border-gray-300 p-2 rounded text-sm focus:border-blue-500 outline-none"
                                            rows={3}
                                            placeholder={field.placeholder}
                                            value={dynamicValues[field.key] || ''}
                                            onChange={(e) => setDynamicValues({...dynamicValues, [field.key]: e.target.value})}
                                        />
                                    ) : (
                                        <input
                                            type={field.type}
                                            className="w-full border border-gray-300 p-2 rounded text-sm focus:border-blue-500 outline-none"
                                            placeholder={field.placeholder}
                                            value={dynamicValues[field.key] || ''}
                                            onChange={(e) => setDynamicValues({...dynamicValues, [field.key]: e.target.value})}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex justify-end gap-3 mt-6 border-t pt-4">
                    <button 
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-xs font-medium transition-colors"
                    >
                        İptal
                    </button>
                    <button 
                        onClick={handleDownloadPdf}
                        disabled={isPdfLoading}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-xs font-medium shadow transition-colors flex items-center gap-2"
                    >
                        {isPdfLoading ? 'Oluşturuluyor...' : 'PDF OLARAK İNDİR'}
                    </button>
                    <button 
                        onClick={handlePrint}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs font-medium shadow transition-colors flex items-center gap-2"
                    >
                        OLUŞTUR VE YAZDIR
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DocumentGenerator;
