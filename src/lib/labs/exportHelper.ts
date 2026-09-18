import { LabSubmissionResult, LabDefinition } from './types';

/**
 * Escapes formula-like cells in CSV exports to prevent CSV formula injection attacks
 */
export function escapeCsvCell(val: unknown): string {
  if (val === null || val === undefined) return '""';
  const str = String(val);
  // If cell starts with =, +, -, @, prefix with a single quote
  let safeStr = str;
  if (/^[=+\-@\t\r]/.test(safeStr)) {
    safeStr = `'${safeStr}`;
  }
  return `"${safeStr.replace(/"/g, '""')}"`;
}

export function downloadJson(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadCsv(
  filename: string,
  headersOrRecords: string[] | Record<string, unknown>[],
  optionalRows?: (string | number | boolean)[][]
) {
  let headers: string[] = [];
  let rows: (string | number | boolean)[][] = [];

  if (Array.isArray(headersOrRecords) && headersOrRecords.length > 0 && typeof headersOrRecords[0] === 'object' && !Array.isArray(headersOrRecords[0])) {
    const records = headersOrRecords as Record<string, unknown>[];
    headers = Object.keys(records[0]);
    rows = records.map(rec => headers.map(k => (rec[k] !== undefined && rec[k] !== null ? String(rec[k]) : '')));
  } else if (Array.isArray(headersOrRecords)) {
    headers = headersOrRecords as string[];
    rows = optionalRows || [];
  }

  const headerLine = headers.map(escapeCsvCell).join(',');
  const rowLines = rows.map(r => r.map(escapeCsvCell).join(',')).join('\n');
  const csvContent = `${headerLine}\n${rowLines}`;

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function generateReportText(lab: LabDefinition, result: LabSubmissionResult, reflectionNotes?: string): string {
  const dateStr = new Date(result.submittedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  let report = `============================================================\n`;
  report += `SKILLSGUIDE VIRTUAL LAB VERIFIED ASSESSMENT REPORT\n`;
  report += `============================================================\n\n`;
  report += `Lab: ${lab.title} (Lab #${lab.labNumber})\n`;
  report += `Domain: ${lab.domainTitle}\n`;
  report += `Verified Objective Score: ${result.serverScore} / 100\n`;
  report += `Status: ${result.passed ? 'PASSED (Competency Demonstrated)' : 'REVISION RECOMMENDED'}\n`;
  report += `Date: ${dateStr} IST\n`;
  report += `Submission Reference: ${result.attemptId}\n\n`;
  report += `------------------------------------------------------------\n`;
  report += `CRITERION BREAKDOWN\n`;
  report += `------------------------------------------------------------\n`;

  result.criterionResults.forEach((c, idx) => {
    report += `${idx + 1}. [${c.category.toUpperCase()}] ${c.name}\n`;
    report += `   Score: ${c.earned} / ${c.max} pts - ${c.passed ? 'PASSED' : 'DEFICIT'}\n`;
    report += `   Feedback: ${c.feedback}\n\n`;
  });

  if (result.authoredHints && result.authoredHints.length > 0) {
    report += `------------------------------------------------------------\n`;
    report += `AUTHORED IMPROVEMENT GUIDANCE\n`;
    report += `------------------------------------------------------------\n`;
    result.authoredHints.forEach(h => {
      report += `• ${h}\n`;
    });
    report += `\n`;
  }

  if (reflectionNotes) {
    report += `------------------------------------------------------------\n`;
    report += `LEARNER SELF-REFLECTION\n`;
    report += `------------------------------------------------------------\n`;
    report += `${reflectionNotes}\n\n`;
  }

  report += `============================================================\n`;
  report += `Learning boundary: Practice simulation, verified deterministic scoring.\n`;
  report += `Issued by SkillsGuide.in Open Learning Directory.\n`;
  report += `============================================================\n`;

  return report;
}

export function triggerPrintReport() {
  if (typeof window !== 'undefined') {
    window.print();
  }
}
