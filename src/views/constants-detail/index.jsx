import React, { useMemo } from 'react';
import {
  Breadcrumb,
  BreadcrumbButton,
  BreadcrumbDivider,
  BreadcrumbItem,
  Body1,
  Button,
  Title3
} from '@fluentui/react-components';

const CONSTANTS_MAX_VALUE = 15.5;

function getCategoryBadgeClass(category) {
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

function getDifficultyTextClass(difficulty) {
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

function getBranchTextClass(branch) {
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

function polarToCartesian(cx, cy, radius, angleDeg) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(rad),
    y: cy + radius * Math.sin(rad)
  };
}

function formatScore(value) {
  if (!Number.isFinite(value)) return '-';
  return value.toFixed(2);
}

function getHeaderCellValue(detail, headerNames) {
  const headers = Array.isArray(detail?.headers) ? detail.headers : [];
  const cells = Array.isArray(detail?.cells) ? detail.cells : [];
  if (!headers.length || !cells.length) return '';

  const normalizedHeaders = headers.map((header) => String(header || '').replace(/\s*\(\d+\)$/, '').trim());
  for (let nameIndex = 0; nameIndex < headerNames.length; nameIndex += 1) {
    const target = headerNames[nameIndex];
    for (let index = normalizedHeaders.length - 1; index >= 0; index -= 1) {
      if (normalizedHeaders[index] === target) {
        return String(cells[index] || '').trim();
      }
    }
  }
  return '';
}

function ConstantsDetailPage({ detail, onBack }) {
  const dimensions = detail?.dimensions || [];
  const fallbackTotalRaw = getHeaderCellValue(detail, ['主定数', '总定数', '定数']);
  const totalConstantRaw = String(detail?.totalConstantRaw || '').trim() || fallbackTotalRaw;
  const totalConstantNumber = Number.isFinite(detail?.totalConstant) ? detail.totalConstant : Number(totalConstantRaw);
  const totalConstantText = Number.isFinite(totalConstantNumber)
    ? formatScore(totalConstantNumber)
    : (totalConstantRaw || '-');

  const chartModel = useMemo(() => {
    if (!dimensions.length) {
      return null;
    }

    const levels = 5;
    const cx = 210;
    const cy = 210;
    const radius = 145;

    const axisPoints = dimensions.map((_, index) => {
      const angle = -90 + (360 / dimensions.length) * index;
      return polarToCartesian(cx, cy, radius, angle);
    });

    const levelPolygons = [];
    for (let level = 1; level <= levels; level += 1) {
      const ratio = level / levels;
      const points = dimensions.map((_, index) => {
        const angle = -90 + (360 / dimensions.length) * index;
        const point = polarToCartesian(cx, cy, radius * ratio, angle);
        return `${point.x},${point.y}`;
      }).join(' ');
      levelPolygons.push(points);
    }

    const valuePolygon = dimensions.map((dimension, index) => {
      const angle = -90 + (360 / dimensions.length) * index;
      const ratio = CONSTANTS_MAX_VALUE > 0 ? Math.max(0, Math.min(1, (dimension.value || 0) / CONSTANTS_MAX_VALUE)) : 0;
      const point = polarToCartesian(cx, cy, radius * ratio, angle);
      return `${point.x},${point.y}`;
    }).join(' ');

    const valuePoints = dimensions.map((dimension, index) => {
      const angle = -90 + (360 / dimensions.length) * index;
      const ratio = CONSTANTS_MAX_VALUE > 0 ? Math.max(0, Math.min(1, (dimension.value || 0) / CONSTANTS_MAX_VALUE)) : 0;
      const point = polarToCartesian(cx, cy, radius * ratio, angle);
      const textPoint = polarToCartesian(cx, cy, Math.min(radius + 16, radius * ratio + 18), angle);
      return {
        name: dimension.name,
        value: dimension.value,
        x: point.x,
        y: point.y,
        textX: textPoint.x,
        textY: textPoint.y
      };
    });

    const labels = dimensions.map((dimension, index) => {
      const angle = -90 + (360 / dimensions.length) * index;
      const point = polarToCartesian(cx, cy, radius + 24, angle);
      return {
        ...point,
        name: dimension.name,
        valueText: formatScore(dimension.value)
      };
    });

    return {
      cx,
      cy,
      levels,
      axisPoints,
      levelPolygons,
      valuePolygon,
      valuePoints,
      labels,
      maxValue: CONSTANTS_MAX_VALUE
    };
  }, [dimensions]);

  return (
    <section className="constants-detail-panel" aria-label="定数详情页面">
      <header className="list-caption" aria-label="定数详情头部">
        <Breadcrumb className="list-breadcrumb" aria-label="面包屑">
          <BreadcrumbItem>
            <BreadcrumbButton onClick={onBack}>数据分析</BreadcrumbButton>
          </BreadcrumbItem>
          <BreadcrumbDivider />
          <BreadcrumbItem>
            <BreadcrumbButton onClick={onBack}>定数表</BreadcrumbButton>
          </BreadcrumbItem>
          <BreadcrumbDivider />
          <BreadcrumbItem>
            <BreadcrumbButton className="constants-breadcrumb-song" current aria-current="page">
              <span className="constants-breadcrumb-song-text">{detail?.songName || '详情'}</span>
            </BreadcrumbButton>
          </BreadcrumbItem>
        </Breadcrumb>
      </header>

      {!detail ? (
        <div className="constants-detail-empty">
          <Body1>未找到定数详情，请从定数表中点击条目进入。</Body1>
          <Button appearance="primary" onClick={onBack}>返回定数表</Button>
        </div>
      ) : (
        <div className="constants-detail-body">
          <div className="constants-detail-left-column">
            <div className="constants-detail-info-card">
              <Title3 className="constants-detail-title">{detail.songName || '未知歌曲'}</Title3>
              <Body1 className="constants-detail-meta">
                <span className="constants-detail-meta-inline" aria-label="分类难度分支">
                  <span className={`constants-detail-meta-item constants-category-badge ${getCategoryBadgeClass(detail.category)}`.trim()}>
                    {detail.category || '-'}
                  </span>
                  <span className={`constants-detail-meta-item constants-difficulty-text ${getDifficultyTextClass(detail.difficulty)}`.trim()}>
                    {detail.difficulty || '-'}
                  </span>
                  <span className={`constants-detail-meta-item constants-branch-text ${getBranchTextClass(detail.branch)}`.trim()}>
                    {detail.branch || '-'}
                  </span>
                </span>
              </Body1>
            </div>

            <div className="constants-detail-score-list">
              <h3 className="constants-detail-card-title">定数</h3>
              <div className="constants-score-item constants-score-item-main" aria-label="主定数">
                <span className="constants-score-name">主定数</span>
                <span className="constants-score-value">{totalConstantText}</span>
              </div>
              {dimensions.map((dimension) => (
                <div className="constants-score-item" key={dimension.name}>
                  <span className="constants-score-name">{dimension.name}</span>
                  <span className="constants-score-value">{formatScore(dimension.value)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="constants-detail-radar-card">
            <h3 className="constants-detail-card-title">定数可视化</h3>
            {chartModel ? (
              <svg className="constants-radar-svg" viewBox="0 0 420 420" role="img" aria-label="定数五维雷达图">
                {chartModel.levelPolygons.map((polygon, index) => (
                  <polygon
                    key={`grid-${index + 1}`}
                    points={polygon}
                    className="constants-radar-grid"
                  />
                ))}

                {chartModel.axisPoints.map((point, index) => (
                  <line
                    key={`axis-${dimensions[index]?.name || index}`}
                    x1={chartModel.cx}
                    y1={chartModel.cy}
                    x2={point.x}
                    y2={point.y}
                    className="constants-radar-axis"
                  />
                ))}

                <polygon points={chartModel.valuePolygon} className="constants-radar-value" />

                {chartModel.valuePoints.map((point) => (
                  <circle
                    key={`value-point-${point.name}`}
                    cx={point.x}
                    cy={point.y}
                    r="3.5"
                    className="constants-radar-value-point"
                  />
                ))}

                {chartModel.labels.map((label) => (
                  <text
                    key={`label-${label.name}`}
                    x={label.x}
                    y={label.y}
                    textAnchor="middle"
                    className="constants-radar-label"
                  >
                    <tspan x={label.x} dy="0">{label.name}</tspan>
                    <tspan x={label.x} dy="1.2em" className="constants-radar-label-value">{label.valueText}</tspan>
                  </text>
                ))}

                <text x={chartModel.cx} y={18} textAnchor="middle" className="constants-radar-max-text">
                  MAX {formatScore(chartModel.maxValue)}
                </text>
              </svg>
            ) : null}
          </div>
        </div>
      )}
    </section>
  );
}

export default ConstantsDetailPage;
