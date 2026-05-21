/**
 * 虚拟化表格组件
 * 为分析列表和定数表提供通用的虚拟化表格实现
 */

import React, { memo } from 'react';

/**
 * 虚拟表格 - 提供高性能的表格渲染
 * @param {Object} props
 * @param {Array} props.columns - 列定义数组，每列包含 id, label, style 等
 * @param {Array} props.rows - 要显示的行数据
 * @param {Array} props.virtualRows - 虚拟化的行数据 {visibleRows, topSpacerHeight, bottomSpacerHeight}
 * @param {Function} props.onSort - 列排序回调函数 (columnId) => void
 * @param {Function} props.renderSortIndicator - 渲染排序指示符 (columnId) => ReactNode
 * @param {Function} props.renderCell - 渲染单元格 (row, column) => ReactNode
 * @param {Function} props.onRowClick - 行点击回调函数 (row) => void
 * @param {string} props.gridClassName - 表格容器的 CSS 类名
 * @param {string} props.headerClassName - 表头行的 CSS 类名前缀
 * @param {string} props.cellClassName - 单元格的 CSS 类名前缀
 * @param {string} props.rowClassName - 行的 CSS 类名前缀
 * @param {string} props.gridRole - 表格的 ARIA role
 * @param {string} props.gridLabel - 表格的 ARIA label
 * @param {string} props.wrapperClassName - 包装器的 CSS 类名
 * @param {Object} props.wrapperStyle - 包装器的内联样式
 * @param {Function} props.onScroll - 滚动回调函数
 * @param {ReactNode} props.renderWrapper - 自定义包装器渲染函数
 */
export const VirtualTable = memo(function VirtualTable({
  columns,
  rows,
  virtualRows,
  onSort,
  renderSortIndicator,
  renderCell,
  onRowClick,
  gridClassName = 'table-grid virtual-grid',
  headerClassName = 'virtual',
  cellClassName = 'virtual',
  rowClassName = 'virtual',
  gridRole = 'table',
  gridLabel = '数据表格',
  wrapperClassName = 'virtual-table-wrapper table-wrapper',
  wrapperStyle = {},
  onScroll,
  renderWrapper
}) {
  const { visibleRows = [], topSpacerHeight = 0, bottomSpacerHeight = 0 } = virtualRows || {};

  const headerPrefix = `${headerClassName}-`;
  const cellPrefix = `${cellClassName}-`;
  const rowPrefix = `${rowClassName}-`;

  const tableContent = (
    <div className={gridClassName} role={gridRole} aria-label={gridLabel}>
      {/* 表头 */}
      <div className={`${headerPrefix}header`} role="rowgroup">
        <div className={`${headerPrefix}header-row`} role="row">
          {columns.map((column, columnIndex) => (
            <div
              key={column.id}
              role="columnheader"
              aria-colindex={columnIndex + 1}
              onClick={() => onSort?.(column.id)}
              className={`${column.sortable ? 'sortable' : ''} ${column.headerClassName || ''} ${cellPrefix}cell ${headerPrefix}header-cell`.trim()}
              style={column.style}
            >
              <span className="header-cell-text">
                <span className="header-title-text">{column.label}</span>
                {column.sortable && renderSortIndicator ? (
                  <span className="sort-indicator">{renderSortIndicator(column.id)}</span>
                ) : null}
              </span>
            </div>
          ))}
          <div className={`${rowPrefix}row-spacer ${headerPrefix}header-spacer`} aria-hidden="true" />
        </div>
      </div>

      {/* 表体 */}
      <div className={`${headerPrefix}scroll-root`} role="rowgroup" aria-label={`${gridLabel}列表`}>
        {topSpacerHeight > 0 ? (
          <div className={`${rowPrefix}spacer`} style={{ height: `${topSpacerHeight}px` }} aria-hidden="true" />
        ) : null}

        {visibleRows.map((row) => {
          if (!row) return null;
          return (
            <div
              key={row.id}
              className={`result-row ${rowPrefix}row ${row.className || ''}`.trim()}
              role="row"
              onClick={() => onRowClick?.(row)}
            >
              {columns.map((column, columnIndex) => (
                <div
                  key={`${row.id}-${column.id}`}
                  role="gridcell"
                  aria-colindex={columnIndex + 1}
                  className={`${column.className || ''} ${cellPrefix}cell`.trim()}
                  style={column.style}
                >
                  {column.id === 'favorite' && column.renderCell
                    ? column.renderCell(row)
                    : <span className={`${cellPrefix}text`}>{renderCell?.(row, column) || column.renderCell?.(row) || ''}</span>}
                </div>
              ))}
              <div className={`${rowPrefix}row-spacer ${rowPrefix}body-spacer`} aria-hidden="true" />
            </div>
          );
        })}

        {bottomSpacerHeight > 0 ? (
          <div className={`${rowPrefix}spacer`} style={{ height: `${bottomSpacerHeight}px` }} aria-hidden="true" />
        ) : null}
      </div>
    </div>
  );

  if (renderWrapper) {
    return renderWrapper(tableContent);
  }

  return (
    <div className={wrapperClassName} style={wrapperStyle} onScroll={onScroll}>
      {tableContent}
    </div>
  );
});

export default VirtualTable;
