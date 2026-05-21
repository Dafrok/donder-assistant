import React from 'react';

export function AnalysisTableWrapper({
  tableWrapperRef,
  isNarrowViewport,
  analysisListScale,
  analysisItemSize,
  onScroll,
  children
}) {
  return (
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
        {children}
      </div>
    </div>
  );
}

export default AnalysisTableWrapper;
