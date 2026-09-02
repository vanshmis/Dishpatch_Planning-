import React, { useState, useEffect } from 'react';
import {
  Truck,
  FileSpreadsheet,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  FileText,
  Shield,
  Layers,
  MapPin,
  RefreshCw,
  Plus,
  Play,
  RotateCcw,
} from 'lucide-react';
import { dispatchService } from '../services/api';
import { DispatchPlan, ProformaInvoice, Vehicle } from '../types';
import { StatCard } from '../components/common/StatCard';
import { StatusBadge } from '../components/common/StatusBadge';
import { CapacityBar } from '../components/common/CapacityBar';

interface DashboardPageProps {
  onNavigate: (path: string) => void;
  onOpenNewDispatch: (piId?: string) => void;
  onOpenNewPI: () => void;
  onOpenGatePass: (dsp: DispatchPlan) => void;
  onOpenRollback: (dsp: DispatchPlan) => void;
  onOpenPIDetails: (pi: ProformaInvoice) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigate,
  onOpenNewDispatch,
  onOpenNewPI,
  onOpenGatePass,
  onOpenRollback,
  onOpenPIDetails,
}) => {
  const [pis, setPis] = useState<ProformaInvoice[]>([]);
  const [dispatches, setDispatches] = useState<DispatchPlan[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  useEffect(() => {
    const loadData = () => {
      setPis(dispatchService.getPIs());
      setDispatches(dispatchService.getDispatchPlans());
      setVehicles(dispatchService.getVehicles());
    };
    loadData();
    const unsub = dispatchService.subscribe(loadData);
    return () => unsub();
  }, []);

  const pendingPIs = pis.filter((p) => p.status === 'PENDING');
  const urgentPIs = pendingPIs.filter((p) => p.priority === 'URGENT' || p.priority === 'HIGH');
  const todaysDispatches = dispatches.filter(
    (d) => d.dispatchDate === '2026-03-02' || d.status === 'LOADING' || d.status === 'READY_FOR_LOADING'
  );
  const inTransitDispatches = dispatches.filter((d) => d.status === 'IN_TRANSIT');
  const completedDispatches = dispatches.filter((d) => d.status === 'DELIVERED');

  const totalPendingWeight = pendingPIs.reduce((sum, p) => sum + p.totalWeightKg, 0);
  const availableVehicles = vehicles.filter((v) => v.status === 'AVAILABLE');

  const handleAdvanceStatus = (dsp: DispatchPlan) => {
    if (dsp.status === 'READY_FOR_LOADING') {
      dispatchService.updateDispatchStatus(dsp.id, 'LOADING');
    } else if (dsp.status === 'LOADING') {
      dispatchService.updateDispatchStatus(dsp.id, 'GATE_PASS_ISSUED');
    } else if (dsp.status === 'GATE_PASS_ISSUED') {
      dispatchService.updateDispatchStatus(dsp.id, 'IN_TRANSIT');
    } else if (dsp.status === 'IN_TRANSIT') {
      dispatchService.updateDispatchStatus(dsp.id, 'DELIVERED', {
        receivedBy: 'Warehouse In-charge',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Operations Dispatch Dashboard
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-semibold border border-amber-200">
              Bhiwandi Hub
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time control tower for vehicle allocations, pending orders, and active freight movements.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenNewPI}
            className="px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-slate-500" />
            <span>Create PI</span>
          </button>
          <button
            onClick={() => onOpenNewDispatch()}
            className="px-4 py-2 bg-[#F4B400] hover:bg-[#e0a400] text-slate-950 text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 transition-all"
          >
            <Truck className="w-4 h-4" />
            <span>Plan New Dispatch</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Pending PIs Backlog"
          value={`${pendingPIs.length} Orders`}
          subtitle={`${(totalPendingWeight / 1000).toFixed(1)} Tons to assign`}
          icon={FileSpreadsheet}
          accentColor="bg-[#181309] text-[#F4B400]"
          badge={urgentPIs.length > 0 ? `${urgentPIs.length} Urgent` : undefined}
          onClick={() => onNavigate('/pending-pi')}
        />

        <StatCard
          title="Today's Dispatch Queue"
          value={`${todaysDispatches.length} Vehicles`}
          subtitle="Loading bays active"
          icon={Clock}
          accentColor="bg-blue-600 text-white"
          onClick={() => onNavigate('/todays-planning')}
        />

        <StatCard
          title="Consignments In Transit"
          value={`${inTransitDispatches.length} En Route`}
          subtitle="GPS tracked interstate"
          icon={Truck}
          accentColor="bg-sky-600 text-white"
          onClick={() => onNavigate('/todays-planning')}
        />

        <StatCard
          title="Fleet Available"
          value={`${availableVehicles.length} / ${vehicles.length}`}
          subtitle="Ready at yard"
          icon={CheckCircle2}
          accentColor="bg-emerald-600 text-white"
          onClick={() => onNavigate('/settings')}
        />
      </div>

      {/* Pipeline Status Breakdown */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center justify-between">
          <span>Dispatch Lifecycle Pipeline</span>
          <span className="text-[11px] font-normal text-slate-400">Live Stage Tracker</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-center text-xs">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-slate-500 block text-[11px]">1. Draft</span>
            <span className="text-lg font-bold text-slate-800">
              {dispatches.filter((d) => d.status === 'DRAFT').length}
            </span>
          </div>
          <div className="p-3 bg-indigo-50/60 rounded-lg border border-indigo-100">
            <span className="text-indigo-700 block text-[11px]">2. Ready to Load</span>
            <span className="text-lg font-bold text-indigo-900">
              {dispatches.filter((d) => d.status === 'READY_FOR_LOADING').length}
            </span>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
            <span className="text-purple-700 block text-[11px]">3. Loading Dock</span>
            <span className="text-lg font-bold text-purple-900">
              {dispatches.filter((d) => d.status === 'LOADING').length}
            </span>
          </div>
          <div className="p-3 bg-cyan-50 rounded-lg border border-cyan-200">
            <span className="text-cyan-700 block text-[11px]">4. Gate Pass Issued</span>
            <span className="text-lg font-bold text-cyan-900">
              {dispatches.filter((d) => d.status === 'GATE_PASS_ISSUED').length}
            </span>
          </div>
          <div className="p-3 bg-sky-50 rounded-lg border border-sky-200">
            <span className="text-sky-700 block text-[11px]">5. In Transit</span>
            <span className="text-lg font-bold text-sky-900">
              {dispatches.filter((d) => d.status === 'IN_TRANSIT').length}
            </span>
          </div>
          <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
            <span className="text-emerald-700 block text-[11px]">6. Delivered (POD)</span>
            <span className="text-lg font-bold text-emerald-900">
              {dispatches.filter((d) => d.status === 'DELIVERED').length}
            </span>
          </div>
        </div>
      </div>

      {/* Main Operational Tables Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active Today's Dispatches */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-sm text-slate-900">
                  Active Dispatch Schedule (Today's Queue)
                </h3>
              </div>
              <button
                onClick={() => onNavigate('/todays-planning')}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
              >
                <span>View Full Schedule</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {todaysDispatches.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  No active dispatches scheduled for today.
                </div>
              ) : (
                todaysDispatches.map((dsp) => (
                  <div key={dsp.id} className="p-4 hover:bg-slate-50/70 transition-colors space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono font-bold text-xs text-slate-900">
                          {dsp.dispatchNumber}
                        </span>
                        <StatusBadge status={dsp.status} />
                        <span className="text-xs text-slate-500 font-medium">
                          Slot: {dsp.scheduledTimeSlot}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {dsp.gatePassNumber ? (
                          <button
                            onClick={() => onOpenGatePass(dsp)}
                            className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded border border-slate-200 flex items-center gap-1"
                          >
                            <FileText className="w-3 h-3 text-slate-500" />
                            <span>Gate Pass</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleAdvanceStatus(dsp)}
                            className="px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200 flex items-center gap-1"
                          >
                            <Play className="w-3 h-3" />
                            <span>
                              {dsp.status === 'READY_FOR_LOADING'
                                ? 'Start Loading'
                                : dsp.status === 'LOADING'
                                ? 'Issue Gate Pass'
                                : 'Next Stage'}
                            </span>
                          </button>
                        )}

                        {dsp.isRollbackAllowed && (
                          <button
                            onClick={() => onOpenRollback(dsp)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50"
                            title="Rollback / Revert Plan"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Route & Vehicle Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <div>
                        <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                          <Truck className="w-3.5 h-3.5 text-slate-500" />
                          <span>{dsp.vehicleNumber}</span>
                          <span className="text-slate-400 font-normal">({dsp.vehicleType})</span>
                        </div>
                        <div className="text-slate-500 mt-0.5">
                          Driver: {dsp.driverName} ({dsp.driverPhone})
                        </div>
                      </div>

                      <div>
                        <div className="text-slate-500 flex items-center gap-1 text-[11px]">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>Route: {dsp.route.join(' → ')}</span>
                        </div>
                        <div className="text-indigo-700 font-semibold mt-0.5 text-[11px]">
                          {dsp.piIds.length} Proforma Invoices mapped (₹
                          {(dsp.estimatedFreightCost).toLocaleString()} freight)
                        </div>
                      </div>
                    </div>

                    {/* Payload Capacity Gauge */}
                    <CapacityBar
                      current={dsp.totalWeightKg}
                      max={dsp.maxWeightCapacityKg}
                      unit="kg"
                      label="Payload Utilization"
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Urgent Pending PI Orders & Quick Links */}
        <div className="space-y-4">
          {/* Urgent Orders Box */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <h3 className="font-bold text-sm text-slate-900">Urgent Pending Orders</h3>
              </div>
              <button
                onClick={() => onNavigate('/pending-pi')}
                className="text-xs text-amber-700 hover:text-amber-900 font-semibold"
              >
                All ({pendingPIs.length})
              </button>
            </div>

            <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
              {urgentPIs.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400">
                  No urgent orders pending allocation.
                </div>
              ) : (
                urgentPIs.map((pi) => (
                  <div
                    key={pi.id}
                    onClick={() => onOpenPIDetails(pi)}
                    className="p-3.5 hover:bg-slate-50 transition-colors cursor-pointer space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-xs text-slate-900">{pi.piNumber}</span>
                      <StatusBadge status={pi.priority} size="sm" />
                    </div>
                    <div className="text-xs font-semibold text-slate-800">{pi.clientName}</div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>{pi.destinationCity}</span>
                      <span className="font-bold text-slate-800">
                        {pi.totalWeightKg.toLocaleString()} kg
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
              <button
                onClick={() => onNavigate('/dispatch-planning')}
                className="w-full py-2 bg-[#181309] hover:bg-[#282114] text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <Layers className="w-3.5 h-3.5 text-[#F4B400]" />
                <span>Open Dispatch Planning Console</span>
              </button>
            </div>
          </div>

          {/* Hub Status Summary */}
          <div className="bg-[#181309] text-white rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between text-xs border-b border-[#382f1b] pb-2">
              <span className="text-[#cca352] font-semibold uppercase tracking-wider">
                Hub Compliance & Safety
              </span>
              <Shield className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>E-Way Bill Compliance:</span>
                <span className="text-emerald-400 font-semibold">100% Validated</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Weighbridge Calibration:</span>
                <span className="text-emerald-400 font-semibold">Active & Certified</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Loading Bays In-Use:</span>
                <span className="text-amber-400 font-semibold">4 / 8 Bays</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
