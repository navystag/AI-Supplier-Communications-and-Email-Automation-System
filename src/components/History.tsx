import React, { useState } from 'react';
import { History as HistoryIcon, Search, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';
import { InvoiceItem } from '../types';

interface HistoryProps {
  invoices: InvoiceItem[];
  darkMode: boolean;
}

export const History: React.FC<HistoryProps> = ({ invoices, darkMode }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Collect all communication history and audit events across invoices
  const auditLogs: any[] = [];
  invoices.forEach(inv => {
    auditLogs.push({
      id: `${inv.id}-created`,
      date: inv.invoiceDate,
      type: 'Invoice Ingested',
      details: `Invoice ${inv.invoiceNumber} from ${inv.supplierName} for $${inv.amount.toLocaleString('en-SG', { minimumFractionDigits: 2 })}`,
      status: inv.threeWayMatchResult
    });
    inv.communicationHistory.forEach(comm => {
      auditLogs.push({
        id: comm.id,
        date: comm.date,
        type: `Communication (${comm.sender})`,
        details: comm.message,
        status: inv.invoiceStatus
      });
    });
  });

  const filteredLogs = auditLogs.filter(log =>
    log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className={`p-6 rounded-2xl border ${
        darkMode ? 'bg-[#2A3441] border-[#3A4654]' : 'bg-white border-[#DCE3EA] shadow-xs'
      }`}>
        <div className="flex items-center space-x-2">
          <HistoryIcon className="w-5 h-5 text-blue-500" />
          <h2 className={`text-base font-bold ${darkMode ? 'text-[#F3F4F6]' : 'text-[#1F2937]'}`}>
            Enterprise Audit Trail & Communication Log
          </h2>
        </div>
        <p className={`text-xs mt-1 ${darkMode ? 'text-[#CBD5E1]' : 'text-[#6B7280]'}`}>
          Complete chronological record of all document ingests, 3-way match results, supplier communications, and authorized reviews.
        </p>
      </div>

      <div className={`p-4 rounded-2xl border flex items-center justify-between ${
        darkMode ? 'bg-[#2A3441] border-[#3A4654]' : 'bg-white border-[#DCE3EA] shadow-xs'
      }`}>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search audit trail..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs font-medium border focus:outline-none focus:ring-2 ${
              darkMode 
                ? 'bg-[#1E2630] border-[#3A4654] text-[#F3F4F6] focus:border-[#4F8EF7] focus:ring-[#4F8EF7]/20' 
                : 'bg-[#F5F7FA] border-[#DCE3EA] text-[#1F2937] focus:border-[#3B82F6] focus:ring-[#3B82F6]/20'
            }`}
          />
        </div>
        <div className="text-xs font-semibold text-gray-400">
          Total Logs: {filteredLogs.length}
        </div>
      </div>

      <div className={`rounded-2xl border overflow-hidden ${
        darkMode ? 'bg-[#2A3441] border-[#3A4654]' : 'bg-white border-[#DCE3EA] shadow-xs'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`border-b text-[11px] font-semibold uppercase tracking-wider ${
                darkMode ? 'border-[#3A4654] bg-[#24303D] text-[#CBD5E1]' : 'border-[#DCE3EA] bg-[#EEF3F8] text-[#6B7280]'
              }`}>
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4">Event Type</th>
                <th className="py-3.5 px-4">Details / Description</th>
                <th className="py-3.5 px-4">Match / Status</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${darkMode ? 'divide-[#3A4654]' : 'divide-[#DCE3EA]'}`}>
              {filteredLogs.map(log => (
                <tr key={log.id} className={`transition-colors text-xs ${
                  darkMode ? 'hover:bg-[#1E2630]/50' : 'hover:bg-gray-50'
                }`}>
                  <td className="py-4 px-4 font-mono text-gray-400 text-[11px]">
                    {log.date}
                  </td>
                  <td className="py-4 px-4 font-semibold">
                    {log.type}
                  </td>
                  <td className="py-4 px-4 max-w-md truncate">
                    {log.details}
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 font-semibold text-[11px]">
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
