import { initializeApp } from 'firebase/app';
import {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  serverTimestamp,
  startAfter,
  type QueryDocumentSnapshot,
} from 'firebase/firestore/lite';
import { config } from '../config';

const PAGE = 8; // 한 번에 보여 주는 글 수
const COOLDOWN = 30_000; // 연속 등록 방지 (30초)
const NAME_MAX = 20;
const MESSAGE_MAX = 300;

export function initGuestbook(toast: (message: string) => void) {
  const form = document.getElementById('gb-form') as HTMLFormElement | null;
  const list = document.getElementById('gb-list');
  const status = document.getElementById('gb-status');
  const more = document.getElementById('gb-more') as HTMLButtonElement | null;
  const count = document.getElementById('gb-count');
  if (!form || !list || !status || !more) return;

  const nameInput = form.elements.namedItem('name') as HTMLInputElement;
  const messageInput = form.elements.namedItem('message') as HTMLTextAreaElement;
  const submit = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;

  const db = getFirestore(initializeApp(config.guestbook));
  const entries = collection(db, 'guestbook');
  let last: QueryDocumentSnapshot | null = null;
  let loading = false;

  const formatDate = (d: Date) =>
    `${d.getFullYear()}. ${String(d.getMonth() + 1).padStart(2, '0')}. ${String(d.getDate()).padStart(2, '0')}`;

  // 글은 항상 textContent 로 넣어, 누가 태그를 적어도 글자로만 보이게 합니다.
  const render = (name: string, message: string, date: Date | null) => {
    const li = document.createElement('li');
    li.className = 'gb-item';
    const head = document.createElement('div');
    head.className = 'gb-item-head';
    const who = document.createElement('strong');
    who.textContent = name;
    const when = document.createElement('time');
    when.textContent = date ? formatDate(date) : '';
    head.append(who, when);
    const body = document.createElement('p');
    body.textContent = message;
    li.append(head, body);
    return li;
  };

  async function load() {
    if (loading) return;
    loading = true;
    more.disabled = true;
    try {
      const parts = [orderBy('createdAt', 'desc'), ...(last ? [startAfter(last)] : []), limit(PAGE + 1)];
      const snap = await getDocs(query(entries, ...parts));
      const docs = snap.docs.slice(0, PAGE);
      docs.forEach((d) => {
        const data = d.data();
        list.append(render(String(data.name ?? ''), String(data.message ?? ''), data.createdAt?.toDate?.() ?? null));
      });
      if (docs.length) last = docs[docs.length - 1];
      more.hidden = snap.docs.length <= PAGE;
      status.hidden = list.children.length > 0;
      status.textContent = '첫 번째 축하 메시지를 남겨 주세요.';
    } catch {
      status.hidden = false;
      status.textContent = '방명록을 불러오지 못했습니다. 잠시 후 다시 열어 주세요.';
    } finally {
      loading = false;
      more.disabled = false;
    }
  }

  more.addEventListener('click', load);

  messageInput.addEventListener('input', () => {
    if (count) count.textContent = `${messageInput.value.length} / ${MESSAGE_MAX}`;
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = nameInput.value.trim().slice(0, NAME_MAX);
    const message = messageInput.value.trim().slice(0, MESSAGE_MAX);
    if (!name) {
      nameInput.focus();
      return toast('이름을 적어 주세요');
    }
    if (!message) {
      messageInput.focus();
      return toast('축하 메시지를 적어 주세요');
    }

    let lastSent = 0;
    try {
      lastSent = Number(localStorage.getItem('gb-sent')) || 0;
    } catch {}
    if (Date.now() - lastSent < COOLDOWN) return toast('잠시 후 다시 남겨 주세요');

    submit.disabled = true;
    try {
      await addDoc(entries, { name, message, createdAt: serverTimestamp() });
      try {
        localStorage.setItem('gb-sent', String(Date.now()));
      } catch {}
      list.prepend(render(name, message, new Date()));
      status.hidden = true;
      messageInput.value = '';
      if (count) count.textContent = `0 / ${MESSAGE_MAX}`;
      toast('축하 메시지를 남겼습니다');
    } catch {
      toast('남기지 못했습니다. 잠시 후 다시 시도해 주세요');
    } finally {
      submit.disabled = false;
    }
  });

  load();
}
