import React from 'react';
import { X, Printer, Shield, CheckCircle, Truck, FileText, QrCode } from 'lucide-react';
import { DispatchPlan } from '../../types';

interface GatePassModalProps {
  dispatch: DispatchPlan | null;
  isOpen: boolean;
  onClose: () => void;
}

import logoUrl from '../../assets/logo.png';

export const GatePassModal: React.FC<GatePassModalProps> = ({ dispatch, isOpen, onClose }) => {
  if (!isOpen || !dispatch) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#F4B400] text-slate-900 flex items-center justify-center font-bold">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold tracking-tight text-white">
                Official Dispatch Gate Pass
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                {dispatch.gatePassNumber || 'GP-GEN-TEMP'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print Gate Pass</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Pass Area */}
        <div className="p-8 overflow-y-auto space-y-6 text-sm bg-white print:p-0">
          {/* Company Brand Header */}
          <div className="border-b-2 border-slate-900 pb-4 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-white rounded-md flex items-center justify-center border border-slate-200 p-1">
                  <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" />
                </div>
                <h1 className="text-xl font-black tracking-tight text-slate-900 uppercase">
                  DISPATCH PLANNING ERP
                </h1>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Central Logistics Hub: Survey 45/2, Bhiwandi Bypass Highway, Thane, MH 421302
              </p>
              <p className="text-xs text-slate-500 font-mono">
                CIN: U60200MH2014PTC254890 | GSTIN: 27AAACD9841K1Z5
              </p>
            </div>
            <div className="text-right">
              <div className="inline-block border-2 border-emerald-600 px-3 py-1 rounded text-xs font-bold text-emerald-700 tracking-wider uppercase mb-1">
                SECURITY CLEARED
              </div>
              <p className="text-xs font-mono text-slate-600">
                Issued: {dispatch.gatePassIssuedAt || new Date().toISOString().substring(0, 16)}
              </p>
            </div>
          </div>

          {/* Key Identifiers Grid */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Gate Pass No</span>
              <span className="font-mono font-bold text-slate-900 text-sm">
                {dispatch.gatePassNumber || 'GP-2026-04419'}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Dispatch ID</span>
              <span className="font-mono font-bold text-slate-900 text-sm">
                {dispatch.dispatchNumber}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Lorry Receipt (LR)</span>
              <span className="font-mono font-bold text-slate-900 text-sm">
                {dispatch.lrNumber || 'LR-DL-99412'}
              </span>
            </div>
          </div>

          {/* Vehicle & Transporter Grid */}
          <div className="grid grid-cols-2 gap-6">
            <div className="p-4 rounded-xl border border-slate-200 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-slate-700" />
                <span>Vehicle & Carrier Details</span>
              </h4>
              <div className="text-xs space-y-1.5">
                <div className="flex justify-between border-b border-slate-100 pb-1">
                  <span className="text-slate-500">Vehicle Number:</span>
                  <span className="font-bold font-mono text-slate-900">{dispatch.vehicleNumber}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1">
                  <span className="text-slate-500">Vehicle Type:</span>
                  <span className="font-semibold text-slate-800">{dispatch.vehicleType}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1">
                  <span className="text-slate-500">Transporter:</span>
                  <span className="font-medium text-slate-800">{dispatch.transporterName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Security Seal No:</span>
                  <span className="font-mono font-bold text-indigo-700">
                    {dispatch.sealNumber || 'SL-884102'}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-slate-700" />
                <span>Driver & Journey Verification</span>
              </h4>
              <div className="text-xs space-y-1.5">
                <div className="flex justify-between border-b border-slate-100 pb-1">
                  <span className="text-slate-500">Driver Name:</span>
                  <span className="font-bold text-slate-900">{dispatch.driverName}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1">
                  <span className="text-slate-500">Driver Contact:</span>
                  <span className="font-mono text-slate-800">{dispatch.driverPhone}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1">
                  <span className="text-slate-500">Dispatch Slot:</span>
                  <span className="font-medium text-slate-800">{dispatch.scheduledTimeSlot}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Net Payload:</span>
                  <span className="font-bold text-emerald-700">
                    {dispatch.totalWeightKg.toLocaleString()} kg ({dispatch.totalVolumeCbm} cbm)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Consignments Covered */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Mapped Proforma Invoices & Destination Drops ({dispatch.pis?.length || dispatch.piIds.length})
            </h4>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-600 font-semibold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-3 py-2">PI Number</th>
                    <th className="px-3 py-2">Consignee</th>
                    <th className="px-3 py-2">Destination City</th>
                    <th className="px-3 py-2 text-right">Cargo Weight</th>
                    <th className="px-3 py-2 text-right">Invoice Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {dispatch.pis && dispatch.pis.length > 0 ? (
                    dispatch.pis.map((pi) => (
                      <tr key={pi.id}>
                        <td className="px-3 py-2 font-mono text-slate-900">{pi.piNumber}</td>
                        <td className="px-3 py-2 text-slate-800">{pi.clientName}</td>
                        <td className="px-3 py-2 text-slate-600">{pi.destinationCity}</td>
                        <td className="px-3 py-2 text-right text-slate-900 font-semibold">
                          {pi.totalWeightKg.toLocaleString()} kg
                        </td>
                        <td className="px-3 py-2 text-right text-emerald-700 font-semibold">
                          ₹{pi.totalAmount.toLocaleString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-3 py-3 text-center text-slate-400">
                        Consolidated multi-drop load for sector {dispatch.route.join(' -> ')}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Signature & Stamp Footer */}
          <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-200 text-center text-xs">
            <div className="space-y-8">
              <div className="h-10 border-b border-dashed border-slate-300 flex items-end justify-center pb-1 text-slate-400 font-mono text-[10px]">
                [Digital Signature Authenticated]
              </div>
              <span className="font-semibold text-slate-700 block">Dispatch Supervisor</span>
            </div>
            <div className="space-y-8">
              <div className="h-10 border-b border-dashed border-slate-300 flex items-end justify-center pb-1 text-slate-400 font-mono text-[10px]">
                [Physical Sign on Out-Gate]
              </div>
              <span className="font-semibold text-slate-700 block">Driver Signature</span>
            </div>
            <div className="space-y-8">
              <div className="h-10 border-b border-dashed border-slate-300 flex items-end justify-center pb-1 text-slate-400 font-mono text-[10px]">
                [Biometric Timestamped]
              </div>
              <span className="font-semibold text-slate-700 block">Gate Security Officer</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Valid for vehicle out-movement within 4 hours of generation time.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
