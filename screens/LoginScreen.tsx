import React, { useState, useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import { DatabaseService } from '../services/databaseService';

const LoginScreen: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [sgkNo, setSgkNo] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(AppContext);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError(''); // Clear previous errors

        const user = DatabaseService.findUser(username);
        
        // 1. Basic Username/Password Check
        if (!user || user.password !== password) {
            setError('Geçersiz kullanıcı adı veya şifre.');
            return;
        }

        // 2. Security Check based on Role
        if (user.role === 'admin') {
            // Admins bypass SGK check (or you can implement a different 2FA for them)
            login(user);
        } else {
            // Standard Users MUST match SGK Number
            if (!user.personnelId) {
                setError('Bu kullanıcı hesabı bir personel kartı ile ilişkilendirilmemiş.');
                return;
            }

            const personnel = DatabaseService.getPersonnelById(user.personnelId);

            if (!personnel) {
                setError('İlişkili personel kaydı veritabanında bulunamadı.');
                return;
            }

            if (personnel.sgkNo !== sgkNo) {
                setError('Girdiğiniz SGK Numarası sistemdeki kayıtlarla eşleşmiyor.');
                return;
            }

            // All checks passed
            login(user);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-300">
            <div className="w-full max-w-md p-8 space-y-6 bg-gray-200 rounded-md shadow-lg border-2 border-gray-400">
                <h2 className="text-2xl font-bold text-center text-gray-700">Personel Takip Programı Giriş</h2>
                <form className="space-y-4" onSubmit={handleLogin}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Kullanıcı Adı</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-3 py-2 mt-1 text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Şifre</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 mt-1 text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">SGK Numarası</label>
                        <input
                            type="text"
                            value={sgkNo}
                            onChange={(e) => setSgkNo(e.target.value)}
                            placeholder="Personel doğrulaması için gereklidir"
                            className="w-full px-3 py-2 mt-1 text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                        <p className="text-[10px] text-gray-500 mt-1">* Yöneticiler bu alanı boş bırakabilir.</p>
                    </div>

                    {error && <div className="p-2 text-sm text-red-700 bg-red-100 border border-red-400 rounded">{error}</div>}
                    
                    <div className="flex items-center justify-between pt-2">
                        <button
                            type="button"
                            className="text-sm text-blue-600 hover:underline"
                            onClick={() => alert('Şifre sıfırlama özelliği henüz eklenmemiştir.')}
                        >
                            Şifremi Unuttum?
                        </button>
                         <button
                            type="button"
                            className="text-sm text-blue-600 hover:underline"
                            onClick={() => alert('Kullanıcı oluşturma sadece yönetici tarafından yapılabilir.')}
                        >
                            Kullanıcı Oluştur
                        </button>
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="w-full px-4 py-2 font-medium text-white bg-blue-600 border border-blue-700 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Giriş Yap
                        </button>
                    </div>
                     <div className="text-xs text-center text-gray-500 mt-4 border-t border-gray-300 pt-2">
                        <p><strong>Demo Admin:</strong> admin / 1234</p>
                        <p><strong>Demo Personel:</strong> yusuf / 1234 / SGK: 123456789</p>
                     </div>
                </form>
            </div>
        </div>
    );
};

export default LoginScreen;