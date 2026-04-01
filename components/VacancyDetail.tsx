
import React from 'react';
import type { Vacancy, Employer } from '../types';
import { 
    BriefcaseIcon, MapPinIcon, ClockIcon, CurrencyDollarIcon, AcademicCapIcon, ArrowLeftIcon, PhoneIcon, EnvelopeIcon, GlobeAltIcon, InformationCircleIcon, CalendarDaysIcon 
} from './IconComponents';

interface VacancyDetailProps {
  vacancy: Vacancy;
  employer: Employer;
  onBack: () => void;
}

const DetailItem: React.FC<{ icon: React.ReactNode; label: string; value?: string }> = ({ icon, label, value }) => {
    if (!value) return null;
    return (
        <div className="flex items-start">
            <div className="flex-shrink-0 h-6 w-6 text-gray-400 mt-1">{icon}</div>
            <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">{label}</p>
                <p className="text-base text-gray-800">{value}</p>
            </div>
        </div>
    );
};

export const VacancyDetail: React.FC<VacancyDetailProps> = ({ vacancy, employer, onBack }) => {
  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl max-w-4xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center mb-6 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
      >
        <ArrowLeftIcon className="h-4 w-4 mr-2" />
        Назад к списку вакансий
      </button>

      <div className="border-b pb-6 mb-6">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">{vacancy.jobTitle}</h1>
        <p className="mt-2 text-xl text-gray-600">{employer.organizationName}</p>
        {vacancy.salary && <p className="mt-2 text-2xl font-bold text-green-600">{vacancy.salary}</p>}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-8">
        <DetailItem icon={<MapPinIcon />} label="Город" value={vacancy.city} />
        <DetailItem icon={<BriefcaseIcon />} label="Тип занятости" value={vacancy.employmentType} />
        <DetailItem icon={<ClockIcon />} label="График работы" value={vacancy.workSchedule} />
        <DetailItem icon={<BriefcaseIcon />} label="Требуемый опыт" value={vacancy.experienceRequired} />
        <DetailItem icon={<AcademicCapIcon />} label="Требуемое образование" value={vacancy.educationRequired} />
        <DetailItem icon={<CalendarDaysIcon />} label="Дата публикации" value={new Date(vacancy.createdAt).toLocaleDateString('ru-RU')} />
      </div>

      <div className="prose prose-lg max-w-none text-gray-800">
        <h2 className="text-2xl font-bold text-gray-900 border-b pb-2 mb-4">Описание вакансии</h2>
        <p style={{ whiteSpace: 'pre-wrap' }}>{vacancy.description}</p>
      </div>

      <div className="mt-10 bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Связаться напрямую</h2>
        <div className="flex items-start p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-6">
            <InformationCircleIcon className="h-6 w-6 text-yellow-500 flex-shrink-0 mt-1" />
            <p className="ml-3 text-sm text-yellow-800">Соискатели связываются с работодателем напрямую по указанным контактам. Платформа не участвует в процессе общения.</p>
        </div>
        
        <div className="space-y-4">
            {(vacancy.contactPhone || employer.contactPhonePrimary) && (
                <div className="flex items-center">
                    <PhoneIcon className="h-6 w-6 text-gray-400"/>
                    <a href={`tel:${(vacancy.contactPhone || employer.contactPhonePrimary).replace(/\s/g, '')}`} className="ml-3 text-lg text-blue-700 hover:underline">
                        {vacancy.contactPhone || employer.contactPhonePrimary}
                    </a>
                </div>
            )}
            {(vacancy.contactEmail || employer.contactEmail) && (
                 <div className="flex items-center">
                    <EnvelopeIcon className="h-6 w-6 text-gray-400"/>
                    <a href={`mailto:${vacancy.contactEmail || employer.contactEmail}`} className="ml-3 text-lg text-blue-700 hover:underline">
                        {vacancy.contactEmail || employer.contactEmail}
                    </a>
                </div>
            )}
            {employer.website && (
                <div className="flex items-center">
                    <GlobeAltIcon className="h-6 w-6 text-gray-500"/>
                    <a href={employer.website} target="_blank" rel="noopener noreferrer" className="ml-3 text-lg text-blue-700 hover:underline">{employer.website}</a>
                </div>
            )}
            {vacancy.contactNote && (
                <div className="pt-2">
                    <p className="text-sm text-gray-600 italic"><strong>Примечание:</strong> {vacancy.contactNote}</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
