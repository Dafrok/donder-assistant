/**
 * 分析列表页面
 * 谱面分析的主要容器组件
 */

import React from 'react';
import { Breadcrumb, BreadcrumbButton, BreadcrumbDivider, BreadcrumbItem, Body1, Toolbar, ToolbarButton } from '@fluentui/react-components';
import { ArrowDownloadRegular, ArrowUploadRegular, CloudArrowUpRegular, StarRegular } from '@fluentui/react-icons';

export function AnalysisPage({
  onUploadCharts,
  onUploadAllCharts,
  onExportResults,
  onRestoreFavorites,
  hasFavoriteCache,
  allResults,
  allColumns,
  filteredRows,
  sortState,
  analysisVirtualRows,
  analysisListScale,
  isNarrowViewport,
  analysisViewportHeight,
  analysisScrollTop,
  analysisItemSize,
  onSort,
  sortIndicator,
  onScroll,
  onChartClick,
  dragOver,
  onDragEnter,
  onDragOver,
  onDragLeave,
  onDrop
}) {
  return (
    <div
      className={`results-panel${dragOver ? ' drag-over' : ''}`}
      onDragEnter={onDragEnter}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <header className="list-caption" aria-label="谱面列表说明与操作">
        <Breadcrumb className="list-breadcrumb" aria-label="面包屑">
          <BreadcrumbItem>
            <BreadcrumbButton>数据分析</BreadcrumbButton>
          </BreadcrumbItem>
          <BreadcrumbDivider />
          <BreadcrumbItem>
            <BreadcrumbButton current aria-current="page">谱面分析</BreadcrumbButton>
          </BreadcrumbItem>
        </Breadcrumb>
      </header>
      
      <Toolbar className="list-toolbar practice-toolbar practice-toolbar-main" aria-label="谱面列表工具栏">
        <ToolbarButton
          className="list-toolbar-button"
          appearance="subtle"
          icon={<StarRegular />}
          disabled={!hasFavoriteCache}
          aria-label="加载收藏"
          title="加载收藏"
          onClick={onRestoreFavorites}
        >
          加载收藏
        </ToolbarButton>
        <ToolbarButton
          className="list-toolbar-button"
          appearance="subtle"
          icon={<ArrowUploadRegular />}
          aria-label="上传谱面"
          title="上传谱面"
          onClick={onUploadCharts}
        >
          上传谱面
        </ToolbarButton>
        <ToolbarButton
          className="list-toolbar-button"
          appearance="subtle"
          icon={<ArrowDownloadRegular />}
          disabled={!allResults.length}
          aria-label="导出结果"
          title="导出结果"
          onClick={onExportResults}
        >
          导出结果
        </ToolbarButton>
        <ToolbarButton
          className="list-toolbar-button"
          appearance="subtle"
          icon={<CloudArrowUpRegular />}
          aria-label="上传所有谱面"
          title="上传所有谱面"
          onClick={onUploadAllCharts}
        >
          上传所有谱面
        </ToolbarButton>
      </Toolbar>

      {!allResults.length ? (
        <div className="drop-placeholder" role="button" tabIndex={0} onClick={onUploadCharts}>
          <div className="drop-icon">📂</div>
          <Body1>点击或拖拽上传 TJA 文件或文件夹</Body1>
          <Body1 className="hint">支持 .TJA 谱面，兼容任意目录结构</Body1>
        </div>
      ) : (
        <div
          className={`analysis-table-wrapper table-wrapper${isNarrowViewport ? ' list-local-zoom-enabled' : ''}`}
          onScroll={onScroll}
        >
          <div
            className="list-local-zoom-surface"
            style={isNarrowViewport ? {
              '--list-local-zoom-scale': analysisListScale,
              '--analysis-row-height': `${analysisItemSize}px`
            } : undefined}
          >
            <div className="table-grid analysis-virtual-grid" role="table" aria-label="谱面分析表格">
              <div className="analysis-virtual-header" role="rowgroup">
                <div className="analysis-virtual-header-row" role="row">
                  {allColumns.map((column, columnIndex) => (
                    <div
                      key={column.id}
                      role="columnheader"
                      aria-colindex={columnIndex + 1}
                      onClick={() => onSort(column.id)}
                      className={`${column.sortable ? 'sortable' : ''} ${column.headerClassName || ''} analysis-virtual-cell analysis-virtual-header-cell`.trim()}
                      style={column.style}
                    >
                      <span className="header-cell-text">
                        <span className="header-title-text">{column.label}</span>
                        {column.sortable ? <span className="sort-indicator">{sortIndicator(column.id)}</span> : null}
                      </span>
                    </div>
                  ))}
                  <div className="analysis-virtual-row-spacer analysis-virtual-header-spacer" aria-hidden="true" />
                </div>
              </div>
              <div className="analysis-virtual-scroll-root" role="rowgroup" aria-label="谱面分析列表">
                {analysisVirtualRows.topSpacerHeight > 0 ? (
                  <div className="analysis-virtual-spacer" style={{ height: `${analysisVirtualRows.topSpacerHeight}px` }} aria-hidden="true" />
                ) : null}
                {analysisVirtualRows.visibleRows.map((item) => {
                  if (!item) return null;
                  return (
                    <div key={item.id} className="result-row analysis-virtual-row" role="row" onClick={() => onChartClick(item)}>
                      {allColumns.map((column, columnIndex) => (
                        <div
                          key={`${item.id}-${column.id}`}
                          role="gridcell"
                          aria-colindex={columnIndex + 1}
                          className={`${column.className || ''} analysis-virtual-cell`.trim()}
                          style={column.style}
                        >
                          {column.id === 'favorite'
                            ? column.renderCell(item)
                            : <span className="analysis-cell-text">{column.renderCell(item)}</span>}
                        </div>
                      ))}
                      <div className="analysis-virtual-row-spacer analysis-virtual-body-spacer" aria-hidden="true" />
                    </div>
                  );
                })}
                {analysisVirtualRows.bottomSpacerHeight > 0 ? (
                  <div className="analysis-virtual-spacer" style={{ height: `${analysisVirtualRows.bottomSpacerHeight}px` }} aria-hidden="true" />
                ) : null}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AnalysisPage;
