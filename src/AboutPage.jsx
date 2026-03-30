import React from 'react';
import {
  Body1,
  Breadcrumb,
  BreadcrumbButton,
  BreadcrumbDivider,
  BreadcrumbItem,
  Button,
  Link
} from '@fluentui/react-components';

function AboutPage({ footerInfo, isOffline, onBack }) {
  return (
    <div className="results-panel">
      <header className="list-caption" aria-label="关于页面导航">
        <Breadcrumb className="list-breadcrumb" aria-label="帮助页面面包屑">
          <BreadcrumbItem>
            <BreadcrumbButton current aria-current="page">帮助</BreadcrumbButton>
          </BreadcrumbItem>
        </Breadcrumb>
      </header>
      <div className="table-wrapper" style={{ padding: 16 }}>
        <Body1>
          这是一个用于分析太鼓谱面难度的工具，支持导入 TJA 谱面文件，自动计算体力、复合、节奏、手速与爆发等维度评分。
        </Body1>
        <Body1 style={{ marginTop: 8 }}>
          你可以通过上传或拖拽文件夹批量导入谱面，使用顶部筛选与搜索快速定位歌曲，并将计算结果导出为 CSV。
        </Body1>
        <div className="about-meta" style={{ marginTop: 12 }}>
          <div className="about-meta-line">部署时间: {footerInfo.timeStr}</div>
          <div className="about-meta-line">
            版本:
            {' '}
            <Link href={`https://github.com/Dafrok/taiko-rating-app/commit/${footerInfo.hash}`} target="_blank" rel="noreferrer">
              {footerInfo.hash}
            </Link>
          </div>
          <div className="about-meta-line">
            网络状态:
            {' '}
            <span className={`network-status ${isOffline ? 'is-offline' : 'is-online'}`}>
              {isOffline ? '网络不可达' : '网络可达'}
            </span>
          </div>
        </div>
        <Button appearance="primary" style={{ marginTop: 16 }} onClick={onBack}>
          返回列表
        </Button>
      </div>
    </div>
  );
}

export default AboutPage;
