'use client';

import { useEffect, useState } from 'react';

const storageKey = 'pil-color-theme';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setIsDark(document.documentElement.dataset.theme === 'dark');
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  function toggleTheme() {
    const root = document.documentElement;
    const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';

    root.dataset.theme = nextTheme;
    root.style.colorScheme = nextTheme;
    setIsDark(nextTheme === 'dark');
    try {
      window.localStorage.setItem(storageKey, nextTheme);
    } catch {
      // The theme still applies to the current page when storage is unavailable.
    }
  }

  return (
    <button
      className="theme-toggle"
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? '切换为浅色主题' : '切换为深色主题'}
      aria-pressed={isDark}
      title={isDark ? '切换为浅色主题' : '切换为深色主题'}
    >
      <svg className="theme-icon theme-icon-moon" aria-hidden="true" viewBox="0 0 24 24">
        <path d="M20 15.3A8.5 8.5 0 0 1 8.7 4a8.5 8.5 0 1 0 11.3 11.3Z" />
      </svg>
      <svg className="theme-icon theme-icon-sun" aria-hidden="true" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="3.5" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.66 6.34l1.41-1.41" />
      </svg>
    </button>
  );
}
