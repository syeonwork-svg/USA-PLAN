// USA Travel Planner - Mock/Initial Data
// Date range: 2026-10-15 to 2026-11-03 (20 Days)

const DEFAULT_TRIP_DETAILS = {
  title: "미국 20일 가족 여행",
  startDate: "2026-10-15",
  endDate: "2026-11-03",
  budget: 12000000, // 1,200만 원
};

const DEFAULT_EVENTS = [
  // City/Region Badges
  { id: "c1", title: "✈️ 인천 ➔ 애틀랜타", date: "2026-10-15", color: "teal", type: "city" },
  { id: "c2", title: "애틀랜타", date: "2026-10-16", color: "teal", type: "city" },
  { id: "c3", title: "애틀랜타", date: "2026-10-17", color: "teal", type: "city" },
  { id: "c4", title: "애틀랜타", date: "2026-10-18", color: "teal", type: "city" },
  { id: "c5", title: "애틀랜타", date: "2026-10-19", color: "teal", type: "city" },
  
  // Road trips
  { id: "rt1", title: "애틀랜타", date: "2026-10-20", color: "teal", type: "city" },
  { id: "rt2", title: "로드트립", date: "2026-10-20", color: "black", type: "roadtrip", duration: "7시간 30분", destination: "올랜도" },
  { id: "rt3", title: "올랜도", date: "2026-10-20", color: "orange", type: "city" },

  { id: "rt4", title: "올랜도", date: "2026-10-21", color: "orange", type: "city" },
  { id: "rt5", title: "로드트립", date: "2026-10-21", color: "black", type: "roadtrip", duration: "4시간", destination: "마이애미" },
  { id: "rt6", title: "마이애미", date: "2026-10-21", color: "yellow", type: "city" },

  { id: "c7", title: "마이애미", date: "2026-10-22", color: "yellow", type: "city" },
  { id: "c8", title: "마이애미", date: "2026-10-23", color: "yellow", type: "city" },
  
  { id: "c9", title: "마이애미", date: "2026-10-24", color: "yellow", type: "city" },
  { id: "c10", title: "✈️ 뉴욕", date: "2026-10-24", color: "pink", type: "city", label: "*아침 비행기표" },

  { id: "c11", title: "뉴욕", date: "2026-10-25", color: "pink", type: "city" },
  { id: "c12", title: "뉴욕", date: "2026-10-26", color: "pink", type: "city" },
  { id: "c13", title: "뉴욕", date: "2026-10-27", color: "pink", type: "city" },
  { id: "c14", title: "뉴욕", date: "2026-10-28", color: "pink", type: "city" },
  { id: "c15", title: "뉴욕", date: "2026-10-29", color: "pink", type: "city" },
  { id: "c16", title: "뉴욕", date: "2026-10-30", color: "pink", type: "city" },
  { id: "c17", title: "뉴욕", date: "2026-10-31", color: "pink", type: "city" },
  { id: "c18", title: "뉴욕", date: "2026-11-01", color: "pink", type: "city" },
  { id: "c19", title: "✈️ 뉴욕 ➔ 인천", date: "2026-11-02", color: "pink", type: "city" },
  { id: "c20", title: "🇰🇷 인천공항 도착", date: "2026-11-03", color: "pink", type: "city" },
  
  // Activities (Small color badges)
  { id: "a1", title: "⛳️ 골프 라운딩", date: "2026-10-18", color: "green", type: "activity" },
  { id: "a2", title: "🌊 나이아가라 폭포", date: "2026-10-30", color: "blue", type: "activity" },
  { id: "a3", title: "🏌️ 골프 라운딩", date: "2026-10-19", color: "green", type: "activity" },
  { id: "a4", title: "🎃 할로윈", date: "2026-10-31", color: "red", type: "activity" },

  // Accommodations (Multi-day spans, shown as grey bar at the bottom)
  { id: "ac1", title: "저지시티", date: "2026-10-24", endDate: "2026-10-29", color: "grey", type: "accommodation", hotel: "하얏트 하우스 저지시티 (예약번호: HY12948)", checkin: "체크인 15:00 / 체크아웃 11:00", address: "1 Exchange Pl, Jersey City, NJ 07302" },
  { id: "ac2", title: "뉴욕 중심가", date: "2026-10-29", endDate: "2026-11-02", color: "grey", type: "accommodation", hotel: "밀레니엄 힐튼 뉴욕 원 디엔디 (예약번호: MH88471)", checkin: "체크인 16:00 / 체크아웃 11:00", address: "One United Nations Plaza, New York, NY 10017" }
];

