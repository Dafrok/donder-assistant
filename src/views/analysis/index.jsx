/**
 * 分析列表页面
 * 谱面分析的主要容器组件
 */

import React from 'react';
import { Breadcrumb, BreadcrumbButton, BreadcrumbDivider, BreadcrumbItem, Body1, Toolbar, ToolbarButton } from '@fluentui/react-components';
import { ArrowDownloadRegular, ArrowUploadRegular, CloudArrowUpRegular, StarRegular } from '@fluentui/react-icons';
import VirtualTable from '../../components/VirtualTable/index.jsx';

export function AnalysisPage({
  tableWrapperRef,
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
    // 渲染自定义包装器以支持缩放功能
    const renderTableWrapper = (tableContent) => (
      <div
        className={`analysis-table-wrapper table-wrapper${isNarrowViewport ? ' list-local-zoom-enabled' : ''}`}
        ref={tableWrapperRef}
        onScroll={onScroll}
      >
        <div
          className="list-local-zoom-surface"
          style={isNarrowViewport ? {
            '--list-local-zoom-scale': analysisListScale,
            '--analysis-row-height': `${analysisItemSize}px`
          } : undefined}
        >
          {tableContent}
        </div>
      </div>
    );

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
        <VirtualTable
          columns={allColumns}
          rows={filteredRows}
          virtualRows={analysisVirtualRows}
          onSort={onSort}
          renderSortIndicator={sortIndicator}
          renderCell={(row, column) => column.renderCell(row)}
          onRowClick={onChartClick}
          gridClassName="table-grid analysis-virtual-grid"
          headerClassName="analysis-virtual"
          cellClassName="analysis-virtual"
          rowClassName="analysis-virtual"
          gridRole="table"
          gridLabel="谱面分析表格"
          renderWrapper={renderTableWrapper}
        />
      )}
    </div>
  );
}

export default AnalysisPage;
