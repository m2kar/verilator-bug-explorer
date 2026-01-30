import { IssueStatus } from '@/types';

export function formatStatus(status: IssueStatus): string {
  const labels = {
    reproduce_success: '复现成功',
    not_a_bug: '不是 Bug',
    no_testcase: '无测例',
    reproduce_failed: '复现失败',
    pending: '待处理',
    fetching_issue: '获取中',
    analyzing_issue: '分析中',
    testing_single: '测试中',
    testing_all: '全版本测试',
  };
  return labels[status] || status;
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '未知';
  const date = new Date(dateStr);
  return date.toLocaleDateString('zh-CN');
}

export function formatRelativeDate(dateStr: string): string {
  if (!dateStr) return '未知';
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days === 0) return '今天';
  if (days === 1) return '昨天';
  if (days < 7) return `${days}天前`;
  return formatDate(dateStr);
}
