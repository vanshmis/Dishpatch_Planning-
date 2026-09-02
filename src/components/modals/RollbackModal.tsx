import React, { useState } from 'react';
import { X, RotateCcw, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { dispatchService } from '../../services/api';
import { DispatchPlan, RollbackAction } from '../../types';

interface RollbackModalProps {
  dispatch: DispatchPlan | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const RollbackModal: React.FC<RollbackModalProps> = ({
  dispatch,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [reasonCategory, setReasonCategory] = useState<RollbackAction['reasonCategory']>(
    'VEHICLE_BREAKDOWN'
  );
  const [notes, setNotes] = useState('');
  const [requestedBy, setRequestedBy] = useState('Rajesh Sharma (Senior Dispatch Officer)');
  const [error, setError] = useState('');

  if (!isOpen || !dispatch) return null;

  const handleExecuteRollback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes.trim()) {
      setError('Please provide detailed reason notes for the audit log');
      return;
    }

    const success = dispatchService.executeRollback(
      dispatch.id,
      reasonCategory,
      notes.trim(),
      requestedBy
    );

    if (success) {
      onClose();
      if (onSuccess) onSuccess();
    } else {
      setError('Failed to execute rollback. Please verify dispatch status.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-rose-950 text-white flex items-center justify-between border-b border-rose-900">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-rose-500 text-white flex items-center justify-center font-bold">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight text-white">
                Rollback Dispatch Plan
              </h3>
              <p className="text-xs text-rose-300 font-mono">{dispatch.dispatchNumber}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-rose-300 hover:text-white hover:bg-rose-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleExecuteRollback} className="p-6 space-y-4 text-sm">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl space-y-1.5 text-xs text-rose-900">
            <div className="font-bold flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>Important Action Notice:</span>
            </div>
            <p>
              Rolling back will cancel dispatch <strong>{dispatch.dispatchNumber}</strong>, revert{' '}
              <strong>{dispatch.piIds.length} Proforma Invoices</strong> back to Pending status, and free
              vehicle <strong>{dispatch.vehicleNumber}</strong> for re-allocation.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Rollback Reason Category
            </label>
            <select
              value={reasonCategory}
              onChange={(e) =>
                setReasonCategory(e.target.value as RollbackAction['reasonCategory'])
              }
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:ring-2 focus:ring-rose-500"
              required
            >
              <option value="VEHICLE_BREAKDOWN">Vehicle Breakdown / Mechanical Issue</option>
              <option value="CLIENT_CANCELLATION">Client Delivery Postponed / Cancelled</option>
              <option value="WEIGHT_DISCREPANCY">Weight or Volume Discrepancy at Weighbridge</option>
              <option value="INCORRECT_MAPPING">Incorrect Item / Client PI Consolidation</option>
              <option value="DOCUMENTATION_ERROR">E-Way Bill or GST Documentation Mismatch</option>
              <option value="OTHER">Other Operational Issue</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Audit Notes & Corrective Remarks
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Provide exact cause (e.g. Engine alternator breakdown on Bay 3, moving cargo to reserve vehicle MH-04-HY-3342)..."
              rows={3}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:ring-2 focus:ring-rose-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Authorizing Officer
            </label>
            <input
              type="text"
              value={requestedBy}
              onChange={(e) => setRequestedBy(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-800"
              required
            />
          </div>

          {/* Buttons */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-300 rounded-lg bg-white hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Confirm & Rollback Plan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
