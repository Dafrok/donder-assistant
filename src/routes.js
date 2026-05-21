/**
 * 路由配置文件
 * 包含所有路由定义、常量、路由检测工具函数和组件映射
 */

// 延迟导入组件，避免循环依赖
let componentCache = null;
function getComponents() {
  if (!componentCache) {
    componentCache = {
      HomePage: () => import('./HomePage.jsx').then(m => m.default),
      AnalysisPage: () => import('./AnalysisPage.jsx').then(m => m.default),
      AboutPage: () => import('./AboutPage.jsx').then(m => m.default),
      ChartDetailPage: () => import('./ChartDetailPage.jsx').then(m => m.default),
      ConstantsDetailPage: () => import('./ConstantsDetailPage.jsx').then(m => m.default),
      ConstantsTablePage: () => import('./ConstantsTablePage.jsx').then(m => m.default),
      PracticeModePage: () => import('./PracticeModePage.jsx').then(m => m.default),
      SingleSongPricePage: () => import('./SingleSongPricePage.jsx').then(m => m.default),
      TargetScorePage: () => import('./TargetScorePage.jsx').then(m => m.default)
    };
  }
  return componentCache;
}

// ============================================================================
// 路由路径常量
// ============================================================================

export const ROUTES = {
  HOME: '/',
  ANALYSIS: '/analysis',
  CONSTANTS: '/constants',
  CONSTANTS_DETAIL: '/constants/:entryId',
  SINGLE_PRICE: '/single-price',
  TARGET_SCORE: '/target-score',
  PRACTICE: '/practice',
  ABOUT: '/about',
  CHART_DETAIL: '/chart/:chartId',
  CHART_PREVIEW: '/chart/:chartId/preview'
};

// ============================================================================
// 路由检测工具函数
// ============================================================================

/**
 * 获取当前路由名称
 * @param {string} pathname - 当前路径
 * @param {Object} location - React Router 的 location 对象
 * @returns {Object} 包含各种路由检测状态的对象
 */
export function detectRoutes(pathname, matchPath) {
  const isAboutRoute = pathname === ROUTES.ABOUT;
  const isConstantsRoute = pathname === ROUTES.CONSTANTS;
  const constantsDetailRouteMatch = matchPath(ROUTES.CONSTANTS_DETAIL, pathname);
  const isConstantsDetailRoute = Boolean(constantsDetailRouteMatch);
  const isSinglePriceRoute = pathname === ROUTES.SINGLE_PRICE;
  const isTargetScoreRoute = pathname === ROUTES.TARGET_SCORE;
  const isPracticeRoute = pathname === ROUTES.PRACTICE;
  const isAnalysisRoute = pathname === ROUTES.ANALYSIS;
  const isRootRoute = pathname === ROUTES.HOME;
  
  const chartPreviewRouteMatch = matchPath(ROUTES.CHART_PREVIEW, pathname);
  const chartDetailRouteMatch = matchPath(ROUTES.CHART_DETAIL, pathname);
  const chartRouteMatch = chartPreviewRouteMatch || chartDetailRouteMatch;
  const isChartRoute = Boolean(chartRouteMatch);
  
  const isKnownRoute = 
    isRootRoute || 
    isAnalysisRoute || 
    isConstantsRoute || 
    isConstantsDetailRoute || 
    isAboutRoute || 
    isSinglePriceRoute || 
    isTargetScoreRoute || 
    isPracticeRoute || 
    isChartRoute;

  return {
    isAboutRoute,
    isConstantsRoute,
    constantsDetailRouteMatch,
    isConstantsDetailRoute,
    isSinglePriceRoute,
    isTargetScoreRoute,
    isPracticeRoute,
    isAnalysisRoute,
    isRootRoute,
    chartPreviewRouteMatch,
    chartDetailRouteMatch,
    chartRouteMatch,
    isChartRoute,
    isKnownRoute
  };
}

/**
 * 检查当前是否为分析或常量表页面
 * @param {boolean} isAnalysisRoute - 是否为分析页面
 * @param {boolean} isConstantsRoute - 是否为常量表页面
 * @returns {boolean}
 */
export function isMainDataPage(isAnalysisRoute, isConstantsRoute) {
  return isAnalysisRoute || isConstantsRoute;
}

/**
 * 获取路由对应的导航值
 * @param {Object} routes - 路由检测对象
 * @returns {string|null} 导航值或 null
 */
export function getNavValueFromRoutes(routes) {
  const {
    isAnalysisRoute,
    isConstantsRoute,
    isSinglePriceRoute,
    isTargetScoreRoute,
    isPracticeRoute,
    isAboutRoute
  } = routes;

  if (isAnalysisRoute) return 'analysis';
  if (isConstantsRoute) return 'constants';
  if (isSinglePriceRoute) return 'singlePrice';
  if (isTargetScoreRoute) return 'targetScore';
  if (isPracticeRoute) return 'practice';
  if (isAboutRoute) return 'about';
  
  return null;
}

