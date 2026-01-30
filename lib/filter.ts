import { Issue, IssueStatus } from '@/types';

export function filterByStatus(issues: Issue[], statuses: IssueStatus[]): Issue[] {
  return issues.filter(issue => statuses.includes(issue.status));
}

export function searchIssues(issues: Issue[], query: string): Issue[] {
  const lowerQuery = query.toLowerCase();
  return issues.filter(issue => 
    issue.title.toLowerCase().includes(lowerQuery) ||
    issue.summary?.toLowerCase().includes(lowerQuery)
  );
}

export function sortIssues(issues: Issue[], field: 'id' | 'date' | 'status'): Issue[] {
  return [...issues].sort((a, b) => {
    if (field === 'id') return b.id - a.id;
    if (field === 'date') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (field === 'status') return a.status.localeCompare(b.status);
    return 0;
  });
}
