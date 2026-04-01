
import React, { useState, useCallback } from 'react';
import type { Employer, Vacancy } from '../types';
import { EmployerForm } from './EmployerForm';
import { VacancyForm } from './VacancyForm';

interface PostVacancyFlowProps {
  employers: Employer[];
  onVacancyPosted: (vacancy: Vacancy, newEmployer?: Employer) => void;
}

type Step = 'check' | 'employer' | 'vacancy';

export const PostVacancyFlow: React.FC<PostVacancyFlowProps> = ({ employers, onVacancyPosted }) => {
  const [step, setStep] = useState<Step>('check');
  const [currentEmployer, setCurrentEmployer] = useState<Employer | null>(null);
  const [taxNumber, setTaxNumber] = useState('');
  
  const handleCheckTaxNumber = () => {
    const existingEmployer = employers.find(e => e.taxNumber === taxNumber);
    if (existingEmployer) {
      setCurrentEmployer(existingEmployer);
      setStep('vacancy');
    } else {
      setStep('employer');
    }
  };

  const handleEmployerSubmit = useCallback((employerData: Partial<Employer>) => {
      const newEmployer: Employer = {
          organizationName: employerData.organizationName || '',
          taxNumber: employerData.taxNumber || '',
          officialAddress: employerData.officialAddress || '',
          contactPhonePrimary: employerData.contactPhonePrimary || '',
          contactEmail: employerData.contactEmail || '',
          ...employerData,
          id: `emp_${Date.now()}`,
          createdAt: new Date().toISOString()
      };
      setCurrentEmployer(newEmployer);
      setStep('vacancy');
  }, []);

  const handleVacancySubmit = useCallback((vacancyData: Omit<Vacancy, 'id' | 'createdAt' | 'employerId' | 'isPublished'>) => {
    if (!currentEmployer) {
        console.error("Cannot post vacancy without employer context.");
        alert("Произошла ошибка. Не удалось определить данные работодателя.");
        return;
    }

    const isNewEmployer = !employers.some(e => e.id === currentEmployer.id);
    
    const newVacancy: Vacancy = {
        ...vacancyData,
        id: `vac_${Date.now()}`,
        createdAt: new Date().toISOString(),
        employerId: currentEmployer.id,
        isPublished: true,
    };

    onVacancyPosted(newVacancy, isNewEmployer ? currentEmployer : undefined);

  }, [currentEmployer, onVacancyPosted, employers]);

  const renderStep = () => {
    switch (step) {
      case 'check':
        return (
          <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-1">Опубликовать вакансию</h2>
            <p className="text-gray-600 mb-6">Проверим, публиковались ли вы у нас ранее.</p>
            <div className="mb-4">
              <label htmlFor="tax_number_check" className="block text-gray-700 text-sm font-bold mb-2">
                ИНН вашей организации
              </label>
              <input
                id="tax_number_check"
                type="text"
                value={taxNumber}
                onChange={(e) => setTaxNumber(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Например, 7701234567"
              />
            </div>
            <button
              onClick={handleCheckTaxNumber}
              disabled={!taxNumber}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-gray-400"
            >
              Продолжить
            </button>
            <p className="text-xs text-gray-500 mt-4">Если вы публикуетесь впервые, мы попросим вас заполнить данные организации на следующем шаге.</p>
          </div>
        );
      case 'employer':
        return <EmployerForm 
            onSubmit={handleEmployerSubmit} 
            initialData={{ taxNumber }}
            buttonText="Сохранить и перейти к вакансии"
          />;
      case 'vacancy':
        if (!currentEmployer) {
            return (
              <div className="text-center text-red-500">
                Ошибка: данные работодателя не найдены. Пожалуйста, вернитесь на предыдущий шаг.
                <button onClick={() => setStep('check')} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">Назад</button>
              </div>
            );
        }
        return <VacancyForm employer={currentEmployer} onSubmit={handleVacancySubmit} />;
      default:
        return null;
    }
  };

  return <div className="container mx-auto">{renderStep()}</div>;
};
