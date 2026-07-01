export interface Submission {
  id: string;
  category: string;
  categoryLabel: string;
  location: string;
  lat?: number;
  lon?: number;
  description: string;
  timestamp: string;
  status: 'Pending' | 'In Progress' | 'Resolved';
  mediaType?: 'image' | 'audio' | 'none';
  adminResponse?: string;
  supports: number;
}

const generateSeedData = (): Submission[] => {
  const centerLat = 28.6139;
  const centerLon = 77.2090;
  
  const categories = [
    { id: 'roads', label: 'Roads & Infrastructure' },
    { id: 'water', label: 'Water Supply' },
    { id: 'health', label: 'Healthcare Access' },
    { id: 'waste', label: 'Waste Management' },
    { id: 'lighting', label: 'Public Lighting' },
  ];

  const descriptions = [
    "Massive potholes on the main road are causing severe traffic delays and vehicle damage.",
    "Water supply has been completely inconsistent for the last 3 days. We need immediate help.",
    "The local public clinic is out of basic medical supplies and antibiotics.",
    "Garbage has not been collected from Sector 4 for over a week. The smell is unbearable.",
    "Streetlights are broken near the central park, making it very unsafe at night.",
    "A pipeline burst near the crossroad, wasting hundreds of gallons of clean water.",
    "Road construction was left unfinished by contractors, dust is everywhere."
  ];

  const seed: Submission[] = [];
  for (let i = 0; i < 35; i++) {
    const cat = categories[Math.floor(Math.random() * categories.length)];
    const desc = descriptions[Math.floor(Math.random() * descriptions.length)];
    const statusRand = Math.random();
    let status: 'Pending' | 'In Progress' | 'Resolved' = 'Pending';
    if (statusRand > 0.85) status = 'Resolved';
    else if (statusRand > 0.6) status = 'In Progress';

    const mediaTypeRand = Math.random();
    let mediaType: 'image' | 'audio' | 'none' = 'none';
    if (mediaTypeRand > 0.6) mediaType = 'image';
    else if (mediaTypeRand > 0.3) mediaType = 'audio';

    seed.push({
      id: `seed-${i}`,
      category: cat.id,
      categoryLabel: cat.label,
      location: `Zone ${Math.floor(Math.random() * 10) + 1}, Block ${String.fromCharCode(65 + Math.floor(Math.random() * 5))}`,
      lat: centerLat + (Math.random() - 0.5) * 0.08, // Random spread around New Delhi
      lon: centerLon + (Math.random() - 0.5) * 0.08,
      description: desc,
      timestamp: new Date(Date.now() - Math.floor(Math.random() * 86400000 * 7)).toISOString(), // Last 7 days
      status,
      mediaType,
      adminResponse: status === 'Resolved' ? "We have dispatched a team and the issue is fully resolved." : (status === 'In Progress' ? "Our team is currently investigating this on site." : undefined),
      supports: Math.floor(Math.random() * 80) // Seed random upvotes
    });
  }
  
  // Sort descending by time
  return seed.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

export const getSubmissions = (): Submission[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem('safeconnect_submissions');
  if (data) {
    const parsed = JSON.parse(data);
    if (parsed.length > 0) return parsed;
  }
  
  // Initialize with seed data if empty
  const seedData = generateSeedData();
  localStorage.setItem('safeconnect_submissions', JSON.stringify(seedData));
  return seedData;
};

export const addSubmission = (submission: Omit<Submission, 'id' | 'timestamp' | 'status'>) => {
  if (typeof window === 'undefined') return 'ERR';
  const current = getSubmissions();
  const generatedId = Math.random().toString(36).substring(2, 9).toUpperCase();
  const newSubmission: Submission = {
    ...submission,
    id: generatedId,
    timestamp: new Date().toISOString(),
    status: 'Pending',
    mediaType: Math.random() > 0.5 ? 'image' : 'audio', // Mock attaching media for demo purposes
    supports: 0
  };
  localStorage.setItem('safeconnect_submissions', JSON.stringify([newSubmission, ...current]));
  return generatedId;
};

export const updateSubmissionStatus = (id: string, status: 'Pending' | 'In Progress' | 'Resolved', response?: string) => {
  if (typeof window === 'undefined') return;
  const current = getSubmissions();
  const updated = current.map(sub => {
    if (sub.id === id) {
      return { ...sub, status, adminResponse: response || sub.adminResponse };
    }
  });
  localStorage.setItem('safeconnect_submissions', JSON.stringify(updated));
};

export const supportSubmission = (id: string) => {
  if (typeof window === 'undefined') return;
  const current = getSubmissions();
  const updated = current.map(sub => {
    if (sub.id === id) {
      return { ...sub, supports: (sub.supports || 0) + 1 };
    }
    return sub;
  });
  localStorage.setItem('safeconnect_submissions', JSON.stringify(updated));
};

export const unsupportSubmission = (id: string) => {
  if (typeof window === 'undefined') return;
  const current = getSubmissions();
  const updated = current.map(sub => {
    if (sub.id === id) {
      return { ...sub, supports: Math.max(0, (sub.supports || 0) - 1) };
    }
    return sub;
  });
  localStorage.setItem('safeconnect_submissions', JSON.stringify(updated));
};
