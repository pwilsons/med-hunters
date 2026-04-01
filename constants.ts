
import type { Employer, Vacancy } from './types';

const employer1Id = 'emp_1';
export const initialEmployers: Employer[] = [
  {
    id: employer1Id,
    organizationName: "Клиника 'Здоровье'",
    taxNumber: "7701234567",
    officialAddress: "г. Москва, ул. Лесная, д. 10",
    contactPhonePrimary: "+7 (495) 123-45-67",
    contactPhoneSecondary: "+7 (495) 987-65-43",
    contactEmail: "hr@zdorovie.ru",
    website: "https://zdorovie.ru",
    description: "Современная многопрофильная клиника для взрослых и детей.",
    createdAt: new Date().toISOString(),
  },
  {
    id: 'emp_2',
    organizationName: "Городская больница №5",
    taxNumber: "7802345678",
    officialAddress: "г. Санкт-Петербург, пр. Просвещения, д. 50",
    contactPhonePrimary: "+7 (812) 555-12-34",
    contactEmail: "kadry@gb5-spb.ru",
    website: "https://gb5-spb.ru",
    description: "Крупное государственное медицинское учреждение.",
    createdAt: new Date().toISOString(),
  }
];

export const initialVacancies: Vacancy[] = [
  {
    id: 'vac_1',
    jobTitle: "Врач-терапевт",
    positionCategory: "Врач",
    city: "Москва",
    employmentType: "Полная занятость",
    workSchedule: "Смены по 8 часов, 2/2",
    salary: "от 150 000 руб.",
    experienceRequired: "от 3 лет по специальности",
    educationRequired: "Высшее медицинское образование, действующий сертификат",
    description: "Амбулаторный приём пациентов, ведение медицинской документации, взаимодействие с лабораторией и узкими специалистами.",
    employerId: employer1Id,
    contactPhone: "+7 (495) 123-45-67",
    contactEmail: "hr@zdorovie.ru",
    contactNote: "Резюме направлять на email с темой письма «Терапевт».",
    isPublished: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'vac_2',
    jobTitle: "Медицинская сестра процедурной",
    positionCategory: "Медсестра",
    city: "Санкт-Петербург",
    employmentType: "Сменный график",
    workSchedule: "Сутки через трое",
    salary: "от 70 000 руб.",
    experienceRequired: "от 1 года",
    educationRequired: "Среднее профессиональное медицинское образование, сертификат «Сестринское дело».",
    description: "Выполнение врачебных назначений, в/в, в/м инъекции, постановка капельниц, забор крови. Ведение учетно-отчетной документации.",
    employerId: 'emp_2',
    contactPhone: "+7 (812) 555-12-34",
    contactEmail: "kadry@gb5-spb.ru",
    isPublished: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'vac_3',
    jobTitle: "Врач-лаборант",
    positionCategory: "Лаборант",
    city: "Москва",
    employmentType: "Полная занятость",
    salary: "от 120 000 руб.",
    description: "Проведение клинических лабораторных исследований. Работа на современном оборудовании. Контроль качества.",
    employerId: employer1Id,
    contactPhone: "+7 (495) 123-45-67",
    contactEmail: "lab@zdorovie.ru",
    isPublished: true,
    createdAt: new Date().toISOString(),
  }
];

export const POSITION_CATEGORIES = ["Врач", "Медсестра", "Лаборант", "Администратор", "Другое"];
export const EMPLOYMENT_TYPES: Vacancy['employmentType'][] = ["Полная занятость", "Частичная занятость", "Сменный график", "Договор"];
