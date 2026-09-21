import React from 'react';
import { Waves } from 'lucide-react';

interface HeaderProps {
  systemStatus?: string;
  dbStatus?: {
    type?: string;
    status?: string;
    database?: string;
  };
  onOpenDataMethodology?: () => void;
  onOpenSettings?: () => void;
}

export const Header: React.FC<HeaderProps> = () => {
  return (
    <header style={{
      height: '60px',
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #DEC9A8',
      display: 'flex',
      alignItems: 'center',
      padding: '0 1.5rem',
      zIndex: 10,
      boxShadow: '0 2px 6px rgba(107,78,43,0.08)'
    }}>
      {/* Brand Identity */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '8px',
          backgroundColor: '#6B4E2B',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(107,78,43,0.3)'
        }}>
          <Waves style={{ color: '#ffffff', width: '22px', height: '22px' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#111111', letterSpacing: '-0.02em' }}>
            Dam-Safe
          </span>
          <span style={{
            fontSize: '0.68rem',
            fontWeight: 700,
            padding: '0.15rem 0.5rem',
            borderRadius: '9999px',
            backgroundColor: 'rgba(107,78,43,0.08)',
            color: '#6B4E2B',
            border: '1px solid rgba(107,78,43,0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#D4A96A' }}></span>
            Simulation Environment
          </span>
        </div>
      </div>
    </header>
  );
};
