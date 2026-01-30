'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { loadIssues } from '@/lib/data';
import type { Issue } from '@/types/issue';

export default function Dashboard() {
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
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const stats = {
    total: issues.length,
    reproduceSuccess: issues.filter(i => i.status === 'reproduce_success').length,
    notBug: issues.filter(i => i.status === 'not_a_bug').length,
    noTestcase: issues.filter(i => i.status === 'no_testcase').length,
    reproduceFailed: issues.filter(i => i.status === 'reproduce_failed').length,
    pending: issues.filter(i => ['pending', 'fetching_issue', 'analyzing_issue', 'testing_single', 'testing_all'].includes(i.status)).length,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-8">
        Verilator Bug Explorer
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-400">
        探索和分析 Verilator 不同版本上的 Bug 复现情况
      </p>
      
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-pulse">
            加载中...
          </div>
        </div>
      ) : (
        <React.Fragment>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>总 Bug 数</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-[#00ADD8]">
                  {stats.total}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>复现成功</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-[#22c55e]">
                  {stats.reproduceSuccess}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>不是 Bug</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-gray-600">
                  {stats.notBug}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>无测例</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-[#f59e0b]">
                  {stats.noTestcase}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>复现失败</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-red-500">
                  {stats.reproduceFailed}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-lg text-gray-600 dark:text-gray-400">
            浏览更多 Bug 详情，访问 Bug 列表或版本矩阵
          </div>
        </React.Fragment>
      )}
    </div>
  );
}
