import React, { useState, useEffect } from 'react';
import {
  CalendarDays,
  Truck,
  Plus,
  Clock,
  MapPin,
  FileSpreadsheet,
  Layers,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { dispatchService } from '../services/api';
import { DispatchPlan, ProformaInvoice } from '../types';
import { StatusBadge } from '../components/common/StatusBadge';
import { CapacityBar } from '../components/common/CapacityBar';

interface UpcomingPlanningPageProps {
  onOpenNewDispatch: () => void;
  onOpenGatePass: (dsp: DispatchPlan) => void;
  onOpenPIDetails: (pi: ProformaInvoice) => void;
}

export const UpcomingPlanningPage: React.FC<UpcomingPlanningPageProps> = ({
  onOpenNewDispatch,
  onOpenGatePass,
  onOpenPIDetails,
}) => {
  const [dispatches, setDispatches] = useState<DispatchPlan[]>([]);
  const [horizonFilter, setHorizonFilter] = useState<'7' | '14' | '30'>('7');

  useEffect(() => {
    const load = () => {
      setDispatches(dispatchService.getDispatchPlans());
    };
    load();
    const unsub = dispatchService.subscribe(load);
    return () => unsub();
  }, []);

  const upcomingList = dispatches.filter(
    (d) => d.dispatchDate > '2026-03-02' || d.status === 'DRAFT'
  );

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Upcoming Dispatch Planning & Forecasting
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-md bg-indigo-100 text-indigo-900 font-bold border border-indigo-200">
              Next {horizonFilter} Days Horizon
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Advance fleet allocation, cross-dock route planning, and upcoming client fulfillment pipeline.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 text-xs font-semibold">
            {(['7', '14', '30'] as const).map((days) => (
              <button
                key={days}
                onClick={() => setHorizonFilter(days)}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  horizonFilter === days
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {days} Days
              </button>
            ))}
          </div>

          <button
            onClick={onOpenNewDispatch}
            className="px-4 py-2 bg-[#F4B400] hover:bg-[#e0a400] text-slate-950 text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Pre-Plan Upcoming Dispatch</span>
          </button>
        </div>
      </div>

      {/* Horizon Summary Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
            Pre-Allocated Fleet
          </span>
          <span className="text-2xl font-bold text-slate-900 mt-1 block">
            {upcomingList.length} Vehicles
          </span>
          <span className="text-slate-500 text-[11px]">Reserved for Gujarat & North sector</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
            Estimated Outbound Freight
          </span>
          <span className="text-2xl font-bold text-slate-900 mt-1 block">
            ₹
            {upcomingList
              .reduce((sum, d) => sum + d.estimatedFreightCost, 0)
              .toLocaleString()}
          </span>
          <span className="text-slate-500 text-[11px]">Forecasted carrier billing</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
            Upcoming Client Orders
          </span>
          <span className="text-2xl font-bold text-indigo-700 mt-1 block">
            {dispatchService.getPendingPIs().length} PIs
          </span>
          <span className="text-slate-500 text-[11px]">Ready for next-week clustering</span>
        </div>
      </div>

      {/* Upcoming Plans List */}
      <div className="space-y-4">
        {upcomingList.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400 bg-white rounded-xl border border-slate-200">
            No upcoming advance dispatch plans created yet. Click "Pre-Plan Upcoming Dispatch" to schedule.
          </div>
        ) : (
          upcomingList.map((dsp) => (
            <div
              key={dsp.id}
              className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4 hover:border-slate-300 transition-all"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
                    <CalendarDays className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-slate-900">
                        {dsp.dispatchNumber}
                      </span>
                      <StatusBadge status={dsp.status} />
                      <span className="text-xs px-2 py-0.5 rounded bg-indigo-50 text-indigo-800 font-semibold border border-indigo-200">
                        Scheduled for: {dsp.dispatchDate} ({dsp.scheduledTimeSlot})
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Carrier: {dsp.transporterName} • Driver: {dsp.driverName} ({dsp.driverPhone})
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">
                    Est. Freight: ₹{dsp.estimatedFreightCost.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Specs & Route */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
                  <div className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-slate-600" />
                    <span>{dsp.vehicleNumber}</span>
                  </div>
                  <div className="text-slate-600">{dsp.vehicleType}</div>
                  <div className="text-slate-500">
                    Max Payload: {(dsp.maxWeightCapacityKg / 1000).toFixed(1)}T ({dsp.maxVolumeCapacityCbm} cbm)
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
                  <div className="font-bold text-slate-800 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-600" />
                    <span>Planned Transit Sector</span>
                  </div>
                  <div className="text-slate-700 font-medium">{dsp.route.join(' → ')}</div>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-2">
                  <CapacityBar
                    current={dsp.totalWeightKg}
                    max={dsp.maxWeightCapacityKg}
                    unit="kg"
                    label="Reserved Weight"
                  />
                  <CapacityBar
                    current={dsp.totalVolumeCbm}
                    max={dsp.maxVolumeCapacityCbm}
                    unit="cbm"
                    label="Volume"
                  />
                </div>
              </div>

              {dsp.remarks && (
                <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-200/80 text-xs text-amber-900">
                  <span className="font-semibold">Planning Notes:</span> {dsp.remarks}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
