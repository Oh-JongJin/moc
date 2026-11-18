# 모바일 청첩장

노을 지는 바다 사진에 맞춘 한 페이지짜리 모바일 청첩장입니다. (Astro 정적 사이트)

## 내용 수정

- 이름, 날짜, 장소, 인사말, 계좌번호, 연락처: `src/config.ts`
- 메인 사진: `src/assets/main.png` 을 같은 이름으로 교체
- 갤러리: `src/assets/gallery/` 폴더에 사진을 넣으면 파일 이름순으로 자동 표시 (비어 있으면 갤러리 구역이 숨겨집니다)
- 색과 글꼴: `src/styles/global.css` 맨 위의 변수

## 실행

```sh
npm install
npm run dev      # 미리보기 (http://localhost:4321/moc/)
npm run build    # dist/ 폴더에 배포용 파일 생성
```

`dist/` 폴더를 Vercel, Netlify, Cloudflare Pages 등에 올리면 됩니다.

## 배포

`main` 브랜치에 push 하면 GitHub Actions가 자동으로 빌드해서 GitHub Pages에 올립니다.

- 주소: https://oh-jongjin.github.io/moc/
