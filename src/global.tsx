import { Button, message, notification } from 'antd';
import React from 'react';
import defaultSettings from '../config/defaultSettings';

const { pwa } = defaultSettings;
// if pwa is true
if (pwa) {
  // 如果现在脱机，请通知用户
  window.addEventListener('sw.offline', () => {
    message.warning('当前处于离线状态');
  });
  // 在页面上弹出一个提示，询问用户是否想使用最新版本
  window.addEventListener('sw.updated', (event: Event) => {
    const e = event as CustomEvent;
    const reloadSW = async () => {
      // 检查ServiceWorkerRegistration中是否有状态正在等待的sw
      // https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration
      const worker = e.detail && e.detail.waiting;
      if (!worker) {
        return true;
      }
      // 用MessageChannel将skip-waiting事件发送到waiting SW
      await new Promise((resolve, reject) => {
        const channel = new MessageChannel();
        channel.port1.onmessage = msgEvent => {
          if (msgEvent.data.error) {
            reject(msgEvent.data.error);
          } else {
            resolve(msgEvent.data);
          }
        };
        worker.postMessage({ type: 'skip-waiting' }, [channel.port2]);
      });
      // 刷新当前页面，在SW跳过等待后使用更新的HTML和其他资产
      window.location.reload(true);
      return true;
    };

    const key = `open${Date.now()}`;
    const btn = (
      <Button
        type="primary"
        onClick={() => {
          notification.close(key);
          reloadSW();
        }}
      >
      刷新
      </Button>
    );
    notification.open({
      message: '有新内容',
      description: '请点击“刷新”按钮或者手动刷新页面',
      btn,
      key,
      onClose: async () => { },
    });
  });
} else if ('serviceWorker' in navigator) {
  // 注销服务工作者
  const { serviceWorker } = navigator;
  if (serviceWorker.getRegistrations) {
    serviceWorker.getRegistrations().then(sws => {
      sws.forEach(sw => {
        sw.unregister();
      });
    });
  }
  serviceWorker.getRegistration().then(sw => {
    if (sw) sw.unregister();
  });

  // 清除所有缓存
  if (window.caches && window.caches.keys) {
    caches.keys().then(keys => {
      keys.forEach(key => {
        caches.delete(key);
      });
    });
  }
}
