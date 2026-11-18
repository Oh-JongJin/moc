import { config } from '../config';

// ----- 토스트 알림 -----
const toastEl = document.getElementById('toast')!;
let toastTimer: number | undefined;
function toast(message: string) {
  toastEl.textContent = message;
  toastEl.classList.add('show');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toastEl.classList.remove('show'), 2200);
}

// ----- 인트로: 한 번 본 뒤에는 생략합니다 -----
// 인트로 중에도 스크롤은 그대로 되므로, 화면을 건드렸다고 중간에 끊지 않습니다.
// (중간에 끊으면 확대돼 있던 사진이 원래 크기로 뚝 바뀌어 보입니다.)
const html = document.documentElement;
if (html.classList.contains('intro')) {
  try {
    sessionStorage.setItem('intro-seen', '1');
  } catch {}
  // 모든 움직임이 끝난 뒤에 정리합니다. 이 시점에는 화면이 이미 최종 상태라 변화가 보이지 않습니다.
  window.setTimeout(() => html.classList.remove('intro'), 6500);
}

// ----- 복사 (카톡 인앱 브라우저처럼 clipboard API가 막힌 곳을 위한 예비 방법 포함) -----
async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0';
    document.body.appendChild(ta);
    ta.select();
    ta.setSelectionRange(0, text.length);
    const ok = document.execCommand('copy');
    ta.remove();
    return ok;
  }
}

document.querySelectorAll<HTMLElement>('[data-copy]').forEach((el) => {
  el.addEventListener('click', async () => {
    const ok = await copyText(el.dataset.copy!);
    toast(ok ? el.dataset.copied || '복사했습니다' : '복사하지 못했습니다. 길게 눌러 복사해 주세요');
  });
});

// ----- 스크롤하면 나타나는 효과 -----
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
  );
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('in'));
}

// ----- D-day -----
const ddayEl = document.getElementById('dday');
if (ddayEl?.dataset.date) {
  const [y, m, d] = ddayEl.dataset.date.split('-').map(Number);
  const now = new Date();
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  const diff = Math.round((Date.UTC(y, m - 1, d) - today) / 86_400_000);
  const names = `${config.groom.name} · ${config.bride.name}`;
  if (diff > 0) ddayEl.innerHTML = `${names}의 결혼식이 <strong>${diff}일</strong> 남았습니다`;
  else if (diff === 0) ddayEl.innerHTML = `${names}의 결혼식이 <strong>오늘</strong>입니다`;
  else ddayEl.innerHTML = `${names}, 함께한 지 <strong>${-diff}일</strong>째입니다`;
}

// ----- 네이버 지도 -----
const mapEl = document.getElementById('map');
if (mapEl && config.naverMapClientId) {
  // 키가 잘못됐거나 등록되지 않은 주소에서 열리면 지도를 숨기고 버튼만 남깁니다.
  (window as any).navermap_authFailure = () => mapEl.remove();

  const sdk = document.createElement('script');
  sdk.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${config.naverMapClientId}`;
  sdk.async = true;
  sdk.onerror = () => mapEl.remove();
  sdk.onload = () => {
    const naver = (window as any).naver;
    if (!naver?.maps) return mapEl.remove();
    const position = new naver.maps.LatLng(Number(mapEl.dataset.lat), Number(mapEl.dataset.lng));
    const map = new naver.maps.Map(mapEl, {
      center: position,
      zoom: 16,
      // 페이지를 넘기다 지도가 대신 움직이지 않도록 끌기는 끄고, 확대/축소만 허용합니다.
      draggable: false,
      scrollWheel: false,
      keyboardShortcuts: false,
      zoomControl: true,
      zoomControlOptions: {
        position: naver.maps.Position.TOP_RIGHT,
        style: naver.maps.ZoomControlStyle.SMALL,
      },
    });
    new naver.maps.Marker({ position, map, title: mapEl.dataset.name });
  };
  document.head.appendChild(sdk);
}

// ----- 공유 -----
document.getElementById('link-share')?.addEventListener('click', async () => {
  const ok = await copyText(location.href.split('#')[0]);
  toast(ok ? '청첩장 주소를 복사했습니다' : '복사하지 못했습니다');
});

const kakaoBtn = document.getElementById('kakao-share');
if (kakaoBtn && config.share.kakaoJsKey) {
  const sdk = document.createElement('script');
  sdk.src = 'https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js';
  sdk.async = true;
  document.head.appendChild(sdk);

  kakaoBtn.addEventListener('click', () => {
    const Kakao = (window as any).Kakao;
    if (!Kakao) return toast('잠시 후 다시 눌러 주세요');
    if (!Kakao.isInitialized()) Kakao.init(config.share.kakaoJsKey);
    const url = location.href.split('#')[0];
    const image = document.querySelector<HTMLMetaElement>('meta[property="og:image"]')?.content;
    Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: config.share.title,
        description: config.share.description,
        imageUrl: image,
        link: { mobileWebUrl: url, webUrl: url },
      },
      buttons: [{ title: '청첩장 보기', link: { mobileWebUrl: url, webUrl: url } }],
    });
  });
}

// ----- 갤러리 크게 보기 -----
const lightbox = document.getElementById('lightbox') as HTMLDialogElement | null;
const items = [...document.querySelectorAll<HTMLElement>('.gallery-item')];
if (lightbox && items.length) {
  const img = lightbox.querySelector('img')!;
  const count = lightbox.querySelector('.lb-count')!;
  let index = 0;

  const show = (i: number) => {
    index = (i + items.length) % items.length;
    img.src = items[index].dataset.full!;
    count.textContent = `${index + 1} / ${items.length}`;
  };

  items.forEach((item, i) =>
    item.addEventListener('click', () => {
      show(i);
      lightbox.showModal();
    }),
  );
  lightbox.querySelector('.lb-close')!.addEventListener('click', () => lightbox.close());
  lightbox.querySelector('.lb-prev')!.addEventListener('click', () => show(index - 1));
  lightbox.querySelector('.lb-next')!.addEventListener('click', () => show(index + 1));
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) lightbox.close();
  });
  lightbox.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') show(index - 1);
    if (e.key === 'ArrowRight') show(index + 1);
  });

  let startX = 0;
  lightbox.addEventListener('touchstart', (e) => (startX = e.touches[0].clientX), { passive: true });
  lightbox.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 45) show(index + (dx < 0 ? 1 : -1));
  });
}