const DEFAULT_TIMELINE = {
  // Atlanta Days (10/15 - 10/19)
  "2026-10-15": [
    { time: "13:30", title: "인천공항 T2 도착 및 체크인", desc: "대한항공 KE085 항공편 수하물 부치기 및 보안검색", locName: "인천국제공항 제2여객터미널", lat: 37.4602, lng: 126.4407 , isDraft: true },
    { time: "16:25", title: "대한항공 KE085 이륙 (인천 출발)", desc: "애틀랜타(ATL)행 14시간 비행 출발 (예약코드: EK859P)", locName: "인천국제공항", lat: 37.4602, lng: 126.4407 , isDraft: true },
    { time: "17:30", title: "애틀랜타 하츠필드 잭슨 공항 도착 (현지 시간)", desc: "대한항공 KE085편 도착, 입국 심사 및 수하물 수취", locName: "Hartsfield-Jackson Atlanta International Airport", lat: 33.6407, lng: -84.4277 , isDraft: true },
    { time: "19:00", title: "렌터카 픽업 및 숙소 이동", desc: "Hertz 렌터카에서 대형 SUV 인수 후 애틀랜타 시내 숙소 이동", locName: "Atlanta Airport Rental Car Center", lat: 33.6432, lng: -84.4492 , isDraft: true },
    { time: "20:30", title: "저녁 식사 (Mary Mac's Tea Room)", desc: "남부 전통 가정식 늦은 식사 및 마트 장보기", locName: "Mary Mac's Tea Room", lat: 33.7725, lng: -84.3800 , isDraft: true }
  ],
  "2026-10-16": [
    { time: "10:00", title: "조지아 아쿠아리움 관람", desc: "세계에서 가장 큰 수족관 중 하나, 고래상어 보기", locName: "Georgia Aquarium", lat: 33.7634, lng: -84.3951 , isDraft: true },
    { time: "13:30", title: "점심 식사 (The Varsity)", desc: "역사적인 패스트푸드점에서 핫도그와 햄버거", locName: "The Varsity", lat: 33.7716, lng: -84.3891 , isDraft: true },
    { time: "15:00", title: "월드 오브 코카콜라 박물관", desc: "코카콜라 역사 관람 및 전세계 음료 시음", locName: "World of Coca-Cola", lat: 33.7624, lng: -84.3928 , isDraft: true }
  ],
  "2026-10-17": [
    { time: "10:00", title: "CNN 센터 및 센테니얼 올림픽 공원 산책", desc: "도심 속 공원 산책 및 포토존", locName: "Centennial Olympic Park", lat: 33.7592, lng: -84.3934 , isDraft: true },
    { time: "12:30", title: "점심 식사 (Ponce City Market)", desc: "다양한 맛집이 모여있는 마켓 락스", locName: "Ponce City Market", lat: 33.7727, lng: -84.3656 , isDraft: true },
    { time: "15:00", title: "마틴 루터 킹 주니어 역사 지구", desc: "역사적인 생가와 박물관 관람", locName: "Martin Luther King, Jr. National Historical Park", lat: 33.7554, lng: -84.3734 , isDraft: true }
  ],
  "2026-10-18": [
    { time: "08:00", title: "⛳️ 라운딩: 골프 (아빠, 엄마 & 작은아빠)", desc: "애틀랜타 인근 골프클럽 라운딩", locName: "Heritage Golf Links", lat: 33.8828, lng: -84.2185 , isDraft: true },
    { time: "14:30", title: "점심 식사 및 휴식", desc: "클럽하우스 또는 주변 한식당에서 식사", locName: "Duluth Korean Town", lat: 33.9535, lng: -84.1430 , isDraft: true },
    { time: "16:00", title: "스톤 마운틴 공원 케이블카 관람", desc: "거대한 바위산 정상에 올라가 애틀랜타 전망 감상", locName: "Stone Mountain Park", lat: 33.8083, lng: -84.1444 , isDraft: true },
    { time: "18:30", title: "가족 저녁 식사 및 마트 장보기", desc: "H-Mart 둘루스점에서 한식 장보기", locName: "H Mart Duluth", lat: 33.9599, lng: -84.1235 , isDraft: true }
  ],
  "2026-10-19": [
    { time: "08:00", title: "⛳️ 라운딩: 골프 2일차 (아빠, 엄마 & 작은아빠)", desc: "다른 코스에서 두 번째 가족 라운딩", locName: "Stone Mountain Golf Club", lat: 33.8055, lng: -84.1481 , isDraft: true },
    { time: "13:00", title: "점심 식사 (South City Kitchen)", desc: "세련된 남부 스타일 런치", locName: "South City Kitchen Midtown", lat: 33.7850, lng: -84.3840 , isDraft: true },
    { time: "14:30", title: "하이 미술관 (High Museum of Art) 관람", desc: "아름다운 백색 건축물과 근현대 미술품 감상", locName: "High Museum of Art", lat: 33.7901, lng: -84.3856 , isDraft: true },
    { time: "16:30", title: "애틀랜타 식물원 산책", desc: "실내 온실과 숲속 공중 산책로 걷기", locName: "Atlanta Botanical Garden", lat: 33.7904, lng: -84.3736 , isDraft: true }
  ],

  // Road trip to Orlando (10/20)
  "2026-10-20": [
    { time: "08:00", title: "애틀랜타 출발 및 로드트립 시작 (🚗7시간 30분)", desc: "올랜도를 향해 남쪽으로 출발 (약 440마일)", locName: "Atlanta, GA", lat: 33.7490, lng: -84.3880 , isDraft: true },
    { time: "12:30", title: "Valdosta (중간 지점) 점심 식사 및 주유", desc: "조지아-플로리다 경계 근처 조용한 도시에서 휴식", locName: "Valdosta, GA", lat: 30.8327, lng: -83.2784 , isDraft: true },
    { time: "16:30", title: "올랜도 숙소 도착 및 체크인", desc: "디즈니월드 인근 리조체크인 및 짐 풀기", locName: "Orlando, FL", lat: 28.5383, lng: -81.3792 , isDraft: true },
    { time: "18:30", title: "디즈니 스프링스 (Disney Springs) 산책", desc: "무료 입장 쇼핑몰가에서 저녁 식사 및 기념품 구경", locName: "Disney Springs", lat: 28.3713, lng: -81.5168 , isDraft: true }
  ],

  // Road trip to Miami (10/21)
  "2026-10-21": [
    { time: "09:00", title: "올랜도 출발 및 로드트립 (🚗4시간)", desc: "마이애미를 향해 플로리다 턴파이크 고속도로 주행 (약 230마일)", locName: "Orlando, FL", lat: 28.5383, lng: -81.3792 , isDraft: true },
    { time: "11:30", title: "West Palm Beach 휴게소 점심 식사", desc: "시원한 에어컨 아래에서 간단한 샌드위치 식사", locName: "West Palm Beach Service Plaza", lat: 26.6850, lng: -80.1333 , isDraft: true },
    { time: "14:30", title: "마이애미 비치 숙소 체크인", desc: "사우스 비치 근처 호텔 체크인 및 휴식", locName: "Miami Beach, FL", lat: 25.7907, lng: -80.1300 , isDraft: true },
    { time: "16:30", title: "사우스 비치 오션 드라이브 산책", desc: "아르데코 역사 지구의 파스텔톤 건물과 바다 구경", locName: "Ocean Drive", lat: 25.7797, lng: -80.1302 , isDraft: true }
  ],

  // Miami Days (10/22 - 10/23)
  "2026-10-22": [
    { time: "09:30", title: "에버글레이즈 국립공원 에어보트 투어", desc: "야생 악어 관찰 및 아열대 늪지대 탐험", locName: "Everglades Safari Park", lat: 25.7615, lng: -80.6044 , isDraft: true },
    { time: "13:30", title: "리틀 하바나 (Little Havana) 구경 및 식사", desc: "쿠바 음악을 들으며 쿠바 샌드위치 시식", locName: "Calle Ocho, Little Havana", lat: 25.7656, lng: -80.2228 , isDraft: true },
    { time: "16:00", title: "윈우드 월스 (Wynwood Walls) 그래피티 예술 감상", desc: "화려한 야외 벽화 박물관 구경 및 카페 거리 투어", locName: "Wynwood Walls", lat: 25.8018, lng: -80.1992 , isDraft: true }
  ],
  "2026-10-23": [
    { time: "10:00", title: "키 비스케인 (Key Biscayne) 빌 벅스 주립공원", desc: "아름다운 해변과 역사적인 등대 하이킹", locName: "Bill Baggs Cape Florida State Park", lat: 25.6792, lng: -80.1565 , isDraft: true },
    { time: "13:30", title: "점심 식사 (Rusty Pelican)", desc: "바다 건너 마이애미 다운타운 스카이라인을 보며 식사", locName: "Rusty Pelican Miami", lat: 25.7483, lng: -80.1772 , isDraft: true },
    { time: "16:00", title: "베이사이드 마켓플레이스 및 유람선 투어", desc: "연예인들의 저택이 있는 아일랜드 주변 보트 크루즈", locName: "Bayside Marketplace", lat: 25.7785, lng: -80.1866 , isDraft: true }
  ],

  // New York City Days (10/24 - 11/03)
  "2026-10-24": [
    { time: "06:30", title: "마이애미 공항으로 이동 및 렌터카 반납", desc: "마이애미 국제공항 국내선 터미널", locName: "Miami International Airport", lat: 25.7959, lng: -80.2870 , isDraft: true },
    { time: "08:30", title: "🛫 아침 비행기로 뉴욕 라구아디아 공항 출발", desc: "델타항공 DL2234편 (08:30 출발 -> 11:30 도착)", locName: "LaGuardia Airport", lat: 40.7769, lng: -73.8740 , isDraft: true },
    { time: "13:00", title: "뉴욕 숙소(저지시티) 이동 및 체크인", desc: "맨해튼이 한눈에 보이는 저지시티 숙소 체크인", locName: "Jersey City, NJ", lat: 40.7178, lng: -74.0431 , isDraft: true },
    { time: "16:30", title: "첼시 마켓 및 하이라인 파크", desc: "폐철길을 도심 공원으로 꾸민 하이라인 산책 및 랍스터 식사", locName: "The High Line", lat: 40.7480, lng: -74.0048 , isDraft: true }
  ],
  "2026-10-25": [
    { time: "09:30", title: "자유의 여신상 크루즈 탑승", desc: "리버티 아일랜드와 엘리스 아일랜드 방문", locName: "Statue of Liberty National Monument", lat: 40.6892, lng: -74.0445 , isDraft: true },
    { time: "13:00", title: "점심 식사 (월스트리트 주변)", desc: "황소 동상(Charging Bull) 앞에서 기념사진 촬영 후 델리 식사", locName: "Wall Street", lat: 40.7074, lng: -74.0113 , isDraft: true },
    { time: "15:00", title: "원월드 전망대 (One World Observatory)", desc: "미국에서 가장 높은 건물 전망대에서 전경 감상", locName: "One World Trade Center", lat: 40.7127, lng: -74.0134 , isDraft: true }
  ],
  "2026-10-26": [
    { time: "10:00", title: "메트로폴리탄 미술관 (The Met) 관람", desc: "세계적인 미술관의 엄청난 소장품 관람", locName: "The Metropolitan Museum of Art", lat: 40.7794, lng: -73.9632 , isDraft: true },
    { time: "13:30", title: "센트럴 파크 샌드위치 피크닉 및 산책", desc: "쉼터에서 조용한 공원 산책 및 요한 레논 추모 광장 구경", locName: "Central Park", lat: 40.7851, lng: -73.9683 , isDraft: true },
    { time: "15:30", title: "🎨 솔로몬 R. 구겐하임 미술관 관람", desc: "나선형 램프가 인상적인 근현대 미술 중심의 상징적 박물관", locName: "Solomon R. Guggenheim Museum", lat: 40.7829796, lng: -73.9589706 , isDraft: true }
  ],
  "2026-10-27": [
    { time: "10:00", title: "☕️ Partners Coffee (Bedford) 모닝커피", desc: "브루클린 윌리엄스버그의 유명 힙스터 카페", locName: "Partners Coffee", lat: 40.7189284, lng: -73.9562766 , isDraft: true },
    { time: "11:30", title: "브루클린 브릿지 도보 건너기", desc: "맨해튼에서 브루클린 방향으로 다리 건너기 (뷰 최고)", locName: "Brooklyn Bridge", lat: 40.7061, lng: -73.9969 , isDraft: true },
    { time: "13:00", title: "덤보(DUMBO) 사진 촬영 및 Time Out Market 점심", desc: "포토존 구경 후 타임아웃 마켓 내 Ess-a-Bagel(에싸베이글) 시식", locName: "Time Out Market New York", lat: 40.7034205, lng: -73.9921457 , isDraft: true },
    { time: "15:30", title: "🍦 Brooklyn Ice Cream Factory 디저트", desc: "브루클린 브릿지 공원의 시원하고 부드러운 수제 아이스크림", locName: "Brooklyn Ice Cream Factory", lat: 40.7026518, lng: -73.9945911 , isDraft: true },
    { time: "16:30", title: "🌅 하버 뷰 론 (Harbor View Lawn) 노을 감상", desc: "브루클린 브릿지 파크에서 아름다운 맨해튼뷰 감상", locName: "Harbor View Lawn", lat: 40.7016568, lng: -73.9972614 , isDraft: true }
  ],
  "2026-10-28": [
    { time: "10:00", title: "자연사 박물관 (AMNH) 관람", desc: "영화 '박물관이 살아있다' 배경의 공룡 화석 관람", locName: "American Museum of Natural History", lat: 40.7813, lng: -73.9740 , isDraft: true },
    { time: "13:30", title: "점심 식사 (Shake Shack)", desc: "자연사박물관 바로 옆 원조 쉐이크쉑 버거 시식", locName: "Shake Shack Upper West Side", lat: 40.7808, lng: -73.9767 , isDraft: true },
    { time: "15:00", title: "링컨 센터 투어 및 주변 쇼핑", desc: "공연 예술 예술의 전당 링컨 센터 구경", locName: "Lincoln Center for the Performing Arts", lat: 40.7725, lng: -73.9835 , isDraft: true }
  ],
  "2026-10-29": [
    { time: "10:00", title: "그랜드 센트럴 터미널 관람", desc: "세계에서 가장 승강장이 많은 유서 깊은 기차역 광장", locName: "Grand Central Terminal", lat: 40.7527, lng: -73.9772 , isDraft: true },
    { time: "11:00", title: "숙소 이동: 뉴욕 중심가 숙소 체크인", desc: "저지시티 숙소 퇴실 후 맨해튼 미드타운 호텔 체크인", locName: "Midtown Manhattan, NY", lat: 40.7549, lng: -73.9840 , isDraft: true },
    { time: "13:00", title: "📚 뉴욕 공립도서관 투어 & 브라이언트 공원", desc: "도서관 투어 시간 확인 후 야외 브라이언트 공원 휴식", locName: "New York Public Library", lat: 40.7531823, lng: -73.9822534 , isDraft: true },
    { time: "15:30", title: "엠파이어 스테이트 빌딩 전망대", desc: "뉴욕의 클래식 랜드마크 86층 야외 전망대 관람", locName: "Empire State Building", lat: 40.7484, lng: -73.9857 , isDraft: true }
  ],
  "2026-10-30": [
    { time: "07:00", title: "나이아가라 폭포 당일치기 비행기 투어", desc: "라구아디아 공항 -> 버팔로 나이아가라 공항 이동", locName: "Buffalo Niagara International Airport", lat: 42.9405, lng: -78.7322 , isDraft: true },
    { time: "09:30", title: "나이아가라 폭포 국립공원 관광", desc: "‘안개 속의 숙녀호(Maid of the Mist)’ 보트를 타고 낙하하는 폭포 바로 밑까지 진입", locName: "Niagara Falls State Park", lat: 43.0815, lng: -79.0642 , isDraft: true },
    { time: "18:00", title: "뉴욕 귀환 및 저녁 식사", desc: "버팔로 공항 -> 라구아디아 복귀 후 숙소 복귀", locName: "LaGuardia Airport", lat: 40.7769, lng: -73.8740 , isDraft: true }
  ],
  "2026-10-31": [
    { time: "10:00", title: "🍳 소호 브런치: Sadelle's", desc: "아침 식사 예약 확인, 프렌치 토스트 및 토마토 스프 식사", locName: "Sadelle's New York", lat: 40.7263129, lng: -74.0002679 , isDraft: true },
    { time: "11:30", title: "🛍️ 소호 쇼핑 투어 (Aimé Leon Dore & Glossier)", desc: "멀버리 스트릿의 에메레온도르 매장 및 Spring St의 글로시에 화장품 쇼핑", locName: "Aimé Leon Dore", lat: 40.7222993, lng: -73.9959041 , isDraft: true },
    { time: "13:30", title: "🛍️ 소호 쇼핑 2차 (Sandy Liang & McNally 서점)", desc: "샌디리앙 의류 매장 구경 후 유명 독립 서점 맥널리 잭슨 도서 구경", locName: "Sandy Liang", lat: 40.7155802, lng: -73.9914295 , isDraft: true },
    { time: "14:30", title: "🥖 Vesuvio Bakery & 프린스 스트릿 피자", desc: "소호 비수비오 베이커리 빵 시식 후 줄 서서 프린스 스트리트 조각피자 점심", locName: "Vesuvio Bakery", lat: 40.7258889, lng: -74.001428 , isDraft: true },
    { time: "17:00", title: "🍟 Pommes Frites (그리니치 빌리지 감자튀김)", desc: "벨기에식 두툼한 감자튀김에 특제 갈릭 소스 곁들이기 (*갈릭소스 추천)", locName: "Pommes Frites", lat: 40.7301312, lng: -74.0003005 , isDraft: true },
    { time: "19:00", title: "🎃 뉴욕 빌리지 할로윈 퍼레이드 관람", desc: "그리니치 빌리지에서 열리는 전세계 최대 규모 할로윈 분장 행진 관람", locName: "Greenwich Village Halloween Parade", lat: 40.7336, lng: -74.0027 , isDraft: true }
  ],
  "2026-11-01": [
    { time: "11:30", title: "🍜 우동 점심 식사: Raku", desc: "웨이팅이 길어 오픈런으로 입장, 따끈하고 쫄깃한 우동 점심", locName: "Raku", lat: 40.7272479, lng: -74.0025495 , isDraft: true },
    { time: "14:00", title: "🎨 뉴욕 현대 미술관 (MoMA) 관람", desc: "고흐 '별이 빛나는 밤', 피카소 등 교과서 속 명작 감상", locName: "The Museum of Modern Art", lat: 40.7614, lng: -73.9776 , isDraft: true },
    { time: "18:30", title: "🥩 Quality Bistro 저녁 식사", desc: "파리풍의 미드타운 퀄리티 비스트로에서 저녁식사 (*버터가 시그니처)", locName: "Quality Bistro", lat: 40.7632028, lng: -73.979167 , isDraft: true }
  ],
  "2026-11-02": [
    { time: "09:00", title: "JFK 공항 이동 및 출국 준비", desc: "인천행 대한항공 KE082편 출국 예약 수속", locName: "John F. Kennedy International Airport", lat: 40.6413, lng: -73.7781 , isDraft: true },
    { time: "12:00", title: "🛫 낮 비행기로 인천 공항 출발 (귀국)", desc: "대한항공 KE082편 이륙 (12:00 출발 -> 다음날 도착, 예약코드: EK859P)", locName: "John F. Kennedy International Airport", lat: 40.6413, lng: -73.7781 , isDraft: true }
  ],
  "2026-11-03": [
    { time: "17:30", title: "인천국제공항 T2 도착 및 귀가", desc: "20일간의 미국 가족 여행 종료", locName: "인천국제공항 제2여객터미널", lat: 37.4602, lng: 126.4407 , isDraft: true }
  ]
};

