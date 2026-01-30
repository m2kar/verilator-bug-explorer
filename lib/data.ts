import { Issue, Version } from '@/types';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function loadIssues(): Promise<Issue[]> {
  try {
    const filePath = join(process.cwd(), 'public', 'data', 'issues.json');
    const data = await readFile(filePath, 'utf-8');
    return JSON.parse(data).issues || [];
  } catch (error) {
    console.error('Error loading issues:', error);
    return [];
  }
}

export async function loadVersions(): Promise<Version[]> {
  try {
    const filePath = join(process.cwd(), 'public', 'data', 'versions.json');
    const data = await readFile(filePath, 'utf-8');
    return JSON.parse(data) || [];
  } catch (error) {
    console.error('Error loading versions:', error);
    return [];
  }
}

export async function getIssueById(id: number): Promise<Issue | null> {
  const issues = await loadIssues();
  return issues.find(i => i.id === id) || null;
}
