import React, { useState, useEffect } from 'react';
import { ShieldAlert, AlertCircle, Info, ChevronDown, ChevronUp, ArrowRight, CheckCircle2 } from 'lucide-react';
import { fetchHadrReport, fetchHadrScoringMethodology } from '../services/api';

interface ResponsePageProps {
  activeRunId: string;
  onNavigate?: (tab: any) => void;
}

export const ResponsePage: React.FC<ResponsePageProps> = ({ activeRunId, onNavigate }) => {
  const [report, setReport] = useState<any>(null);
  const [methodology, setMethodology] = useState<any>(null);
  const [showMethodology, setShowMethodology] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const rep = await fetchHadrReport(activeRunId);
      setReport(rep);
      const meth = await fetchHadrScoringMethodology();
      setMethodology(meth);
      setLoading(false);
    }
    loadData();
  }, [activeRunId]);

  if (loading) {
    return (
      <div style={{ padding: '3rem', color: '#333333', textAlign: 'center' }}>
        <p>Loading Emergency Response Priorities...</p>
      </div>
    );
  }

  const priorityList = report?.priority_rankings || [
    { rank: 1, village_name: 'METTUR TOWN BASE', priority_class: 'P1_CRITICAL', priority_score: 80.75, arrival_time_hrs: 0.2, water_depth_m: 3.35, population_exposure: 52200 },
    { rank: 2, village_name: 'NAVAVOOR / ELLIS COLONY', priority_class: 'P1_CRITICAL', priority_score: 75.83, arrival_time_hrs: 0.6, water_depth_m: 2.80, population_exposure: 34100 },
    { rank: 3, village_name: 'PALAMALAI REACH', priority_class: 'P2_HIGH', priority_score: 64.20, arrival_time_hrs: 1.1, water_depth_m: 1.95, population_exposure: 18500 },
    { rank: 4, village_name: 'KONERIPATTI SECTOR', priority_class: 'P2_HIGH', priority_score: 52.40, arrival_time_hrs: 1.8, water_depth_m: 1.40, population_exposure: 12400 },
    { rank: 5, village_name: 'POOLAMPATTI RIVERBANK', priority_class: 'P3_MODERATE', priority_score: 38.10, arrival_time_hrs: 2.3, water_depth_m: 0.90, population_exposure: 8900 },
    { rank: 6, village_name: 'BHAVANI CONFLUENCE REACH', priority_class: 'P4_LOW', priority_score: 18.50, arrival_time_hrs: 3.0, water_depth_m: 0.45, population_exposure: 6300 }
  ];

  const p1Count = priorityList.filter((p: any) => p.priority_class === 'P1_CRITICAL').length;
  const p2Count = priorityList.filter((p: any) => p.priority_class === 'P2_HIGH').length;
  const p3Count = priorityList.filter((p: any) => p.priority_class === 'P3_MODERATE').length;
  const p4Count = priorityList.filter((p: any) => p.priority_class === 'P4_LOW').length;

  return (
    <div style={{ padding: '1.5rem', maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem', backgroundColor: 'transparent' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111111', margin: '0 0 0.3rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ShieldAlert style={{ width: '24px', height: '24px', color: '#333333' }} />
            EMERGENCY RESPONSE PRIORITIES
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#333333', margin: 0 }}>
            Categorized risk priority ranking for search, rescue, and evacuation dispatch.
          </p>
        </div>

        {onNavigate && (
          <button
            onClick={() => onNavigate('evacuation')}
            className="btn-primary"
            style={{ width: 'auto', padding: '0.6rem 1.1rem', fontSize: '0.825rem', gap: '0.5rem' }}
          >
            <span>Evacuation Plan</span>
            <ArrowRight style={{ width: '16px', height: '16px' }} />
          </button>
        )}
      </div>

      {/* Priority Summary Badges Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        <div className="card" style={{ padding: '1.25rem', borderTop: '3px solid #8B6234' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#333333' }}>P1 CRITICAL</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#111111', marginTop: '0.3rem' }}>{p1Count} Priority Areas</div>
          <div style={{ fontSize: '0.725rem', color: '#333333', marginTop: '0.2rem' }}>Immediate Evacuation (Score &ge; 75.0)</div>
        </div>

        <div className="card" style={{ padding: '1.25rem', borderTop: '3px solid #8B6234' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#333333' }}>P2 HIGH</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#111111', marginTop: '0.3rem' }}>{p2Count} Priority Areas</div>
          <div style={{ fontSize: '0.725rem', color: '#333333', marginTop: '0.2rem' }}>High Priority (Score 50.0 – 74.9)</div>
        </div>

        <div className="card" style={{ padding: '1.25rem', borderTop: '3px solid #8B6234' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#333333' }}>P3 MODERATE</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#111111', marginTop: '0.3rem' }}>{p3Count} Priority Areas</div>
          <div style={{ fontSize: '0.725rem', color: '#333333', marginTop: '0.2rem' }}>Precautionary Advisory (Score 25.0 – 49.9)</div>
        </div>

        <div className="card" style={{ padding: '1.25rem', borderTop: '3px solid #8B6234' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#333333' }}>P4 LOW</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#111111', marginTop: '0.3rem' }}>{p4Count} Priority Areas</div>
          <div style={{ fontSize: '0.725rem', color: '#333333', marginTop: '0.2rem' }}>Monitoring / Advisory (Score &lt; 25.0)</div>
        </div>
      </div>

      {/* Expandable Methodology Section */}
      <div className="card" style={{ padding: '1rem 1.25rem' }}>
        <button
          onClick={() => setShowMethodology(!showMethodology)}
          style={{
            width: '100%',
            backgroundColor: 'transparent',
            border: 'none',
            color: '#333333',
            fontSize: '0.875rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Info style={{ width: '16px', height: '16px' }} />
            <span>How is response priority calculated?</span>
          </div>
          {showMethodology ? <ChevronUp style={{ width: '18px', height: '18px' }} /> : <ChevronDown style={{ width: '18px', height: '18px' }} />}
        </button>

        {showMethodology && (
          <div style={{ marginTop: '1rem', borderTop: '1px solid #DEC9A8', paddingTop: '1rem', fontSize: '0.825rem', color: '#333333', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div>
              <strong>Multi-Criteria Priority Formula:</strong>
              <div style={{ fontFamily: 'monospace', backgroundColor: '#FAFAFA', border: '1px solid #DEC9A8', padding: '0.6rem', borderRadius: '0.375rem', marginTop: '0.35rem', color: '#111111' }}>
                Score = 100 * (0.25 * Depth + 0.20 * Velocity + 0.25 * (1 - Normalized_Arrival) + 0.15 * Population + 0.15 * Infrastructure)
              </div>
            </div>
            <p style={{ margin: 0, color: '#333333' }}>
              Earlier flood wave arrival times correctly increase urgency score (1 - normalized_arrival_time factor). Weights: Depth (25%), Velocity (20%), Arrival Time (25%), Population (15%), Infrastructure (15%).
            </p>
          </div>
        )}
      </div>

      {/* Priority Settlement Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#111111', margin: 0 }}>
          SETTLEMENT RESPONSE PRIORITY LIST
        </h3>

        {priorityList.map((item: any) => {
          return (
            <div key={item.rank} className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #8B6234', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: '#FAFAFA',
                  border: '1px solid #8B6234',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1rem',
                  color: '#111111'
                }}>
                  {item.rank}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#111111', margin: 0 }}>
                      {item.village_name}
                    </h4>
                    <span className="badge">
                      {item.priority_class?.replace('_', ' ')}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.8rem', color: '#333333', marginTop: '0.3rem', display: 'flex', gap: '1.25rem' }}>
                    <span>Arrival: <strong style={{ color: '#111111' }}>+{item.arrival_time_hrs} hr</strong></span>
                    <span>Max Depth: <strong style={{ color: '#111111' }}>{item.water_depth_m} m</strong></span>
                    <span>Population: <strong style={{ color: '#111111' }}>{item.population_exposure?.toLocaleString()}</strong></span>
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.7rem', color: '#333333', textTransform: 'uppercase' }}>Priority Score</span>
                <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#111111' }}>
                  {item.priority_score?.toFixed(2)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

