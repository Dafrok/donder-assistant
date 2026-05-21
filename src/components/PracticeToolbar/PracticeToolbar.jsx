import React from 'react';
import {
  Toolbar,
  ToolbarButton
} from '@fluentui/react-components';
import {
  DataHistogramRegular,
  FastForwardRegular,
  FolderOpenRegular,
  FullScreenMaximizeRegular,
  FullScreenMinimizeRegular,
  PlaySettingsRegular,
  ReplayRegular,
  RewindRegular,
  SettingsRegular
} from '@fluentui/react-icons';

function PracticeToolbar({
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
  onOpenResultDialog,
  onOpenSpeedDialog,
  onOpenSettings,
  isFullscreen,
  onToggleFullscreen
}) {
  return (
    <Toolbar className="practice-toolbar practice-toolbar-main" aria-label="练习控制">
      <div className="practice-toolbar-group" role="group" aria-label="播放与游戏设置">
        <ToolbarButton
          onClick={onImportClick}
          icon={<FolderOpenRegular />}
          aria-label="导入 TJA / ZIP"
          title="导入 TJA / ZIP"
        />
        <ToolbarButton
          onClick={mainPlaybackAction}
          disabled={mainPlaybackDisabled}
          icon={mainPlaybackIcon}
          aria-label={mainPlaybackLabel}
          title={mainPlaybackLabel}
        />
        <ToolbarButton
          onClick={onOpenSpeedDialog}
          icon={<PlaySettingsRegular />}
          aria-label="游戏设置"
          title="游戏设置"
        />
      </div>
      <div className="practice-toolbar-group" role="group" aria-label="小节与重置">
        <ToolbarButton
          onClick={onSeekPrevBar}
          disabled={!notesLength || !isPaused}
          icon={<RewindRegular />}
          aria-label="上一小节"
          title="上一小节"
        />
        <ToolbarButton
          onClick={onSeekNextBar}
          disabled={!notesLength || !isPaused}
          icon={<FastForwardRegular />}
          aria-label="下一小节"
          title="下一小节"
        />
        <ToolbarButton
          onClick={onReset}
          disabled={!notesLength}
          icon={<ReplayRegular />}
          aria-label="重置"
          title="重置"
        />
      </div>
      <div className="practice-toolbar-group" role="group" aria-label="系统设置">
        <ToolbarButton
          onClick={onOpenResultDialog}
          disabled={!notesLength}
          icon={<DataHistogramRegular />}
          aria-label="结算"
          title="结算"
        />
        <ToolbarButton
          onClick={onOpenSettings}
          icon={<SettingsRegular />}
          aria-label="设置"
          title="设置"
        />
        <ToolbarButton
          onClick={onToggleFullscreen}
          icon={isFullscreen ? <FullScreenMinimizeRegular /> : <FullScreenMaximizeRegular />}
          aria-label={isFullscreen ? '退出全屏' : '全屏'}
          title={isFullscreen ? '退出全屏' : '全屏'}
        />
      </div>
    </Toolbar>
  );
}

export default PracticeToolbar;
