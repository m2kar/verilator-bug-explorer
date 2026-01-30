'use client';

import { useState, useEffect } from 'react';
import { Github, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { loadIssues } from '@/lib/data';
import type { Issue } from '@/types/issue';

export default function MatrixPage() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const data = await loadIssues();
        setIssues(data);
      } catch (error) {
        console.error('Failed to load issues:', error);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const versions = [
    'v5.044', 'v5.042', 'v5.040', 'v5.038', 'v5.036', 'v5.034',
    'v5.032', 'v5.030', 'v5.028', 'v5.026', 'v5.024', 'v5.020',
    'v5.018', 'v5.014', 'v5.012', 'v5.010', 'v5.008', 'v5.006', 'v5.002',
    'v4.224', 'v4.220', 'v4.216', 'v4.212', 'v4.202', 'v4.108', 'v4.100',
    'v4.036', 'v4.028', 'v4.020', 'v4.016',
  ];

  const getCellColor = (issue: Issue, version: string): string => {
    const versionResult = issue.versions.find(v => v.version === version);
    if (!versionResult) return 'bg-gray-200 dark:bg-gray-800';
    
    if (versionResult?.reproduced) return 'bg-red-500 dark:bg-red-400';
    return 'bg-white dark:bg-gray-800';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-zinc-100">
        版本矩阵
      </h1>
      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4">
        点击单元格查看 Bug 详情，红色表示有 Bug，灰色表示无 Bug
      </p>
      
      {loading ? (
        <div className="flex h-[400px] items-center justify-center">
          <Github className="h-8 w-8 text-gray-400 animate-spin" />
          <p>加载中...</p>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Bug × 版本</CardTitle>
            <CardDescription>
              {issues.length} 个 Bug × {versions.length} 个版本
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[800px]">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Bug</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">版本 (新→旧)</th>
                  {versions.map((version) => (
                    <th key={version} className="px-3 py-3 text-left font-medium text-gray-600 dark:text-gray-400">
                      {version}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {issues.slice(0, 100).map((issue) => (
                  <tr key={issue.id}>
                    <td className="font-medium font-semibold text-gray-900 dark:text-gray-100">
                      <a
                        href={'/issue/' + issue.id}
                        className="text-[#00ADD8] hover:underline"
                      >
                        {issue.id}
                      </a>
                    </td>
                    {versions.map((version) => (
                      <td
                        key={version}
                        className={`cursor-pointer transition-colors hover:bg-gray-100 dark:hover:bg-gray-200 ${getCellColor(issue, version)}`}
                        onClick={() => window.location.href = '/issue/' + issue.id}
                      >
                        {issue.versions.find(v => v.version === version)?.reproduced && (
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
