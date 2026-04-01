
import React, { useState, useMemo } from 'react';
import type { Vacancy, Employer } from '../types';
import { VacancyCard } from './VacancyCard';
import { POSITION_CATEGORIES } from '../constants';
import { MagnifyingGlassIcon, MapPinIcon, TagIcon, RedCrossIcon } from './IconComponents';

interface VacancyListProps {
  vacancies: Vacancy[];
  employers: Employer[];
  onSelectVacancy: (id: string) => void;
}

export const VacancyList: React.FC<VacancyListProps> = ({ vacancies, employers, onSelectVacancy }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const cities = useMemo(() => {
      const citySet = new Set(vacancies.map(v => v.city).filter(Boolean));
      return Array.from(citySet).sort();
  }, [vacancies]);

  const filteredVacancies = useMemo(() => {
    return vacancies.filter(vacancy => {
      const employer = employers.find(e => e.id === vacancy.employerId);
      if (!employer) return false;

      const searchTermLower = searchTerm.toLowerCase();
      const matchesSearch =
        vacancy.jobTitle.toLowerCase().includes(searchTermLower) ||
        employer.organizationName.toLowerCase().includes(searchTermLower) ||
        vacancy.description.toLowerCase().includes(searchTermLower);

      const matchesCity = !cityFilter || vacancy.city.toLowerCase() === cityFilter.toLowerCase();
      const matchesCategory = !categoryFilter || vacancy.positionCategory === categoryFilter;
      
      return matchesSearch && matchesCity && matchesCategory;
    });
  }, [vacancies, employers, searchTerm, cityFilter, categoryFilter]);

  return (
    <div className="space-y-8">
      <div>
        <div className="mb-2">
            <h1 className="text-xl md:text-2xl font-normal text-gray-800">Найти вакансию</h1>
        </div>
        <p className="text-lg text-gray-600">Актуальные предложения от ведущих медицинских организаций.</p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md sticky top-[81px] z-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Должность или ключевое слово"
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              className="w-full pl-10 pr-4 py-2 border rounded-lg appearance-none bg-white focus:ring-blue-500 focus:border-blue-500"
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
            >
              <option value="">Все города</option>
              {cities.map(city => <option key={city} value={city}>{city}</option>)}
            </select>
          </div>
           <div className="relative">
            <TagIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              className="w-full pl-10 pr-4 py-2 border rounded-lg appearance-none bg-white focus:ring-blue-500 focus:border-blue-500"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">Все категории</option>
              {POSITION_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
        </div>
      </div>
      
      {filteredVacancies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVacancies.map(vacancy => {
            const employer = employers.find(e => e.id === vacancy.employerId);
            return employer ? (
                <VacancyCard
                key={vacancy.id}
                vacancy={vacancy}
                employer={employer}
                onSelectVacancy={onSelectVacancy}
                />
            ) : null;
            })}
        </div>
      ) : (
         <div className="text-center py-16 px-4 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-700">Вакансий не найдено</h2>
            <p className="text-gray-500 mt-2">Попробуйте изменить параметры поиска или загляните позже.</p>
        </div>
      )}
    </div>
  );
};