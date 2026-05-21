import React from 'react';
import { Body1 } from '@fluentui/react-components';

export function AnalysisEmptyState({ onUploadCharts }) {
  return (
    <div className="drop-placeholder" role="button" tabIndex={0} onClick={onUploadCharts}>
      <div className="drop-icon">📂</div>
      <Body1>点击或拖拽上传 TJA 文件或文件夹</Body1>
      <Body1 className="hint">支持 .TJA 谱面，兼容任意目录结构</Body1>
    </div>
  );
}

export default AnalysisEmptyState;
