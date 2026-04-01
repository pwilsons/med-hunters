
import React, { useState } from 'react';
import type { Employer, Vacancy } from '../types';
import { EmployerForm } from './EmployerForm';
import { VacancyForm } from './VacancyForm';
import { PencilIcon, TrashIcon, BuildingOffice2Icon, BriefcaseIcon } from './IconComponents';

interface AdminDashboardProps {
    employers: Employer[];
    vacancies: Vacancy[];
    onUpdateEmployer: (employer: Employer) => void;
    onDeleteEmployer: (employerId: string) => void;
    onUpdateVacancy: (vacancy: Vacancy) => void;
    onDeleteVacancy: (vacancyId: string) => void;
    onAddNewEmployer: (employerData: Partial<Employer>) => void;
    onAddNewVacancy: (vacancyData: Omit<Vacancy, 'id' | 'createdAt' | 'employerId' | 'isPublished'>, employerId: string) => void;
}

type Mode = 'list' | 'edit_employer' | 'create_employer' | 'edit_vacancy' | 'create_vacancy';

const StatCard: React.FC<{ icon: React.ReactNode, title: string, value: number | string }> = ({ icon, title, value }) => (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
        <div className="bg-blue-100 p-3 rounded-full">
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);


export const AdminDashboard: React.FC<AdminDashboardProps> = ({
    employers,
    vacancies,
    onUpdateEmployer,
    onDeleteEmployer,
    onUpdateVacancy,
    onDeleteVacancy,
    onAddNewEmployer,
    onAddNewVacancy,
}) => {
    const [mode, setMode] = useState<Mode>('list');
    const [selectedItem, setSelectedItem] = useState<Employer | Vacancy | null>(null);
    const [employerForNewVacancy, setEmployerForNewVacancy] = useState<Employer | null>(null);

    const handleCancel = () => {
        setMode('list');
        setSelectedItem(null);
        setEmployerForNewVacancy(null);
    };

    const handleEmployerSubmit = (formData: Partial<Employer>) => {
        if (mode === 'create_employer') {
            onAddNewEmployer(formData);
        } else if (mode === 'edit_employer' && selectedItem) {
            onUpdateEmployer({ ...(selectedItem as Employer), ...formData });
        }
        handleCancel();
    };

    const handleVacancySubmit = (formData: Omit<Vacancy, 'id' | 'createdAt' | 'employerId' | 'isPublished'>) => {
        if (mode === 'create_vacancy' && employerForNewVacancy) {
            onAddNewVacancy(formData, employerForNewVacancy.id);
        } else if (mode === 'edit_vacancy' && selectedItem) {
            onUpdateVacancy({ ...(selectedItem as Vacancy), ...formData });
        }
        handleCancel();
    };

    if (mode === 'create_employer') {
        return <EmployerForm onSubmit={handleEmployerSubmit} onCancel={handleCancel} buttonText="Добавить работодателя" />;
    }
    if (mode === 'edit_employer' && selectedItem) {
        return <EmployerForm initialData={selectedItem as Employer} onSubmit={handleEmployerSubmit} onCancel={handleCancel} buttonText="Сохранить изменения" />;
    }
    if (mode === 'create_vacancy') {
        if (!employerForNewVacancy) {
            return (
                <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-xl">
                    <h2 className="text-2xl font-bold text-gray-800 mb-1">Создание вакансии</h2>
                    <p className="text-gray-600 mb-6">Шаг 1: Выберите работодателя для новой вакансии.</p>
                    <div className="mb-4">
                        <label htmlFor="employer-select" className="block text-gray-700 text-sm font-bold mb-2">
                            Организация
                        </label>
                        <select
                            id="employer-select"
                            onChange={(e) => {
                                const emp = employers.find(emp => emp.id === e.target.value);
                                if (emp) setEmployerForNewVacancy(emp);
                            }}
                            defaultValue=""
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        >
                            <option value="" disabled>-- Выберите организацию --</option>
                            {employers.map(emp => <option key={emp.id} value={emp.id}>{emp.organizationName} ({emp.taxNumber})</option>)}
                        </select>
                    </div>
                    <div className="flex justify-end space-x-4 mt-6">
                        <button onClick={handleCancel} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                            Отмена
                        </button>
                    </div>
                </div>
            );
        }
        return <VacancyForm employer={employerForNewVacancy} onSubmit={handleVacancySubmit} onCancel={handleCancel} />;
    }
    if (mode === 'edit_vacancy' && selectedItem) {
        const employerForVacancy = employers.find(e => e.id === (selectedItem as Vacancy).employerId);
        if (!employerForVacancy) {
            return <p className="text-red-500">Ошибка: Работодатель для этой вакансии не найден.</p>;
        }
        return <VacancyForm employer={employerForVacancy} initialData={selectedItem as Vacancy} onSubmit={handleVacancySubmit} onCancel={handleCancel} />;
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Панель администратора</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <StatCard icon={<BuildingOffice2Icon className="h-6 w-6 text-blue-600" />} title="Всего работодателей" value={employers.length} />
                    <StatCard icon={<BriefcaseIcon className="h-6 w-6 text-blue-600" />} title="Всего вакансий" value={vacancies.length} />
                </div>

                <div className="flex justify-start space-x-4">
                    <button onClick={() => setMode('create_employer')} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                        + Добавить работодателя
                    </button>
                     <button onClick={() => setMode('create_vacancy')} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                        + Добавить вакансию
                    </button>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Управление работодателями</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Организация</th>
                                <th scope="col" className="px-6 py-3">ИНН</th>
                                <th scope="col" className="px-6 py-3">Email</th>
                                <th scope="col" className="px-6 py-3">Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employers.map(employer => (
                                <tr key={employer.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{employer.organizationName}</td>
                                    <td className="px-6 py-4">{employer.taxNumber}</td>
                                    <td className="px-6 py-4">{employer.contactEmail}</td>
                                    <td className="px-6 py-4 flex space-x-2">
                                        <button onClick={() => { setSelectedItem(employer); setMode('edit_employer'); }} className="text-blue-600 hover:text-blue-800"><PencilIcon className="h-5 w-5"/></button>
                                        <button onClick={() => onDeleteEmployer(employer.id)} className="text-red-600 hover:text-red-800"><TrashIcon className="h-5 w-5"/></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Управление вакансиями</h2>
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Должность</th>
                                <th scope="col" className="px-6 py-3">Работодатель</th>
                                <th scope="col" className="px-6 py-3">Город</th>
                                <th scope="col" className="px-6 py-3">Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vacancies.map(vacancy => {
                                const employer = employers.find(e => e.id === vacancy.employerId);
                                return (
                                <tr key={vacancy.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{vacancy.jobTitle}</td>
                                    <td className="px-6 py-4">{employer?.organizationName || 'N/A'}</td>
                                    <td className="px-6 py-4">{vacancy.city}</td>
                                    <td className="px-6 py-4 flex space-x-2">
                                        <button onClick={() => { setSelectedItem(vacancy); setMode('edit_vacancy'); }} className="text-blue-600 hover:text-blue-800"><PencilIcon className="h-5 w-5"/></button>
                                        <button onClick={() => onDeleteVacancy(vacancy.id)} className="text-red-600 hover:text-red-800"><TrashIcon className="h-5 w-5"/></button>
                                    </td>
                                </tr>
                            )})}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};