/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { NoticeBanner } from './components/NoticeBanner';
import { PanApplicationForm } from './components/PanApplicationForm';
import { SubmissionSuccessModal } from './components/SubmissionSuccessModal';
import { AcknowledgmentReceipt } from './components/AcknowledgmentReceipt';
import { TrackStatusModal } from './components/TrackStatusModal';
import { OperatorPortal } from './components/OperatorPortal';
import { FormDownloadGuide } from './components/FormDownloadGuide';
import { Footer } from './components/Footer';
import { PanApplication, OperatorSettings } from './types/pan';
import { getOperatorSettings, saveOperatorSettings } from './utils/storage';
import { Language } from './utils/translations';

export default function App() {
  const [lang, setLang] = useState<Language>('en');
  const [currentTab, setCurrentTab] = useState<'apply' | 'track' | 'operator' | 'guidelines'>('apply');
  const [settings, setSettings] = useState<OperatorSettings>(getOperatorSettings());

  // Recently submitted application for success modal
  const [submittedApp, setSubmittedApp] = useState<PanApplication | null>(null);

  // Active application to view/print Acknowledgment Receipt
  const [activeReceiptApp, setActiveReceiptApp] = useState<PanApplication | null>(null);

  useEffect(() => {
    setSettings(getOperatorSettings());
  }, []);

  const handleUpdateSettings = (newSettings: OperatorSettings) => {
    setSettings(newSettings);
    saveOperatorSettings(newSettings);
  };

  const handleFormSubmitSuccess = (app: PanApplication) => {
    setSubmittedApp(app);
  };

  const handleViewReceipt = (app: PanApplication) => {
    setActiveReceiptApp(app);
    setSubmittedApp(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-amber-100 selection:text-amber-900">
      {/* Top Navigation */}
      <Header
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setActiveReceiptApp(null);
          setCurrentTab(tab);
        }}
        lang={lang}
        setLang={setLang}
      />

      {/* Notice Banner with Operator Helpline and Official Disclaimer */}
      <NoticeBanner
        lang={lang}
        settings={settings}
        onOpenGuidelines={() => {
          setActiveReceiptApp(null);
          setCurrentTab('guidelines');
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeReceiptApp ? (
          <AcknowledgmentReceipt
            application={activeReceiptApp}
            settings={settings}
            lang={lang}
            onBack={() => setActiveReceiptApp(null)}
          />
        ) : (
          <>
            {currentTab === 'apply' && (
              <PanApplicationForm
                lang={lang}
                settings={settings}
                onSubmitSuccess={handleFormSubmitSuccess}
              />
            )}

            {currentTab === 'track' && (
              <TrackStatusModal
                lang={lang}
                settings={settings}
                onViewReceipt={handleViewReceipt}
                onApplyNew={() => setCurrentTab('apply')}
              />
            )}

            {currentTab === 'operator' && (
              <OperatorPortal
                lang={lang}
                settings={settings}
                onUpdateSettings={handleUpdateSettings}
                onPrintReceipt={handleViewReceipt}
              />
            )}

            {currentTab === 'guidelines' && (
              <FormDownloadGuide
                lang={lang}
                onStartApplication={() => setCurrentTab('apply')}
              />
            )}
          </>
        )}
      </main>

      {/* Submission Success Modal with instant WhatsApp button and Reference ID */}
      {submittedApp && (
        <SubmissionSuccessModal
          application={submittedApp}
          settings={settings}
          lang={lang}
          onClose={() => setSubmittedApp(null)}
          onPrintReceipt={() => handleViewReceipt(submittedApp)}
          onTrackApplication={() => {
            setSubmittedApp(null);
            setCurrentTab('track');
          }}
        />
      )}

      {/* Footer */}
      {!activeReceiptApp && (
        <Footer
          lang={lang}
          settings={settings}
          onNavigate={(tab) => {
            setActiveReceiptApp(null);
            setCurrentTab(tab);
          }}
        />
      )}
    </div>
  );
}
