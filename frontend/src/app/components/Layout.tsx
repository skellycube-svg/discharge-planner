import React from 'react';
import { Outlet, NavLink } from 'react-router';
import { Home, Pill, Calendar, HeartHandshake, Languages } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useLanguage } from '../context/LanguageContext';
import { usePatient } from '../context/PatientContext';
import { useNavigate } from 'react-router';
import { LogOut } from 'lucide-react';

export function Layout() {
  const { lang, toggleLang, t } = useLanguage();
  const { patient, clearPatient } = usePatient();
  const navigate = useNavigate();

  const handleSwitch = () => {
    clearPatient();
    navigate('/login');
  };

  const navItems = [
    { to: "/", icon: Home, label: t.nav.home },
    { to: "/medications", icon: Pill, label: t.nav.meds },
    { to: "/appointments", icon: Calendar, label: t.nav.visits },
    { to: "/resources", icon: HeartHandshake, label: t.nav.help },
  ];

  return (
    <div className="relative min-h-screen bg-gray-50 flex justify-center overflow-hidden">
      <div className="w-full max-w-md bg-white min-h-screen shadow-2xl relative flex flex-col">
        
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex justify-between items-center z-50 shadow-sm gap-2">
          <button
            onClick={handleSwitch}
            className="flex items-center gap-2 min-w-0 active:scale-95 transition-transform"
            aria-label="Switch patient"
          >
            <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 font-black text-sm flex items-center justify-center shrink-0">
              {patient ? patient.name.split(' ').map((n) => n[0]).slice(0, 2).join('') : '—'}
            </div>
            <div className="min-w-0 text-left">
              <div className="font-black text-gray-900 text-sm truncate">{patient?.name ?? 'Care to Home'}</div>
              <div className="text-xs font-bold text-gray-500 truncate">
                {patient ? `MRN ${patient.mrn}` : ''}
              </div>
            </div>
            <LogOut className="w-4 h-4 text-gray-400 shrink-0" />
          </button>
          <button
            onClick={toggleLang}
            className="flex items-center gap-1 bg-indigo-50 border border-indigo-100 px-3 py-2 rounded-full text-indigo-700 font-bold text-sm active:scale-95 transition-transform shrink-0"
          >
            <Languages className="w-4 h-4" /> {lang === 'en' ? 'ES' : 'EN'}
          </button>
        </div>

        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <Outlet />
        </main>

        <nav className="absolute bottom-0 w-full bg-white border-t border-gray-200 pb-safe shadow-[0_-4px_10px_rgba(0,0,0,0.03)] z-50">
          <div className="flex justify-around items-center h-20">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => 
                  twMerge(
                    "flex flex-col items-center justify-center w-full h-full space-y-1.5 transition-colors",
                    isActive ? "text-indigo-700" : "text-gray-400 hover:text-gray-600"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon className={clsx("w-7 h-7", isActive && "fill-indigo-50 text-indigo-700")} strokeWidth={isActive ? 2.5 : 2} />
                    <span className={clsx("text-sm font-bold", isActive ? "text-indigo-700" : "")}>
                      {item.label}
                    </span>
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>

      </div>
    </div>
  );
}
