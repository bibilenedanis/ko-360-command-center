import type { ReportOutput } from "../report-output.schema";

export interface SnapshotDiff {
  path: string;
  type: "changed" | "missing" | "extra";
  expected?: unknown;
  actual?: unknown;
}

export interface SnapshotReport {
  match: boolean;
  diffs: SnapshotDiff[];
  summary: {
    changed: number;
    missing: number;
    extra: number;
    total: number;
  };
}

export function compareReportOutput(
  expected: ReportOutput,
  actual: ReportOutput,
): SnapshotReport {
  const diffs: SnapshotDiff[] = [];

  compareValues(expected, actual, "", diffs);

  return {
    match: diffs.length === 0,
    diffs,
    summary: {
      changed: diffs.filter((d) => d.type === "changed").length,
      missing: diffs.filter((d) => d.type === "missing").length,
      extra: diffs.filter((d) => d.type === "extra").length,
      total: diffs.length,
    },
  };
}

function compareValues(
  expected: unknown,
  actual: unknown,
  path: string,
  diffs: SnapshotDiff[],
): void {
  if (expected === actual) return;

  if (expected === null || expected === undefined) {
    if (actual !== null && actual !== undefined) {
      diffs.push({ path: path || "root", type: "extra", actual });
    }
    return;
  }

  if (actual === null || actual === undefined) {
    diffs.push({ path: path || "root", type: "missing", expected });
    return;
  }

  if (typeof expected !== typeof actual) {
    diffs.push({ path, type: "changed", expected, actual });
    return;
  }

  if (Array.isArray(expected)) {
    if (!Array.isArray(actual)) {
      diffs.push({ path, type: "changed", expected, actual });
      return;
    }

    const maxLen = Math.max(expected.length, actual.length);
    for (let i = 0; i < maxLen; i++) {
      const itemPath = `${path}[${i}]`;
      if (i >= expected.length) {
        diffs.push({ path: itemPath, type: "extra", actual: actual[i] });
      } else if (i >= actual.length) {
        diffs.push({ path: itemPath, type: "missing", expected: expected[i] });
      } else {
        compareValues(expected[i], actual[i], itemPath, diffs);
      }
    }
    return;
  }

  if (typeof expected === "object") {
    if (typeof actual !== "object") {
      diffs.push({ path, type: "changed", expected, actual });
      return;
    }

    const expectedObj = expected as Record<string, unknown>;
    const actualObj = actual as Record<string, unknown>;

    for (const key of Object.keys(expectedObj)) {
      const fieldPath = path ? `${path}.${key}` : key;
      if (!(key in actualObj)) {
        diffs.push({ path: fieldPath, type: "missing", expected: expectedObj[key] });
      } else {
        compareValues(expectedObj[key], actualObj[key], fieldPath, diffs);
      }
    }

    for (const key of Object.keys(actualObj)) {
      const fieldPath = path ? `${path}.${key}` : key;
      if (!(key in expectedObj)) {
        diffs.push({ path: fieldPath, type: "extra", actual: actualObj[key] });
      }
    }

    return;
  }

  if (expected !== actual) {
    diffs.push({ path, type: "changed", expected, actual });
  }
}

export function formatSnapshotReport(report: SnapshotReport): string {
  if (report.match) {
    return "Snapshot match: No differences found.";
  }

  const lines: string[] = [];
  lines.push(`Snapshot mismatch: ${report.summary.total} difference(s)`);
  lines.push(`  Changed: ${report.summary.changed}`);
  lines.push(`  Missing: ${report.summary.missing}`);
  lines.push(`  Extra:   ${report.summary.extra}`);
  lines.push("");

  for (const diff of report.diffs) {
    const icon = diff.type === "changed" ? "~" : diff.type === "missing" ? "-" : "+";
    lines.push(`  [${icon}] ${diff.path}`);
    if (diff.type === "changed") {
      lines.push(`      expected: ${JSON.stringify(diff.expected)}`);
      lines.push(`      actual:   ${JSON.stringify(diff.actual)}`);
    } else if (diff.type === "missing") {
      lines.push(`      expected: ${JSON.stringify(diff.expected)}`);
    } else {
      lines.push(`      actual:   ${JSON.stringify(diff.actual)}`);
    }
  }

  return lines.join("\n");
}
