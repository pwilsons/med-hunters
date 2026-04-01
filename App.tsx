
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { VacancyList } from './components/VacancyList';
import { VacancyDetail } from './components/VacancyDetail';
import { PostVacancyFlow } from './components/PostVacancyFlow';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLogin } from './components/AdminLogin';
import type { Employer, Vacancy } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { initialEmployers, initialVacancies } from './constants';

type View = 'list' | 'detail' | 'post' | 'admin' | 'login';

const App: React.FC = () => {
  const [view, setView] = useState<View>('list');
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedVacancyId, setSelectedVacancyId] = useState<string | null>(null);

  const [employers, setEmployers] = useLocalStorage<Employer[]>('employers', initialEmployers);
  const [vacancies, setVacancies] = useLocalStorage<Vacancy[]>('vacancies', initialVacancies);

  useEffect(() => {
    const checkHashForAdmin = () => {
      if (window.location.hash === '#/control') {
        setView('login');
      }
    };

    window.addEventListener('hashchange', checkHashForAdmin);
    checkHashForAdmin(); // Check on initial load

    return () => {
      window.removeEventListener('hashchange', checkHashForAdmin);
    };
  }, []);

  const handleSelectVacancy = useCallback((id: string) => {
    setSelectedVacancyId(id);
    setView('detail');
  }, []);
  
  const handleNavigate = useCallback((newView: View) => {
    if (newView === 'admin' && !isAdmin) {
        setView('login');
        return;
    }
    setSelectedVacancyId(null);
    setView(newView);
  }, [isAdmin]);

  const handleAdminLoginAttempt = (passwordOne: string, passwordTwo: string): boolean => {
    const pass1 = 'ICUIvrDJdd@2026_Katsu';
    const pass2 = 'BghJoe@7227++++';

    const isValid = (passwordOne === pass1 && passwordTwo === pass2) || (passwordOne === pass2 && passwordTwo === pass1);

    if (isValid) {
        setIsAdmin(true);
        setView('admin');
        return true;
    }
    return false;
  };

  const handleVacancyPosted = useCallback((newVacancy: Vacancy, newEmployer?: Employer) => {
      if (newEmployer) {
          setEmployers(prev => [...prev, newEmployer]);
      }
      setVacancies(prev => [newVacancy, ...prev]);
      setView('list');
  }, [setEmployers, setVacancies]);
  
  // Admin CRUD Handlers
  const handleAddNewEmployer = (employerData: Partial<Employer>) => {
    const newEmployer: Employer = {
        organizationName: employerData.organizationName || 'Новая организация',
        taxNumber: employerData.taxNumber || '',
        officialAddress: employerData.officialAddress || '',
        contactPhonePrimary: employerData.contactPhonePrimary || '',
        contactEmail: employerData.contactEmail || '',
        ...employerData,
        id: `emp_${Date.now()}`,
        createdAt: new Date().toISOString()
    };
    setEmployers(prev => [...prev, newEmployer]);
  };

  const handleAddNewVacancy = (vacancyData: Omit<Vacancy, 'id' | 'createdAt' | 'employerId' | 'isPublished'>, employerId: string) => {
      const newVacancy: Vacancy = {
          ...vacancyData,
          id: `vac_${Date.now()}`,
          createdAt: new Date().toISOString(),
          employerId: employerId,
          isPublished: true,
      };
      setVacancies(prev => [newVacancy, ...prev]);
  };

  const handleUpdateEmployer = (updatedEmployer: Employer) => {
    setEmployers(prev => prev.map(e => e.id === updatedEmployer.id ? updatedEmployer : e));
  };

  const handleDeleteEmployer = (employerId: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этого работодателя и все его вакансии?')) {
        setVacancies(prev => prev.filter(v => v.employerId !== employerId));
        setEmployers(prev => prev.filter(e => e.id !== employerId));
    }
  };

  const handleUpdateVacancy = (updatedVacancy: Vacancy) => {
    setVacancies(prev => prev.map(v => v.id === updatedVacancy.id ? updatedVacancy : v));
  };

  const handleDeleteVacancy = (vacancyId: string) => {
    if (window.confirm('Вы уверены, что хотите удалить эту вакансию?')) {
        setVacancies(prev => prev.filter(v => v.id !== vacancyId));
    }
  };

  const selectedVacancy = useMemo(() => {
    if (view !== 'detail' || !selectedVacancyId) return null;
    return vacancies.find(v => v.id === selectedVacancyId) || null;
  }, [view, selectedVacancyId, vacancies]);

  const selectedEmployer = useMemo(() => {
    if (!selectedVacancy) return null;
    return employers.find(e => e.id === selectedVacancy.employerId) || null;
  }, [selectedVacancy, employers]);

  const renderContent = () => {
    switch(view) {
        case 'list':
            return <VacancyList 
                        vacancies={vacancies} 
                        employers={employers} 
                        onSelectVacancy={handleSelectVacancy}
                    />;
        case 'detail':
            if (selectedVacancy && selectedEmployer) {
                return <VacancyDetail vacancy={selectedVacancy} employer={selectedEmployer} onBack={() => handleNavigate('list')} />;
            }
            // Fallback if detail view is active but no selection is found
            setView('list');
            return null;
        case 'post':
            return <PostVacancyFlow employers={employers} onVacancyPosted={handleVacancyPosted} />;
        case 'admin':
            if (isAdmin) {
                return <AdminDashboard 
                    employers={employers}
                    vacancies={vacancies}
                    onUpdateEmployer={handleUpdateEmployer}
                    onDeleteEmployer={handleDeleteEmployer}
                    onUpdateVacancy={handleUpdateVacancy}
                    onDeleteVacancy={handleDeleteVacancy}
                    onAddNewEmployer={handleAddNewEmployer}
                    onAddNewVacancy={handleAddNewVacancy}
                />;
            }
            // Fallback to login if not admin
            setView('login');
            return null;
        case 'login':
            return <AdminLogin onLoginAttempt={handleAdminLoginAttempt} onBack={() => setView('list')} />;
        default:
            return null;
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      <Header onNavigate={handleNavigate} isAdmin={isAdmin} />
      <main className="container mx-auto p-4 md:p-8 flex-grow">
        {renderContent()}
      </main>
      <footer className="text-center p-4 text-gray-500 text-sm mt-8">
        <p>
            &copy; 2026 Med-Hunters. Все права защищены.
        </p>
      </footer>
    </div>
  );
};

export default App;