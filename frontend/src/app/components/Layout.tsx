import React from 'react';
import { Outlet, NavLink } from 'react-router';
import { Home, Pill, Calendar, HeartHandshake, Languages, HelpCircle, Printer } from 'lucide-react';
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
    { to: "/faq", icon: HelpCircle, label: t.nav.faq },
  ];

  return (
    <div className="relative min-h-screen bg-paper-sunken flex justify-center overflow-hidden">
      <div className="w-full max-w-md bg-paper min-h-screen relative flex flex-col border-x border-hairline">

        {/* Top Bar */}
        <div className="bg-paper-raised border-b border-hairline px-4 py-3 flex justify-between items-center z-50 gap-2 print:hidden">
          <button
            onClick={handleSwitch}
            className="flex items-center gap-2 min-w-0 active:scale-95 transition-transform"
            aria-label="Switch patient"
          >
            <div className="w-9 h-9 rounded-full bg-brand text-brand-fg font-bold text-sm flex items-center justify-center shrink-0">
              {patient ? patient.name.split(' ').map((n) => n[0]).slice(0, 2).join('') : '—'}
            </div>
            <div className="min-w-0 text-left">
              <div className="font-display font-bold text-ink text-sm truncate">{patient?.name ?? 'CareBridge'}</div>
              <div className="text-xs font-semibold text-ink-soft truncate tabular">
                {patient ? `MRN ${patient.mrn}` : ''}
              </div>
            </div>
            <LogOut className="w-4 h-4 text-ink-mute shrink-0" aria-hidden="true" />
          </button>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => window.print()}
              aria-label={lang === 'es' ? 'Imprimir resumen del alta' : 'Print discharge summary'}
              title={lang === 'es' ? 'Imprimir resumen del alta' : 'Print discharge summary'}
              className="bg-paper border border-hairline pl-2 pr-3 py-1.5 rounded-full text-ink-soft active:scale-95 transition-transform flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" strokeWidth={1.75} aria-hidden="true" />
              <span className="text-[11px] font-semibold leading-none">
                {lang === 'es' ? 'Imprimir resumen del alta' : 'Print discharge summary'}
              </span>
            </button>
            <button
              onClick={toggleLang}
              className="flex items-center gap-1 bg-brand-soft border border-hairline px-3 py-2 rounded-full text-brand font-bold text-sm active:scale-95 transition-transform"
              aria-label={lang === 'en' ? 'Cambiar a español' : 'Switch to English'}
            >
              <Languages className="w-4 h-4" strokeWidth={1.75} aria-hidden="true" /> {lang === 'en' ? 'ES' : 'EN'}
            </button>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <Outlet />
        </main>

        <nav className="absolute bottom-0 w-full bg-paper-raised border-t border-hairline pb-safe z-50 print:hidden">
          <div className="flex justify-around items-center h-20">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  twMerge(
                    "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors px-1",
                    isActive ? "text-brand" : "text-ink-mute hover:text-ink-soft"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon className={clsx("w-6 h-6")} strokeWidth={isActive ? 2.25 : 1.75} aria-hidden="true" />
                    <span className={clsx("text-xs font-semibold leading-none")}>
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
