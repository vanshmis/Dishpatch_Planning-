import React, { useState, useEffect } from 'react';
import {
  History,
  Search,
  Filter,
  Download,
  Calendar,
  Truck,
  FileText,
  Printer,
  ChevronDown,
  Layers,
  CheckCircle,
  Clock,
  RotateCcw,
} from 'lucide-react';
import { dispatchService } from '../services/api';
import { DispatchPlan, ProformaInvoice } from '../types';
import { StatusBadge } from '../components/common/StatusBadge';

interface DispatchHistoryPageProps {
  onOpenGatePass: (dsp: DispatchPlan) => void;
  onOpenPIDetails: (pi: ProformaInvoice) => void;
}

export const DispatchHistoryPage: React.FC<DispatchHistoryPageProps> = ({
  onOpenGatePass,
  onOpenPIDetails,
}) => {
  const [dispatches, setDispatches] = useState<DispatchPlan[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [carrierFilter, setCarrierFilter] = useState('ALL');

  useEffect(() => {
    const load = () => {
      setDispatches(dispatchService.getDispatchPlans());
    };
    load();
    const unsub = dispatchService.subscribe(load);
    return () => unsub();
  }, []);

  const carriers = Array.from(
    new Set(dispatches.map((d) => d.transporterName).filter(Boolean))
  ) as string[];

  const filtered = dispatches.filter((d) => {
    const matchesSearch =
      d.dispatchNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.gatePassNumber && d.gatePassNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      d.route.some((r) => r.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || d.status === statusFilter;
    const matchesCarrier = carrierFilter === 'ALL' || d.transporterName === carrierFilter;

    return matchesSearch && matchesStatus && matchesCarrier;
  });

  const totalHistoricalWeight = filtered.reduce((sum, d) => sum + d.totalWeightKg, 0);
  const totalFreight = filtered.reduce((sum, d) => sum + d.estimatedFreightCost, 0);

  const handleExportCSV = () => {
    const headers = [
      'Dispatch No',
      'Date',
      'Vehicle No',
      'Vehicle Type',
      'Driver',
      'Carrier',
      'Route',
      'Gate Pass No',
      'Total Weight (kg)',
      'Freight (INR)',
      'Status',
    ];
    const rows = filtered.map((d) => [
      d.dispatchNumber,
      d.dispatchDate,
      d.vehicleNumber,
      `"${d.vehicleType}"`,
      `"${d.driverName}"`,
      `"${d.transporterName || ''}"`,
      `"${d.route.join(' -> ')}"`,
      d.gatePassNumber || 'N/A',
      d.totalWeightKg,
      d.estimatedFreightCost,
      d.status,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Dispatch_Planning_History_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Dispatch History & Freight Audit Archive
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-md bg-slate-200 text-slate-800 font-bold">
              {dispatches.length} Historical Records
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Complete audit trail of all generated gate passes, carrier manifests, vehicle trips, and financial logs.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Archive (CSV)</span>
          </button>
        </div>
      </div>

      {/* Aggregate Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
            Total Trips Logged
          </span>
          <span className="text-2xl font-bold text-slate-900 mt-1 block">
            {filtered.length} Dispatches
          </span>
          <span className="text-slate-500 text-[11px]">Filtered view total</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
            Total Cargo Hauled
          </span>
          <span className="text-2xl font-bold text-slate-900 mt-1 block">
            {(totalHistoricalWeight / 1000).toFixed(1)} Tons
          </span>
          <span className="text-slate-500 text-[11px]">
            {totalHistoricalWeight.toLocaleString()} net payload kg
          </span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
            Total Freight Invoiced
          </span>
          <span className="text-2xl font-bold text-emerald-700 mt-1 block">
            ₹{(totalFreight / 100000).toFixed(2)} Lakhs
          </span>
          <span className="text-slate-500 text-[11px]">₹{totalFreight.toLocaleString()}</span>
        </div>
      </div>

      {/* Filter & History Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Filter Bar */}
        <div className="p-4 border-b border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dispatch, vehicle, driver, gate pass..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#F4B400]"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700"
          >
            <option value="ALL">All Lifecycle Statuses</option>
            <option value="DRAFT">Draft Plans</option>
            <option value="READY_FOR_LOADING">Ready For Loading</option>
            <option value="LOADING">Loading at Dock</option>
            <option value="GATE_PASS_ISSUED">Gate Pass Issued</option>
            <option value="IN_TRANSIT">In Transit</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled / Reverted</option>
          </select>

          <select
            value={carrierFilter}
            onChange={(e) => setCarrierFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700"
          >
            <option value="ALL">All Carriers & Transporters</option>
            {carriers.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-600 font-semibold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Dispatch / GP No</th>
                <th className="px-4 py-3">Date & Slot</th>
                <th className="px-4 py-3">Vehicle & Transporter</th>
                <th className="px-4 py-3">Driver</th>
                <th className="px-4 py-3">Route Sector</th>
                <th className="px-4 py-3 text-right">Payload (kg)</th>
                <th className="px-4 py-3 text-right">Freight (₹)</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-normal">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-slate-400">
                    No historical dispatch records found.
                  </td>
                </tr>
              ) : (
                filtered.map((dsp) => (
                  <tr key={dsp.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-mono font-bold text-slate-900">{dsp.dispatchNumber}</div>
                      {dsp.gatePassNumber && (
                        <div className="text-[10px] text-slate-500 font-mono">
                          GP: {dsp.gatePassNumber}
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-900">{dsp.dispatchDate}</div>
                      <div className="text-[10px] text-slate-500">{dsp.scheduledTimeSlot}</div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-900">{dsp.vehicleNumber}</div>
                      <div className="text-[11px] text-slate-500">{dsp.transporterName}</div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-800">{dsp.driverName}</div>
                      <div className="text-[10px] text-slate-500">{dsp.driverPhone}</div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-800 truncate max-w-xs">
                        {dsp.route.join(' → ')}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {dsp.piIds.length} Consignments mapped
                      </div>
                    </td>

                    <td className="px-4 py-3 text-right font-semibold text-slate-900">
                      {dsp.totalWeightKg.toLocaleString()}
                    </td>

                    <td className="px-4 py-3 text-right font-bold text-slate-900">
                      ₹{dsp.estimatedFreightCost.toLocaleString()}
                    </td>

                    <td className="px-4 py-3">
                      <StatusBadge status={dsp.status} size="sm" />
                    </td>

                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => onOpenGatePass(dsp)}
                        className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded text-[11px] inline-flex items-center gap-1 transition-colors"
                        title="View Gate Pass Document"
                      >
                        <FileText className="w-3 h-3 text-slate-600" />
                        <span>View</span>
                      </button>
                    </td>
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
