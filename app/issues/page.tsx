'use client';

import { useState, useEffect } from 'react';
import { loadIssues } from '@/lib/data';
import { formatStatus } from '@/lib/format';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';
import type { Issue } from '@/types/issue';

export default function IssuesPage() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await loadIssues();
        setIssues(data);
      } catch (error) {
        console.error('Failed to load issues:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [searchQuery, statusFilter]);

  // Filter issues based on search query and status filter
  const filteredIssues = issues.filter((issue) => {
    const matchesSearch =
      searchQuery === '' ||
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.id.toString().includes(searchQuery);

    const matchesStatus = statusFilter === 'all' || issue.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredIssues.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentIssues = filteredIssues.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-pulse">加载中...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        Bug 列表
      </h1>
      <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-6">
        浏览所有已复现的 Verilator Bug，查看详细信息和版本测试结果
      </p>

      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="搜索 Bug 标题或编号..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="sm:w-48 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">全部状态</option>
            <option value="reproduce_success">复现成功</option>
            <option value="reproduce_failed">复现失败</option>
            <option value="not_a_bug">不是 Bug</option>
            <option value="no_testcase">无测试用例</option>
          </select>
        </div>
      </div>

       <div className="space-y-4 mb-6">
        {currentIssues.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center text-gray-600 dark:text-gray-400">
                没有找到匹配的 Bug
              </div>
            </CardContent>
          </Card>
        ) : (
          currentIssues.map((issue) => (
            <Card key={issue.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle>
                      <a
                        href={`/issue/${issue.id}`}
                        className="text-[#00ADD8] hover:underline"
                      >
                        #{issue.id} {issue.title}
                      </a>
                    </CardTitle>
                    <CardDescription className="mt-2">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span>
                          作者: <strong>{issue.author}</strong>
                        </span>
                        <span>•</span>
                        <span>
                          {new Date(issue.createdAt).toLocaleDateString('zh-CN')}
                        </span>
                        <span>•</span>
                        {issue.firstBuggyVersion && (
                          <>
                            <span>•</span>
                            <span>
                              首次发现: <strong>{issue.firstBuggyVersion}</strong>
                            </span>
                          </>
                        )}
                        {issue.firstFixedVersion && (
                          <>
                            <span>•</span>
                            <span>
                              修复版本: <strong>{issue.firstFixedVersion}</strong>
                            </span>
                          </>
                        )}
                      </div>
                    </CardDescription>
                  </div>
                  <Badge>{formatStatus(issue.status)}</Badge>
                </div>
              </CardHeader>
            </Card>
          ))
        )}
      </div>

       <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
         <div className="flex items-center gap-2 w-full sm:w-auto">
           <Button
             variant="outline"
             onClick={() => handlePageChange(currentPage - 1)}
             disabled={currentPage === 1}
             className="flex-1 sm:flex-none"
           >
             上一页
           </Button>

           <Button
             variant="outline"
             onClick={() => handlePageChange(currentPage + 1)}
             disabled={currentPage === totalPages}
             className="flex-1 sm:flex-none"
           >
             下一页
           </Button>
         </div>

         <div className="flex items-center justify-center gap-2 w-full sm:w-auto flex-wrap">
           {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
             let pageNum;
             if (totalPages <= 7) {
               pageNum = i + 1;
             } else if (currentPage <= 4) {
               pageNum = i + 1;
             } else if (currentPage >= totalPages - 3) {
               pageNum = totalPages - 6 + i;
             } else {
               pageNum = currentPage - 3 + i;
             }

             return (
               <Button
                 key={pageNum}
                 variant={currentPage === pageNum ? 'default' : 'outline'}
                 size="sm"
                 onClick={() => handlePageChange(pageNum)}
                 className="w-8 h-8 sm:w-10 sm:h-10"
               >
                 {pageNum}
               </Button>
             );
           })}
         </div>

         <div className="text-sm text-gray-600 dark:text-gray-400 sm:ml-4">
           {currentPage} / {totalPages}
         </div>
       </div>
    </div>
  );
}
