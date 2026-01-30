import { Issue, Version } from '@/types';

 export async function loadIssues(): Promise<Issue[]> {
   try {
     const response = await fetch('/data/issues.json');
     if (!response.ok) {
       console.error('Failed to load issues.json:', response.status, response.statusText);
       return [];
     }
     const data = await response.json();
     console.log('Loaded issues:', data);
     return data.issues || [];
   } catch (error) {
     console.error('Error loading issues:', error);
     return [];
   }
 }

 export async function loadVersions(): Promise<Version[]> {
   try {
     const response = await fetch('/data/versions.json');
     if (!response.ok) {
       console.error('Failed to load versions.json:', response.status, response.statusText);
       return [];
     }
     const data = await response.json();
     return data || [];
   } catch (error) {
     console.error('Error loading versions:', error);
     return [];
   }
 }

export async function getIssueById(id: number): Promise<Issue | null> {
  const issues = await loadIssues();
  return issues.find(i => i.id === id) || null;
}
