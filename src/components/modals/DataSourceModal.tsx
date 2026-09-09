import React, { useState } from 'react';
import { Dataset } from '../../types/data';
import { parseCsvFile, parseExcelFile, parseJsonData } from '../../engine/dataEngine';
import {
  UploadCloud,
  Database,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  X,
  Server,
  Code,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAddDataset: (dataset: Dataset) => void;
}

export const DataSourceModal: React.FC<Props> = ({ isOpen, onClose, onAddDataset }) => {
  const [activeTab, setActiveTab] = useState<'file' | 'database' | 'api'>('file');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // DB Form state
  const [dbType, setDbType] = useState<'postgresql' | 'mysql' | 'sqlite'>('postgresql');
  const [dbName, setDbName] = useState('production_analytics_db');
  const [dbHost, setDbHost] = useState('localhost');
  const [dbPort, setDbPort] = useState('5432');
  const [dbUser, setDbUser] = useState('analytics_reader');
  const [dbPass, setDbPass] = useState('••••••••••••');
  const [isTestingConn, setIsTestingConn] = useState(false);

  // REST API Form
  const [apiUrl, setApiUrl] = useState('https://api.example.com/v1/metrics');
  const [apiMethod, setApiMethod] = useState<'GET' | 'POST'>('GET');

  if (!isOpen) return null;

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    setIsProcessing(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const ext = file.name.split('.').pop()?.toLowerCase();
      let dataset: Dataset;

      if (ext === 'csv') {
        const text = await file.text();
        dataset = await parseCsvFile(text, file.name);
      } else if (ext === 'xlsx' || ext === 'xls') {
        const buffer = await file.arrayBuffer();
        dataset = await parseExcelFile(buffer, file.name);
      } else if (ext === 'json') {
        const text = await file.text();
        dataset = parseJsonData(text, file.name);
      } else {
        throw new Error('Unsupported file format. Please upload CSV, XLSX, or JSON files.');
      }

      onAddDataset(dataset);
      setSuccessMsg(`Successfully imported ${file.name} with ${dataset.rowCount} rows!`);
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to parse data file');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTestAndConnectDb = () => {
    setIsTestingConn(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    // Simulate database connection test & schema sync
    setTimeout(() => {
      setIsTestingConn(false);
      setSuccessMsg(`Connection to ${dbType.toUpperCase()} database (${dbName}) established successfully!`);
      // Add simulated dataset from connection
      const simulatedDbDataset: Dataset = {
        id: `ds_db_${Date.now()}`,
        name: `${dbName} (${dbType})`,
        sourceType: 'database',
        sourceName: `${dbHost}:${dbPort}/${dbName}`,
        columns: [
          { name: 'record_id', type: 'number', sampleValues: [1, 2, 3], nullCount: 0, uniqueCount: 1500 },
          { name: 'customer_region', type: 'string', sampleValues: ['Americas', 'EMEA', 'APAC'], nullCount: 0, uniqueCount: 6 },
          { name: 'gross_sales', type: 'number', sampleValues: [15400, 28900, 42000], nullCount: 0, uniqueCount: 950 },
          { name: 'margin_pct', type: 'number', sampleValues: [24.5, 31.2, 18.9], nullCount: 0, uniqueCount: 300 },
          { name: 'sync_date', type: 'date', sampleValues: ['2026-03-01'], nullCount: 0, uniqueCount: 90 },
        ],
        data: [
          { record_id: 101, customer_region: 'Americas', gross_sales: 38400, margin_pct: 28.5, sync_date: '2026-03-01' },
          { record_id: 102, customer_region: 'EMEA', gross_sales: 29100, margin_pct: 22.1, sync_date: '2026-03-02' },
          { record_id: 103, customer_region: 'APAC', gross_sales: 45200, margin_pct: 34.0, sync_date: '2026-03-03' },
          { record_id: 104, customer_region: 'LATAM', gross_sales: 18700, margin_pct: 19.4, sync_date: '2026-03-04' },
          { record_id: 105, customer_region: 'Americas', gross_sales: 52000, margin_pct: 31.8, sync_date: '2026-03-05' },
        ],
        rowCount: 5,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      onAddDataset(simulatedDbDataset);
      setTimeout(() => onClose(), 1200);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs select-none">
      <div className="relative w-full max-w-xl rounded-xl border border-slate-200 bg-white p-6 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center space-x-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
            <Database className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Connect Data Source</h2>
            <p className="text-xs text-slate-500">Import files or configure live analytical databases</p>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="mt-5 flex border-b border-slate-200 text-xs font-medium">
          <button
            onClick={() => setActiveTab('file')}
            className={`flex items-center space-x-2 border-b-2 px-4 py-2 transition-all ${
              activeTab === 'file'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileSpreadsheet className="h-4 w-4" />
            <span>File Upload (CSV, XLSX, JSON)</span>
          </button>
          <button
            onClick={() => setActiveTab('database')}
            className={`flex items-center space-x-2 border-b-2 px-4 py-2 transition-all ${
              activeTab === 'database'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Server className="h-4 w-4" />
            <span>Relational Database</span>
          </button>
          <button
            onClick={() => setActiveTab('api')}
            className={`flex items-center space-x-2 border-b-2 px-4 py-2 transition-all ${
              activeTab === 'api'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Code className="h-4 w-4" />
            <span>REST API Endpoint</span>
          </button>
        </div>

        {/* Feedback alerts */}
        {errorMsg && (
          <div className="mt-3 flex items-center space-x-2 rounded-lg bg-rose-50 p-2.5 text-xs text-rose-700">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="mt-3 flex items-center space-x-2 rounded-lg bg-emerald-50 p-2.5 text-xs text-emerald-700">
            <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* FILE IMPORT TAB */}
        {activeTab === 'file' && (
          <div className="mt-4 space-y-4">
            <label
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleFileUpload(e.dataTransfer.files);
              }}
              className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/70 p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50/20 transition-all"
            >
              <UploadCloud className="h-10 w-10 text-blue-500 mb-2" />
              <div className="text-sm font-semibold text-slate-700">
                {isProcessing ? 'Parsing data schema...' : 'Drop files here or click to browse'}
              </div>
              <div className="mt-1 text-xs text-slate-400">
                Supports CSV, Microsoft Excel (.xlsx, .xls), and JSON datasets
              </div>
              <input
                type="file"
                accept=".csv, .xlsx, .xls, .json"
                onChange={(e) => handleFileUpload(e.target.files)}
                className="hidden"
                disabled={isProcessing}
              />
            </label>
          </div>
        )}

        {/* DATABASE CONNECTION TAB */}
        {activeTab === 'database' && (
          <div className="mt-4 space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-600">Database Engine</label>
                <select
                  value={dbType}
                  onChange={(e) => setDbType(e.target.value as any)}
                  className="mt-1 w-full rounded border border-slate-200 px-2.5 py-1.5 text-slate-800"
                >
                  <option value="postgresql">PostgreSQL</option>
                  <option value="mysql">MySQL</option>
                  <option value="sqlite">SQLite (Local Embedded)</option>
                </select>
              </div>
              <div>
                <label className="font-semibold text-slate-600">Database Name</label>
                <input
                  type="text"
                  value={dbName}
                  onChange={(e) => setDbName(e.target.value)}
                  className="mt-1 w-full rounded border border-slate-200 px-2.5 py-1.5 text-slate-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className="font-semibold text-slate-600">Host Server</label>
                <input
                  type="text"
                  value={dbHost}
                  onChange={(e) => setDbHost(e.target.value)}
                  className="mt-1 w-full rounded border border-slate-200 px-2.5 py-1.5 text-slate-800"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-600">Port</label>
                <input
                  type="text"
                  value={dbPort}
                  onChange={(e) => setDbPort(e.target.value)}
                  className="mt-1 w-full rounded border border-slate-200 px-2.5 py-1.5 text-slate-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-600">Username</label>
                <input
                  type="text"
                  value={dbUser}
                  onChange={(e) => setDbUser(e.target.value)}
                  className="mt-1 w-full rounded border border-slate-200 px-2.5 py-1.5 text-slate-800"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-600">Password</label>
                <input
                  type="password"
                  value={dbPass}
                  onChange={(e) => setDbPass(e.target.value)}
                  className="mt-1 w-full rounded border border-slate-200 px-2.5 py-1.5 text-slate-800"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end space-x-2">
              <button
                onClick={handleTestAndConnectDb}
                disabled={isTestingConn}
                className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {isTestingConn ? 'Testing Connection...' : 'Test & Save Connection'}
              </button>
            </div>
          </div>
        )}

        {/* REST API TAB */}
        {activeTab === 'api' && (
          <div className="mt-4 space-y-3 text-xs">
            <div className="flex space-x-2">
              <select
                value={apiMethod}
                onChange={(e) => setApiMethod(e.target.value as any)}
                className="w-24 rounded border border-slate-200 px-2.5 py-1.5 font-semibold text-slate-800"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
              </select>
              <input
                type="text"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                className="flex-1 rounded border border-slate-200 px-2.5 py-1.5 text-slate-800"
              />
            </div>
            <p className="text-[11px] text-slate-400">
              API queries expect JSON array payload. Authentication headers and parameters can be set in settings.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
