/**
 * 定数表的列定义和渲染工具
 */

import React from 'react';

export function getCategoryBadgeClass(category) {
  const normalized = String(category || '').trim().toLowerCase();
  if (!normalized) return '';

  if (normalized.includes('children') || normalized.includes('folk')) {
    return 'badge-children-folk';
  }
  if (normalized.includes('namco') || normalized.includes('original')) {
    return 'badge-namco-original';
  }
  if (normalized.includes('game')) {
    return 'badge-game-music';
  }
  if (normalized.includes('vocaloid')) {
    return 'badge-vocaloid';
  }
  if (normalized.includes('anime')) {
    return 'badge-anime';
  }
  if (normalized.includes('classical')) {
    return 'badge-classical';
  }
  if (normalized.includes('variety') || normalized.includes('variaty')) {
    return 'badge-variety';
  }
  if (normalized.includes('pop')) {
    return 'badge-pop';
  }

  return '';
}

export function getBranchTextClass(branch) {
  const normalized = String(branch || '').trim().toLowerCase();
  if (!normalized) return '';

  if (normalized.includes('master') || normalized.includes('达人')) {
    return 'constants-branch-master';
  }
  if (normalized.includes('expert') || normalized.includes('玄人')) {
    return 'constants-branch-expert';
  }
  if (normalized.includes('normal') || normalized.includes('普通')) {
    return 'constants-branch-normal';
  }

  return '';
}

export function getDifficultyTextClass(difficulty) {
  const normalized = String(difficulty || '').trim().toLowerCase();
  if (!normalized) return '';

  if (normalized.includes('edit') || normalized.includes('里')) {
    return 'constants-difficulty-edit';
  }
  if (normalized.includes('oni') || normalized.includes('魔王')) {
    return 'constants-difficulty-oni';
  }
  if (normalized.includes('hard') || normalized.includes('困难')) {
    return 'constants-difficulty-hard';
  }
  if (normalized.includes('normal') || normalized.includes('普通')) {
    return 'constants-difficulty-normal';
  }
  if (normalized.includes('easy') || normalized.includes('简单')) {
    return 'constants-difficulty-easy';
  }

  return '';
}

export function getNumericValue(text) {
  const normalized = String(text || '').trim().replace(/%$/, '');
  if (!normalized) return null;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

export function getConstantValueToneClass(value) {
  const numericValue = getNumericValue(value);
  if (numericValue === null) return '';
  if (numericValue <= 0) return 'constants-value-zero';
  if (numericValue >= 15) return 'constants-value-extreme';

  const step = Math.max(1, Math.min(15, Math.ceil(numericValue)));
  return `constants-value-step-${step}`;
}

