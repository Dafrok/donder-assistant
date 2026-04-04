import React from 'react';
import {
  Toolbar,
  ToolbarButton,
  ToolbarDivider,
  ToolbarRadioButton,
  ToolbarRadioGroup
} from '@fluentui/react-components';

const branchLabelMap = {
  normal: '普通谱面',
  expert: '玄人谱面',
  master: '达人谱面'
};

const branchIconMap = {
  normal: '普',
  expert: '玄',
  master: '达'
};

function PracticeToolbar({
  isMobileToolbar,
  onImportClick,
  mainPlaybackAction,
  mainPlaybackDisabled,
  mainPlaybackLabel,
  mainPlaybackIcon,
  onSeekPrevBar,
  onSeekNextBar,
  onReset,
  notesLength,
  isPaused,
  availableBranches,
  branchSelection,
  isPlaying,
  onBranchSelectionChange
}) {
  return (
    <Toolbar className="practice-toolbar practice-toolbar-main" aria-label="练习控制">
      <ToolbarButton
        onClick={onImportClick}
        icon={isMobileToolbar ? '📁' : undefined}
        aria-label="导入 TJA / ZIP"
        title="导入 TJA / ZIP"
      >
        {isMobileToolbar ? null : '导入 TJA / ZIP'}
      </ToolbarButton>
      <ToolbarButton
        onClick={mainPlaybackAction}
        disabled={mainPlaybackDisabled}
        icon={isMobileToolbar ? mainPlaybackIcon : undefined}
        aria-label={mainPlaybackLabel}
        title={mainPlaybackLabel}
      >
        {isMobileToolbar ? null : mainPlaybackLabel}
      </ToolbarButton>
      <ToolbarDivider />
      <ToolbarButton
        onClick={onSeekPrevBar}
        disabled={!notesLength || !isPaused}
        icon={isMobileToolbar ? '⏮' : undefined}
        aria-label="上一小节"
        title="上一小节"
      >
        {isMobileToolbar ? null : '上一小节'}
      </ToolbarButton>
      <ToolbarButton
        onClick={onSeekNextBar}
        disabled={!notesLength || !isPaused}
        icon={isMobileToolbar ? '⏭' : undefined}
        aria-label="下一小节"
        title="下一小节"
      >
        {isMobileToolbar ? null : '下一小节'}
      </ToolbarButton>
      <ToolbarButton
        onClick={onReset}
        disabled={!notesLength}
        icon={isMobileToolbar ? '↺' : undefined}
        aria-label="重置"
        title="重置"
      >
        {isMobileToolbar ? null : '重置'}
      </ToolbarButton>

      {availableBranches.length > 0 ? (
        <>
          <ToolbarDivider />
          <ToolbarRadioGroup
            value={branchSelection}
            onChange={(_, data) => {
              if (!data?.value) return;
              onBranchSelectionChange(String(data.value));
            }}
            aria-label="分歧单选"
          >
            {availableBranches.map((branch) => (
              <ToolbarRadioButton
                key={branch}
                value={branch}
                className={`practice-branch-button${branchSelection === branch ? ' is-selected' : ''}`}
                disabled={isPlaying}
                onClick={() => onBranchSelectionChange(branch)}
                icon={isMobileToolbar ? (branchIconMap[branch] || '谱') : undefined}
                aria-label={branchLabelMap[branch] || `${branch}谱面`}
                title={branchLabelMap[branch] || `${branch}谱面`}
              >
                {isMobileToolbar ? null : (branchLabelMap[branch] || `${branch}谱面`)}
              </ToolbarRadioButton>
            ))}
          </ToolbarRadioGroup>
        </>
      ) : null}
    </Toolbar>
  );
}

export default PracticeToolbar;
