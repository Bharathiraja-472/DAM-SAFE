import React, { useState, useEffect } from 'react';
import {
  LifeBuoy,
  AlertTriangle,
  Users,
  ShieldAlert,
  Navigation,
  Home,
  FileText,
  Info,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { fetchHadrReport, fetchHadrScoringMethodology } from '../services/api';

export const HadrDashboardPage: React.FC = () => {
  const [report, setReport] = useState<any>(null);
  const [methodology, setMethodology] = useState<any>(null);
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'villages' | 'evacuation' | 'routes' | 'shelters' | 'methodology'>('overview');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const rep = await fetchHadrReport('default_proto');
      const meth = await fetchHadrScoringMethodology();
      setReport(rep);
      setMethodology(meth);
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '2rem', color: '#333333', textAlign: 'center' }}>
        <LifeBuoy className="animate-spin" style={{ width: '32px', height: '32px', margin: '0 auto 1rem', color: '#333333' }} />
        <p>Loading HADR Decision Support Analytics...</p>
      </div>
    );
  }

  const summary = report?.summary_statistics || {
    total_affected_villages: 6,
    total_population_exposed: 169600,
    critical_p1_villages: 2,
    high_p2_villages: 2,
    severely_affected_roads: 1,
    operational_shelters_capacity: 4800
  };

  return (
    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', backgroundColor: 'transparent' }}>
      {/* Disclaimer Banner */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #8B6234',
        borderRadius: '0.5rem',
        padding: '1rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem'
      }}>
        <ShieldAlert style={{ width: '28px', height: '28px', color: '#333333', flexShrink: 0 }} />
        <div>
          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#111111', letterSpacing: '0.03em' }}>
            HADR DECISION SUPPORT PROTOTYPE — NOT AN OPERATIONAL EMERGENCY WARNING SYSTEM
          </div>
          <div style={{ fontSize: '0.78rem', color: '#333333', marginTop: '0.2rem' }}>
            Outputs are generated for prototype software workflow demonstration using Mettur Step 8 mixed real + prototype inputs.
          </div>
        </div>
      </div>

      {/* Title & Navigation Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111111', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <LifeBuoy style={{ width: '24px', height: '24px', color: '#333333' }} />
            HADR Impact & Evacuation Decision Support
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#333333', marginTop: '0.25rem' }}>
            Population exposure attribution, HADR priority score (0–100), transport corridor usability, and staging shelters.
          </p>
        </div>

        {/* Sub-tab Navigation */}
        <div style={{ display: 'flex', backgroundColor: '#FAFAFA', padding: '0.25rem', borderRadius: '0.5rem', border: '1px solid #DEC9A8' }}>
          {[
            { id: 'overview', label: 'Overview', icon: LifeBuoy },
            { id: 'villages', label: 'Village Priority', icon: Users },
            { id: 'evacuation', label: 'Evacuation Zones', icon: AlertTriangle },
            { id: 'routes', label: 'Route Usability', icon: Navigation },
            { id: 'shelters', label: 'Staging Shelters', icon: Home },
            { id: 'methodology', label: 'Methodology', icon: FileText }
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.4rem 0.75rem',
                  borderRadius: '0.375rem',
                  fontSize: '0.8rem',
                  fontWeight: active ? 700 : 400,
                  color: active ? '#FAFAFA' : '#8B6234',
                  backgroundColor: active ? '#8B6234' : 'transparent',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <Icon style={{ width: '14px', height: '14px' }} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
        <div className="card" style={{ padding: '1rem', borderTop: '3px solid #8B6234' }}>
          <div style={{ fontSize: '0.75rem', color: '#333333', textTransform: 'uppercase' }}>Exposed Population</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#111111', marginTop: '0.25rem' }}>
            {summary.total_population_exposed.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.68rem', color: '#333333', marginTop: '0.2rem' }}>
            Census 2011 Baseline
          </div>
        </div>

        <div className="card" style={{ padding: '1rem', borderTop: '3px solid #8B6234' }}>
          <div style={{ fontSize: '0.75rem', color: '#333333', textTransform: 'uppercase' }}>P1 Critical Settlements</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#111111', marginTop: '0.25rem' }}>
            {summary.critical_p1_villages}
          </div>
          <div style={{ fontSize: '0.68rem', color: '#333333', marginTop: '0.2rem' }}>
            Priority Score ≥ 75.0
          </div>
        </div>

        <div className="card" style={{ padding: '1rem', borderTop: '3px solid #8B6234' }}>
          <div style={{ fontSize: '0.75rem', color: '#333333', textTransform: 'uppercase' }}>P2 High Priority</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#111111', marginTop: '0.25rem' }}>
            {summary.high_p2_villages}
          </div>
          <div style={{ fontSize: '0.68rem', color: '#333333', marginTop: '0.2rem' }}>
            Priority Score 50.0–74.9
          </div>
        </div>

        <div className="card" style={{ padding: '1rem', borderTop: '3px solid #8B6234' }}>
          <div style={{ fontSize: '0.75rem', color: '#333333', textTransform: 'uppercase' }}>Severely Cut Roads</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#111111', marginTop: '0.25rem' }}>
            {summary.severely_affected_roads}
          </div>
          <div style={{ fontSize: '0.68rem', color: '#333333', marginTop: '0.2rem' }}>
            Depth &gt; 2.0m (Unpassable)
          </div>
        </div>

        <div className="card" style={{ padding: '1rem', borderTop: '3px solid #8B6234' }}>
          <div style={{ fontSize: '0.75rem', color: '#333333', textTransform: 'uppercase' }}>Staging Capacity</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#111111', marginTop: '0.25rem' }}>
            {summary.operational_shelters_capacity.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.68rem', color: '#333333', marginTop: '0.2rem' }}>
            Relief Center Beds
          </div>
        </div>
      </div>

      {/* Main Tab Content */}
      {activeSubTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
          {/* Top Priority Settlements List */}
          <div className="card" style={{ padding: '1.25rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#111111', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users style={{ width: '18px', height: '18px', color: '#333333' }} />
              Highest HADR Priority Settlements
            </h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #DEC9A8', color: '#333333', textAlign: 'left' }}>
                  <th style={{ padding: '0.5rem' }}>Settlement</th>
                  <th style={{ padding: '0.5rem' }}>Exposed Pop</th>
                  <th style={{ padding: '0.5rem' }}>Arrival</th>
                  <th style={{ padding: '0.5rem' }}>Depth</th>
                  <th style={{ padding: '0.5rem' }}>Score</th>
                  <th style={{ padding: '0.5rem' }}>Priority Rank</th>
                </tr>
              </thead>
              <tbody>
                {(report?.village_impact_results || []).map((v: any) => (
                  <tr key={v.village_id} style={{ borderBottom: '1px solid #DEC9A8' }}>
                    <td style={{ padding: '0.6rem 0.5rem', fontWeight: 600, color: '#111111' }}>{v.village_name}</td>
                    <td style={{ padding: '0.6rem 0.5rem', color: '#333333' }}>{v.population_exposure.toLocaleString()}</td>
                    <td style={{ padding: '0.6rem 0.5rem', color: '#333333' }}>+{v.min_arrival_time_hrs} hrs</td>
                    <td style={{ padding: '0.6rem 0.5rem', color: '#333333' }}>{v.max_water_depth_m} m</td>
                    <td style={{ padding: '0.6rem 0.5rem', fontWeight: 700, color: '#111111' }}>{v.priority_score}</td>
                    <td style={{ padding: '0.6rem 0.5rem' }}>
                      <span className="badge">
                        {v.priority_rank}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ fontSize: '0.72rem', color: '#666666', marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Info style={{ width: '12px', height: '12px', color: '#333333' }} />
              Population exposure estimate based on Census 2011
            </div>
          </div>

          {/* Staging Shelters Card */}
          <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#111111', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Home style={{ width: '18px', height: '18px', color: '#333333' }} />
                Relief Shelters
              </h3>
              <span className="badge">
                PROTOTYPE DATA
              </span>
            </div>
            {(report?.staging_shelters || []).map((s: any, idx: number) => (
              <div key={idx} style={{ backgroundColor: '#FAFAFA', border: '1px solid #DEC9A8', borderRadius: '0.375rem', padding: '0.75rem' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#111111' }}>{s.shelter_name}</div>
                <div style={{ fontSize: '0.75rem', color: '#333333', marginTop: '0.2rem' }}>
                  Capacity: <strong style={{ color: '#111111' }}>{s.capacity}</strong> | Occupancy: {s.current_occupancy}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#666666', marginTop: '0.2rem' }}>
                  Contact: {s.contact_person} ({s.contact_phone})
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSubTab === 'villages' && (
        <div className="card" style={{ padding: '1.25rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#111111', marginBottom: '1rem' }}>
            Village Impact & Demographics Exposure (Census 2011)
          </h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #DEC9A8', color: '#333333', textAlign: 'left' }}>
                <th style={{ padding: '0.6rem' }}>Village / Settlement</th>
                <th style={{ padding: '0.6rem' }}>District / Taluk</th>
                <th style={{ padding: '0.6rem' }}>Exposed Pop (Census 2011)</th>
                <th style={{ padding: '0.6rem' }}>Arrival Time</th>
                <th style={{ padding: '0.6rem' }}>Water Depth</th>
                <th style={{ padding: '0.6rem' }}>Velocity</th>
                <th style={{ padding: '0.6rem' }}>Severity</th>
                <th style={{ padding: '0.6rem' }}>Priority Score</th>
                <th style={{ padding: '0.6rem' }}>Priority Rank</th>
              </tr>
            </thead>
            <tbody>
              {(report?.village_impact_results || []).map((v: any) => (
                <tr key={v.village_id} style={{ borderBottom: '1px solid #DEC9A8' }}>
                  <td style={{ padding: '0.65rem 0.6rem', fontWeight: 600, color: '#111111' }}>{v.village_name}</td>
                  <td style={{ padding: '0.65rem 0.6rem', color: '#333333' }}>{v.district} / {v.taluk}</td>
                  <td style={{ padding: '0.65rem 0.6rem', color: '#111111', fontWeight: 600 }}>{v.population_exposure.toLocaleString()}</td>
                  <td style={{ padding: '0.65rem 0.6rem', color: '#333333' }}>+{v.min_arrival_time_hrs} hrs</td>
                  <td style={{ padding: '0.65rem 0.6rem', color: '#333333' }}>{v.max_water_depth_m} m</td>
                  <td style={{ padding: '0.65rem 0.6rem', color: '#333333' }}>{v.max_velocity_m_s} m/s</td>
                  <td style={{ padding: '0.65rem 0.6rem' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#111111' }}>
                      {v.severity_level}
                    </span>
                  </td>
                  <td style={{ padding: '0.65rem 0.6rem', fontWeight: 700, color: '#111111', fontSize: '0.95rem' }}>{v.priority_score}</td>
                  <td style={{ padding: '0.65rem 0.6rem' }}>
                    <span className="badge">
                      {v.priority_rank}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeSubTab === 'evacuation' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          {(report?.evacuation_zones || []).map((z: any) => (
            <div key={z.zone_code} className="card" style={{ padding: '1.25rem', borderTop: '3px solid #8B6234' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#111111' }}>{z.zone_name}</h4>
                <span className="badge">
                  {z.zone_code}
                </span>
              </div>
              <div style={{ margin: '0.75rem 0', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.3rem', color: '#333333' }}>
                <div>Priority Level: <strong style={{ color: '#111111' }}>{z.priority_level}</strong></div>
                <div>Area: <strong>{z.area_sq_km} sq km</strong></div>
                <div>Estimated Population: <strong>{z.est_population.toLocaleString()}</strong></div>
                <div>Earliest Arrival: <strong>+{z.min_arrival_hrs} hrs</strong></div>
                <div>Max Inundation Depth: <strong>{z.max_depth_m} m</strong></div>
              </div>
              <div style={{ fontSize: '0.7rem', color: '#666666' }}>
                Population exposure estimate based on Census 2011
              </div>
            </div>
          ))}
        </div>
      )}

      {activeSubTab === 'routes' && (
        <div className="card" style={{ padding: '1.25rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#111111', marginBottom: '1rem' }}>
            Transport Network & Evacuation Corridor Usability
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {(report?.route_analysis || []).map((r: any, idx: number) => {
              return (
                <div key={idx} style={{
                  backgroundColor: '#FAFAFA',
                  border: '1px solid #DEC9A8',
                  borderLeft: '4px solid #8B6234',
                  borderRadius: '0.5rem',
                  padding: '1rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.5rem'
                }}>
                  <div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#111111' }}>{r.road_name}</div>
                    <div style={{ fontSize: '0.78rem', color: '#333333', marginTop: '0.2rem' }}>
                      Type: {r.road_type} | Max Water Depth: <strong>{r.max_water_depth_m} m</strong> ({r.passable_status})
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#333333', marginTop: '0.25rem' }}>
                      Alternative Routing: {r.alternative_route_info}
                    </div>
                  </div>
                  <span className="badge">
                    {r.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeSubTab === 'shelters' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{
            backgroundColor: '#ffffff',
            border: '1px solid #8B6234',
            borderRadius: '0.5rem',
            padding: '0.75rem 1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <Info style={{ width: '20px', height: '20px', color: '#333333' }} />
            <div style={{ fontSize: '0.82rem', color: '#333333' }}>
              <strong style={{ color: '#111111' }}>DUMMY DATA — PROTOTYPE ONLY:</strong> Staging shelters below are synthetic test records for pipeline software verification and do not represent active disaster management declarations.
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
            {(report?.staging_shelters || []).map((s: any, idx: number) => (
              <div key={idx} className="card" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#111111' }}>{s.shelter_name}</h4>
                  <span className="badge">
                    PROTOTYPE DATA
                  </span>
                </div>
                <div style={{ margin: '0.75rem 0', fontSize: '0.85rem', color: '#333333', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <div>District / Taluk: <strong>{s.district} / {s.taluk}</strong></div>
                  <div>Capacity: <strong style={{ color: '#111111' }}>{s.capacity} beds</strong></div>
                  <div>Current Occupancy: <strong>{s.current_occupancy}</strong></div>
                  <div>Contact Officer: <strong>{s.contact_person}</strong></div>
                  <div>Helpline: <strong>{s.contact_phone}</strong></div>
                </div>
                <div style={{ fontSize: '0.72rem', color: '#111111', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <CheckCircle style={{ width: '12px', height: '12px', color: '#333333' }} />
                  Status: {s.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSubTab === 'methodology' && (
        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#111111' }}>
              {methodology?.title || 'HADR Priority Score Methodology (0–100)'}
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#333333', marginTop: '0.3rem' }}>
              Transparent mathematical risk indexing based on normalized hydraulic severity, population exposure, and infrastructure importance.
            </p>
          </div>

          <div style={{ backgroundColor: '#FAFAFA', border: '1px solid #DEC9A8', borderRadius: '0.5rem', padding: '1rem' }}>
            <div style={{ fontSize: '0.8rem', color: '#666666', textTransform: 'uppercase', fontWeight: 600 }}>Mathematical Formula</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111111', fontFamily: 'monospace', margin: '0.5rem 0' }}>
              {methodology?.formula || 'Score = 100 * (0.25 * R_d + 0.20 * R_v + 0.25 * R_a + 0.15 * R_p + 0.15 * R_i)'}
            </div>
            <div style={{ fontSize: '0.82rem', color: '#333333', fontFamily: 'monospace' }}>
              {methodology?.arrival_time_factor || 'R_a = 1.0 - min(1.0, arrival_hrs / 3.0)'}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#111111', marginBottom: '0.5rem' }}>Weighting Factors</h4>
              <ul style={{ fontSize: '0.82rem', color: '#333333', display: 'flex', flexDirection: 'column', gap: '0.3rem', paddingLeft: '1.2rem' }}>
                <li>Depth Weight ($w_d$): <strong>25% (0.25)</strong></li>
                <li>Velocity Weight ($w_v$): <strong>20% (0.20)</strong></li>
                <li>Arrival Time Weight ($w_a$): <strong>25% (0.25)</strong> — <em>1 - normalized arrival time</em></li>
                <li>Population Weight ($w_p$): <strong>15% (0.15)</strong></li>
                <li>Infrastructure Weight ($w_i$): <strong>15% (0.15)</strong></li>
              </ul>
            </div>

            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#111111', marginBottom: '0.5rem' }}>Priority Classification Thresholds</h4>
              <ul style={{ fontSize: '0.82rem', color: '#333333', display: 'flex', flexDirection: 'column', gap: '0.3rem', paddingLeft: '1.2rem' }}>
                <li><strong style={{ color: '#111111' }}>75.0 – 100.0:</strong> P1 CRITICAL (Immediate Evacuation)</li>
                <li><strong style={{ color: '#111111' }}>50.0 – 74.9:</strong> P2 HIGH (High Priority Evacuation)</li>
                <li><strong style={{ color: '#111111' }}>25.0 – 49.9:</strong> P3 MODERATE (Precautionary Advisory)</li>
                <li><strong style={{ color: '#111111' }}>0.0 – 24.9:</strong> P4 LOW (Monitoring / Alert)</li>
              </ul>
            </div>
          </div>

          <div style={{ fontSize: '0.78rem', color: '#666666', borderTop: '1px solid #DEC9A8', paddingTop: '0.75rem' }}>
            Detailed documentation available in <code style={{ color: '#333333' }}>models/mettur/docs/HADR_PRIORITY_METHODOLOGY.md</code>
          </div>
        </div>
      )}
    </div>
  );
};
