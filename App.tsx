
import React, { useState, useEffect, useCallback } from 'react';
import LoginScreen from './screens/LoginScreen';
import MainScreen from './screens/MainScreen';
import { User } from './types';
import { AppContext } from './contexts/AppContext';
import { DatabaseService } from './services/databaseService';

const App: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const initializeApp = useCallback(() => {
        DatabaseService.initDB();
        // In a real app, you'd check for a session token here
        setIsLoading(false);
    }, []);

    useEffect(() => {
        initializeApp();
    }, [initializeApp]);

    const handleLogin = (user: User) => {
        setCurrentUser(user);
    };

    const handleLogout = () => {
        if (currentUser?.role === 'admin') {
            if (window.confirm('Oturumu kapatırken veritabanının yedeğini indirmek ister misiniz? Bu, verilerinizin güvenliği için önerilir.')) {
                DatabaseService.triggerBackupDownload();
                alert('Yönetici oturumu kapatılırken veritabanı yedeği indirildi. Dosyayı güvenli bir yerde saklayın.');
            }
        }
        setCurrentUser(null);
    };

    if (isLoading) {
        return <div className="flex items-center justify-center h-screen">Yükleniyor...</div>;
    }

    return (
        <AppContext.Provider value={{ currentUser, login: handleLogin, logout: handleLogout }}>
            <div className="min-h-screen bg-gray-200">
                {currentUser ? <MainScreen /> : <LoginScreen />}
            </div>
        </AppContext.Provider>
    );
};

export default App;
