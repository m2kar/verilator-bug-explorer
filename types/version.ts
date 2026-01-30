export interface Version {
  tag: string;
  commitDate: string;
  buildStatus: 'built' | 'failed';
}
