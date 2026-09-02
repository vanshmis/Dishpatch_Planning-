import React, { useState, useEffect } from 'react';
import {
  RotateCcw,
  AlertTriangle,
  ShieldAlert,
  Search,
  CheckCircle2,
  Clock,
  UserCheck,
  FileText,
  Truck,
  ArrowRight,
} from 'lucide-react';
import { dispatchService } from '../services/api';
import { DispatchPlan, RollbackAction } from '../types';
import { StatusBadge } from '../components/common/StatusBadge';

interface RollbackPageProps {
  onOpenRollback: (dsp: DispatchPlan) => void;
  onNavigate: (path: string) => void;
}

export const RollbackPage: React.FC<RollbackPageProps> = ({ onOpenRollback, onNavigate }) => {
  const [activeDispatches, setActiveDispatches] = useState<DispatchPlan[]>([]);
  const [rollbackLogs, setRollbackLogs] = useState<RollbackAction[]>([]);
  const [reasonFilter, setReasonFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const load = () => {
      const allD = dispatchService.getDispatchPlans();
      setActiveDispatches(allD.filter((d) => d.isRollbackAllowed && d.status !== 'CANCELLED'));
      setRollbackLogs(dispatchService.getRollbackLogs());
    };
    load();
    const unsub = dispatchService.subscribe(load);
    return () => unsub();
  }, []);

  const filteredLogs = rollbackLogs.filter((log) => {
    const matchesReason = reasonFilter === 'ALL' || log.reasonCategory === reasonFilter;
    const matchesSearch =
      log.dispatchNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.requestedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.reasonNotes.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesReason && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Rollback, Correction & Audit Center
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-md bg-rose-100 text-rose-900 font-bold border border-rose-200">
              Supervisor Authorized Access
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Safely revert gate passes, de-allocate Proforma Invoices back to pending queue, and audit operational corrections.
          </p>
        </div>
      </div>

      {/* Safety Notice Banner */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 text-xs text-amber-900">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold block text-sm">Strict Governance Protocol:</span>
          <p className="mt-0.5">
            Every rollback action requires mandatory reason classification, authorization credentials, and logs an immutable audit event. Reverting a dispatch resets all mapped PIs to "PENDING" and frees the allocated vehicle immediately.
          </p>
        </div>
      </div>

      {/* Section 1: Active Plans Eligible for Rollback */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-rose-600" />
            <h3 className="font-bold text-sm text-slate-900">
              Active Dispatches Eligible for Reversion ({activeDispatches.length})
            </h3>
          </div>
          <span className="text-xs text-slate-500">
            Only pre-transit & loading stage plans can be rolled back
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {activeDispatches.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No active dispatches currently pending rollback eligibility.
            </div>
          ) : (
            activeDispatches.map((dsp) => (
              <div
                key={dsp.id}
                className="p-4 hover:bg-slate-50 flex flex-wrap items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono font-bold text-sm text-slate-900">
                      {dsp.dispatchNumber}
                    </span>
                    <StatusBadge status={dsp.status} size="sm" />
                    {dsp.gatePassNumber && (
                      <span className="font-mono text-slate-500">GP: {dsp.gatePassNumber}</span>
                    )}
                  </div>
                  <div className="text-slate-600">
                    Vehicle: <span className="font-bold text-slate-900">{dsp.vehicleNumber}</span> •
                    Driver: {dsp.driverName} • Route: {dsp.route.join(' → ')}
                  </div>
                  <div className="text-slate-500">
                    Mapped Cargo: {dsp.piIds.length} Proforma Invoices ({dsp.totalWeightKg.toLocaleString()} kg)
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenRollback(dsp)}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-xs shadow-xs flex items-center gap-1.5 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Initiate Rollback</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Section 2: Historical Rollback Audit Logs */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-sm text-slate-900">
              Immutable Rollback Audit Log & Reason History ({rollbackLogs.length})
            </h3>
            <p className="text-[11px] text-slate-500">
              Historical record of all reversed dispatches and cancellations
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search audit notes..."
                className="pl-8 pr-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <select
              value={reasonFilter}
              onChange={(e) => setReasonFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700"
            >
              <option value="ALL">All Reason Categories</option>
              <option value="VEHICLE_BREAKDOWN">Vehicle Breakdown</option>
              <option value="CLIENT_CANCELLATION">Client Cancellation</option>
              <option value="WEIGHT_DISCREPANCY">Weight Discrepancy</option>
              <option value="INCORRECT_MAPPING">Incorrect Item Mapping</option>
              <option value="DOCUMENTATION_ERROR">Documentation Error</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-600 font-semibold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Audit ID</th>
                <th className="px-4 py-3">Dispatch No</th>
                <th className="px-4 py-3">Reason Category</th>
                <th className="px-4 py-3">Audit Details / Notes</th>
                <th className="px-4 py-3">Action Taken</th>
                <th className="px-4 py-3">Authorized By</th>
                <th className="px-4 py-3">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-normal">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                    No rollback audit logs matching the criteria.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80">
                    <td className="px-4 py-3 font-mono font-bold text-slate-700">{log.id}</td>
                    <td className="px-4 py-3 font-mono font-bold text-slate-900">
                      {log.dispatchNumber}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-200 font-semibold text-[11px]">
                        {log.reasonCategory.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 max-w-sm text-slate-800">{log.reasonNotes}</td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-indigo-700">
                        {log.actionTaken.replace(/_/g, ' ')} ({log.affectedPiCount} PIs restored)
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-900">{log.requestedBy}</div>
                      <div className="text-[10px] text-slate-500">Approved: {log.approvedBy}</div>
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-600">{log.requestedAt}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
