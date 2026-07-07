import React from 'react';

const recommendedProjects = [
  {
    id: 1,
    title: "Vocational Training Center vs. Primary School Upgrade",
    location: "Sector 4, Block D",
    score: 94,
    decision: "Prioritize Vocational Center",
    citizenDemand: "High (142 reports)",
    infrastructureGap: "Critical",
    demographicFit: "High (62% under age 25)",
    justification: "AI analysis of multi-modal citizen reports (voice notes & text) indicates a severe lack of local employment opportunities. Overlaying local census data (youth bulge) and the master development plan strongly favors prioritizing the Vocational Center to address immediate unemployment over the school upgrade."
  },
  {
    id: 2,
    title: "Main Road Resurfacing vs. New Public Park",
    location: "Market Road, Zone 2",
    score: 88,
    decision: "Prioritize Road Resurfacing",
    citizenDemand: "Severe (210 reports, 45 photos)",
    infrastructureGap: "High",
    demographicFit: "Medium",
    justification: "Computer vision analysis of 45 submitted photos confirms severe pothole degradation. NLP theme extraction shows high frustration affecting daily commerce. While the master plan includes a park, the immediate economic impact and citizen safety risk mandate urgent road repair."
  },
  {
    id: 3,
    title: "Water Purification Plant Expansion",
    location: "East District Waterworks",
    score: 82,
    decision: "Approve Expansion",
    citizenDemand: "Moderate (85 reports)",
    infrastructureGap: "High (Current capacity at 95%)",
    demographicFit: "High (Growing residential zone)",
    justification: "Though direct citizen complaints are moderate, predictive modeling based on recent residential development data and current plant capacity indicates a severe water shortage within 18 months if expansion is not prioritized now."
  }
];

export default function AiPlanner() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '2rem' }}>
      <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', borderLeft: '4px solid #8b5cf6' }}>
        <h2 style={{ fontSize: '1.25rem', color: '#0f172a', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>✨</span> AI Project Prioritization Engine
        </h2>
        <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.5 }}>
          The AI engine cross-references live citizen demand (voice, text, photo submissions) with local demographic data, existing infrastructure gaps, and master development plans to recommend the highest-impact projects for the constituency.
        </p>
      </div>

      <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
        {recommendedProjects.map((project) => (
          <div key={project.id} style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', color: '#0f172a', fontWeight: 700, marginBottom: '0.25rem', lineHeight: 1.3 }}>{project.title}</h3>
                <div style={{ color: '#64748b', fontSize: '0.85rem' }}>📍 {project.location}</div>
              </div>
              <div style={{ background: '#8b5cf6', color: 'white', padding: '0.4rem 0.8rem', borderRadius: '20px', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span>🎯</span> {project.score}/100
              </div>
            </div>
            
            <div style={{ padding: '1.5rem' }}>
              <div style={{ background: '#ecfdf5', color: '#059669', padding: '0.5rem 0.75rem', borderRadius: '6px', fontWeight: 600, fontSize: '0.9rem', marginBottom: '1rem', border: '1px solid #a7f3d0', display: 'inline-block' }}>
                Recommendation: {project.decision}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: '#64748b' }}>Citizen Demand:</span>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>{project.citizenDemand}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: '#64748b' }}>Infrastructure Gap:</span>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>{project.infrastructureGap}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: '#64748b' }}>Demographic Fit:</span>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>{project.demographicFit}</span>
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.5px', marginBottom: '0.5rem' }}>AI Justification</h4>
                <p style={{ fontSize: '0.9rem', color: '#334155', lineHeight: 1.5, background: '#f1f5f9', padding: '1rem', borderRadius: '8px' }}>
                  {project.justification}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
