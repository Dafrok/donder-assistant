import React, { useState } from 'react';
import {
  Body1,
  Button,
  Breadcrumb,
  BreadcrumbButton,
  BreadcrumbItem,
  Divider,
  Link
} from '@fluentui/react-components';

function normalizeComparableUrl(urlLike) {
  if (!urlLike) return '';
  try {
    const url = new URL(urlLike, window.location.href);
    return `${url.origin}${url.pathname}${url.search}`;
  } catch (_) {
    return String(urlLike);
  }
}

function getCurrentEntryScriptUrl() {
  const moduleScripts = Array.from(document.querySelectorAll('script[type="module"][src]'));
  if (!moduleScripts.length) return '';
  return moduleScripts[moduleScripts.length - 1]?.src || '';
}

async function getServerEntryScriptUrl(scope) {
  const indexUrl = new URL(`index.html?__update_check=${Date.now()}`, scope).toString();
  const response = await fetch(indexUrl, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`获取线上 index 失败（${response.status}）`);
  }

  const html = await response.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const moduleScripts = Array.from(doc.querySelectorAll('script[type="module"][src]'));
  if (!moduleScripts.length) return '';
  const lastScriptSrc = moduleScripts[moduleScripts.length - 1]?.getAttribute('src') || '';
  if (!lastScriptSrc) return '';
  return new URL(lastScriptSrc, scope).toString();
}

async function forceRefreshFromServer(registration) {
  if ('caches' in window) {
    const keys = await caches.keys();
    await Promise.all(keys.map((key) => caches.delete(key)));
  }

  await registration.unregister();
  const url = new URL(window.location.href);
  url.searchParams.set('__force_refresh', String(Date.now()));
  window.location.replace(url.toString());
}

function AboutPage({ footerInfo, isOffline, onBack }) {
  const [isCheckingUpdate, setIsCheckingUpdate] = useState(false);
  const [updateHint, setUpdateHint] = useState('');

  async function checkForUpdate() {
    if (!('serviceWorker' in navigator)) {
      setUpdateHint('当前浏览器不支持 Service Worker，无法检查更新。');
      return;
    }

    if (!window.isSecureContext) {
      setUpdateHint('当前页面不是安全上下文（HTTPS），无法检查更新。');
      return;
    }

    setIsCheckingUpdate(true);
    setUpdateHint('正在检查更新...');

    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (!registration) {
        setUpdateHint('未检测到已注册的离线缓存，请先刷新页面后再试。');
        return;
      }

      if (registration.waiting) {
        const shouldActivate = window.confirm('发现新版本，是否立即更新？');
        if (shouldActivate) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
          setUpdateHint('正在切换到新版本...');
        } else {
          setUpdateHint('已检测到新版本，稍后可再次点击检查更新。');
        }
        return;
      }

      await registration.update();
      await new Promise((resolve) => setTimeout(resolve, 800));

      const latestRegistration = await navigator.serviceWorker.getRegistration();
      if (latestRegistration?.waiting) {
        const shouldActivate = window.confirm('发现新版本，是否立即更新？');
        if (shouldActivate) {
          latestRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
          setUpdateHint('正在切换到新版本...');
        } else {
          setUpdateHint('已检测到新版本，稍后可再次点击检查更新。');
        }
      } else {
        const currentEntryUrl = getCurrentEntryScriptUrl();
        const serverEntryUrl = await getServerEntryScriptUrl(latestRegistration?.scope || registration.scope || window.location.origin);

        if (currentEntryUrl && serverEntryUrl
          && normalizeComparableUrl(currentEntryUrl) !== normalizeComparableUrl(serverEntryUrl)) {
          const shouldForceRefresh = window.confirm('检测到静态资源已更新，是否立即强制刷新并更新离线缓存？');
          if (shouldForceRefresh) {
            setUpdateHint('检测到资源变化，正在强制刷新并更新缓存...');
            await forceRefreshFromServer(latestRegistration || registration);
            return;
          }
          setUpdateHint('已检测到静态资源变化，稍后可再次点击检查更新。');
        } else {
          setUpdateHint('当前已经是最新版本。');
        }
      }
    } catch (error) {
      setUpdateHint(`检查更新失败：${error?.message || String(error)}`);
    } finally {
      setIsCheckingUpdate(false);
    }
  }

  return (
    <div className="results-panel">
      <header className="list-caption" aria-label="关于页面导航">
        <Breadcrumb className="list-breadcrumb" aria-label="关于页面面包屑">
          <BreadcrumbItem>
            <BreadcrumbButton current aria-current="page">关于</BreadcrumbButton>
          </BreadcrumbItem>
        </Breadcrumb>
      </header>
      <div className="table-wrapper" style={{ padding: 16 }}>
        <section aria-label="工具简介">
          <h3 style={{ margin: 0, fontSize: 16 }}>工具简介</h3>
          <Body1 style={{ marginTop: 8 }}>
            Donder Assistant 是面向鼓众的免费工具，提供谱面分析、定数查询与出勤测算等功能，打开网页即可使用，并可安装至桌面以便快速访问。
          </Body1>
        </section>

        <section aria-label="本地安装与离线" style={{ marginTop: 14 }}>
          <h3 style={{ margin: 0, fontSize: 16 }}>本地安装与离线</h3>
          <Body1 style={{ marginTop: 8 }}>
            本工具支持以 PWA 形式安装到本地桌面或主屏，安装后可像本地应用一样快速启动并直接使用。应用会缓存必要页面与数据（localStorage / IndexedDB），在离线或弱网场景下仍可访问已加载内容；网络恢复后会自动同步更新状态。
          </Body1>
        </section>

        <Divider style={{ marginTop: 14 }} />

        <div className="about-meta" style={{ marginTop: 12 }}>
          <div className="about-meta-line">部署时间: {footerInfo.timeStr}</div>
          <div className="about-meta-line">
            版本:
            {' '}
            <Link href={`https://github.com/Dafrok/donder-assistant/commit/${footerInfo.hash}`} target="_blank" rel="noreferrer">
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

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 14, flexWrap: 'wrap' }}>
          <Button appearance="primary" onClick={checkForUpdate} disabled={isCheckingUpdate}>
            {isCheckingUpdate ? '检查中...' : '检查更新'}
          </Button>
          <Body1>{updateHint || '可手动检查当前 PWA 是否有新版本。'}</Body1>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