/**
 * 导航菜单项配置
 */
export const NAVIGATION_CONFIG = {
  sections: [
    {
      label: '数据分析',
      items: [
        { value: 'constants', label: '定数表', path: ROUTES.CONSTANTS },
        { value: 'analysis', label: '谱面分析', path: ROUTES.ANALYSIS }
      ]
    },
    {
      label: '出勤工具',
      items: [
        { value: 'singlePrice', label: '单曲价格速算', path: ROUTES.SINGLE_PRICE },
        { value: 'targetScore', label: '目标成绩速算', path: ROUTES.TARGET_SCORE },
        { value: 'practice', label: '特训', path: ROUTES.PRACTICE }
      ]
    },
    {
      label: '其他',
      items: [
        { value: 'about', label: '关于', path: ROUTES.ABOUT }
      ]
    }
  ]
};

/**
 * 路由配置表
 * 定义每个路由的详细配置，包括组件、布局类型等
 */
export const ROUTE_CONFIG = {
  [ROUTES.HOME]: {
    name: 'home',
    component: 'HomePage',
    layout: 'hidden'
  },
  [ROUTES.ANALYSIS]: {
    name: 'analysis',
    component: 'AnalysisPage',
    layout: 'main',
    isDataPage: true,
    showSearch: true,
    showFooter: true
  },
  [ROUTES.CONSTANTS]: {
    name: 'constants',
    component: 'ConstantsTablePage',
    layout: 'main',
    isDataPage: true,
    showSearch: true,
    showFooter: true
  },
  [ROUTES.CONSTANTS_DETAIL]: {
    name: 'constants-detail',
    component: 'ConstantsDetailPage',
    layout: 'overlay'
  },
  [ROUTES.SINGLE_PRICE]: {
    name: 'single-price',
    component: 'SingleSongPricePage',
    layout: 'overlay'
  },
  [ROUTES.TARGET_SCORE]: {
    name: 'target-score',
    component: 'TargetScorePage',
    layout: 'overlay'
  },
  [ROUTES.PRACTICE]: {
    name: 'practice',
    component: 'PracticeModePage',
    layout: 'overlay'
  },
  [ROUTES.ABOUT]: {
    name: 'about',
    component: 'AboutPage',
    layout: 'overlay'
  },
  [ROUTES.CHART_DETAIL]: {
    name: 'chart-detail',
    component: 'ChartDetailPage',
    layout: 'overlay'
  },
  [ROUTES.CHART_PREVIEW]: {
    name: 'chart-preview',
    component: 'ChartDetailPage',
    layout: 'overlay',
    preview: true
  }
};

/**
 * 获取路由的组件
 * @param {string} componentName - 组件名称
 * @returns {Promise<Component>|Component|null} 组件或 Promise
 */
export function getRouteComponent(componentName) {
  const components = getComponents();
  if (!componentName || typeof componentName !== 'string') return null;
  const componentFn = components[componentName];
  return componentFn ? componentFn() : null;
}

/**
 * 检查路由是否为主数据页面
 * @param {string} pathname - 路径名
 * @returns {boolean}
 */
export function isDataRoute(pathname) {
  const config = ROUTE_CONFIG[pathname];
  return config?.isDataPage === true;
}

/**
 * 检查路由是否需要显示搜索栏
 * @param {string} pathname - 路径名
 * @returns {boolean}
 */
export function shouldShowSearch(pathname) {
  const config = ROUTE_CONFIG[pathname];
  return config?.showSearch === true;
}

/**
 * 检查路由是否需要显示页脚
 * @param {string} pathname - 路径名
 * @returns {boolean}
 */
export function shouldShowFooter(pathname) {
  const config = ROUTE_CONFIG[pathname];
  return config?.showFooter === true;
}

/**
 * 获取路由配置
 * @param {string} pathname - 路径名
 * @returns {Object|null}
 */
export function getRouteConfig(pathname) {
  return ROUTE_CONFIG[pathname] || null;
}

/**
 * 路由元数据
 */
export const ROUTE_META = {
  [ROUTES.HOME]: {
    title: 'Donder Assistant',
    description: '主页'
  },
  [ROUTES.ANALYSIS]: {
    title: 'Donder Assistant - 谱面分析',
    description: '谱面分析'
  },
  [ROUTES.CONSTANTS]: {
    title: 'Donder Assistant - 定数表',
    description: '定数表'
  },
  [ROUTES.SINGLE_PRICE]: {
    title: 'Donder Assistant - 单曲价格速算',
    description: '单曲价格速算'
  },
  [ROUTES.TARGET_SCORE]: {
    title: 'Donder Assistant - 目标成绩速算',
    description: '目标成绩速算'
  },
  [ROUTES.PRACTICE]: {
    title: 'Donder Assistant - 特训',
    description: '特训'
  },
  [ROUTES.ABOUT]: {
    title: 'Donder Assistant - 关于',
    description: '关于'
  }
};
