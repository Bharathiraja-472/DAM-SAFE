import React, { useState, useEffect } from 'react';
import { InteractiveMap } from '../components/Map/InteractiveMap';
import { Play, Pause, SkipBack, SkipForward, ArrowRight, Layers, Activity } from 'lucide-react';
import { fetchPrototypeTimesteps } from '../services/api';

interface FloodMapPageProps {
  activeRunId: string;
  onNavigate: (tab: any) => void;
}

export const FloodMapPage: React.FC<FloodMapPageProps> = ({ activeRunId, onNavigate }) => {
  const [timesteps, setTimesteps] = useState<any[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(3); // Default T+01:30
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    async function loadTimesteps() {
      const data = await fetchPrototypeTimesteps(activeRunId);
      if (data && Array.isArray(data.timesteps) && data.timesteps.length > 0) {
        setTimesteps(data.timesteps);
      } else {
        // Deterministic timesteps fallback
        const mockSteps = [
          { step: 0, time_hours: 0.0, label: "T+00:00 Breach Begins", max_depth_m: 0.8, max_velocity_m_s: 0.5 },
          { step: 1, time_hours: 0.5, label: "T+00:30 Downstream Reach", max_depth_m: 1.65, max_velocity_m_s: 0.9 },
          { step: 2, time_hours: 1.0, label: "T+01:00 Navavoor Reach", max_depth_m: 2.50, max_velocity_m_s: 1.3 },
          { step: 3, time_hours: 1.5, label: "T+01:30 Mettur Floodplain", max_depth_m: 3.35, max_velocity_m_s: 1.7 },
          { step: 4, time_hours: 2.0, label: "T+02:00 Inundation Peak", max_depth_m: 4.20, max_velocity_m_s: 2.1 },
          { step: 5, time_hours: 2.5, label: "T+02:30 Valley Spread", max_depth_m: 5.05, max_velocity_m_s: 2.5 },
          { step: 6, time_hours: 3.0, label: "T+03:00 Max Extent", max_depth_m: 5.90, max_velocity_m_s: 2.9 }
        ];
        setTimesteps(mockSteps);
      }
    }
    loadTimesteps();
  }, [activeRunId]);

  // Animation Playback Effect
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentStepIndex(prev => {
          if (prev >= timesteps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1200);
    }
    return () => clearInterval(interval);
  }, [isPlaying, timesteps.length]);

  const activeStepObj = timesteps[currentStepIndex] || {
    step: currentStepIndex,
    time_hours: (currentStepIndex * 0.5).toFixed(1),
    label: `T+${(currentStepIndex * 0.5).toFixed(1)}h`,
    max_depth_m: 2.85,
    max_velocity_m_s: 1.45
  };

  const formattedTimeLabel = `T+${String(Math.floor(activeStepObj.time_hours || 0)).padStart(2, '0')}:${String(Math.round(((activeStepObj.time_hours || 0) % 1) * 60)).padStart(2, '0')}`;
  const totalDurationLabel = "03:00";

  return (
    <div style={{ position: 'relative', width: '100%', height: 'calc(100vh - 60px)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Viewport Map Area */}
      <div style={{ flex: 1, position: 'relative', width: '100%', height: '100%' }}>
        <InteractiveMap activeTimestep={activeStepObj} />
      </div>

      {/* Floating Bottom Simulation Control Bar Overlay */}
      <div style={{
        position: 'absolute',
        bottom: '1.5rem',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 2000,
        width: '90%',
        maxWidth: '850px',
        backgroundColor: 'rgba(15, 14, 10, 0.92)',
        backdropFilter: 'blur(12px)',
        border: '1px solid #DEC9A8',
        borderRadius: '0.75rem',
        padding: '0.85rem 1.25rem',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.6)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem'
      }}>
        {/* Top Control Bar Row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          {/* Playback Controls & Time Display */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <button
                onClick={() => setCurrentStepIndex(prev => Math.max(0, prev - 1))}
                disabled={currentStepIndex === 0}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #DEC9A8',
                  color: '#111111',
                  borderRadius: '0.375rem',
                  padding: '0.4rem',
                  cursor: currentStepIndex === 0 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <SkipBack style={{ width: '16px', height: '16px' }} />
              </button>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                style={{
                  backgroundColor: '#6B4E2B',
                  border: 'none',
                  color: '#111111',
                  borderRadius: '0.375rem',
                  padding: '0.45rem 0.85rem',
                  cursor: 'pointer',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  boxShadow: '0 2px 8px rgba(107, 78, 43, 0.25)'
                }}
              >
                {isPlaying ? <Pause style={{ width: '16px', height: '16px' }} /> : <Play style={{ width: '16px', height: '16px' }} />}
                <span style={{ fontSize: '0.8rem' }}>{isPlaying ? 'Pause' : 'Play'}</span>
              </button>

              <button
                onClick={() => setCurrentStepIndex(prev => Math.min(timesteps.length - 1, prev + 1))}
                disabled={currentStepIndex >= timesteps.length - 1}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #DEC9A8',
                  color: '#111111',
                  borderRadius: '0.375rem',
                  padding: '0.4rem',
                  cursor: currentStepIndex >= timesteps.length - 1 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <SkipForward style={{ width: '16px', height: '16px' }} />
              </button>
            </div>

            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#333333', fontFamily: 'monospace', minWidth: '110px' }}>
              {formattedTimeLabel} / {totalDurationLabel}
            </div>
          </div>

          {/* Dynamic Hydraulics Readouts */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '0.8rem' }}>
            <div>
              <span style={{ color: '#666666', fontSize: '0.7rem' }}>Depth:</span>
              <div style={{ fontWeight: 800, color: '#111111' }}>{activeStepObj.max_depth_m} m</div>
            </div>

            <div>
              <span style={{ color: '#666666', fontSize: '0.7rem' }}>Velocity:</span>
              <div style={{ fontWeight: 800, color: '#111111' }}>{activeStepObj.max_velocity_m_s} m/s</div>
            </div>

            <div>
              <span style={{ color: '#666666', fontSize: '0.7rem' }}>Arrival Time:</span>
              <div style={{ fontWeight: 800, color: '#333333' }}>{activeStepObj.time_hours || 0.2} hr</div>
            </div>

            {/* Next Step Navigation CTA */}
            <button
              onClick={() => onNavigate('impact')}
              className="btn-primary"
              style={{ padding: '0.45rem 0.9rem', fontSize: '0.775rem', gap: '0.4rem' }}
            >
              <span>Impact Analysis</span>
              <ArrowRight style={{ width: '14px', height: '14px' }} />
            </button>
          </div>
        </div>

        {/* Timeline Slider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <input
            type="range"
            min={0}
            max={Math.max(0, timesteps.length - 1)}
            value={currentStepIndex}
            onChange={(e) => setCurrentStepIndex(parseInt(e.target.value))}
            style={{ flex: 1, accentColor: '#333333', cursor: 'pointer' }}
          />
        </div>
      </div>
    </div>
  );
};
