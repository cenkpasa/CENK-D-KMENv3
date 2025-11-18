
import React, { useState, useEffect, useContext, useRef } from 'react';
import type { Personnel, PersonnelDocument } from '../types';
import { DatabaseService } from '../services/databaseService';
import { AppContext } from '../contexts/AppContext';

interface PersonnelDetailsProps {
    personnel: Personnel;
    onUpdate: () => void;
}

const defaultAvatar = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2NjYyIgY2xhc3M9InctNiBoLTYiPjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTcuNSA2YTQuNSA0LjUgMCAxMSw5IDBWOWE2IDYgMCAxMC0xMiAwVjZhNC41IDQuNSAwIDAxLDQuNS00LjV6bS43NSAxMi4zNzVhLjc1Ljc1IDAgMDAtMS41IDB2Ljc1YzAsNC4xNCAzLjM2IDcuNSA3LjUgNy41czcuNS0zLjM2IDcuNS03LjV2LS43NWEuNzUuNzUgMCAwMC0xLjUgMHYuNzVjMCwzLjMxLTIuNjksNi02LDZzLTYtMi42OS02LTZ2LS43NXoiIGNsaXAtcnVsZT0iZXZlbm9kZCIgLz48L3N2Zz4=';

const PersonnelDetails: React.FC<PersonnelDetailsProps> = ({ personnel, onUpdate }) => {
    const [formData, setFormData] = useState<Personnel>(personnel);
    const [isNew, setIsNew] = useState(false);
    const [activeTab, setActiveTab] = useState<'info' | 'documents'>('info');
    const { currentUser } = useContext(AppContext);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const docInputRef = useRef<HTMLInputElement>(null);

    // Security Check: Is the current user an Admin?
    const isAdmin = currentUser?.role === 'admin';

    useEffect(() => {
        setFormData(personnel);
        setIsNew(false);
        setActiveTab('info');
    }, [personnel]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        // Prevent non-admins from editing fields
        if (!isAdmin) return;
        
        const { name, value, type } = e.target;
        setFormData({ 
            ...formData, 
            [name]: type === 'number' ? parseFloat(value) || 0 : value 
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!isAdmin) return;

        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setFormData({ ...formData, resim: event.target?.result as string });
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!isAdmin) {
            alert('Sadece yöneticiler belge ekleyebilir.');
            return;
        }

        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.size > 2 * 1024 * 1024) { 
                alert('Dosya boyutu çok büyük. Lütfen 2MB altında bir dosya seçin.');
                return;
            }

            const reader = new FileReader();
            reader.onload = (event) => {
                const newDoc: PersonnelDocument = {
                    id: `doc_${Date.now()}`,
                    name: file.name,
                    type: file.type.includes('pdf') ? 'pdf' : 'image',
                    data: event.target?.result as string,
                    uploadDate: new Date().toLocaleDateString('tr-TR')
                };
                
                const updatedDocs = [...(formData.documents || []), newDoc];
                setFormData({ ...formData, documents: updatedDocs });
            };
            reader.readAsDataURL(file);
        }
    };

    const deleteDocument = (docId: string) => {
        if (!isAdmin) {
            alert('Belge silme yetkiniz yok.');
            return;
        }
        if(window.confirm('Bu belgeyi silmek istediğinizden emin misiniz?')) {
             const updatedDocs = (formData.documents || []).filter(d => d.id !== docId);
             setFormData({ ...formData, documents: updatedDocs });
        }
    };

    const viewDocument = (doc: PersonnelDocument) => {
        const win = window.open();
        if (win) {
            if (doc.type === 'pdf') {
                win.document.write(`<iframe src="${doc.data}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`);
            } else {
                win.document.write(`<img src="${doc.data}" style="max-width: 100%;" />`);
            }
        }
    };

    const triggerFileInput = () => {
        if (isAdmin) fileInputRef.current?.click();
    };

    const triggerDocInput = () => {
        if (isAdmin) docInputRef.current?.click();
    }
    
    const handleSave = () => {
        if (!isAdmin) {
            alert('Kayıt güncelleme yetkiniz yok.');
            return;
        }
        DatabaseService.savePersonnel(formData);
        onUpdate();
        alert('Personel bilgileri ve belgeler kaydedildi.');
        setIsNew(false);
    }
    
    const handleDelete = () => {
        if (!isAdmin) {
            alert('Bu işlem için yetkiniz yok.');
            return;
        }
        if (window.confirm(`${formData.adSoyad} personelini silmek istediğinizden emin misiniz?`)) {
            DatabaseService.deletePersonnel(formData.id);
            onUpdate();
            alert('Personel silindi.');
        }
    }
    
    const handleNew = () => {
         if (!isAdmin) {
            alert('Bu işlem için yetkiniz yok.');
            return;
        }
        const newId = `T${Date.now().toString().slice(-6)}`;
        const newSicil = Date.now().toString().slice(-6);
        setFormData({
            id: newId,
            sicilNo: newSicil,
            adSoyad: '',
            gorevi: '',
            leaves: [],
            timeLogs: [],
            bonuses: [],
            deductions: [],
            baseSalary: 0,
            hourlyRate: 0,
            documents: []
        });
        setIsNew(true);
        setActiveTab('info');
    }

    const inputStyle = `w-full bg-white border border-gray-400 px-1 py-0.5 ${!isAdmin ? 'bg-gray-100 text-gray-600 cursor-not-allowed' : ''}`;

    return (
        <div className="p-2 border bg-gray-200 shadow-inner h-full flex flex-col">
            <div className="flex justify-between items-center border-b pb-1 mb-2">
                 <h2 className="font-bold">PERSONEL DOSYASI</h2>
                 <div className="flex space-x-2">
                     <button 
                        onClick={() => setActiveTab('info')}
                        className={`px-3 py-1 text-xs rounded-t border border-b-0 ${activeTab === 'info' ? 'bg-white font-bold border-gray-400' : 'bg-gray-300 text-gray-600'}`}
                     >
                        KİMLİK & GÖREV
                     </button>
                     <button 
                        onClick={() => setActiveTab('documents')}
                        className={`px-3 py-1 text-xs rounded-t border border-b-0 ${activeTab === 'documents' ? 'bg-white font-bold border-gray-400' : 'bg-gray-300 text-gray-600'}`}
                     >
                        ÖZLÜK DOSYASI / BELGELER
                     </button>
                 </div>
            </div>
            
            {activeTab === 'info' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2 grid grid-cols-2 gap-x-4 gap-y-2 content-start">
                        <label>T.C. Kimlik No</label><input type="text" value={formData.id} name="id" onChange={handleChange} className={inputStyle} readOnly={true} />
                        <label>Sicil No</label><input type="text" value={formData.sicilNo} name="sicilNo" onChange={handleChange} className={inputStyle} readOnly={!isAdmin} />
                        <label>Ad Soyad</label><input type="text" value={formData.adSoyad} name="adSoyad" onChange={handleChange} className={inputStyle} readOnly={!isAdmin} />
                        <label>Görevi</label><input type="text" value={formData.gorevi} name="gorevi" onChange={handleChange} className={inputStyle} readOnly={!isAdmin} />
                        <label>SGK Numarası</label><input type="text" value={formData.sgkNo || ''} name="sgkNo" onChange={handleChange} className={inputStyle} readOnly={!isAdmin} />
                        <label>Telefon</label><input type="text" value={formData.telefon || ''} name="telefon" onChange={handleChange} className={inputStyle} readOnly={!isAdmin} placeholder="05xx xxx xx xx" />
                        <label>Adres</label><input type="text" value={formData.adres || ''} name="adres" onChange={handleChange} className={inputStyle} readOnly={!isAdmin} />
                        <label>Doğum Tarihi</label><input type="date" value={formData.dogumTarihi || ''} name="dogumTarihi" onChange={handleChange} className={inputStyle} readOnly={!isAdmin} />
                        <label>İşe Giriş Tarihi</label><input type="date" value={formData.iseGirisTarihi || ''} name="iseGirisTarihi" onChange={handleChange} className={inputStyle} readOnly={!isAdmin} />
                        <label>İşten Ayrılış Tarihi</label><input type="date" value={formData.istenAyrilisTarihi || ''} name="istenAyrilisTarihi" onChange={handleChange} className={inputStyle} readOnly={!isAdmin} />
                        
                        {isAdmin && (
                            <>
                                <hr className="col-span-2 my-1 border-gray-400" />
                                <label className="font-semibold">Aylık Brüt Maaş (TL)</label><input type="number" value={formData.baseSalary || 0} name="baseSalary" onChange={handleChange} className={inputStyle} />
                                <label className="font-semibold">Saatlik Ücret (TL)</label><input type="number" value={formData.hourlyRate || 0} name="hourlyRate" onChange={handleChange} className={inputStyle} />
                            </>
                        )}
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="w-40 h-48 border-2 border-gray-400 bg-white flex items-center justify-center mb-2">
                            <img src={formData.resim || defaultAvatar} alt="personel" className="w-full h-full object-cover" />
                        </div>
                        <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleFileChange} 
                            className="hidden" 
                            ref={fileInputRef}
                        />
                        {isAdmin && (
                            <button 
                                onClick={triggerFileInput}
                                className="px-4 py-1 bg-gray-300 border border-gray-400 rounded shadow-sm hover:bg-gray-400 text-xs w-full font-bold"
                            >
                                FOTOĞRAF YÜKLE
                            </button>
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'documents' && (
                <div className="flex flex-col h-full">
                     <div className="mb-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
                        <p><strong>Dijital Özlük Dosyası:</strong> Zimmet tutanakları ve diğer resmi evraklar burada saklanır. {isAdmin ? '' : '(Sadece Görüntüleme)'}</p>
                     </div>
                     
                     <div className="flex-1 bg-white border border-gray-300 overflow-y-auto p-2 mb-2">
                        {(!formData.documents || formData.documents.length === 0) ? (
                            <p className="text-center text-gray-500 mt-10">Henüz yüklenmiş belge yok.</p>
                        ) : (
                            <ul className="space-y-1">
                                {formData.documents.map((doc) => (
                                    <li key={doc.id} className="flex justify-between items-center p-2 border-b hover:bg-blue-50">
                                        <div className="flex items-center gap-2 overflow-hidden">
                                            <span className="text-xl">{doc.type === 'pdf' ? '📄' : '🖼️'}</span>
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-sm truncate w-48" title={doc.name}>{doc.name}</span>
                                                <span className="text-[10px] text-gray-500">{doc.uploadDate}</span>
                                            </div>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button onClick={() => viewDocument(doc)} className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600">Görüntüle</button>
                                            {isAdmin && (
                                                <button onClick={() => deleteDocument(doc.id)} className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600">Sil</button>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                     </div>

                     {isAdmin && (
                        <>
                            <input 
                                type="file" 
                                accept="image/*,application/pdf" 
                                onChange={handleDocumentUpload} 
                                className="hidden" 
                                ref={docInputRef}
                            />
                            <button 
                                onClick={triggerDocInput}
                                className="w-full py-2 bg-indigo-600 text-white font-bold rounded hover:bg-indigo-700 flex justify-center items-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                     <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                </svg>
                                BELGE TARA / YÜKLE
                            </button>
                        </>
                     )}
                </div>
            )}

             <div className="mt-auto flex space-x-2 border-t pt-2 justify-center">
                {isAdmin && <button onClick={handleNew} className="px-4 py-1 bg-gray-300 border border-gray-400 rounded shadow-sm hover:bg-gray-400">Yeni Kayıt</button>}
                {isAdmin && <button onClick={handleSave} className="px-4 py-1 bg-gray-300 border border-gray-400 rounded shadow-sm hover:bg-gray-400">Kaydet</button>}
                {isAdmin && <button onClick={handleDelete} className="px-4 py-1 bg-gray-300 border border-gray-400 rounded shadow-sm hover:bg-gray-400">Sil</button>}
            </div>
        </div>
    );
};

export default PersonnelDetails;
