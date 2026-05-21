import React from 'react';
import {
  Breadcrumb,
  BreadcrumbButton,
  BreadcrumbDivider,
  BreadcrumbItem
} from '@fluentui/react-components';

function PracticeBreadcrumb() {
  return (
    <header className="list-caption" aria-label="特训导航">
      <Breadcrumb className="list-breadcrumb" aria-label="特训面包屑">
        <BreadcrumbItem>
          <BreadcrumbButton>出勤工具</BreadcrumbButton>
        </BreadcrumbItem>
        <BreadcrumbDivider />
        <BreadcrumbItem>
          <BreadcrumbButton current aria-current="page">特训</BreadcrumbButton>
        </BreadcrumbItem>
      </Breadcrumb>
    </header>
  );
}

export default PracticeBreadcrumb;
