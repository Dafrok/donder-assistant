/**
 * 分析列表页面
 * 谱面分析的主要容器组件
 */

import React from 'react';
import VirtualTable from '../../components/VirtualTable/index.jsx';
import AnalysisActionsToolbar from './components/AnalysisActionsToolbar.jsx';
import AnalysisBreadcrumb from './components/AnalysisBreadcrumb.jsx';
import AnalysisEmptyState from './components/AnalysisEmptyState.jsx';
import AnalysisTableWrapper from './components/AnalysisTableWrapper.jsx';

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
  const renderTableWrapper = (tableContent) => (
    <AnalysisTableWrapper
      tableWrapperRef={tableWrapperRef}
      isNarrowViewport={isNarrowViewport}
      analysisListScale={analysisListScale}
      analysisItemSize={analysisItemSize}
      onScroll={onScroll}
    >
      {tableContent}
    </AnalysisTableWrapper>
  );

  return (
    <div
      className={`results-panel${dragOver ? ' drag-over' : ''}`}
      onDragEnter={onDragEnter}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <AnalysisBreadcrumb />

      <AnalysisActionsToolbar
        hasFavoriteCache={hasFavoriteCache}
        hasResults={allResults.length > 0}
        onRestoreFavorites={onRestoreFavorites}
        onUploadCharts={onUploadCharts}
        onExportResults={onExportResults}
        onUploadAllCharts={onUploadAllCharts}
      />

      {!allResults.length ? (
        <AnalysisEmptyState onUploadCharts={onUploadCharts} />
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
