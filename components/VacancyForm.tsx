
import React, { useState, useEffect } from 'react';
import type { Vacancy, Employer } from '../types';
import { POSITION_CATEGORIES, EMPLOYMENT_TYPES } from '../constants';

interface VacancyFormProps {
  employer: Employer;
  initialData?: Vacancy;
  onSubmit: (data: Omit<Vacancy, 'id' | 'createdAt' | 'employerId' | 'isPublished'>) => void;
  onCancel?: () => void;
}

export const VacancyForm: React.FC<VacancyFormProps> = ({ employer, initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    jobTitle: initialData?.jobTitle || '',
    positionCategory: initialData?.positionCategory || POSITION_CATEGORIES[0],
    city: initialData?.city || '',
    employmentType: initialData?.employmentType || EMPLOYMENT_TYPES[0],
    workSchedule: initialData?.workSchedule || '',
    salary: initialData?.salary || '',
    experienceRequired: initialData?.experienceRequired || '',
    educationRequired: initialData?.educationRequired || '',
    description: initialData?.description || '',
    contactPhone: initialData?.contactPhone || employer.contactPhonePrimary,
    contactEmail: initialData?.contactEmail || employer.contactEmail,
    contactNote: initialData?.contactNote || '',
  });

  useEffect(() => {
     if (initialData) {
        setFormData({
            jobTitle: initialData.jobTitle,
            positionCategory: initialData.positionCategory,
            city: initialData.city,
            employmentType: initialData.employmentType,
            workSchedule: initialData.workSchedule || '',
            salary: initialData.salary || '',
            experienceRequired: initialData.experienceRequired || '',
            educationRequired: initialData.educationRequired || '',
            description: initialData.description,
            contactPhone: initialData.contactPhone,
            contactEmail: initialData.contactEmail,
            contactNote: initialData.contactNote || '',
        });
     }
  }, [initialData]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.jobTitle) newErrors.jobTitle = 'Название должности обязательно';
    if (!formData.description) newErrors.description = 'Описание вакансии обязательно';
    if (!formData.contactPhone && !formData.contactEmail) newErrors.contact = 'Укажите хотя бы телефон или email для связи';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const isEditMode = !!initialData;

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-xl">
        <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">{isEditMode ? 'Редактирование вакансии' : 'Новая вакансия'}</h2>
            <p className="text-gray-600">для организации «{employer.organizationName}»</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="label">Название должности *</label>
                <input type="text" name="jobTitle" value={formData.jobTitle} onChange={handleChange} className={`input ${errors.jobTitle ? 'border-red-500' : ''}`} />
                {errors.jobTitle && <p className="error-text">{errors.jobTitle}</p>}
            </div>
            <div>
                <label className="label">Категория</label>
                <select name="positionCategory" value={formData.positionCategory} onChange={handleChange} className="input">
                    {POSITION_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
            </div>
            <div>
                <label className="label">Город</label>
                <input type="text" name="city" value={formData.city} onChange={handleChange} className="input" />
            </div>
            <div>
                <label className="label">Тип занятости</label>
                <select name="employmentType" value={formData.employmentType} onChange={handleChange} className="input">
                    {EMPLOYMENT_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
            </div>
             <div>
                <label className="label">График работы</label>
                <input type="text" name="workSchedule" value={formData.workSchedule} onChange={handleChange} className="input" placeholder="Например, 5/2 с 9:00 до 18:00"/>
            </div>
             <div>
                <label className="label">Зарплата</label>
                <input type="text" name="salary" value={formData.salary} onChange={handleChange} className="input" placeholder="Например, от 100 000 руб."/>
            </div>
             <div>
                <label className="label">Требуемый опыт</label>
                <input type="text" name="experienceRequired" value={formData.experienceRequired} onChange={handleChange} className="input" placeholder="Например, от 3 лет"/>
            </div>
            <div>
                <label className="label">Требуемое образование</label>
                <input type="text" name="educationRequired" value={formData.educationRequired} onChange={handleChange} className="input" placeholder="Например, высшее медицинское"/>
            </div>
            <div>
                <div className="flex justify-between items-center mb-2">
                    <label className="label mb-0">Описание вакансии (обязанности, требования, условия) *</label>
                </div>
                <textarea name="description" value={formData.description} onChange={handleChange} className={`input h-48 ${errors.description ? 'border-red-500' : ''}`} />
                {errors.description && <p className="error-text">{errors.description}</p>}
            </div>
            
            <div className="pt-4 border-t">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Контакты для соискателей</h3>
                <p className="text-sm text-gray-500 mb-4">Предзаполнены из данных организации, но вы можете их изменить для этой вакансии.</p>
                <div>
                    <label className="label">Контактный телефон</label>
                    <input type="tel" name="contactPhone" value={formData.contactPhone} onChange={handleChange} className="input" />
                </div>
                 <div>
                    <label className="label">Контактный Email</label>
                    <input type="email" name="contactEmail" value={formData.contactEmail} onChange={handleChange} className="input" />
                </div>
                {errors.contact && <p className="error-text">{errors.contact}</p>}
                 <div>
                    <label className="label">Примечание для соискателей</label>
                    <input type="text" name="contactNote" value={formData.contactNote} onChange={handleChange} className="input" placeholder="Например, «Звонить с 10:00 до 17:00»"/>
                </div>
            </div>

            <div className="flex space-x-4 pt-4">
                 {onCancel && (
                    <button type="button" onClick={onCancel} className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline">
                        Отмена
                    </button>
                )}
                <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline">
                    {isEditMode ? 'Сохранить изменения' : 'Опубликовать вакансию'}
                </button>
            </div>
        </form>
         <style>{`
            .label { display: block; color: #374151; font-size: 0.875rem; font-weight: 700; margin-bottom: 0.5rem; }
            .input {
                box-shadow: inset 0 1px 2px rgba(0,0,0,0.07);
                appearance: none;
                border: 1px solid #d2d6dc;
                border-radius: 0.375rem;
                width: 100%;
                padding: 0.5rem 0.75rem;
                color: #374151;
                line-height: 1.5;
            }
            .input:focus {
                outline: none;
                box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5);
                border-color: #3b82f6;
            }
            .error-text { color: #ef4444; font-size: 0.75rem; font-style: italic; }
        `}</style>
    </div>
  );
};