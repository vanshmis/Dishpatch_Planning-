import React from 'react';
import { X, FileText, MapPin, Calendar, Scale, Box, DollarSign, AlertCircle, ArrowRight } from 'lucide-react';
import { ProformaInvoice } from '../../types';
import { StatusBadge } from '../common/StatusBadge';

interface ViewPIDetailsModalProps {
  pi: ProformaInvoice | null;
  isOpen: boolean;
  onClose: () => void;
  onPlanDispatch?: (pi: ProformaInvoice) => void;
}

export const ViewPIDetailsModal: React.FC<ViewPIDetailsModalProps> = ({
  pi,
  isOpen,
  onClose,
  onPlanDispatch,
}) => {
  if (!isOpen || !pi) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#F4B400] text-slate-900 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold tracking-tight text-white">{pi.piNumber}</h3>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                  {pi.orderNumber}
                </span>
              </div>
              <p className="text-xs text-slate-400">Created on {pi.createdDate}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
          {/* Status & Highlights */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200/80">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Status:</span>
              <StatusBadge status={pi.status} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Priority:</span>
              <StatusBadge status={pi.priority} size="sm" />
            </div>
            {pi.assignedDispatchId && (
              <div className="flex items-center gap-1.5 text-xs text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded border border-indigo-200">
                <span>Mapped to:</span>
                <span className="font-semibold">{pi.assignedDispatchId}</span>
              </div>
            )}
          </div>

          {/* Client & Shipping Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-600" />
                <span>Client & Consignee</span>
              </div>
              <div>
                <div className="font-bold text-slate-900 text-base">{pi.clientName}</div>
                <div className="text-xs font-mono text-slate-500 mt-0.5">Code: {pi.clientCode}</div>
              </div>
              <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <p className="font-medium text-slate-800 mb-0.5">Delivery Destination:</p>
                <p>{pi.deliveryAddress}</p>
                <p className="mt-1 font-semibold text-slate-700">
                  {pi.destinationCity}, {pi.state} - {pi.pinCode}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-600" />
                <span>Delivery Schedule & Cargo Weight</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <span className="text-slate-500 block">PI Issue Date</span>
                  <span className="font-semibold text-slate-800">{pi.piDate}</span>
                </div>
                <div className="bg-amber-50 p-2 rounded-lg border border-amber-200/60">
                  <span className="text-amber-800 block">Expected Arrival</span>
                  <span className="font-semibold text-amber-900">{pi.expectedDeliveryDate}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100">
                <div className="text-center p-2 bg-slate-50 rounded-lg">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Weight</span>
                  <span className="font-bold text-slate-800 text-sm">
                    {pi.totalWeightKg.toLocaleString()} kg
                  </span>
                </div>
                <div className="text-center p-2 bg-slate-50 rounded-lg">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Volume</span>
                  <span className="font-bold text-slate-800 text-sm">{pi.totalVolumeCbm} cbm</span>
                </div>
                <div className="text-center p-2 bg-slate-50 rounded-lg">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Value</span>
                  <span className="font-bold text-slate-800 text-sm">
                    ₹{(pi.totalAmount / 1000).toFixed(0)}k
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
              <Box className="w-3.5 h-3.5 text-slate-600" />
              <span>Consignment Line Items ({pi.items.length})</span>
            </h4>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-600 font-semibold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-3 py-2.5">Item Code</th>
                    <th className="px-3 py-2.5">Description</th>
                    <th className="px-3 py-2.5 text-right">Qty</th>
                    <th className="px-3 py-2.5 text-right">Weight (kg)</th>
                    <th className="px-3 py-2.5 text-right">Rate (₹)</th>
                    <th className="px-3 py-2.5 text-right">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-normal">
                  {pi.items.map((item, idx) => (
                    <tr key={item.id || idx} className="hover:bg-slate-50/70">
                      <td className="px-3 py-2.5 font-mono font-medium text-slate-700">{item.itemCode}</td>
                      <td className="px-3 py-2.5 text-slate-900 font-medium">{item.description}</td>
                      <td className="px-3 py-2.5 text-right font-semibold">
                        {item.quantity.toLocaleString()} {item.unit}
                      </td>
                      <td className="px-3 py-2.5 text-right text-slate-600">{item.weightKg.toLocaleString()}</td>
                      <td className="px-3 py-2.5 text-right text-slate-600">₹{item.rate.toLocaleString()}</td>
                      <td className="px-3 py-2.5 text-right font-semibold text-slate-900">
                        ₹{item.amount.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-50 font-bold border-t border-slate-200 text-slate-800">
                  <tr>
                    <td colSpan={3} className="px-3 py-2.5 text-right">
                      Totals:
                    </td>
                    <td className="px-3 py-2.5 text-right text-indigo-700">
                      {pi.totalWeightKg.toLocaleString()} kg
                    </td>
                    <td className="px-3 py-2.5 text-right">-</td>
                    <td className="px-3 py-2.5 text-right text-emerald-700">
                      ₹{pi.totalAmount.toLocaleString()}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {pi.remarks && (
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 flex items-start gap-2.5 text-xs text-amber-900">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Dispatch Instructions:</span>
                <span>{pi.remarks}</span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-300 rounded-lg bg-white hover:bg-slate-100 transition-colors"
          >
            Close
          </button>
          {pi.status === 'PENDING' && onPlanDispatch && (
            <button
              onClick={() => {
                onClose();
                onPlanDispatch(pi);
              }}
              className="px-5 py-2 text-xs font-bold text-slate-900 bg-[#F4B400] hover:bg-[#e0a400] rounded-lg shadow-xs flex items-center gap-1.5 transition-all"
            >
              <span>Add to Dispatch Plan</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
