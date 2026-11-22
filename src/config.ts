// 청첩장에 들어가는 모든 내용은 이 파일에서 수정합니다.
// ○○ 나 000 으로 적힌 값은 아직 예시입니다. 실제 정보로 바꿔 주세요.

export const config = {
  // 배포할 실제 주소 (카톡 미리보기 이미지 주소를 만드는 데 쓰입니다)
  siteUrl: 'https://oh-jongjin.github.io/moc/',

  groom: {
    name: '오종진',
    father: '오○○',
    mother: '배○○',
    relation: '아들',
    phone: '010-0000-0000',
  },
  bride: {
    name: '배지은',
    father: '배○○',
    mother: '정○○',
    relation: '딸',
    phone: '010-0000-0000',
  },

  // 예식 일시 (한국 시간, 24시간제)
  date: { year: 2027, month: 11, day: 27, hour: 12, minute: 20 },

  venue: {
    name: '파티오벨라',
    hall: '1층',
    address: '경기 안양시 동안구 시민대로159번길 25',
    tel: '', // 예식장 전화번호 (비워 두면 표시하지 않습니다)
    // 지도 앱에서 검색할 이름
    mapQuery: '파티오벨라',
    // 네이버지도 길찾기 주소 (네이버지도에서 예식장을 '도착'으로 지정한 뒤 복사한 주소)
    // 비워 두면 네이버지도 버튼은 위 이름으로 검색합니다.
    naverDirections:
      'https://map.naver.com/p/directions/-/3zgnSq,2AEFpH,%ED%8C%8C%ED%8B%B0%EC%98%A4%EB%B2%A8%EB%9D%BC,1572417432,PLACE_POI/-/transit',
    // 지도에 핀을 찍을 좌표 (위도, 경도)
    lat: 37.3905777,
    lng: 126.9475553,
    // 교통 안내 (비워 두면 표시하지 않습니다)
    // 예: { title: '지하철', lines: ['4호선 ○○역 0번 출구에서 도보 0분'] }
    guides: [] as { title: string; lines: string[] }[],
  },

  // 네이버 클라우드 플랫폼 > Maps 에서 발급받은 Client ID를 넣으면 실제 지도가 표시됩니다.
  naverMapClientId: 'cnti2dzro5',

  // 배경음악: public 폴더에 있는 파일 이름. 비워 두면 음악 버튼이 사라집니다.
  bgm: 'b.mp3',

  greeting: [
    '해가 저무는 바다 앞에서',
    '서로의 하루 끝이 되어주기로 약속했습니다.',
    '',
    '노을처럼 따뜻하게, 파도처럼 한결같이',
    '함께 걸어갈 저희의 첫날에',
    '귀한 걸음으로 축복해 주시면 감사하겠습니다.',
  ],

  accounts: {
    groom: [
      { role: '신랑', name: '오종진', bank: '○○은행', number: '000-000-000000' },
      { role: '아버지', name: '오○○', bank: '○○은행', number: '000-000-000000' },
      { role: '어머니', name: '배○○', bank: '○○은행', number: '000-000-000000' },
    ],
    bride: [
      { role: '신부', name: '배지은', bank: '○○은행', number: '000-000-000000' },
      { role: '아버지', name: '배○○', bank: '○○은행', number: '000-000-000000' },
      { role: '어머니', name: '정○○', bank: '○○은행', number: '000-000-000000' },
    ],
  },

  // 방명록: Firebase 프로젝트의 웹 앱 설정값. apiKey를 비워 두면 방명록이 사라집니다.
  // (이 값들은 웹페이지에 공개되어도 되는 값입니다. 보안은 Firestore 보안 규칙으로 지킵니다.)
  guestbook: {
    apiKey: 'AIzaSyD_TNcdy27dnxHRF0j7h4bjfxGygwWjLEo',
    authDomain: 'mochung-d48b2.firebaseapp.com',
    projectId: 'mochung-d48b2',
    storageBucket: 'mochung-d48b2.firebasestorage.app',
    messagingSenderId: '151974709335',
    appId: '1:151974709335:web:a08d5bb8947afcaf1afb12',
  },

  share: {
    // 카톡 등에 링크를 보냈을 때 보이는 제목과 설명
    title: '오종진 ♥ 배지은 결혼합니다',
    description: '2027년 11월 27일 토요일 낮 12시 20분, 안양 파티오벨라',
    // 카카오 개발자 사이트에서 받은 JavaScript 키를 넣으면 "카카오톡으로 공유" 버튼이 생깁니다.
    kakaoJsKey: '',
  },
};
