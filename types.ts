
export interface Employer {
  id: string;
  organizationName: string;
  taxNumber: string; // ИНН
  officialAddress: string;
  contactPhonePrimary: string;
  contactPhoneSecondary?: string;
  contactEmail: string;
  website?: string;
  description?: string;
  createdAt: string;
}

export interface Vacancy {
  id: string;
  jobTitle: string;
  positionCategory: string; // 'Врач', 'Медсестра', 'Лаборант'
  city: string;
  employmentType: 'Полная занятость' | 'Частичная занятость' | 'Сменный график' | 'Договор';
  workSchedule?: string;
  salary?: string;
  experienceRequired?: string;
  educationRequired?: string;
  description: string;
  employerId: string;
  contactPhone: string;
  contactEmail:string;
  contactNote?: string;
  isPublished: boolean;
  createdAt: string;
}
