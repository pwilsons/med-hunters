
import React, { useState } from 'react';
import { ArrowLeftIcon, EyeIcon, EyeSlashIcon } from './IconComponents';

interface AdminLoginProps {
    onLoginAttempt: (passwordOne: string, passwordTwo: string) => boolean;
    onBack: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginAttempt, onBack }) => {
    const [passwordOne, setPasswordOne] = useState('');
    const [passwordTwo, setPasswordTwo] = useState('');
    const [showPasswordOne, setShowPasswordOne] = useState(false);
    const [showPasswordTwo, setShowPasswordTwo] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const success = onLoginAttempt(passwordOne, passwordTwo);
        if (!success) {
            setError('Неверная комбинация паролей. Попробуйте еще раз.');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center pt-16">
             <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">Вход для администратора</h1>
                <p className="text-center text-gray-500 mb-8">Введите оба пароля для доступа к панели управления.</p>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="passwordOne" className="block text-sm font-medium text-gray-700 mb-1">
                            Пароль 1
                        </label>
                        <div className="relative">
                            <input
                                id="passwordOne"
                                name="passwordOne"
                                type={showPasswordOne ? 'text' : 'password'}
                                required
                                value={passwordOne}
                                onChange={(e) => setPasswordOne(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPasswordOne(!showPasswordOne)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                                aria-label="Toggle password one visibility"
                            >
                                {showPasswordOne ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>

                     <div>
                        <label htmlFor="passwordTwo" className="block text-sm font-medium text-gray-700 mb-1">
                            Пароль 2
                        </label>
                        <div className="relative">
                            <input
                                id="passwordTwo"
                                name="passwordTwo"
                                type={showPasswordTwo ? 'text' : 'password'}
                                required
                                value={passwordTwo}
                                onChange={(e) => setPasswordTwo(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                             <button
                                type="button"
                                onClick={() => setShowPasswordTwo(!showPasswordTwo)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                                aria-label="Toggle password two visibility"
                            >
                                {showPasswordTwo ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>
                    
                    {error && <p className="text-sm text-center text-red-600">{error}</p>}

                    <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                            Войти
                        </button>
                    </div>
                </form>
            </div>
             <button
                onClick={onBack}
                className="flex items-center mt-8 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
            >
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Вернуться на главную
            </button>
        </div>
    );
};
