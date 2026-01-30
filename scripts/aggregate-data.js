const fs = require('fs');
const path = require('path');
const { readdir } = require('fs').promises;

function readVersions() {
  const versionsJson = fs.readFileSync('builds/versions.jsonl', 'utf-8');
  const versions = versionsJson.trim().split('\n').map(line => {
    if (!line.trim()) return null;
    try {
      const data = JSON.parse(line);
      return {
        tag: data.tag,
        commitDate: data.commit_date,
        buildStatus: data.build_status?.built ? 'built' : 'failed'
      };
    } catch (e) {
      console.error('Failed to parse version line:', line);
      return null;
    }
  }).filter(Boolean);
  
  versions.sort((a, b) => b.tag.localeCompare(a.tag));
  return versions;
}

function readIssue(issueDir) {
  const statusPath = path.join(issueDir, 'status.json');
  const issueJsonPath = path.join(issueDir, 'issue.json');
  const resultCsvPath = path.join(issueDir, 'result.csv');
  
  if (!fs.existsSync(statusPath)) return null;
  
  let status;
  try {
    status = JSON.parse(fs.readFileSync(statusPath, 'utf-8'));
  } catch (e) {
    console.error(`Failed to parse ${statusPath}:`, e.message);
    return null;
  }
  
  const skipStatuses = ['pending', 'fetching_issue', 'analyzing_issue', 'testing_single', 'testing_all'];
  if (skipStatuses.includes(status.status)) return null;
  
  const issue = {
    id: status.number,
    status: status.status,
    type: status.type,
    labels: [],
    createdAt: status.created_at,
    author: '',
    title: '',
    summary: status.summary || '',
    firstBuggyVersion: status.steps?.test_all_versions?.first_buggy_version || null,
    firstFixedVersion: status.steps?.test_all_versions?.first_fixed_version || null,
    versions: []
  };
  
  if (fs.existsSync(issueJsonPath)) {
    try {
      const issueJson = JSON.parse(fs.readFileSync(issueJsonPath, 'utf-8'));
      issue.title = issueJson.title;
      issue.author = issueJson.author?.login || '';
      issue.labels = issueJson.labels?.map(l => l.name) || [];
    } catch (e) {
      console.error(`Failed to parse ${issueJsonPath}:`, e.message);
    }
  }
  
  if (fs.existsSync(resultCsvPath)) {
    const csv = fs.readFileSync(resultCsvPath, 'utf-8');
    const lines = csv.trim().split('\n');
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const parts = [];
      let current = '';
      let inQuotes = false;
      
      for (let j = 0; j < line.length; j++) {
        const char = line[j];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          parts.push(current);
          current = '';
        } else {
          current += char;
        }
      }
      parts.push(current);
      
      const number = parts[0] || '';
      const type = parts[1] || '';
      const version = parts[2] || '';
      const reproduced = parts[3] || '';
      const exitCode = parts[4] || '0';
      const summary = parts[5] || '';
      
      issue.versions.push({
        version: version.replace(/^"|"$/g, ''),
        reproduced: reproduced.trim().toLowerCase() === 'true',
        exitCode: parseInt(exitCode) || 0,
        summary: summary.replace(/^"|"$/g, '')
      });
    }
  }
  
  return issue;
}

async function main() {
  console.log('Starting data aggregation...');
  
  const issuesDir = process.cwd();
  const dirs = (await readdir(issuesDir))
    .filter(name => name.match(/^issue_\d+$/))
    .map(name => path.join(issuesDir, name));
  
  console.log(`Found ${dirs.length} issue directories`);
  
  const issues = [];
  let errorCount = 0;
  for (const dir of dirs) {
    const issue = readIssue(dir);
    if (issue) {
      issues.push(issue);
    } else {
      errorCount++;
    }
  }
  
  console.log(`Processed ${issues.length} valid issues, ${errorCount} errors`);
  
  const versions = readVersions();
  console.log(`Loaded ${versions.length} versions`);
  
  const output = {
    issues: issues.sort((a, b) => b.id - a.id),
    versions: versions
  };
  
  fs.mkdirSync('web/data', { recursive: true });
  fs.writeFileSync('web/data/issues.json', JSON.stringify(output, null, 2));
  fs.writeFileSync('web/data/versions.json', JSON.stringify(versions, null, 2));
  
  console.log('Data aggregation complete!');
  console.log(`- ${issues.length} issues written to web/data/issues.json`);
  console.log(`- ${versions.length} versions written to web/data/versions.json`);
}

main().catch(console.error);
