import React from 'react';

function PracticeStage({
  onPointerDown,
  onTouchStart,
  canvasRef,
  touchGuideCanvasRef,
  fileInputRef,
  onImportLocalCharts
}) {
  return (
    <>
      <div className="practice-frame-wrap" onPointerDown={onPointerDown} onTouchStart={onTouchStart}>
        <canvas ref={canvasRef} className="practice-lane-canvas" aria-label="最小可玩轨道（Canvas 2D）" />
        <div className="practice-touch-zone" aria-label="触屏打鼓区">
          <canvas ref={touchGuideCanvasRef} className="practice-touch-guide-canvas" aria-hidden="true" />
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple={false}
        className="hidden-input"
        onChange={onImportLocalCharts}
        accept=".tja,.zip"
      />
    </>
  );
}

export default PracticeStage;