const DEFAULT_EXPENSES = [];

const DEFAULT_TICKETS = [
  {
    id: "t1",
    category: "flight",
    title: "대한항공 KE085 (인천 ➔ 애틀랜타)",
    date: "2026-10-15",
    time: "16:25",
    details: "편명: KE085 (공동운항) | 좌석등급: 일반석\n항공사 예약번호: EK859P | 여행사 예약번호: HA2635045264\n탑승인원: 4명 | 발권: 하나투어",
    imageUrl: "",
    memo: "*수화물 규정 및 대한항공 마일리지 적립 체크 필수 (1인당 1,943,500원)",
    depCode: "ICN",
    arrCode: "ATL",
    flightNo: "KE085"
  },
  {
    id: "t2",
    category: "flight",
    title: "대한항공 KE082 (뉴욕 ➔ 인천)",
    date: "2026-11-02",
    time: "12:00",
    details: "편명: KE082 | 좌석등급: 일반석\n항공사 예약번호: EK859P | 여행사 예약번호: HA2635045264\n탑승인원: 4명 | 발권: 하나투어",
    imageUrl: "",
    memo: "*수화물 규정 및 마일리지 적립 확인",
    depCode: "JFK",
    arrCode: "ICN",
    flightNo: "KE082"
  },
  {
    id: "t3",
    category: "museum",
    title: "뉴욕 근대 미술관 (MoMA) 입장권",
    date: "2026-11-01",
    time: "14:00",
    details: "티켓 구분: 성인 일반 입장권 (3매)\n예약 번호: MoMA-99283-UN | 입장시간: 14:00",
    imageUrl: "",
    memo: "모바일 QR코드로 현장에서 줄 서지 않고 즉시 입장 가능"
  },
  {
    id: "t4",
    category: "activity",
    title: "헤리티지 골프 링크 라운딩 예약증",
    date: "2026-10-18",
    time: "08:00",
    details: "티타임: 오전 08:00 | 인원: 3인 라운딩\n예약자: 임세연 | 카트 포함 여부: 포함",
    imageUrl: "",
    memo: "클럽하우스 30분 전 도착하여 체크인 요망"
  }
];

