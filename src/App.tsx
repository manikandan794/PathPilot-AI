import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { LandingPage } from './components/landing/LandingPage';
import { StudentPortal } from './components/student/StudentPortal';
import { EmployeePortal } from './components/employee/EmployeePortal';
import { AdminPortal } from './components/admin/AdminPortal';
import { AuthModal } from './components/auth/AuthModal';
import { useAuth } from './context/AuthContext';

export function App() {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState<'landing' | 'student' | 'employee' | 'admin'>('landing');
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeView]);

  return (
    <div className="min-h-screen bg-charcoal text-text-white flex flex-col selection:bg-lime-brand selection:text-charcoal">
      
      {/* Fixed Navigation Bar */}
      <Navbar
        activeView={activeView}
        onNavigate={(view) => setActiveView(view)}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeView === 'landing' && (
          <LandingPage
            onNavigate={(view) => setActiveView(view)}
            onOpenAuth={() => setIsAuthOpen(true)}
          />
        )}

        {activeView === 'student' && <StudentPortal />}

        {activeView === 'employee' && <EmployeePortal />}

        {activeView === 'admin' && <AdminPortal />}
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Authentication & Persona Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

    </div>
  );
}

export default App;
