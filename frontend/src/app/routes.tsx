import React from 'react';
import { createBrowserRouter, Navigate, Outlet } from 'react-router';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Medications } from './pages/Medications';
import { Appointments } from './pages/Appointments';
import { WarningSigns } from './pages/WarningSigns';
import { Resources } from './pages/Resources';
import { FAQ } from './pages/FAQ';
import { PersonalizeQuiz } from './pages/PersonalizeQuiz';
import { Login } from './pages/Login';
import { usePatient } from './context/PatientContext';

function RequirePatient() {
  const { patient } = usePatient();
  if (!patient) return <Navigate to="/login" replace />;
  return <Outlet />;
}

export const router = createBrowserRouter([
  { path: '/login', Component: Login },
  {
    path: '/',
    Component: RequirePatient,
    children: [
      {
        path: '/',
        Component: Layout,
        children: [
          { index: true, Component: Dashboard },
          { path: 'medications', Component: Medications },
          { path: 'appointments', Component: Appointments },
          { path: 'warnings', Component: WarningSigns },
          { path: 'resources', Component: Resources },
          { path: 'resources/personalize', Component: PersonalizeQuiz },
          { path: 'faq', Component: FAQ },
        ],
      },
    ],
  },
]);
