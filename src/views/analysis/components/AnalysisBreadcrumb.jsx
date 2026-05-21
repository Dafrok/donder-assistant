import React from 'react';
import { Breadcrumb, BreadcrumbButton, BreadcrumbDivider, BreadcrumbItem } from '@fluentui/react-components';

export function AnalysisBreadcrumb() {
  return (
    <header className="list-caption" aria-label="谱面列表说明与操作">
      <Breadcrumb className="list-breadcrumb" aria-label="面包屑">
        <BreadcrumbItem>
          <BreadcrumbButton>数据分析</BreadcrumbButton>
        </BreadcrumbItem>
        <BreadcrumbDivider />
        <BreadcrumbItem>
          <BreadcrumbButton current aria-current="page">谱面分析</BreadcrumbButton>
        </BreadcrumbItem>
      </Breadcrumb>
    </header>
  );
}

export default AnalysisBreadcrumb;
