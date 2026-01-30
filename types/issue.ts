export type IssueStatus =
  | 'reproduce_success'
  | 'not_a_bug'
  | 'no_testcase'
  | 'reproduce_failed'
  | 'pending'
  | 'fetching_issue'
  | 'analyzing_issue'
  | 'testing_single'
  | 'testing_all';

export interface VersionResult {
  version: string;
  reproduced: boolean;
  exitCode: number;
  summary: string;
}

type SummaryContent = {
  type: string;
  reason: string;
};

type SummaryData = {
  not_a_bug?: SummaryContent;
  no_testcase?: SummaryContent;
  [key: string]: SummaryContent | undefined;
};

export interface Issue {
  id: number;
  title: string;
  status: IssueStatus;
  type: 'issue' | 'pull_request';
  labels: string[];
  createdAt: string;
  author: string;
  summary?: string | SummaryData;
  firstBuggyVersion?: string;
  firstFixedVersion?: string;
  versions: VersionResult[];
}
