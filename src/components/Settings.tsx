import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Building2, Bell, Shield, Database, Check, ExternalLink, RefreshCw, AlertTriangle } from 'lucide-react';
import { getMasterDbConfig, setMasterDbConfig, getInvoiceRecord, DEFAULT_SHEET_URL } from '../services/masterDbService';

interface SettingsProps {
  darkMode: boolean;
  onRefreshMasterDb?: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ darkMode, onRefreshMasterDb }) => {
  const [saved, setSaved] = useState(false);
  const [companyName, setCompanyName] = useState('Boon Huat Hardware & Supplies Pte Ltd');
  const [uen, setUen] = useState('198203492H');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [aiConfidenceThreshold, setAiConfidenceThreshold] = useState('95');

  // Master AP DB Integration Settings
  const [sheetUrl, setSheetUrl] = useState('');
  const [testingDb, setTestingDb] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    const config = getMasterDbConfig();
    setSheetUrl(config.sheetUrl);
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setMasterDbConfig('', sheetUrl);
    setSaved(true);
    if (onRefreshMasterDb) {
      onRefreshMasterDb();
    }
    setTimeout(() => setSaved(false), 2500);
  };

  const handleTestConnection = async () => {
    setTestingDb(true);
    setTestResult(null);

    // Temporarily save config to test
    setMasterDbConfig('', sheetUrl);

    const res = await getInvoiceRecord();
    setTestingDb(false);

    if (res.success) {
      setTestResult({
        success: true,
        message: `Successfully connected! Retrieved ${res.records.length} records from Master Database Google Sheet.`
      });
      if (onRefreshMasterDb) {
        onRefreshMasterDb();
      }
    } else {
      setTestResult({
        success: false,
        message: res.message
      });
    }
  };

  const handleResetDefaultUrls = () => {
    setSheetUrl(DEFAULT_SHEET_URL);
    setMasterDbConfig('', DEFAULT_SHEET_URL);
    if (onRefreshMasterDb) {
      onRefreshMasterDb();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className={`p-6 rounded-2xl border ${
        darkMode ? 'bg-[#2A3441] border-[#3A4654]' : 'bg-white border-[#DCE3EA] shadow-xs'
      }`}>
        <div className="flex items-center space-x-2">
          <SettingsIcon className="w-5 h-5 text-blue-500" />
          <h2 className={`text-base font-bold ${darkMode ? 'text-[#F3F4F6]' : 'text-[#1F2937]'}`}>
            Enterprise System Settings & Integrations
          </h2>
        </div>
        <p className={`text-xs mt-1 ${darkMode ? 'text-[#CBD5E1]' : 'text-[#6B7280]'}`}>
          Manage Master AP Database Google Links, Organization profile, AI guardrails, and notification preferences.
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-semibold flex items-center space-x-2">
          <Check className="w-4 h-4" />
          <span>System settings and Master AP Database configuration updated successfully.</span>
        </div>
      )}

      <form onSubmit={handleSave} className={`p-6 rounded-2xl border space-y-6 ${
        darkMode ? 'bg-[#2A3441] border-[#3A4654]' : 'bg-white border-[#DCE3EA] shadow-xs'
      }`}>
        {/* Google Sheet & Google Apps Script Integration Section */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-2 border-gray-200 dark:border-gray-700">
            <h3 className={`text-sm font-bold flex items-center space-x-2 ${darkMode ? 'text-[#F3F4F6]' : 'text-[#1F2937]'}`}>
              <Database className="w-4 h-4 text-blue-500" />
              <span>Master Database Google Sheet Configuration</span>
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-500/10 text-blue-500 border border-blue-500/20 self-start sm:self-auto">
              READ-ONLY SHEET INTEGRATION
            </span>
          </div>

          <p className={`text-xs leading-relaxed ${darkMode ? 'text-[#CBD5E1]' : 'text-[#6B7280]'}`}>
            Configure the connection to the Google Sheet Master AP Database. The system reads live data directly from the worksheet named "MasterSheet".
          </p>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-semibold text-gray-400 uppercase text-[10px]">
                  Master Database Google Sheet URL
                </label>
                {sheetUrl && (
                  <a
                    href={sheetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline flex items-center space-x-1 text-[11px] font-medium"
                  >
                    <span>Open Sheet in Google Docs</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
              <input
                type="url"
                required
                value={sheetUrl}
                onChange={(e) => setSheetUrl(e.target.value)}
                placeholder="https://docs.google.com/spreadsheets/d/.../edit"
                className={`w-full px-3.5 py-2.5 rounded-xl border font-mono text-xs focus:outline-none ${
                  darkMode ? 'bg-[#1E2630] border-[#3A4654] text-white' : 'bg-[#F5F7FA] border-[#DCE3EA] text-gray-900'
                }`}
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={testingDb}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center space-x-1.5 transition-colors shadow-xs"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${testingDb ? 'animate-spin' : ''}`} />
                  <span>{testingDb ? 'Testing Connection...' : 'Test DB Connection'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetDefaultUrls}
                  className={`px-3 py-2 rounded-xl border text-xs font-medium transition-colors ${
                    darkMode ? 'border-[#3A4654] bg-[#1E2630] hover:bg-[#3A4654] text-gray-300' : 'border-gray-300 bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  Reset Default Links
                </button>
              </div>

              {sheetUrl && (
                <a
                  href={sheetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center space-x-1.5 hover:bg-emerald-500/20 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>View Master Sheet</span>
                </a>
              )}
            </div>

            {testResult && (
              <div className={`p-4 rounded-xl border flex items-start space-x-2.5 ${
                testResult.success
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400'
              }`}>
                {testResult.success ? (
                  <Check className="w-4 h-4 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                )}
                <span className="font-semibold">{testResult.message}</span>
              </div>
            )}
          </div>
        </div>

        {/* Organization Profile */}
        <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h3 className={`text-sm font-bold border-b pb-2 ${darkMode ? 'border-[#3A4654] text-[#F3F4F6]' : 'border-gray-200 text-[#1F2937]'}`}>
            Organization Profile
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold mb-1 text-gray-400 uppercase text-[10px]">Company Legal Name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-medium focus:outline-none ${
                  darkMode ? 'bg-[#1E2630] border-[#3A4654] text-white' : 'bg-[#F5F7FA] border-[#DCE3EA] text-gray-900'
                }`}
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-gray-400 uppercase text-[10px]">UEN / Registration No.</label>
              <input
                type="text"
                value={uen}
                onChange={(e) => setUen(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-medium focus:outline-none ${
                  darkMode ? 'bg-[#1E2630] border-[#3A4654] text-white' : 'bg-[#F5F7FA] border-[#DCE3EA] text-gray-900'
                }`}
              />
            </div>
          </div>
        </div>

        {/* AI & Automation Guardrails */}
        <div className="space-y-4">
          <h3 className={`text-sm font-bold border-b pb-2 ${darkMode ? 'border-[#3A4654] text-[#F3F4F6]' : 'border-gray-200 text-[#1F2937]'}`}>
            AI & Automation Guardrails
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold mb-1 text-gray-400 uppercase text-[10px]">Min OCR Confidence Threshold (%)</label>
              <input
                type="number"
                value={aiConfidenceThreshold}
                onChange={(e) => setAiConfidenceThreshold(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-medium focus:outline-none ${
                  darkMode ? 'bg-[#1E2630] border-[#3A4654] text-white' : 'bg-[#F5F7FA] border-[#DCE3EA] text-gray-900'
                }`}
              />
            </div>
            <div className="flex items-center space-x-3 pt-5">
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
              <span className={`text-xs font-medium ${darkMode ? 'text-[#F3F4F6]' : 'text-gray-900'}`}>
                Enable instant discrepancy notification emails for Finance Team
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-blue-500/20 transition-colors"
          >
            Save Configuration
          </button>
        </div>
      </form>
    </div>
  );
};
