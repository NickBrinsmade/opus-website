// Every <form data-access-form> on the page posts to the request_access RPC.
// iPhone doesn't: choosing it toggles .ios, which shows the TestFlight link.
// The RPC answers the same way for new and repeat emails, so the form never
// reveals who is already on the list.
import { SUPABASE_URL, SUPABASE_KEY } from '../lib/site';
import { track } from './track';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function source(form: HTMLFormElement) {
  const q = new URLSearchParams(location.search);
  return {
    p_source: (q.get('src') || location.pathname).slice(0, 200),
    p_placement: (form.dataset.placement || '').slice(0, 60),
    p_referrer: (document.referrer || '').slice(0, 300),
    p_utm: ['utm_source', 'utm_medium', 'utm_campaign'].map((k) => q.get(k) || '').join('|').slice(0, 200),
  };
}

async function submit(form: HTMLFormElement) {
  const status = form.querySelector<HTMLElement>('[data-status]')!;
  const button = form.querySelector<HTMLButtonElement>('button[type=submit]')!;
  const data = new FormData(form);
  const email = String(data.get('email') || '').trim();
  const platform = String(data.get('platform') || '');

  if (data.get('website')) return; // honeypot: bots fill every field
  if (!EMAIL.test(email)) return show(status, 'error', 'That email doesn’t look right.');
  if (platform === 'ios') return; // the TestFlight link replaces the submit button
  if (platform !== 'android') return show(status, 'error', 'Pick iPhone or Android so we send the right invite.');

  button.disabled = true;
  show(status, 'busy', 'Sending…');
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/request_access`, {
      method: 'POST',
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ p_email: email, p_platform: platform, ...source(form) }),
    });
    if (!res.ok) throw new Error(String(res.status));
    track('access_submit', { placement: form.dataset.placement, platform });
    form.classList.add('done');
    show(status, 'ok', 'You’re on the list. When a spot opens we’ll email you a Google Play testing link.');
  } catch {
    button.disabled = false;
    show(status, 'error', 'Something went wrong on our side. Please try again in a minute.');
  }
}

function show(el: HTMLElement, kind: 'ok' | 'error' | 'busy', text: string) {
  el.dataset.kind = kind;
  el.textContent = text;
}

document.querySelectorAll<HTMLFormElement>('form[data-access-form]').forEach((form) => {
  form.addEventListener('submit', (e) => { e.preventDefault(); submit(form); });
  form.addEventListener('change', () => {
    form.classList.toggle('ios', new FormData(form).get('platform') === 'ios');
  });
  form.querySelector('[data-testflight]')?.addEventListener('click', () => {
    track('testflight_click', { placement: form.dataset.placement });
  });
});
