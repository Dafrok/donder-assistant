export const DIFFICULTY_LABELS = {
  easy: '简单',
  normal: '普通',
  hard: '困难',
  oni: '魔王',
  edit: '魔王(里)'
};

export const BRANCH_LABELS = {
  unbranched: '',
  normal: '普通',
  expert: '玄人',
  master: '达人'
};

export const DIFFICULTY_COLORS = {
  easy: '#cf202f',
  normal: '#4d7f2f',
  hard: '#005a9c',
  oni: '#8f1d4f',
  edit: '#5c2d91'
};

export const BRANCH_COLORS = {
  normal: '#667085',
  expert: '#0078d4',
  master: '#b42318'
};

export const DIFFICULTY_FILTER_OPTIONS = [
  { value: 'all', label: '全部' },
  { value: 'easy', label: '简单' },
  { value: 'normal', label: '一般' },
  { value: 'hard', label: '困难' },
  { value: 'oni', label: '魔王' },
  { value: 'edit', label: '魔王(里)' },
  { value: 'oni+edit', label: '魔王 & 魔王(里)' }
];

export function getDifficultyColor(difficulty) {
  return DIFFICULTY_COLORS[difficulty] || '#475467';
}

export function getBranchColor(branchType) {
  return BRANCH_COLORS[branchType] || '#667085';
}