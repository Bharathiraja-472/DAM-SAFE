import React from 'react';
import { Layers, Info } from 'lucide-react';

interface PlaceholderPageProps {
  title: string;
  subtitle: string;
  icon: any;
  targetStep: string;
  description: string;
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({
  title,
  subtitle,
  icon: Icon,
  targetStep,
  description
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '850px' }}>
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Icon style={{ color: '#18B6D9', width: '24px', height: '24px' }} />
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc' }}>
                {title}
              </h2>
              <p style={{ fontSize: '0.825rem', color: '#a3c2de' }}>
                {subtitle}
              </p>
            </div>
          </div>
          <span className="badge">TARGET: {targetStep}</span>
        </div>
      </div>

      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#a3c2de', fontSize: '0.875rem' }}>
          <Info style={{ width: '18px', height: '18px', color: '#18B6D9' }} />
          <span>Module Scope & Planned Integration</span>
        </div>
        <p style={{ fontSize: '0.875rem', color: '#a3c2de', lineHeight: '1.6' }}>
          {description}
        </p>
        <div style={{ backgroundColor: '#071524', border: '1px solid #184169', borderRadius: '0.375rem', padding: '1rem', fontSize: '0.8rem', color: '#6b8fae' }}>
          <strong>Step 1 Foundation Status:</strong> UI navigation, API contracts, and metadata abstraction structure are fully wired. This module will ingest live GIS/spatial layers and PostGIS tables as planned in subsequent rollout steps.
        </div>
      </div>
    </div>
  );
};
