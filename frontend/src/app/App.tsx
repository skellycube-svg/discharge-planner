import React from 'react';
import { RouterProvider } from 'react-router';
import { router } from './routes';
import { LanguageProvider } from './context/LanguageContext';
import { PatientProvider } from './context/PatientContext';

export default function App() {
  return (
    <LanguageProvider>
      <PatientProvider>
        <RouterProvider router={router} />
      </PatientProvider>
    </LanguageProvider>
  );
}
