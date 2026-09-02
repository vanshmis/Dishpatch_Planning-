import React, { useState, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { CreateDispatchModal } from '../components/modals/CreateDispatchModal';
import { NewPIModal } from '../components/modals/NewPIModal';
import { GatePassModal } from '../components/modals/GatePassModal';
import { RollbackModal } from '../components/modals/RollbackModal';
import { ViewPIDetailsModal } from '../components/modals/ViewPIDetailsModal';
import { DispatchPlan, ProformaInvoice } from '../types';

interface AppLayoutProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  children: (helpers: {
    openNewDispatch: (preSelectedPIId?: string) => void;
    openNewPI: () => void;
    openGatePass: (dsp: DispatchPlan) => void;
    openRollback: (dsp: DispatchPlan) => void;
    openPIDetails: (pi: ProformaInvoice) => void;
  }) => React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  currentPath,
  onNavigate,
  children,
}) => {
  const [isNewDispatchOpen, setIsNewDispatchOpen] = useState(false);
  const [preSelectedPIId, setPreSelectedPIId] = useState<string | undefined>();
  const [isNewPIOpen, setIsNewPIOpen] = useState(false);

  const [activeGatePassDispatch, setActiveGatePassDispatch] = useState<DispatchPlan | null>(null);
  const [activeRollbackDispatch, setActiveRollbackDispatch] = useState<DispatchPlan | null>(null);
  const [activePIDetail, setActivePIDetail] = useState<ProformaInvoice | null>(null);

  const openNewDispatch = (piId?: string) => {
    setPreSelectedPIId(piId);
    setIsNewDispatchOpen(true);
  };

  const openNewPI = () => {
    setIsNewPIOpen(true);
  };

  const openGatePass = (dsp: DispatchPlan) => {
    setActiveGatePassDispatch(dsp);
  };

  const openRollback = (dsp: DispatchPlan) => {
    setActiveRollbackDispatch(dsp);
  };

  const openPIDetails = (pi: ProformaInvoice) => {
    setActivePIDetail(pi);
  };

  return (
    <div className="flex min-h-screen bg-[#F6F7FB] text-slate-900">
      {/* Sidebar */}
      <Sidebar currentPath={currentPath} onNavigate={onNavigate} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          onOpenNewDispatch={() => openNewDispatch()}
          onOpenNewPI={openNewPI}
        />

        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6">
          {children({
            openNewDispatch,
            openNewPI,
            openGatePass,
            openRollback,
            openPIDetails,
          })}
        </main>
      </div>

      {/* Global Modals */}
      <CreateDispatchModal
        isOpen={isNewDispatchOpen}
        onClose={() => setIsNewDispatchOpen(false)}
        preSelectedPIId={preSelectedPIId}
      />

      <NewPIModal
        isOpen={isNewPIOpen}
        onClose={() => setIsNewPIOpen(false)}
      />

      <GatePassModal
        dispatch={activeGatePassDispatch}
        isOpen={!!activeGatePassDispatch}
        onClose={() => setActiveGatePassDispatch(null)}
      />

      <RollbackModal
        dispatch={activeRollbackDispatch}
        isOpen={!!activeRollbackDispatch}
        onClose={() => setActiveRollbackDispatch(null)}
      />

      <ViewPIDetailsModal
        pi={activePIDetail}
        isOpen={!!activePIDetail}
        onClose={() => setActivePIDetail(null)}
        onPlanDispatch={(pi) => openNewDispatch(pi.id)}
      />
    </div>
  );
};