const DEFAULT_PASSPORTS = [
  {
    id: "p1",
    relationship: "본인",
    nameKo: "임세연",
    nameEn: "LIM SEYEON",
    passportNo: "M12345678",
    birthdate: "1998-05-15",
    issueDate: "2022-05-15",
    expiryDate: "2032-05-15",
    photoBase64: "",
    memo: "대표 연락처"
  },
  {
    id: "p2",
    relationship: "가족 1",
    nameKo: "가족 1 (예시)",
    nameEn: "FAMILY ONE",
    passportNo: "M22345678",
    birthdate: "1972-03-20",
    issueDate: "2023-01-10",
    expiryDate: "2033-01-10",
    photoBase64: "",
    memo: "부모님"
  },
  {
    id: "p3",
    relationship: "가족 2",
    nameKo: "가족 2 (예시)",
    nameEn: "FAMILY TWO",
    passportNo: "M32345678",
    birthdate: "1974-07-15",
    issueDate: "2024-05-20",
    expiryDate: "2034-05-20",
    photoBase64: "",
    memo: "부모님"
  },
  {
    id: "p4",
    relationship: "가족 3",
    nameKo: "가족 3 (예시)",
    nameEn: "FAMILY THREE",
    passportNo: "M42345678",
    birthdate: "2002-11-25",
    issueDate: "2026-09-10",
    expiryDate: "2036-09-10",
    photoBase64: "",
    memo: "동생"
  }
];

