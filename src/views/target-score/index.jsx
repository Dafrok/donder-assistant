import React, { useMemo, useState } from 'react';
import {
  Body1,
  Breadcrumb,
  BreadcrumbButton,
  BreadcrumbDivider,
  BreadcrumbItem,
  Input
} from '@fluentui/react-components';

function parseNonNegativeInteger(value) {
  if (value === '') return null;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || !Number.isInteger(parsed) || parsed < 0) return NaN;
  return parsed;
}

function formatScore(value) {
  if (!Number.isFinite(value)) return '-';
  if (Math.abs(value - Math.round(value)) < 1e-9) {
    return `${Math.round(value)}`;
  }
  return value.toFixed(4).replace(/\.?0+$/, '');
}

function TargetScorePage() {
  const [form, setForm] = useState({
    currentScore: '',
    currentGood: '',
    currentOk: '',
    currentMiss: '',
    currentDrumroll: '',
    targetScore: '',
    targetDrumroll: ''
  });

  const result = useMemo(() => {
    const currentScore = parseNonNegativeInteger(form.currentScore);
    const currentGood = parseNonNegativeInteger(form.currentGood);
    const currentOk = parseNonNegativeInteger(form.currentOk);
    const currentMiss = parseNonNegativeInteger(form.currentMiss);
    const currentDrumroll = parseNonNegativeInteger(form.currentDrumroll);
    const targetScore = parseNonNegativeInteger(form.targetScore);
    const targetDrumroll = parseNonNegativeInteger(form.targetDrumroll);

    const values = [currentScore, currentGood, currentOk, currentMiss, currentDrumroll, targetScore, targetDrumroll];

    if (values.some((value) => Number.isNaN(value))) {
      return { status: 'error', message: '请输入大于或等于 0 的整数。' };
    }

    if ([currentScore, currentGood, currentOk, currentMiss, currentDrumroll, targetScore].some((value) => value === null)) {
      return { status: 'empty', message: '请输入完整参数后自动计算。' };
    }

    const baseWeight = currentGood * 2 + currentOk;
    if (baseWeight <= 0) {
      return { status: 'error', message: '当前成绩中的良和可至少要有一个，用于反推单个可分值。' };
    }

    const drumrollScore = currentDrumroll * 100;
    if (currentScore < drumrollScore) {
      return { status: 'error', message: '当前总分不能小于连打分数（连打 x 100）。' };
    }

    const noteScore = currentScore - drumrollScore;
    if (noteScore <= 0) {
      return { status: 'error', message: '当前成绩无法反推出有效的单个可分值。' };
    }

    const perOkScore = noteScore / baseWeight;
    if (!Number.isFinite(perOkScore) || perOkScore <= 0) {
      return { status: 'error', message: '无法反推单个可分值，请检查输入。' };
    }

    const totalNotes = currentGood + currentOk + currentMiss;
    if (totalNotes <= 0) {
      return { status: 'error', message: '当前成绩中的音符总数必须大于 0。' };
    }

    const resolvedTargetDrumroll = targetDrumroll === null ? currentDrumroll : targetDrumroll;
    const targetDrumrollScore = resolvedTargetDrumroll * 100;
    const maxPossibleScore = perOkScore * (2 * totalNotes) + targetDrumrollScore;
    if (targetScore > maxPossibleScore + 1e-9) {
      return {
        status: 'error',
        message: `目标分数过高，在目标连打与不可为 0 的前提下最高只能到 ${formatScore(maxPossibleScore)}。`
      };
    }

    const rawMaxOk = 2 * totalNotes - (targetScore - targetDrumrollScore) / perOkScore;
    const conservativeMaxOk = Math.floor(rawMaxOk + 1e-9);
    const maxOk = Math.min(totalNotes, Math.max(0, conservativeMaxOk));
    const minGood = totalNotes - maxOk;
    const projectedScore = perOkScore * (2 * minGood + maxOk) + targetDrumrollScore;
    const roundedDownForSafety = rawMaxOk - maxOk > 1e-9;

    return {
      status: 'ok',
      perOkScore,
      perGoodScore: perOkScore * 2,
      totalNotes,
      targetDrumroll: resolvedTargetDrumroll,
      maxOk,
      minGood,
      projectedScore,
      roundedDownForSafety
    };
  }, [form]);

  function updateField(field, value) {
    setForm((prev) => ({
      ...prev,
      [field]: value
    }));
  }

  return (
    <div className="results-panel target-score-panel">
      <header className="list-caption" aria-label="目标成绩速算导航">
        <Breadcrumb className="list-breadcrumb" aria-label="目标成绩速算面包屑">
          <BreadcrumbItem>
            <BreadcrumbButton>出勤工具</BreadcrumbButton>
          </BreadcrumbItem>
          <BreadcrumbDivider />
          <BreadcrumbItem>
            <BreadcrumbButton current aria-current="page">目标成绩速算</BreadcrumbButton>
          </BreadcrumbItem>
        </Breadcrumb>
      </header>

      <div className="table-wrapper target-score-wrapper">
        <Body1 className="target-score-hint">
          根据当前成绩反推单个判定分值，并在“不可为 0”的前提下计算达成目标时最多可出现的“可”。目标连打可选填，留空继承当前连打。
        </Body1>

        <div className="target-score-form-grid">
          <section className="target-score-group" aria-label="当前成绩输入组">
            <div className="target-score-label">当前成绩</div>
            <div className="target-score-inline-fields">
              <label className="target-score-inline-field" htmlFor="target-current-score">
                <Input
                  id="target-current-score"
                  type="number"
                  min="0"
                  step="1"
                  value={form.currentScore}
                  onChange={(_, data) => updateField('currentScore', data.value)}
                  contentAfter={<span className="target-score-inline-unit">分</span>}
                />
              </label>
              <label className="target-score-inline-field" htmlFor="target-current-good">
                <Input
                  id="target-current-good"
                  type="number"
                  min="0"
                  step="1"
                  value={form.currentGood}
                  onChange={(_, data) => updateField('currentGood', data.value)}
                  contentAfter={<span className="target-score-inline-unit">良</span>}
                />
              </label>
              <label className="target-score-inline-field" htmlFor="target-current-ok">
                <Input
                  id="target-current-ok"
                  type="number"
                  min="0"
                  step="1"
                  value={form.currentOk}
                  onChange={(_, data) => updateField('currentOk', data.value)}
                  contentAfter={<span className="target-score-inline-unit">可</span>}
                />
              </label>
              <label className="target-score-inline-field" htmlFor="target-current-miss">
                <Input
                  id="target-current-miss"
                  type="number"
                  min="0"
                  step="1"
                  value={form.currentMiss}
                  onChange={(_, data) => updateField('currentMiss', data.value)}
                  contentAfter={<span className="target-score-inline-unit">不可</span>}
                />
              </label>
              <label className="target-score-inline-field" htmlFor="target-current-drumroll">
                <Input
                  id="target-current-drumroll"
                  type="number"
                  min="0"
                  step="1"
                  value={form.currentDrumroll}
                  onChange={(_, data) => updateField('currentDrumroll', data.value)}
                  contentAfter={<span className="target-score-inline-unit">连打</span>}
                />
              </label>
            </div>
          </section>

          <section className="target-score-group" aria-label="目标成绩输入组">
            <div className="target-score-label">目标成绩</div>
            <div className="target-score-inline-fields">
              <label className="target-score-inline-field" htmlFor="target-score">
                <Input
                  id="target-score"
                  type="number"
                  min="0"
                  step="1"
                  value={form.targetScore}
                  onChange={(_, data) => updateField('targetScore', data.value)}
                  contentAfter={<span className="target-score-inline-unit">分</span>}
                />
              </label>
              <label className="target-score-inline-field" htmlFor="target-drumroll">
                <Input
                  id="target-drumroll"
                  type="number"
                  min="0"
                  step="1"
                  value={form.targetDrumroll}
                  onChange={(_, data) => updateField('targetDrumroll', data.value)}
                  contentAfter={<span className="target-score-inline-unit">连打</span>}
                  placeholder={form.currentDrumroll}
                />
              </label>
            </div>
          </section>
        </div>

        <section className="target-score-result" aria-live="polite">
          {result.status === 'ok' ? (
            <>
              <div className="target-score-result-main">
                爆可不能超过
                <span className="target-score-result-emphasis">{result.maxOk}</span>
                个
              </div>
              <div className="target-score-result-sub">至少良：{result.minGood} 个（不可按 0 计算）</div>
              <div className="target-score-result-sub">目标连打按 {result.targetDrumroll} 计算</div>
              <div className="target-score-result-sub">反推单个可分值：{formatScore(result.perOkScore)}，单个良分值：{formatScore(result.perGoodScore)}</div>
              <div className="target-score-result-sub">按该上限配置预计分数：{formatScore(result.projectedScore)}</div>
              {result.roundedDownForSafety ? (
                <div className="target-score-result-tip">存在小数时已按“可数更少”方向取整。</div>
              ) : null}
            </>
          ) : (
            <div className="target-score-result-message">{result.message}</div>
          )}
        </section>
      </div>
    </div>
  );
}

export default TargetScorePage;
