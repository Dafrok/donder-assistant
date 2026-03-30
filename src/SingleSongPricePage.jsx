import React, { useMemo, useState } from 'react';
import {
  Body1,
  Breadcrumb,
  BreadcrumbButton,
  BreadcrumbDivider,
  BreadcrumbItem,
  Input
} from '@fluentui/react-components';

function parsePositiveNumber(value) {
  if (value === '') return null;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return NaN;
  return parsed;
}

function formatYuan(value) {
  return `¥${value.toFixed(4).replace(/\.?(0+)$/, '')}`;
}

function SingleSongPricePage({ onBack }) {
  const [form, setForm] = useState({
    x: '',
    y: '',
    m: '',
    n: ''
  });

  const result = useMemo(() => {
    const x = parsePositiveNumber(form.x);
    const y = parsePositiveNumber(form.y);
    const m = parsePositiveNumber(form.m);
    const n = parsePositiveNumber(form.n);

    if ([x, y, m, n].some((num) => Number.isNaN(num))) {
      return { status: 'error', message: '输入必须为大于 0 的数字。' };
    }

    if ([x, y, m, n].some((num) => num === null)) {
      return { status: 'empty', message: '请输入完整参数后自动计算。' };
    }

    const tokenPrice = x / y;
    const tokenPerSong = m / n;
    const songPrice = tokenPrice * tokenPerSong;

    return {
      status: 'ok',
      tokenPrice,
      tokenPerSong,
      songPrice
    };
  }, [form]);

  function updateField(field, value) {
    setForm((prev) => ({
      ...prev,
      [field]: value
    }));
  }

  return (
    <div className="results-panel single-price-panel">
      <header className="list-caption" aria-label="单曲价格速算导航">
        <Breadcrumb className="list-breadcrumb" aria-label="单曲价格速算面包屑">
          <BreadcrumbItem>
            <BreadcrumbButton>出勤工具</BreadcrumbButton>
          </BreadcrumbItem>
          <BreadcrumbDivider />
          <BreadcrumbItem>
            <BreadcrumbButton current aria-current="page">单曲价格速算</BreadcrumbButton>
          </BreadcrumbItem>
        </Breadcrumb>
      </header>

      <div className="table-wrapper single-price-wrapper">
        <Body1 className="single-price-hint">输入代币购买比例和游玩比例，自动换算单曲价格。</Body1>

        <div className="single-price-form-grid">
          <section className="single-price-group" aria-label="代币价格输入组">
            <div className="single-price-label">代币价格</div>
            <div className="single-price-inline-fields">
              <label className="single-price-inline-field" htmlFor="price-x">
                <Input
                  id="price-x"
                  type="number"
                  step="any"
                  min="0"
                  value={form.x}
                  onChange={(_, data) => updateField('x', data.value)}
                  contentAfter={<span className="single-price-inline-unit">元</span>}
                  placeholder="请输入"
                />
              </label>
              <label className="single-price-inline-field" htmlFor="price-y">
                <Input
                  id="price-y"
                  type="number"
                  step="any"
                  min="0"
                  value={form.y}
                  onChange={(_, data) => updateField('y', data.value)}
                  contentAfter={<span className="single-price-inline-unit">枚</span>}
                  placeholder="请输入"
                />
              </label>
            </div>
          </section>

          <section className="single-price-group" aria-label="游玩消耗输入组">
            <div className="single-price-label">游玩消耗</div>
            <div className="single-price-inline-fields">
              <label className="single-price-inline-field" htmlFor="price-m">
                <Input
                  id="price-m"
                  type="number"
                  step="any"
                  min="0"
                  value={form.m}
                  onChange={(_, data) => updateField('m', data.value)}
                  contentAfter={<span className="single-price-inline-unit">币</span>}
                  placeholder="请输入"
                />
              </label>
              <label className="single-price-inline-field" htmlFor="price-n">
                <Input
                  id="price-n"
                  type="number"
                  step="any"
                  min="0"
                  value={form.n}
                  onChange={(_, data) => updateField('n', data.value)}
                  contentAfter={<span className="single-price-inline-unit">曲</span>}
                  placeholder="请输入"
                />
              </label>
            </div>
          </section>
        </div>

        <section className="single-price-result" aria-live="polite">
          {result.status === 'ok' ? (
            <>
              <div className="single-price-result-main">单曲价格：{formatYuan(result.songPrice)}</div>
              <div className="single-price-result-sub">每枚代币价格：{formatYuan(result.tokenPrice)}</div>
              <div className="single-price-result-sub">每曲消耗代币：{result.tokenPerSong.toFixed(4).replace(/\.?(0+)$/, '')} 枚</div>
            </>
          ) : (
            <div className="single-price-result-message">{result.message}</div>
          )}
        </section>

      </div>
    </div>
  );
}

export default SingleSongPricePage;