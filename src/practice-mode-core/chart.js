const DIFF_PRIORITY = ['edit', 'oni', 'hard', 'normal', 'easy'];

function normalizeCourseKey(key) {
  const lower = String(key || '').toLowerCase();
  if (lower === '4' || lower === 'edit') return 'edit';
  if (lower === '3' || lower === 'oni') return 'oni';
  if (lower === '2' || lower === 'hard') return 'hard';
  if (lower === '1' || lower === 'normal') return 'normal';
  if (lower === '0' || lower === 'easy') return 'easy';
  return lower;
}

export function resolveMainCourse(parsed) {
  const entries = Object.entries(parsed || {});
  if (!entries.length) return null;

  const normalized = entries.map(([key, value]) => ({
    originalKey: key,
    normalizedKey: normalizeCourseKey(key),
    chart: value
  }));

  for (const wanted of DIFF_PRIORITY) {
    const hit = normalized.find((entry) => entry.normalizedKey === wanted);
    if (hit) return hit;
  }
  return normalized[0];
}

export function resolvePlayableChart(chart) {
  if (!chart) return null;

  if (chart.playerSides) {
    return chart.playerSides.p1 || chart.playerSides.player1 || Object.values(chart.playerSides)[0] || null;
  }

  return chart;
}

export function getBranchOptions(baseChart) {
  if (!baseChart?.branches) return [];
  return ['normal', 'expert', 'master'].filter((name) => Boolean(baseChart.branches[name]));
}

export function getPreferredBranchSelection(branchOptions) {
  const options = Array.isArray(branchOptions) ? branchOptions : [];
  return options.includes('master')
    ? 'master'
    : options.includes('expert')
      ? 'expert'
      : options.includes('normal')
        ? 'normal'
        : 'normal';
}

export function resolveChartByBranch(baseChart, branchSelection) {
  if (!baseChart) return null;
  if (!baseChart.branches) return baseChart;

  if (baseChart.branches[branchSelection]) {
    return baseChart.branches[branchSelection];
  }

  return baseChart.branches.master || baseChart.branches.expert || baseChart.branches.normal || Object.values(baseChart.branches)[0] || null;
}
