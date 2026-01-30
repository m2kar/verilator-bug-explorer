import { Issue, Version } from '@/types';

export async function loadIssues(): Promise<Issue[]> {
  try {
    const response = await fetch('/api/issues', { next: { revalidate: 60 } });
    const data = await response.json();
    return data.issues || [];
  } catch (error) {
    console.error('Error loading issues:', error);
    return [];
  }
}

export async function loadVersions(): Promise<Version[]> {
  try {
    const response = await fetch('/api/versions', { next: { revalidate: 60 } });
    return await response.json();
  } catch (error) {
    console.error('Error loading versions:', error);
    return [];
  }
}

export async function getIssueById(id: number): Promise<Issue | null> {
  const issues = await loadIssues();
  return issues.find(i => i.id === id) || null;
}
