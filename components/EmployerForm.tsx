
import React, { useState, useEffect } from 'react';
import type { Employer } from '../types';

interface EmployerFormProps {
  initialData?: Partial<Employer>;
  onSubmit: (data: Partial<Employer>) => void;
  onCancel?: () => void;
  buttonText: string;
}

const defaultState = {
    organizationName: '',
    taxNumber: '',
    officialAddress: '',
    contactPhonePrimary: '',
    contactPhoneSecondary: '',
    contactEmail: '',
    website: '',
    description: '',
};

export const EmployerForm: React.FC<EmployerFormProps> = ({ onSubmit, initialData, onCancel, buttonText }) => {
  const [formData, setFormData] = useState(defaultState);

  useEffect(() => {
    if (initialData) {
        setFormData(prev => ({ ...prev, ...initialData }));
    } else {
        setFormData(defaultState);
    }
  }, [initialData]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.organizationName) newErrors.organizationName = 'Название организации обязательно';
    if (!formData.taxNumber) newErrors.taxNumber = 'ИНН обязателен';
    if (!/^\d{10}(\d{2})?$/.test(formData.taxNumber)) newErrors.taxNumber = 'ИНН должен состоять из 10 или 12 цифр';
    if (!formData.officialAddress) newErrors.officialAddress = 'Юридический адрес обязателен';
    if (!formData.contactPhonePrimary) newErrors.contactPhonePrimary = 'Основной телефон обязателен';
    if (!formData.contactEmail) newErrors.contactEmail = 'Email обязателен';
    if (formData.contactEmail && !/^\S+@\S+\.\S+$/.test(formData.contactEmail)) newErrors.contactEmail = 'Некорректный формат email';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const isEditMode = !!initialData?.id;

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{isEditMode ? 'Редактирование организации' : 'Данные организации'}</h2>
        <p className="text-gray-600 mb-6">{isEditMode ? `Вы редактируете "${initialData?.organizationName}"` : 'Эта информация будет видна соискателям. Вы заполняете её один раз.'}</p>
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Название организации *</label>
                <input type="text" name="organizationName" value={formData.organizationName} onChange={handleChange} className={`input ${errors.organizationName ? 'border-red-500' : ''}`} />
                {errors.organizationName && <p className="text-red-500 text-xs italic">{errors.organizationName}</p>}
            </div>
            <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">ИНН *</label>
                <input type="text" name="taxNumber" value={formData.taxNumber} onChange={handleChange} readOnly={isEditMode} className={`input ${errors.taxNumber ? 'border-red-500' : ''} ${isEditMode ? 'bg-gray-100' : ''}`} />
                {errors.taxNumber && <p className="text-red-500 text-xs italic">{errors.taxNumber}</p>}
            </div>
            <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Юридический адрес *</label>
                <input type="text" name="officialAddress" value={formData.officialAddress} onChange={handleChange} className={`input ${errors.officialAddress ? 'border-red-500' : ''}`} />
                {errors.officialAddress && <p className="text-red-500 text-xs italic">{errors.officialAddress}</p>}
            </div>
             <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Основной контактный телефон *</label>
                <input type="tel" name="contactPhonePrimary" value={formData.contactPhonePrimary} onChange={handleChange} className={`input ${errors.contactPhonePrimary ? 'border-red-500' : ''}`} />
                 {errors.contactPhonePrimary && <p className="text-red-500 text-xs italic">{errors.contactPhonePrimary}</p>}
            </div>
             <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Дополнительный телефон</label>
                <input type="tel" name="contactPhoneSecondary" value={formData.contactPhoneSecondary} onChange={handleChange} className="input" />
            </div>
            <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Контактный Email *</label>
                <input type="email" name="contactEmail" value={formData.contactEmail} onChange={handleChange} className={`input ${errors.contactEmail ? 'border-red-500' : ''}`} />
                {errors.contactEmail && <p className="text-red-500 text-xs italic">{errors.contactEmail}</p>}
            </div>
             <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Сайт</label>
                <input type="url" name="website" value={formData.website} onChange={handleChange} className="input" placeholder="https://example.com" />
            </div>
            <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Краткое описание организации</label>
                <textarea name="description" value={formData.description} onChange={handleChange} className="input h-24" />
            </div>

            <div className="flex space-x-4">
                {onCancel && (
                    <button type="button" onClick={onCancel} className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline">
                        Отмена
                    </button>
                )}
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline">
                    {buttonText}
                </button>
            </div>
        </form>
        <style>{`
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
        `}</style>
    </div>
  );
};
