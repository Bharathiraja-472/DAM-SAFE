import React from 'react';
import {
  Home as HomeIcon,
  Sliders,
  PlayCircle,
  Map as MapIcon,
  BarChart3,
  ShieldAlert,
  Navigation as NavIcon,
  FileText,
  Settings
} from 'lucide-react';
import { NavTab } from '../types';

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  onOpenDataMethodology?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const primaryMenuItems = [
    { id: 'home', label: 'HOME', icon: HomeIcon },
    { id: 'scenario', label: 'SCENARIO', icon: Sliders },
    { id: 'simulation', label: 'SIMULATION', icon: PlayCircle },
    { id: 'map', label: 'FLOOD MAP', icon: MapIcon },
    { id: 'impact', label: 'FLOOD IMPACT', icon: BarChart3 },
    { id: 'response', label: 'RESPONSE', icon: ShieldAlert },
    { id: 'evacuation', label: 'EVACUATION', icon: NavIcon },
    { id: 'reports', label: 'REPORTS', icon: FileText },
  ];

  return (
    <aside style={{
      width: '220px',
      backgroundColor: '#ffffff',
      borderRight: '1px solid #DEC9A8',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '1rem 0.5rem',
      boxShadow: '2px 0 6px rgba(107,78,43,0.06)'
    }}>
      <div>
        <div style={{ padding: '0 0.75rem 0.6rem', fontSize: '0.675rem', fontWeight: 700, color: '#111111', textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>
          Workflow Navigation
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
          {primaryMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as NavTab)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.625rem 0.75rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.825rem',
                  fontWeight: isActive ? 700 : 400,
                  color: '#111111',
                  backgroundColor: isActive ? '#DEC9A8' : 'transparent',
                  border: isActive ? '1px solid #DEC9A8' : '1px solid transparent',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon style={{ width: '18px', height: '18px', color: '#6B4E2B' }} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Secondary Settings Button */}
      <div style={{ borderTop: '1px solid #DEC9A8', paddingTop: '0.75rem', marginTop: '1rem' }}>
        <button
          onClick={() => setActiveTab('system_status')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.6rem 0.75rem',
            width: '100%',
            borderRadius: '0.5rem',
            fontSize: '0.8rem',
            fontWeight: activeTab === 'system_status' ? 700 : 400,
            color: '#111111',
            backgroundColor: activeTab === 'system_status' ? '#DEC9A8' : 'transparent',
            border: activeTab === 'system_status' ? '1px solid #DEC9A8' : '1px solid transparent',
            cursor: 'pointer',
            textAlign: 'left'
          }}
        >
          <Settings style={{ width: '16px', height: '16px', color: '#6B4E2B' }} />
          <span>System Status</span>
        </button>
      </div>
    </aside>
  );
};
