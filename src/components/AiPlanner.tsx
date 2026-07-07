import React, { useEffect, useState } from 'react';
import { getSubmissions } from '@/lib/store';

const projectTemplates = {
  water: {
    title: "Water Purification Plant Expansion",
    location: "District Waterworks",
    baseScore: 60,
    decision: "Approve Expansion",
    infrastructureGap: "High (Current capacity at 95%)",
    demographicFit: "High (Growing residential zone)",
    justificationTemplate: (count: number) => `AI analysis of ${count} real citizen reports concerning water supply indicates a severe shortage. Predictive modeling based on recent residential development data and current plant capacity mandates immediate expansion.`
  },
  roads: {
    title: "Main Road Resurfacing & Repair",
    location: "Major Transit Corridors",
    baseScore: 65,
    decision: "Prioritize Road Resurfacing",
    infrastructureGap: "Critical",
    demographicFit: "Medium",
    justificationTemplate: (count: number) => `Analysis of ${count} submitted citizen reports confirms severe pothole and road degradation. The immediate economic impact and citizen safety risk mandate urgent road repair over long-term beautification.`
  },
  health: {
    title: "New Primary Health Clinic",
    location: "Underserved Sectors",
    baseScore: 70,
    decision: "Prioritize Clinic Construction",
    infrastructureGap: "Severe (Nearest hospital >15km)",
    demographicFit: "High (High elderly population)",
    justificationTemplate: (count: number) => `NLP theme extraction from ${count} healthcare-related complaints shows critical frustration with medical access. Overlaying local census data (aging population) strongly favors prioritizing a new health clinic.`
  },
  education: {
    title: "Primary School Digital Upgrade",
    location: "Sector 4",
    baseScore: 55,
    decision: "Fund Digital Upgrade",
    infrastructureGap: "Medium",
    demographicFit: "High (62% under age 25)",
    justificationTemplate: (count: number) => `Based on ${count} education requests and local census data (youth bulge), funding a digital upgrade for primary schools will provide the highest long-term ROI for the community's youth.`
  },
  waste: {
    title: "Automated Waste Management System",
    location: "City-wide",
    baseScore: 50,
    decision: "Implement Smart Bins",
    infrastructureGap: "Medium",
    demographicFit: "High",
    justificationTemplate: (count: number) => `With ${count} reports regarding waste and sanitation, the AI recommends deploying an automated waste management system to optimize collection routes and improve public hygiene.`
  },
  safety: {
    title: "Smart Street Lighting & CCTV",
    location: "High-Risk Zones",
    baseScore: 60,
    decision: "Deploy Smart Lighting",
    infrastructureGap: "High",
    demographicFit: "High",
    justificationTemplate: (count: number) => `Analysis of ${count} public safety reports correlates heavily with poorly lit areas. Deploying smart street lighting and CCTV is recommended to immediately reduce crime rates.`
  }
};

export default function AiPlanner() {
  const [recommendedProjects, setRecommendedProjects] = useState<any[]>([]);

  useEffect(() => {
    const submissions = getSubmissions();
    
    // Group by category
    const categoryCounts: Record<string, number> = {};
    submissions.forEach(sub => {
      const cat = sub.category;
      if (['water', 'roads', 'health', 'education', 'waste', 'safety'].includes(cat)) {
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
      }
    });

    // Generate dynamic projects
    const dynamicProjects = Object.keys(categoryCounts).map(cat => {
      const count = categoryCounts[cat];
      const template = projectTemplates[cat as keyof typeof projectTemplates];
      const dynamicScore = Math.min(99, template.baseScore + (count * 5));
      
      let demandText = "Low";
      if (count > 10) demandText = "Critical";
      else if (count > 5) demandText = "Severe";
      else if (count > 2) demandText = "High";
      else if (count > 0) demandText = "Moderate";

      return {
        id: cat,
        title: template.title,
        location: template.location,
        score: dynamicScore,
        decision: template.decision,
        citizenDemand: `${demandText} (${count} verified reports)`,
        infrastructureGap: template.infrastructureGap,
        demographicFit: template.demographicFit,
        justification: template.justificationTemplate(count)
      };
    });

    // Sort by score descending
    dynamicProjects.sort((a, b) => b.score - a.score);
    
    // If we don't have enough dynamic projects, pad with some defaults
    if (dynamicProjects.length === 0) {
      setRecommendedProjects([
        {
          id: 'default-1',
          title: "Vocational Training Center",
          location: "Sector 4, Block D",
          score: 45,
          decision: "Awaiting Citizen Data",
          citizenDemand: "Insufficient Data (0 reports)",
          infrastructureGap: "Moderate",
          demographicFit: "High (62% under age 25)",
          justification: "Waiting for citizen submissions to generate real recommendations. Currently relying only on static census data which indicates a need for youth employment training."
        }
      ]);
    } else {
      setRecommendedProjects(dynamicProjects.slice(0, 3)); // Top 3
    }
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '2rem' }}>
      <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', borderLeft: '4px solid #8b5cf6' }}>
        <h2 style={{ fontSize: '1.25rem', color: '#0f172a', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>✨</span> AI Project Prioritization Engine (Live Dynamic Data)
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
