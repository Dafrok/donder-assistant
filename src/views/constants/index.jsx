/**
 * 定数表页面
 * 显示难度定数和各维度属性的表格
 */

import React, { memo, useCallback, useEffect, useMemo, useRef, useState, useTransition } from 'react';
import { flushSync } from 'react-dom';
import {
  Breadcrumb,
  BreadcrumbButton,
  BreadcrumbDivider,
  BreadcrumbItem,
  Body1,
  Spinner
} from '@fluentui/react-components';
import VirtualTable from '../../components/VirtualTable/index.jsx';
import {
  getCategoryBadgeClass,
  getBranchTextClass,
  getDifficultyTextClass,
  getNumericValue,
  getConstantValueToneClass
} from './column-renderer.js';

let constantsCache = null;
const ROW_HEIGHT = 44;
const VIRTUAL_OVERSCAN_ROWS = 10;
const MIN_NON_FIRST_COL_WIDTH = 120;
let textMeasureContext = null;

function estimateTextPixelWidth(text, font) {
  const normalized = String(text || '').trim();
  if (!normalized) return 0;

  if (typeof document !== 'undefined') {
    if (!textMeasureContext) {
      const canvas = document.createElement('canvas');
      textMeasureContext = canvas.getContext('2d');
    }

    if (textMeasureContext) {
      textMeasureContext.font = font;
      return textMeasureContext.measureText(normalized).width;
    }
  }

  return normalized.length * 8;
}

function isLikelyNumericColumn(rows, columnIndex) {
  const sampleCount = Math.min(rows.length, 800);
  let nonEmptyCount = 0;
  let numericCount = 0;

  for (let rowIndex = 0; rowIndex < sampleCount; rowIndex += 1) {
    const raw = String(rows[rowIndex]?.cells?.[columnIndex] || '').trim();
    if (!raw || raw === '-') continue;

    nonEmptyCount += 1;
    if (getNumericValue(raw) !== null) {
      numericCount += 1;
    }
  }

  if (nonEmptyCount === 0) return false;
  return numericCount / nonEmptyCount >= 0.9;
}

function getHeaderBaseName(headerLabel) {
  return String(headerLabel || '').replace(/\s*\(\d+\)$/, '').trim();
}

function findLastColumnIndex(headers, baseName) {
  for (let index = headers.length - 1; index >= 0; index -= 1) {
    if (getHeaderBaseName(headers[index]?.label) === baseName) {
      return index;
    }
  }
  return -1;
}

function findLastColumnIndexByNames(headers, names) {
  for (let nameIndex = 0; nameIndex < names.length; nameIndex += 1) {
    const target = names[nameIndex];
    const found = findLastColumnIndex(headers, target);
    if (found >= 0) {
      return found;
    }
  }
  return -1;
}

function clampListScale(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return 1;
  return Math.min(1, Math.max(0.3, numeric));
}

function getTouchDistance(touchA, touchB) {
  const dx = touchA.clientX - touchB.clientX;
  const dy = touchA.clientY - touchB.clientY;
  return Math.hypot(dx, dy);
}

function getBranchSortRank(value) {
  const normalized = String(value || '').trim().toLowerCase();
  if (!normalized) return 99;
  if (normalized.includes('master') || normalized.includes('达人')) return 0;
  if (normalized.includes('expert') || normalized.includes('玄人')) return 1;
  if (normalized.includes('normal') || normalized.includes('普通')) return 2;
  return 98;
}

