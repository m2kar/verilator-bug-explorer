import { readFile } from 'fs/promises';
import { join } from 'path';
import { formatStatus } from '@/lib/format';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Issue } from '@/types/issue';

async function loadIssuesServer(): Promise<Issue[]> {
  try {
    const filePath = join(process.cwd(), 'public', 'data', 'issues.json');
    const data = await readFile(filePath, 'utf-8');
    return JSON.parse(data).issues || [];
  } catch (error) {
    console.error('Error loading issues:', error);
    return [];
  }
}

export async function generateStaticParams() {
  const issues = await loadIssuesServer();
  return issues
    .filter((issue) => issue.id != null)
    .map((issue) => ({ id: issue.id.toString() }));
}

export const dynamic = 'force-static';

export default async function IssueDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: idParam } = await params;
  const issues = await loadIssuesServer();
  const id = parseInt(idParam);
  const issue = issues.find(i => i.id === id) || null;

  if (!issue) {
    return (
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-gray-600 dark:text-gray-400">
              找不到 ID 为 {id} 的 Bug
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex-1">
                <CardTitle className="text-lg sm:text-xl">
                  <a
                    href={`https://github.com/verilator/verilator/issues/${id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#00ADD8] hover:underline"
                  >
                    #{issue.id} {issue.title}
                  </a>
                </CardTitle>
                <CardDescription className="mt-2 sm:mt-3">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                    <span className="text-sm">
                      作者: <strong>{issue.author}</strong>
                    </span>
                    <span className="hidden sm:inline">•</span>
                    <span className="text-sm">
                      {new Date(issue.createdAt).toLocaleDateString('zh-CN')}
                    </span>
                    <span className="hidden sm:inline">•</span>
                    <span className="text-sm">
                      类型: <strong>{issue.type === 'issue' ? 'Issue' : 'Pull Request'}</strong>
                    </span>
                    <span className="hidden sm:inline">•</span>
                    <div className="sm:mt-0">
                      <Badge>{formatStatus(issue.status)}</Badge>
                    </div>
                  </div>
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {issue.summary && (
          <Card>
            <CardHeader>
              <CardTitle>概览</CardTitle>
            </CardHeader>
            <CardContent>
              {typeof issue.summary === 'string' ? (
                <p>{issue.summary}</p>
              ) : (
                <div className="space-y-2">
                  {Object.entries(issue.summary).map(([key, value]) => (
                    <div key={key}>
                      {typeof value === 'object' && 'type' in value && 'reason' in value && (
                        <div>
                          <p className="font-semibold">{value.type}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{value.reason}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-4 flex items-center gap-3 flex-wrap">
                {issue.firstBuggyVersion && (
                  <div className="flex items-center gap-2">
                    <span>
                      首次发现: <strong>{issue.firstBuggyVersion}</strong>
                    </span>
                  </div>
                )}
                {issue.firstFixedVersion && (
                  <div className="flex items-center gap-2">
                    <span>
                      修复版本: <strong>{issue.firstFixedVersion}</strong>
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {issue.versions && issue.versions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>版本测试结果</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                        版本
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                        复现
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                        退出码
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                        摘要
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {issue.versions.map((versionResult, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800' : ''}>
                        <td className="px-4 py-3 font-medium">
                          {versionResult.version}
                        </td>
                        <td className="px-4 py-3">
                          {versionResult.reproduced ? (
                            <span className="text-red-500 font-semibold">是</span>
                          ) : (
                            <span className="text-green-500 font-semibold">否</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <code className="text-xs">{versionResult.exitCode}</code>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm">{versionResult.summary}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="text-sm text-gray-600 dark:text-gray-400 mt-4">
          <a
            href="/issues"
            className="text-[#00ADD8] hover:underline"
          >
            ← 返回 Bug 列表
          </a>
        </div>
      </div>
    </div>
  );
}
