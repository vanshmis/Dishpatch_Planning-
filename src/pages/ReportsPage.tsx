import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  Truck,
  DollarSign,
  Clock,
  PieChart,
  Printer,
  CheckCircle2,
} from 'lucide-react';
import { dispatchService } from '../services/api';

export const ReportsPage: React.FC = () => {
  const [reportRange, setReportRange] = useState<'WEEK' | 'MONTH' | 'QUARTER'>('MONTH');

  const pis = dispatchService.getPIs();
  const dispatches = dispatchService.getDispatchPlans();
  const completed = dispatchService.getCompletedDispatches();

  const totalDeliveredTonnage = (
    completed.reduce((sum, d) => sum + d.totalWeightKg, 0) / 1000
  ).toFixed(1);

  const totalFreightPaid = completed.reduce((sum, d) => sum + d.estimatedFreightCost, 0);
  const avgUtilization = 86.4;
  const onTimeRate = 98.2;
  const avgTurnaroundHrs = 18.5;

  const destinationMetrics = [
    { city: 'Mumbai / MMR', share: 38, tons: 45.2, spend: 185000 },
    { city: 'Pune / Chakan MIDC', share: 26, tons: 32.8, spend: 142000 },
    { city: 'Ahmedabad / Changodar', share: 18, tons: 24.1, spend: 110000 },
    { city: 'Bengaluru / Harohalli', share: 12, tons: 16.5, spend: 95000 },
    { city: 'Hyderabad & North', share: 6, tons: 8.4, spend: 48000 },
  ];

  const vehicleTypeMetrics = [
    { type: '32ft Multi-Axle (15T)', trips: 14, avgLoadPercent: 91, efficiency: 'Optimal' },
    { type: '19ft Container (7.5T)', trips: 22, avgLoadPercent: 88, efficiency: 'Optimal' },
    { type: '14ft Eicher (4T)', trips: 18, avgLoadPercent: 82, efficiency: 'Good' },
    { type: 'Tata Ace (1.2T)', trips: 31, avgLoadPercent: 78, efficiency: 'Moderate' },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Logistics & Freight Performance Reports
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-md bg-[#F4B400]/20 text-[#996f00] font-bold border border-[#F4B400]/40">
              FY 2025-26 Analytics
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Operational analytics on vehicle payload utilization, turnaround times (TAT), delivery SLAs, and regional freight expenditure.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 text-xs font-semibold">
            {(['WEEK', 'MONTH', 'QUARTER'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setReportRange(r)}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  reportRange === r
                    ? 'bg-[#181309] text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {r === 'WEEK' ? 'This Week' : r === 'MONTH' ? 'This Month' : 'This Quarter'}
              </button>
            ))}
          </div>

          <button
            onClick={handlePrint}
            className="px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print Executive Summary</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 uppercase font-semibold text-[10px] tracking-wider">
            <span>Payload Utilization</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{avgUtilization}%</div>
          <div className="text-[11px] text-emerald-700 font-semibold">+3.2% vs last month target</div>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 uppercase font-semibold text-[10px] tracking-wider">
            <span>On-Time Delivery SLA</span>
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{onTimeRate}%</div>
          <div className="text-[11px] text-slate-500">Benchmark: 95.0%</div>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 uppercase font-semibold text-[10px] tracking-wider">
            <span>Avg Turnaround Time</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{avgTurnaroundHrs} hrs</div>
          <div className="text-[11px] text-emerald-700 font-semibold">-2.4 hrs faster loading</div>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 uppercase font-semibold text-[10px] tracking-wider">
            <span>Delivered Freight</span>
            <Truck className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{totalDeliveredTonnage} Tons</div>
          <div className="text-[11px] text-slate-500">₹{(totalFreightPaid / 100000).toFixed(2)}L spend</div>
        </div>
      </div>

      {/* Detailed Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Destination / Sector Breakdown */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <PieChart className="w-4 h-4 text-indigo-600" />
              <span>Regional Freight & Destination Volume</span>
            </h3>
            <span className="text-xs text-slate-500 font-medium">Top 5 Corridors</span>
          </div>

          <div className="space-y-3 text-xs">
            {destinationMetrics.map((dest) => (
              <div key={dest.city} className="space-y-1">
                <div className="flex justify-between font-medium text-slate-800">
                  <span>{dest.city}</span>
                  <span>
                    {dest.tons} Tons ({dest.share}%) • ₹{(dest.spend / 1000).toFixed(0)}k
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full"
                    style={{ width: `${dest.share * 2}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fleet Vehicle Category Efficiency */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#996f00]" />
              <span>Fleet Category Utilization & Load Factor</span>
            </h3>
            <span className="text-xs text-slate-500 font-medium">By Fleet Class</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-3 py-2">Vehicle Type</th>
                  <th className="px-3 py-2 text-right">Trips</th>
                  <th className="px-3 py-2 text-right">Avg Load %</th>
                  <th className="px-3 py-2 text-center">Efficiency Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {vehicleTypeMetrics.map((vm) => (
                  <tr key={vm.type} className="hover:bg-slate-50">
                    <td className="px-3 py-2.5 font-medium text-slate-900">{vm.type}</td>
                    <td className="px-3 py-2.5 text-right font-semibold text-slate-800">{vm.trips}</td>
                    <td className="px-3 py-2.5 text-right font-bold text-emerald-700">
                      {vm.avgLoadPercent}%
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                        {vm.efficiency}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
