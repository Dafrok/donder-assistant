/**
 * 首页
 * 应用的默认页面，重定向到分析页面
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../routes.js';

export function HomePage() {
  const navigate = useNavigate();

  useEffect(() => {
    // 首页直接重定向到分析页面
    navigate(ROUTES.ANALYSIS, { replace: true });
  }, [navigate]);

  return null;
}

export default HomePage;
