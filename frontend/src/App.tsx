import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { NavTab } from './types';
import { HomePage } from './pages/HomePage';
import { CreateScenarioPage } from './pages/CreateScenarioPage';
import { SimulationProgressPage } from './pages/SimulationProgressPage';
import { FloodMapPage } from './pages/FloodMapPage';
import { FloodImpactPage } from './pages/FloodImpactPage';
import { ResponsePage } from './pages/ResponsePage';
import { EvacuationPage } from './pages/EvacuationPage';
import { ReportsPage } from './pages/ReportsPage';
import { SystemStatusPage } from './pages/SystemStatusPage';
import { DataMethodologyModal } from './components/DataMethodologyModal';
import { fetchHealth } from './services/api';

export function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [activeRunId, setActiveRunId] = useState<string>('default_proto');
  const [showDataModal, setShowDataModal] = useState<boolean>(false);
  const [systemStatus, setSystemStatus] = useState<string>('online');

  useEffect(() => {
    async function loadHealth() {
      const health = await fetchHealth();
      if (health && health.status) setSystemStatus(health.status);
    }
    loadHealth();
  }, []);

  const handleScenarioSubmitted = (newRunId: string) => {
    setActiveRunId(newRunId);
    setActiveTab('simulation');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage activeRunId={activeRunId} onNavigate={setActiveTab} />;
      case 'scenario':
        return <CreateScenarioPage onScenarioSubmitted={handleScenarioSubmitted} />;
      case 'simulation':
        return <SimulationProgressPage runId={activeRunId} onComplete={() => setActiveTab('map')} />;
      case 'map':
        return <FloodMapPage activeRunId={activeRunId} onNavigate={setActiveTab} />;
      case 'impact':
        return <FloodImpactPage activeRunId={activeRunId} onNavigate={setActiveTab} />;
      case 'response':
        return <ResponsePage activeRunId={activeRunId} onNavigate={setActiveTab} />;
      case 'evacuation':
        return <EvacuationPage activeRunId={activeRunId} onNavigate={setActiveTab} />;
      case 'reports':
        return <ReportsPage activeRunId={activeRunId} />;
      case 'system_status':
        return <SystemStatusPage />;
      default:
        return <HomePage activeRunId={activeRunId} onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="app-container">
      <Header
        systemStatus={systemStatus}
        onOpenDataMethodology={() => setShowDataModal(true)}
        onOpenSettings={() => setActiveTab('system_status')}
      />
      <div className="main-body">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="content-area" style={{ padding: 0, overflowY: 'auto' }}>
          {renderContent()}
        </main>
      </div>

      {showDataModal && (
        <DataMethodologyModal onClose={() => setShowDataModal(false)} />
      )}
    </div>
  );
}

export default App;

