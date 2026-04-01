
import React from 'react';
import { BriefcaseIcon, BuildingOffice2Icon, RedCrossIcon } from './IconComponents';

interface HeaderProps {
  onNavigate: (view: 'list' | 'post' | 'admin') => void;
  isAdmin: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate, isAdmin }) => {
  return (
    <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex justify-between items-center py-4">
          <div 
            className="flex items-center space-x-2 cursor-pointer group"
            onClick={() => onNavigate('list')}
          >
            <div className="text-3xl md:text-4xl font-black tracking-tighter">
              <span className="text-red-600">Med</span>
              <span className="mx-1 text-4xl inline-block align-middle">🩺</span>
              <span className="text-blue-600">Hunters</span>
            </div>
          </div>
          
          <nav className="flex items-center space-x-1 md:space-x-4">
             <button
              onClick={() => onNavigate('list')}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm md:text-base font-semibold text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
            >
              <BriefcaseIcon className="h-5 w-5" />
              <span className="hidden sm:inline">Вакансии</span>
            </button>
            <button
              onClick={() => onNavigate('post')}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm md:text-base font-semibold text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
            >
              <BuildingOffice2Icon className="h-5 w-5" />
              <span className="hidden sm:inline">Работодателям</span>
            </button>
            <div className="h-6 w-px bg-gray-200 mx-2 hidden md:block"></div>
            <button
                onClick={() => onNavigate('admin')}
                className={`px-4 py-2 text-sm md:text-base font-bold text-white rounded-full transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 active:translate-y-0 ${isAdmin ? 'bg-red-600 hover:bg-red-700' : 'bg-indigo-600 hover:bg-indigo-700'}`}
              >
                {isAdmin ? 'Выйти' : 'Админ'}
              </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
