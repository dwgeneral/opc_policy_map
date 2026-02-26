import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { Policy, Park } from '@/types';

const DATA_DIR = path.join(process.cwd(), 'data');

// ─── Policies ──────────────────────────────────────────────────────────────

export function getAllPolicies(): Policy[] {
  const policiesDir = path.join(DATA_DIR, 'policies');
  const policies: Policy[] = [];

  const cities = fs.readdirSync(policiesDir).filter((name) => {
    const fullPath = path.join(policiesDir, name);
    return fs.statSync(fullPath).isDirectory();
  });

  for (const city of cities) {
    const cityDir = path.join(policiesDir, city);
    const files = fs.readdirSync(cityDir).filter((f) => f.endsWith('.yaml') || f.endsWith('.yml'));

    for (const file of files) {
      try {
        const content = fs.readFileSync(path.join(cityDir, file), 'utf8');
        const policy = yaml.load(content) as Policy;
        if (policy && policy.id) {
          policies.push(policy);
        }
      } catch (err) {
        console.warn(`Failed to parse policy file: ${city}/${file}`, err);
      }
    }
  }

  // Sort by publish_date descending (newest first)
  return policies.sort((a, b) =>
    new Date(b.publish_date).getTime() - new Date(a.publish_date).getTime()
  );
}

export function getPolicyById(id: string): Policy | null {
  const all = getAllPolicies();
  return all.find((p) => p.id === id) ?? null;
}

export function getPoliciesByCity(city: string): Policy[] {
  return getAllPolicies().filter((p) => p.city === city);
}

export function getActivePolicies(): Policy[] {
  return getAllPolicies().filter((p) => p.status === 'active');
}

export function getAllCities(): string[] {
  const policies = getAllPolicies();
  return [...new Set(policies.map((p) => p.city))].sort();
}

export function getAllTags(): string[] {
  const policies = getAllPolicies();
  const tagSet = new Set<string>();
  policies.forEach((p) => p.tags?.forEach((t) => tagSet.add(t)));
  return [...tagSet].sort();
}

export function getCityStats(): Record<string, { total: number; active: number }> {
  const policies = getAllPolicies();
  const stats: Record<string, { total: number; active: number }> = {};

  for (const policy of policies) {
    if (!stats[policy.city]) {
      stats[policy.city] = { total: 0, active: 0 };
    }
    stats[policy.city].total++;
    if (policy.status === 'active') {
      stats[policy.city].active++;
    }
  }
  return stats;
}

// ─── Parks ─────────────────────────────────────────────────────────────────

export function getAllParks(): Park[] {
  const parksDir = path.join(DATA_DIR, 'parks');
  const parks: Park[] = [];

  if (!fs.existsSync(parksDir)) return parks;

  const files = fs.readdirSync(parksDir).filter((f) => f.endsWith('.yaml') || f.endsWith('.yml'));

  for (const file of files) {
    try {
      const content = fs.readFileSync(path.join(parksDir, file), 'utf8');
      const park = yaml.load(content) as Park;
      if (park && park.id) {
        parks.push(park);
      }
    } catch (err) {
      console.warn(`Failed to parse park file: ${file}`, err);
    }
  }

  return parks;
}

export function getParkById(id: string): Park | null {
  return getAllParks().find((p) => p.id === id) ?? null;
}

// ─── Stats ─────────────────────────────────────────────────────────────────

export function getSiteStats() {
  const policies = getAllPolicies();
  const parks = getAllParks();
  const cities = new Set(policies.map((p) => p.city));

  return {
    totalPolicies: policies.length,
    activePolicies: policies.filter((p) => p.status === 'active').length,
    totalCities: cities.size,
    totalParks: parks.length,
  };
}
