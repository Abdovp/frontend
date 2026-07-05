import { useEffect } from 'react';

/** Force LTR + English document settings while admin is mounted. */
export function useAdminDocument() {
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevDir = html.dir;
    const prevLang = html.lang;

    html.dir = 'ltr';
    html.lang = 'en';
    html.classList.add('admin-root');
    body.classList.add('admin-body');

    return () => {
      html.dir = prevDir;
      html.lang = prevLang;
      html.classList.remove('admin-root');
      body.classList.remove('admin-body');
    };
  }, []);
}
