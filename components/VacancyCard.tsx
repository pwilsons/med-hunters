
import React from 'react';
import type { Vacancy, Employer } from '../types';
import { MapPinIcon, CurrencyDollarIcon, BuildingOfficeIcon } from './IconComponents';

interface VacancyCardProps {
  vacancy: Vacancy;
  employer: Employer;
  onSelectVacancy: (id: string) => void;
}

export const VacancyCard: React.FC<VacancyCardProps> = ({ vacancy, employer, onSelectVacancy }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full border border-gray-200">
      <div className="p-6 flex-grow">
        <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold text-gray-800 pr-2">{vacancy.jobTitle}</h3>
             <span className="flex-shrink-0 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">{vacancy.positionCategory}</span>
        </div>
        <div className="flex items-center text-gray-600 mb-2">
            <BuildingOfficeIcon className="h-5 w-5 mr-2 text-gray-400"/>
            <span>{employer.organizationName}</span>
        </div>
        <div className="flex items-center text-gray-600 mb-2">
          <MapPinIcon className="h-5 w-5 mr-2 text-gray-400" />
          <span>{vacancy.city}</span>
        </div>
        {vacancy.salary && (
            <div className="flex items-center text-green-600 font-semibold mb-4">
                <CurrencyDollarIcon className="h-5 w-5 mr-2"/>
                <span>{vacancy.salary}</span>
            </div>
        )}
        <p className="text-gray-700 text-sm line-clamp-3">
          {vacancy.description}
        </p>
      </div>
      <div className="p-6 bg-gray-50 rounded-b-lg border-t">
        <button
          onClick={() => onSelectVacancy(vacancy.id)}
          className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Подробнее
        </button>
      </div>
    </div>
  );
};