const DEFAULT_CHECKLIST = [
  { id: "chk1", category: "document", title: "여권 유효기간 확인 (출발일 기준 6개월 이상)", checked: false },
  { id: "chk2", category: "document", title: "미국 ESTA 관광 비자 신청 및 발급", checked: false },
  { id: "chk3", category: "document", title: "가족 여행자 보험 가입", checked: false },
  { id: "chk4", category: "document", title: "렌터카 운전자 자차 보험 (LDW/LIS) 확인 및 가입", checked: false },
  { id: "chk5", category: "document", title: "국제운전면허증 및 영문운전면허증 발급", checked: false },
  { id: "chk6", category: "telecom", title: "미국 현지 유심 / eSIM 구매 (4인)", checked: false },
  { id: "chk7", category: "telecom", title: "달러 환전 완료 (팁용 소액권 포함)", checked: false },
  { id: "chk8", category: "telecom", title: "해외 결제용 신용카드/트래블카드 발급 및 원화결제차단(DCC) 설정", checked: false },
  { id: "chk9", category: "packing", title: "110V 돼지코(어댑터) 및 멀티탭 챙기기", checked: false },
  { id: "chk10", category: "packing", title: "비상 약품 (감기약, 진통제, 소화제, 밴드)", checked: false },
  { id: "chk11", category: "packing", title: "여권 사본 및 예약 확정서 인쇄본 준비", checked: false }
];

