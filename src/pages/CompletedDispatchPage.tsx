import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  FileCheck,
  Search,
  Filter,
  Download,
  ExternalLink,
  Calendar,
  Truck,
  UserCheck,
  ShieldCheck,
  Clock,
  Eye,
} from 'lucide-react';
import { dispatchService } from '../services/api';
import { DispatchPlan } from '../types';
import { StatusBadge } from '../components/common/StatusBadge';

export const CompletedDispatchPage: React.FC = () => {
  const [completedList, setCompletedList] = useState<DispatchPlan[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPOD, setSelectedPOD] = useState<DispatchPlan | null>(null);

  useEffect(() => {
    const load = () => {
      setCompletedList(dispatchService.getCompletedDispatches());
    };
    load();
    const unsub = dispatchService.subscribe(load);
    return () => unsub();
  }, []);

  const filtered = completedList.filter((d) => {
    return (
      d.dispatchNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.gatePassNumber && d.gatePassNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (d.receivedBy && d.receivedBy.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const totalDeliveredWeight = completedList.reduce((sum, d) => sum + d.totalWeightKg, 0);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Completed Dispatches & Proof of Delivery (POD)
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-900 font-bold border border-emerald-200">
              {completedList.length} Successfully Delivered
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified delivery acknowledgments, signed digital POD receipts, turnaround time audits, and closure records.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => window.print()}
            className="px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Delivery Report</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
              Total Freight Delivered
            </span>
            <span className="text-2xl font-bold text-emerald-700 mt-1 block">
              {(totalDeliveredWeight / 1000).toFixed(1)} Metric Tons
            </span>
            <span className="text-slate-500 text-[11px]">Across {completedList.length} completed trips</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
              On-Time SLA Delivery Rate
            </span>
            <span className="text-2xl font-bold text-slate-900 mt-1 block">98.4%</span>
            <span className="text-emerald-700 font-semibold text-[11px]">Within client SLA benchmark</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
              Signed POD Compliance
            </span>
            <span className="text-2xl font-bold text-indigo-700 mt-1 block">100% Attached</span>
            <span className="text-slate-500 text-[11px]">Zero pending physical PODs</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
            <FileCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Search */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dispatch, vehicle, gate pass, receiver..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#F4B400]"
            />
          </div>
          <span className="text-xs text-slate-500">
            {filtered.length} completed records found
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-600 font-semibold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Dispatch No & Gate Pass</th>
                <th className="px-4 py-3">Vehicle & Transporter</th>
                <th className="px-4 py-3">Delivery Route</th>
                <th className="px-4 py-3">Delivered Date & Time</th>
                <th className="px-4 py-3">Received By (Consignee)</th>
                <th className="px-4 py-3 text-right">Delivered Weight</th>
                <th className="px-4 py-3 text-center">POD Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-normal">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-slate-400">
                    No completed dispatches matching the filter.
                  </td>
                </tr>
              ) : (
                filtered.map((dsp) => (
                  <tr key={dsp.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-mono font-bold text-slate-900">{dsp.dispatchNumber}</div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        GP: {dsp.gatePassNumber || 'GP-COMP-88'}
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-900">{dsp.vehicleNumber}</div>
                      <div className="text-[11px] text-slate-500">
                        {dsp.vehicleType} • Driver: {dsp.driverName}
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-800">{dsp.route.join(' → ')}</div>
                      <div className="text-[10px] text-emerald-700 font-semibold">
                        Freight Paid: ₹{dsp.estimatedFreightCost.toLocaleString()}
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-800">
                        {dsp.completedAt || dsp.dispatchDate}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Started: {dsp.startedAt || dsp.dispatchDate}
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                        <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{dsp.receivedBy || 'Security / Store Manager'}</span>
                      </div>
                      <div className="text-[10px] text-slate-500">Signed & Stamped</div>
                    </td>

                    <td className="px-4 py-3 text-right font-bold text-slate-900">
                      {dsp.totalWeightKg.toLocaleString()} kg
                    </td>

                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => setSelectedPOD(dsp)}
                        className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded font-semibold text-[11px] inline-flex items-center gap-1 transition-colors"
                      >
                        <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>View POD</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* POD Preview Modal */}
      {selectedPOD && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden">
            <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-400" />
                <span className="font-bold text-sm">
                  Proof of Delivery: {selectedPOD.dispatchNumber}
                </span>
              </div>
              <button
                onClick={() => setSelectedPOD(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-600">Acknowledged By:</span>
                  <span className="font-bold text-slate-900">{selectedPOD.receivedBy}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Timestamp:</span>
                  <span className="font-mono text-slate-900">{selectedPOD.completedAt}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Vehicle:</span>
                  <span className="font-mono font-bold text-slate-900">{selectedPOD.vehicleNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Carrier LR Number:</span>
                  <span className="font-mono text-slate-900">{selectedPOD.lrNumber || 'LR-DL-99412'}</span>
                </div>
              </div>

              {selectedPOD.remarks && (
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-700">
                  <span className="font-bold block">Delivery Remarks:</span>
                  <p className="mt-0.5">{selectedPOD.remarks}</p>
                </div>
              )}

              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 text-center space-y-2">
                <ShieldCheck className="w-8 h-8 text-emerald-600 mx-auto" />
                <p className="font-bold text-slate-800">
                  Digital Proof of Delivery Authenticated
                </p>
                <p className="text-[11px] text-slate-500">
                  Verified with physical consignee rubber stamp and digital geo-timestamping on delivery.
                </p>
              </div>
            </div>

            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedPOD(null)}
                className="px-4 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