function ConstantsTablePage({ searchKeyword = '', enableLocalZoom = false, onCountChange, onOpenDetail, isActive = false }) {
  const [isPending, startTransition] = useTransition();
  const [isListBusy, setIsListBusy] = useState(false);
  const [sortState, setSortState] = useState({ columnIndex: -1, asc: true });
  const [headers, setHeaders] = useState([]);
  const [rows, setRows] = useState([]);
  const [loadingState, setLoadingState] = useState({ loading: false, error: '' });
  const [hasActivated, setHasActivated] = useState(isActive);
  const pendingRaf1Ref = useRef(0);
  const pendingRaf2Ref = useRef(0);
  const pendingTimerRef = useRef(0);
  const tableWrapperRef = useRef(null);
  const scrollUpdateRafRef = useRef(0);
  const zoomRefreshTimerRef = useRef(0);
  const [virtualViewportHeight, setVirtualViewportHeight] = useState(0);
  const [virtualScrollTop, setVirtualScrollTop] = useState(0);
  const [listZoomScale, setListZoomScale] = useState(1);
  const [listZoomRevision, setListZoomRevision] = useState(0);
  const listZoomScaleRef = useRef(1);
  const effectiveListScale = enableLocalZoom ? listZoomScale : 1;
  const rowHeight = Math.max(1, Math.round(ROW_HEIGHT * effectiveListScale));

  const handleZoomWheelCapture = useCallback((event) => {
    if (!enableLocalZoom || !isActive || !event.ctrlKey) return;
    const delta = -event.deltaY * 0.002;
    const nextScale = clampListScale(listZoomScaleRef.current + delta);
    if (Math.abs(nextScale - listZoomScaleRef.current) < 0.001) return;
    listZoomScaleRef.current = nextScale;
    setListZoomScale(nextScale);
  }, [enableLocalZoom, isActive]);

  const clearPendingSchedule = useCallback(() => {
    if (pendingRaf1Ref.current) {
      window.cancelAnimationFrame(pendingRaf1Ref.current);
      pendingRaf1Ref.current = 0;
    }
    if (pendingRaf2Ref.current) {
      window.cancelAnimationFrame(pendingRaf2Ref.current);
      pendingRaf2Ref.current = 0;
    }
    if (pendingTimerRef.current) {
      window.clearTimeout(pendingTimerRef.current);
      pendingTimerRef.current = 0;
    }
  }, []);

  const scheduleListUpdate = useCallback((work, options = {}) => {
    const { immediate = false, mode = 'raf' } = options;
    clearPendingSchedule();

    if (immediate) {
      flushSync(() => {
        setIsListBusy(true);
      });
    } else {
      setIsListBusy(true);
    }

    if (mode === 'timeout') {
      pendingTimerRef.current = window.setTimeout(() => {
        pendingTimerRef.current = 0;
        startTransition(() => {
          work();
        });
      });
      return;
    }

    pendingRaf1Ref.current = window.requestAnimationFrame(() => {
      pendingRaf1Ref.current = 0;
      pendingRaf2Ref.current = window.requestAnimationFrame(() => {
        pendingRaf2Ref.current = 0;
        startTransition(() => {
          work();
        });
      });
    });
  }, [clearPendingSchedule, startTransition]);

  useEffect(() => {
    if (!isPending && isListBusy) {
      const rafId = window.requestAnimationFrame(() => {
        setIsListBusy(false);
      });
      return () => window.cancelAnimationFrame(rafId);
    }
    return undefined;
  }, [isPending, isListBusy]);

  useEffect(() => {
    listZoomScaleRef.current = listZoomScale;
  }, [listZoomScale]);

  useEffect(() => {
    if (!enableLocalZoom) {
      listZoomScaleRef.current = 1;
      setListZoomScale(1);
      return undefined;
    }

    if (!isActive) {
      return undefined;
    }

    const wrapper = tableWrapperRef.current;
    if (!wrapper) return undefined;

    const pinchState = {
      active: false,
      startDistance: 0,
      startScale: 1
    };

    const onTouchStart = (event) => {
      if (event.touches.length !== 2) return;
      pinchState.active = true;
      pinchState.startDistance = getTouchDistance(event.touches[0], event.touches[1]);
      pinchState.startScale = listZoomScaleRef.current;
    };

    const onTouchMove = (event) => {
      if (!pinchState.active || event.touches.length !== 2) return;

      const distance = getTouchDistance(event.touches[0], event.touches[1]);
      if (distance <= 0 || pinchState.startDistance <= 0) return;

      event.preventDefault();
      const ratio = distance / pinchState.startDistance;
      const nextScale = clampListScale(pinchState.startScale * ratio);
      if (Math.abs(nextScale - listZoomScaleRef.current) < 0.01) return;
      listZoomScaleRef.current = nextScale;
      setListZoomScale(nextScale);
    };

    const onTouchEnd = (event) => {
      if (event.touches.length < 2) {
        pinchState.active = false;
      }
    };

    wrapper.addEventListener('touchstart', onTouchStart, { passive: true });
    wrapper.addEventListener('touchmove', onTouchMove, { passive: false });
    wrapper.addEventListener('touchend', onTouchEnd, { passive: true });
    wrapper.addEventListener('touchcancel', onTouchEnd, { passive: true });

    return () => {
      wrapper.removeEventListener('touchstart', onTouchStart);
      wrapper.removeEventListener('touchmove', onTouchMove);
      wrapper.removeEventListener('touchend', onTouchEnd);
      wrapper.removeEventListener('touchcancel', onTouchEnd);
    };
  }, [enableLocalZoom, isActive]);

  useEffect(() => {
    if (zoomRefreshTimerRef.current) {
      window.clearTimeout(zoomRefreshTimerRef.current);
      zoomRefreshTimerRef.current = 0;
    }

    if (!enableLocalZoom) return undefined;

    zoomRefreshTimerRef.current = window.setTimeout(() => {
      zoomRefreshTimerRef.current = 0;
      const wrapper = tableWrapperRef.current;
      if (wrapper) {
        setVirtualViewportHeight(wrapper.clientHeight);
        setVirtualScrollTop(wrapper.scrollTop);
      }
      setListZoomRevision((value) => value + 1);
    }, 300);

    return () => {
      if (zoomRefreshTimerRef.current) {
        window.clearTimeout(zoomRefreshTimerRef.current);
        zoomRefreshTimerRef.current = 0;
      }
    };
  }, [listZoomScale, enableLocalZoom]);

  useEffect(() => {
    return () => {
      clearPendingSchedule();
      if (zoomRefreshTimerRef.current) {
        window.clearTimeout(zoomRefreshTimerRef.current);
        zoomRefreshTimerRef.current = 0;
      }
    };
  }, [clearPendingSchedule]);

  useEffect(() => {
    return () => {
      if (scrollUpdateRafRef.current) {
        window.cancelAnimationFrame(scrollUpdateRafRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isActive) {
      setHasActivated(true);
    }
  }, [isActive]);

  useEffect(() => {
    if (!hasActivated) return undefined;

    if (constantsCache?.headers && constantsCache?.rows) {
      setHeaders(constantsCache.headers);
      setRows(constantsCache.rows);
      setLoadingState({ loading: false, error: '' });
      return undefined;
    }

    setLoadingState({ loading: true, error: '' });
    const worker = new Worker(new URL('../../constants-csv.worker.js', import.meta.url), { type: 'module' });

    const handleMessage = (event) => {
      const { type, payload, message } = event.data || {};
      if (type === 'parse-success') {
        const nextHeaders = Array.isArray(payload?.headers) ? payload.headers : [];
        const nextRows = Array.isArray(payload?.rows) ? payload.rows : [];
        constantsCache = { headers: nextHeaders, rows: nextRows };
        setHeaders(nextHeaders);
        setRows(nextRows);
        setLoadingState({ loading: false, error: '' });
      } else if (type === 'parse-error') {
        setLoadingState({ loading: false, error: message || '读取定数表失败' });
      }
    };

    worker.addEventListener('message', handleMessage);
    worker.postMessage({ type: 'parse-constants-csv' });

    return () => {
      worker.removeEventListener('message', handleMessage);
      worker.terminate();
    };
  }, [hasActivated]);

  const filteredRows = useMemo(() => {
    const normalizedKeyword = searchKeyword.trim().toLowerCase();
    let result = rows;

    if (normalizedKeyword) {
      result = result.filter((row) => {
        return row.searchText.includes(normalizedKeyword);
      });
    }

    if (sortState.columnIndex >= 0) {
      const branchColumnIndex = findLastColumnIndex(headers, '分支');
      result = [...result].sort((a, b) => {
        const left = a.cells[sortState.columnIndex] || '';
        const right = b.cells[sortState.columnIndex] || '';

        if (sortState.columnIndex === branchColumnIndex) {
          const compare = getBranchSortRank(left) - getBranchSortRank(right);
          return sortState.asc ? compare : -compare;
        }

        const leftNum = getNumericValue(left);
        const rightNum = getNumericValue(right);

        let compare = 0;
        if (leftNum !== null && rightNum !== null) {
          compare = leftNum - rightNum;
        } else {
          compare = left.localeCompare(right, 'zh-CN', { numeric: true, sensitivity: 'base' });
        }

        return sortState.asc ? compare : -compare;
      });
    }

    return result;
  }, [searchKeyword, rows, sortState, headers]);

  useEffect(() => {
    const wrapper = tableWrapperRef.current;
    if (!wrapper) return undefined;

    const updateViewport = () => {
      setVirtualViewportHeight(wrapper.clientHeight);
    };

    updateViewport();
    const resizeObserver = new ResizeObserver(updateViewport);
    resizeObserver.observe(wrapper);

    return () => {
      resizeObserver.disconnect();
    };
  }, [hasActivated]);

  const handleTableWrapperScroll = useCallback((event) => {
    const nextScrollTop = event.currentTarget.scrollTop;
    if (scrollUpdateRafRef.current) return;

    scrollUpdateRafRef.current = window.requestAnimationFrame(() => {
      scrollUpdateRafRef.current = 0;
      setVirtualScrollTop(nextScrollTop);
    });
  }, []);

  const virtualRows = useMemo(() => {
    if (!filteredRows.length) {
      return {
        visibleRows: [],
        topSpacerHeight: 0,
        bottomSpacerHeight: 0
      };
    }

    const effectiveViewportHeight = Math.max(virtualViewportHeight, rowHeight * 8);
    const startIndex = Math.max(0, Math.floor(virtualScrollTop / rowHeight) - VIRTUAL_OVERSCAN_ROWS);
    const endIndex = Math.min(
      filteredRows.length,
      Math.ceil((virtualScrollTop + effectiveViewportHeight) / rowHeight) + VIRTUAL_OVERSCAN_ROWS
    );

    return {
      visibleRows: filteredRows.slice(startIndex, endIndex),
      topSpacerHeight: startIndex * rowHeight,
      bottomSpacerHeight: (filteredRows.length - endIndex) * rowHeight
    };
  }, [filteredRows, virtualScrollTop, virtualViewportHeight, rowHeight]);

  useEffect(() => {
    const wrapper = tableWrapperRef.current;
    if (!wrapper) return;
    const maxScrollTop = Math.max(0, (filteredRows.length * rowHeight) - wrapper.clientHeight);
    if (wrapper.scrollTop > maxScrollTop) {
      wrapper.scrollTop = maxScrollTop;
      setVirtualScrollTop(maxScrollTop);
    }
  }, [filteredRows.length, rowHeight]);

  const categoryColumnIndex = useMemo(() => findLastColumnIndex(headers, '分类'), [headers]);
  const difficultyColumnIndex = useMemo(() => findLastColumnIndex(headers, '难度'), [headers]);
  const branchColumnIndex = useMemo(() => findLastColumnIndex(headers, '分支'), [headers]);
  const constantColumnIndexes = useMemo(() => {
    const result = new Set();
    for (let index = 0; index < headers.length; index += 1) {
      if (index === categoryColumnIndex || index === difficultyColumnIndex || index === branchColumnIndex) continue;

      const baseName = getHeaderBaseName(headers[index]?.label);
      if (baseName === '歌曲') continue;

      if (isLikelyNumericColumn(rows, index)) {
        result.add(index);
      }
    }
    return result;
  }, [headers, rows, categoryColumnIndex, difficultyColumnIndex, branchColumnIndex]);

  const columnStyles = useMemo(() => {
    if (!headers.length) return [];

    return headers.map((header, columnIndex) => {
      if (columnIndex === 0) {
        return {
          width: 'var(--song-col-width)',
          minWidth: 'var(--song-col-width)',
          maxWidth: 'var(--song-col-width)',
          flexBasis: 'var(--song-col-width)',
          flexGrow: 0,
          flexShrink: 0
        };
      }

      let computedWidth = Math.max(
        MIN_NON_FIRST_COL_WIDTH,
        estimateTextPixelWidth(header.label, '700 14px "Segoe UI", "Microsoft YaHei", sans-serif') + 42
      );

      for (let rowIndex = 0; rowIndex < rows.length; rowIndex += 1) {
        const rawText = rows[rowIndex]?.cells?.[columnIndex];
        if (!rawText) continue;

        const measuredWidth = estimateTextPixelWidth(rawText, '400 14px "Segoe UI", "Microsoft YaHei", sans-serif') + 24;
        if (measuredWidth > computedWidth) {
          computedWidth = measuredWidth;
        }
      }

      const scaledWidth = Math.max(1, Math.ceil(computedWidth * effectiveListScale));
      const width = `${scaledWidth}px`;
      return {
        width,
        minWidth: width,
        flexBasis: width,
        maxWidth: width,
        flexGrow: 0,
        flexShrink: 0
      };
    });
  }, [headers, rows, effectiveListScale]);

  useEffect(() => {
    if (isActive && typeof onCountChange === 'function') {
      onCountChange(filteredRows.length, rows.length);
    }
  }, [filteredRows.length, rows.length, onCountChange, isActive]);

  const handleSort = useCallback((columnIndex) => {
    scheduleListUpdate(() => {
      setSortState((prev) => {
        if (prev.columnIndex === columnIndex) {
          return { ...prev, asc: !prev.asc };
        }
        return { columnIndex, asc: true };
      });
    }, { immediate: true, mode: 'timeout' });
  }, [scheduleListUpdate]);

  const renderSortIcon = useCallback((columnIndex) => {
    if (sortState.columnIndex !== columnIndex) return '⇅';
    return sortState.asc ? '▲' : '▼';
  }, [sortState]);

  const openDetail = useCallback((row) => {
    if (typeof onOpenDetail !== 'function') return;

    const songIndex = findLastColumnIndex(headers, '歌曲');
    const categoryIndex = findLastColumnIndex(headers, '分类');
    const difficultyIndex = findLastColumnIndex(headers, '难度');
    const branchIndex = findLastColumnIndex(headers, '分支');
    const totalConstantIndex = findLastColumnIndexByNames(headers, ['主定数', '总定数', '定数']);
    const totalConstantRaw = totalConstantIndex >= 0
      ? row.cells[totalConstantIndex]
      : (row.cells[row.cells.length - 1] || '');
    const totalConstantValue = getNumericValue(totalConstantRaw);

    const dimensionNames = ['体力', '手速', '爆发', '节奏', '复合'];
    const dimensions = dimensionNames.map((name) => {
      const dimIndex = findLastColumnIndex(headers, name);
      const raw = dimIndex >= 0 ? row.cells[dimIndex] : '';
      const numeric = getNumericValue(raw);
      return {
        name,
        raw,
        value: numeric === null ? 0 : numeric
      };
    });

    onOpenDetail({
      id: row.id,
      songName: songIndex >= 0 ? row.cells[songIndex] : '',
      category: categoryIndex >= 0 ? row.cells[categoryIndex] : '',
      difficulty: difficultyIndex >= 0 ? row.cells[difficultyIndex] : '',
      branch: branchIndex >= 0 ? row.cells[branchIndex] : '',
      totalConstantRaw,
      totalConstant: totalConstantValue,
      dimensions,
      cells: row.cells,
      headers: headers.map((header) => header.label)
    });
  }, [headers, onOpenDetail]);

  const columns = useMemo(() => {
    return headers.map((header, columnIndex) => ({
      id: `col-${columnIndex}`,
      label: header.label,
      columnIndex,
      sortable: true,
      className: columnIndex === 0 ? 'sticky-first-col-cell' : '',
      headerClassName: columnIndex === 0 ? 'sticky-first-col-header' : '',
      style: columnStyles[columnIndex],
      renderCell: (row) => {
        const cellContent = row.cells[columnIndex] || '-';

        if (columnIndex === categoryColumnIndex) {
          return (
            <span className={`constants-category-badge ${getCategoryBadgeClass(cellContent)}`.trim()}>
              {cellContent}
            </span>
          );
        }

        if (columnIndex === difficultyColumnIndex) {
          return (
            <span className={`constants-cell-text constants-difficulty-text ${getDifficultyTextClass(cellContent)}`.trim()}>
              {cellContent}
            </span>
          );
        }

        if (columnIndex === branchColumnIndex) {
          return (
            <span className={`constants-branch-text ${getBranchTextClass(cellContent)}`.trim()}>
              {cellContent}
            </span>
          );
        }

        if (constantColumnIndexes.has(columnIndex)) {
          return (
            <span className={`constants-cell-text constants-value-text ${getConstantValueToneClass(cellContent)}`.trim()}>
              {cellContent}
            </span>
          );
        }

        return <span className="constants-cell-text">{cellContent}</span>;
      }
    }));
  }, [headers, columnStyles, categoryColumnIndex, difficultyColumnIndex, branchColumnIndex, constantColumnIndexes]);

  const renderTableWrapper = (tableContent) => (
    <div
      className={`constants-table-wrapper table-wrapper${enableLocalZoom ? ' list-local-zoom-enabled' : ''}`}
      ref={tableWrapperRef}
      onScroll={handleTableWrapperScroll}
      onWheelCapture={handleZoomWheelCapture}
    >
      <div
        className="list-local-zoom-surface"
        style={enableLocalZoom ? {
          '--list-local-zoom-scale': listZoomScale,
          '--constants-row-height': `${rowHeight}px`
        } : undefined}
      >
        {tableContent}
      </div>
      {!loadingState.loading && !loadingState.error && (isPending || isListBusy) ? (
        <div className="constants-list-busy-overlay" aria-live="polite" aria-label="列表更新中">
          <Spinner size="medium" label="更新列表中..." />
        </div>
      ) : null}
    </div>
  );

  return (
    <section className="constants-panel" aria-label="定数表页面">
      <header className="list-caption" aria-label="定数表页面头部">
        <Breadcrumb className="list-breadcrumb" aria-label="面包屑">
          <BreadcrumbItem>
            <BreadcrumbButton>数据分析</BreadcrumbButton>
          </BreadcrumbItem>
          <BreadcrumbDivider />
          <BreadcrumbItem>
            <BreadcrumbButton current aria-current="page">定数表</BreadcrumbButton>
          </BreadcrumbItem>
        </Breadcrumb>
      </header>

      {loadingState.loading ? (
        <div className="constants-table-wrapper table-wrapper">
          <div className="constants-loading-wrap">
            <Spinner size="large" label="正在解析定数表..." />
          </div>
        </div>
      ) : loadingState.error ? (
        <div className="constants-table-wrapper table-wrapper">
          <div className="constants-loading-wrap">
            <Body1>{loadingState.error}</Body1>
          </div>
        </div>
      ) : !headers.length ? (
        <div className="constants-table-wrapper table-wrapper">
          <div className="constants-loading-wrap">
            <Body1>没有数据</Body1>
          </div>
        </div>
      ) : (
        <VirtualTable
          key={`constants-vlist-${listZoomRevision}`}
          columns={columns}
          rows={filteredRows}
          virtualRows={virtualRows}
          onSort={handleSort}
          renderSortIndicator={renderSortIcon}
          renderCell={(row, column) => column.renderCell(row)}
          onRowClick={openDetail}
          gridClassName="constants-virtual-grid table-grid"
          headerClassName="constants-virtual"
          cellClassName="constants-virtual"
          rowClassName="constants-virtual"
          gridRole="table"
          gridLabel="定数表"
          renderWrapper={renderTableWrapper}
        />
      )}
    </section>
  );
}

export default memo(ConstantsTablePage, (prevProps, nextProps) => {
  return prevProps.searchKeyword === nextProps.searchKeyword
    && prevProps.enableLocalZoom === nextProps.enableLocalZoom
    && prevProps.isActive === nextProps.isActive;
});