const GOOGLE_MAPS_PLACES = [
  { name: "Sandy Liang", lat: 40.7155802, lng: -73.9914295, category: "shopping", address: "28 Orchard St, New York, NY 10002", note: "" },
  { name: "프린스 스트릿 핏자", lat: 40.7230777, lng: -73.9945444, category: "food", address: "27 Prince St, New York, NY 10012", note: "" },
  { name: "솔로몬 R. 구겐하임 미술관", lat: 40.7829796, lng: -73.9589706, category: "sightseeing", address: "1071 5th Ave, New York, NY 10128", note: "" },
  { name: "Partners Coffee - Bedford", lat: 40.7189284, lng: -73.9562766, category: "food", address: "125 N 6th St, Brooklyn, NY 11249", note: "" },
  { name: "Brooklyn Ice Cream Factory", lat: 40.7026518, lng: -73.9945911, category: "food", address: "14 Old Fulton St, Brooklyn, NY 11201", note: "" },
  { name: "하버 뷰 론", lat: 40.7016568, lng: -73.9972614, category: "sightseeing", address: "Brooklyn Bridge Park, Brooklyn, NY 11201", note: "*멘헤튼뷰를 볼 수 있음" },
  { name: "Ess-a-Bagel Time Out Market New York", lat: 40.7034191, lng: -73.9916072, category: "food", address: "55 Water St, Brooklyn, NY 11201", note: "" },
  { name: "Time Out Market New York", lat: 40.7034205, lng: -73.9921457, category: "food", address: "55 Water St, Brooklyn, NY 11201", note: "*ESS-A-BAGEL" },
  { name: "Pommes Frites", lat: 40.7301312, lng: -74.0003005, category: "food", address: "128 MacDougal St, New York, NY 10012", note: "*감자튀김\n*갈릭소스 맛있다고 함" },
  { name: "뉴욕 현대 미술관", lat: 40.7614327, lng: -73.9776216, category: "sightseeing", address: "11 W 53rd St, New York, NY 10019", note: "" },
  { name: "Raku", lat: 40.7272479, lng: -74.0025495, category: "food", address: "48 MacDougal St, New York, NY 10012", note: "*오프런" },
  { name: "Aimé Leon Dore", lat: 40.7222993, lng: -73.9959041, category: "shopping", address: "224 Mulberry St, New York, NY 10012", note: "" },
  { name: "Glossier NYC", lat: 40.7224343, lng: -73.997891, category: "shopping", address: "72 Spring St, New York, NY 10012", note: "" },
  { name: "Sadelle's New York", lat: 40.7263129, lng: -74.0002679, category: "food", address: "463 W Broadway, New York, NY 10012", note: "*아침식사\n*프렌치 토스트 & 토마토 스프\n*예약확인" },
  { name: "Vesuvio Bakery", lat: 40.7258889, lng: -74.001428, category: "food", address: "160 Prince St, New York, NY 10012", note: "" },
  { name: "Quality Bistro", lat: 40.7632028, lng: -73.979167, category: "food", address: "120 W 55th St, New York, NY 10019", note: "*버터가 맛있음" },
  { name: "뉴욕 공립도서관", lat: 40.7531823, lng: -73.9822534, category: "sightseeing", address: "476 5th Ave, New York, NY 10018", note: "*투어시간 확인" },
  { name: "브라이언트 공원", lat: 40.7535367, lng: -73.9829529, category: "sightseeing", address: "New York, NY 10018", note: "" },
  { name: "Leon's Bagels", lat: 40.7276755, lng: -74.0004378, category: "food", address: "169 Thompson St, New York, NY 10012", note: "" },
  { name: "McNally Jackson Books SoHo", lat: 40.725538, lng: -74.000592, category: "shopping", address: "134 Prince St, New York, NY 10012", note: "" }
];
