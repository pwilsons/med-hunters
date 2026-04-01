
import * as React from 'react';
import { useState, useCallback, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { VacancyList } from './components/VacancyList';
import { VacancyDetail } from './components/VacancyDetail';
import { PostVacancyFlow } from './components/PostVacancyFlow';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLogin } from './components/AdminLogin';
import type { Employer, Vacancy } from './types';
import { db, auth, handleFirestoreError, OperationType } from './firebase';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy,
  setDoc
} from 'firebase/firestore';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';

type View = 'list' | 'detail' | 'post' | 'admin' | 'login';

const App: React.FC = () => {
  const [view, setView] = useState<View>('list');
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedVacancyId, setSelectedVacancyId] = useState<string | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  const [employers, setEmployers] = useState<Employer[]>([]);
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Check if user is admin (you can add more complex logic here)
        // For now, we'll allow the password login to set isAdmin, 
        // but Google login can also be used.
        // If the email matches the admin email, set isAdmin to true.
        if (user.email === 'pwilsonswp@gmail.com') {
          setIsAdmin(true);
        }
      } else {
        setIsAdmin(false);
      }
      setIsAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!isAuthReady) return;

    const employersQuery = query(collection(db, 'employers'), orderBy('createdAt', 'desc'));
    const unsubscribeEmployers = onSnapshot(employersQuery, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Employer));
      setEmployers(docs);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'employers');
    });

    const vacanciesQuery = query(collection(db, 'vacancies'), orderBy('createdAt', 'desc'));
    const unsubscribeVacancies = onSnapshot(vacanciesQuery, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Vacancy));
      setVacancies(docs);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'vacancies');
    });

    return () => {
      unsubscribeEmployers();
      unsubscribeVacancies();
    };
  }, [isAuthReady]);

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
    if (newView === 'admin') {
      if (isAdmin) {
        signOut(auth).then(() => {
          setIsAdmin(false);
          setView('list');
        });
      } else {
        setView('login');
      }
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

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      setView('admin');
    } catch (error) {
      console.error("Google login error:", error);
    }
  };

  const handleVacancyPosted = useCallback(async (newVacancyData: Omit<Vacancy, 'id' | 'createdAt' | 'isPublished'>, newEmployerData?: Omit<Employer, 'id' | 'createdAt'>) => {
      try {
        let employerId = newVacancyData.employerId;

        if (newEmployerData) {
            const employerRef = doc(collection(db, 'employers'));
            employerId = employerRef.id;
            await setDoc(employerRef, {
                ...newEmployerData,
                id: employerId,
                createdAt: new Date().toISOString()
            });
        }

        const vacancyRef = doc(collection(db, 'vacancies'));
        await setDoc(vacancyRef, {
            ...newVacancyData,
            id: vacancyRef.id,
            employerId: employerId,
            isPublished: true,
            createdAt: new Date().toISOString()
        });

        setView('list');
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, 'vacancies/employers');
      }
  }, []);
  
  // Admin CRUD Handlers
  const handleAddNewEmployer = async (employerData: Partial<Employer>) => {
    try {
      const employerRef = doc(collection(db, 'employers'));
      await setDoc(employerRef, {
          organizationName: employerData.organizationName || 'Новая организация',
          taxNumber: employerData.taxNumber || '',
          officialAddress: employerData.officialAddress || '',
          contactPhonePrimary: employerData.contactPhonePrimary || '',
          contactEmail: employerData.contactEmail || '',
          ...employerData,
          id: employerRef.id,
          createdAt: new Date().toISOString()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'employers');
    }
  };

  const handleAddNewVacancy = async (vacancyData: Omit<Vacancy, 'id' | 'createdAt' | 'employerId' | 'isPublished'>, employerId: string) => {
      try {
        const vacancyRef = doc(collection(db, 'vacancies'));
        await setDoc(vacancyRef, {
            ...vacancyData,
            id: vacancyRef.id,
            createdAt: new Date().toISOString(),
            employerId: employerId,
            isPublished: true,
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, 'vacancies');
      }
  };

  const handleUpdateEmployer = async (updatedEmployer: Employer) => {
    try {
      const employerRef = doc(db, 'employers', updatedEmployer.id);
      await updateDoc(employerRef, { ...updatedEmployer });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `employers/${updatedEmployer.id}`);
    }
  };

  const handleDeleteEmployer = async (employerId: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этого работодателя и все его вакансии?')) {
        try {
          // Delete employer
          await deleteDoc(doc(db, 'employers', employerId));
          
          // Delete associated vacancies
          const associatedVacancies = vacancies.filter(v => v.employerId === employerId);
          for (const vacancy of associatedVacancies) {
            await deleteDoc(doc(db, 'vacancies', vacancy.id));
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.DELETE, `employers/${employerId}`);
        }
    }
  };

  const handleUpdateVacancy = async (updatedVacancy: Vacancy) => {
    try {
      const vacancyRef = doc(db, 'vacancies', updatedVacancy.id);
      await updateDoc(vacancyRef, { ...updatedVacancy });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `vacancies/${updatedVacancy.id}`);
    }
  };

  const handleDeleteVacancy = async (vacancyId: string) => {
    if (window.confirm('Вы уверены, что хотите удалить эту вакансию?')) {
        try {
          await deleteDoc(doc(db, 'vacancies', vacancyId));
        } catch (error) {
          handleFirestoreError(error, OperationType.DELETE, `vacancies/${vacancyId}`);
        }
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
    if (!isAuthReady) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
    }

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
            return <AdminLogin onLoginAttempt={handleAdminLoginAttempt} onGoogleLogin={handleGoogleLogin} onBack={() => setView('list')} />;
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