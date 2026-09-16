import React, { useState, useEffect } from 'react';
import { CheckCircle2, Loader2, ArrowRight, MapPin, PlayCircle } from 'lucide-react';

interface SimulationProgressPageProps {
  runId: string;
  onComplete: () => void;
}

export const SimulationProgressPage: React.FC<SimulationProgressPageProps> = ({ runId, onComplete }) => {
  const [progress, setProgress] = useState<number>(15);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const steps = [
    'Preparing terrain and DEM elevation model...',
    'Preparing reservoir initial storage conditions...',
    'Creating dam breach geometry & failure sequence...',
    'Calculating downstream hydraulic flood wave propagation...',
    'Generating flood inundation depth & velocity map...'
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setIsCompleted(true);
          return 100;
        }
        const next = prev + 20;
        if (next >= 40 && next < 60) setCurrentStep(1);
        else if (next >= 60 && next < 80) setCurrentStep(2);
        else if (next >= 80 && next < 95) setCurrentStep(3);
        else if (next >= 95) setCurrentStep(4);
        return next;
      });
    }, 500);

    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{
      padding: '3rem 1.5rem',
      maxWidth: '700px',
      margin: '2rem auto 0',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '2rem'
    }}>
      <div className="card" style={{ width: '100%', padding: '2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111111', margin: '0 0 0.4rem' }}>
            {isCompleted ? 'SIMULATION COMPLETE' : 'RUNNING FLOOD SIMULATION'}
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#333333', margin: 0 }}>
            {isCompleted
              ? 'Downstream hydraulic wave propagation and spatial inundation computed successfully.'
              : `Processing Mettur Dam-break scenario (Run ID: ${runId})`}
          </p>
        </div>

        {/* Progress Bar */}
        <div style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, color: '#333333', marginBottom: '0.5rem' }}>
            <span>Estimated Progress</span>
            <span style={{ color: '#111111' }}>{progress}%</span>
          </div>
          <div style={{ width: '100%', height: '10px', backgroundColor: '#FAFAFA', borderRadius: '9999px', overflow: 'hidden', border: '1px solid #DEC9A8' }}>
            <div style={{
              width: `${progress}%`,
              height: '100%',
              backgroundColor: '#6B4E2B',
              borderRadius: '9999px',
              transition: 'width 0.4s ease'
            }}></div>
          </div>
        </div>

        {/* Step-by-step Execution List */}
        <div style={{ width: '100%', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '0.75rem', backgroundColor: '#FAFAFA', padding: '1.25rem', borderRadius: '0.5rem', border: '1px solid #DEC9A8' }}>
          {steps.map((label, idx) => {
            const isDone = idx < currentStep || isCompleted;
            const isCurrent = idx === currentStep && !isCompleted;
            return (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem' }}>
                {isDone ? (
                  <CheckCircle2 style={{ width: '18px', height: '18px', color: '#333333', flexShrink: 0 }} />
                ) : isCurrent ? (
                  <Loader2 className="animate-spin" style={{ width: '18px', height: '18px', color: '#333333', flexShrink: 0 }} />
                ) : (
                  <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '2px solid #DEC9A8', flexShrink: 0 }}></div>
                )}
                <span style={{
                  color: isDone ? '#6B4E2B' : isCurrent ? '#8B6234' : '#A07850',
                  fontWeight: isCurrent || isDone ? 600 : 400
                }}>
                  {label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Completion Action */}
        {isCompleted && (
          <button
            onClick={onComplete}
            className="btn-primary"
            style={{
              padding: '0.9rem',
              fontSize: '0.95rem'
            }}
          >
            <span>VIEW FLOOD ANIMATION</span>
            <ArrowRight style={{ width: '18px', height: '18px' }} />
          </button>
        )}
      </div>
    </div>
  );
};

