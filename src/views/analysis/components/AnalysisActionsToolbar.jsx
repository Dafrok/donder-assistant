import React from 'react';
import { Toolbar, ToolbarButton } from '@fluentui/react-components';
import { ArrowDownloadRegular, ArrowUploadRegular, CloudArrowUpRegular, StarRegular } from '@fluentui/react-icons';

export function AnalysisActionsToolbar({
  hasFavoriteCache,
  hasResults,
  onRestoreFavorites,
  onUploadCharts,
  onExportResults,
  onUploadAllCharts
}) {
  return (
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
        disabled={!hasResults}
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
  );
}

export default AnalysisActionsToolbar;
