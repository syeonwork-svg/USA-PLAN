// USA Travel Planner - Mock/Initial Data
// Date range: 2026-10-14 to 2026-11-02 (20 Days)

const DEFAULT_TRIP_DETAILS = {
  title: "미국 20일 가족 여행",
  startDate: "2026-10-14",
  endDate: "2026-11-02",
  budget: 12000000, // 1,200만 원
};

const DEFAULT_EVENTS = [
  // City/Region Badges
  { id: "c1", title: "애틀랜타", date: "2026-10-14", color: "teal", type: "city" },
  { id: "c2", title: "애틀랜타", date: "2026-10-15", color: "teal", type: "city" },
  { id: "c3", title: "애틀랜타", date: "2026-10-16", color: "teal", type: "city" },
  { id: "c4", title: "애틀랜타", date: "2026-10-17", color: "teal", type: "city" },
  { id: "c5", title: "애틀랜타", date: "2026-10-18", color: "teal", type: "city" },
  { id: "c6", title: "애틀랜타", date: "2026-10-19", color: "teal", type: "city" },
  
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
  { id: "c18", title: "뉴욕", date: "2026-11-01", color: "pink", type: "city", label: "*뉴욕으로 오실 수 있다면 같이 저녁" },
  { id: "c19", title: "뉴욕", date: "2026-11-02", color: "pink", type: "city" },

  // Special Activities
  { id: "a1", title: "⛳️ 골프 (아빠, 엄마&작은아빠)", date: "2026-10-17", color: "green", type: "activity" },
  { id: "a2", title: "⛳️ 골프 (아빠, 엄마&작은아빠)", date: "2026-10-18", color: "green", type: "activity" },
  { id: "a3", title: "나이아가라 폭포", date: "2026-10-30", color: "blue", type: "activity" },
  { id: "a4", title: "🎃 할로윈", date: "2026-10-31", color: "red", type: "activity" },

  // Accommodations (Multi-day spans, shown as grey bar at the bottom)
  { id: "ac1", title: "저지시티", date: "2026-10-24", endDate: "2026-10-29", color: "grey", type: "accommodation", hotel: "하얏트 하우스 저지시티 (예약번호: HY12948)", checkin: "체크인 15:00 / 체크아웃 11:00", address: "1 Exchange Pl, Jersey City, NJ 07302" },
  { id: "ac2", title: "뉴욕 중심가", date: "2026-10-29", endDate: "2026-11-02", color: "grey", type: "accommodation", hotel: "밀레니엄 힐튼 뉴욕 원 디엔디 (예약번호: MH88471)", checkin: "체크인 16:00 / 체크아웃 11:00", address: "One United Nations Plaza, New York, NY 10017" }
];

const DEFAULT_TIMELINE = {
  // Atlanta Days (10/14 - 10/19)
  "2026-10-14": [
    { time: "14:00", title: "애틀랜타 하츠필드 잭슨 국제공항 도착", desc: "대한항공 KE085 항공편 도착 및 입국 심사", locName: "Hartsfield-Jackson Atlanta International Airport", lat: 33.6407, lng: -84.4277 },
    { time: "16:00", title: "렌터카 픽업 및 숙소 이동", desc: "Hertz 렌터카에서 대형 SUV 인수 후 애틀랜타 시내 숙소 이동", locName: "Atlanta Airport Rental Car Center", lat: 33.6432, lng: -84.4492 },
    { time: "18:30", title: "저녁 식사 (Mary Mac's Tea Room)", desc: "남부 전통 가정식 식사", locName: "Mary Mac's Tea Room", lat: 33.7725, lng: -84.3800 }
  ],
  "2026-10-15": [
    { time: "10:00", title: "조지아 아쿠아리움 관람", desc: "세계에서 가장 큰 수족관 중 하나, 고래상어 보기", locName: "Georgia Aquarium", lat: 33.7634, lng: -84.3951 },
    { time: "13:30", title: "점심 식사 (The Varsity)", desc: "역사적인 패스트푸드점에서 핫도그와 햄버거", locName: "The Varsity", lat: 33.7716, lng: -84.3891 },
    { time: "15:00", title: "월드 오브 코카콜라 박물관", desc: "코카콜라 역사 관람 및 전세계 음료 시음", locName: "World of Coca-Cola", lat: 33.7624, lng: -84.3928 }
  ],
  "2026-10-16": [
    { time: "10:00", title: "CNN 센터 및 센테니얼 올림픽 공원 산책", desc: "도심 속 공원 산책 및 포토존", locName: "Centennial Olympic Park", lat: 33.7592, lng: -84.3934 },
    { time: "12:30", title: "점심 식사 (Ponce City Market)", desc: "다양한 맛집이 모여있는 마켓 락스", locName: "Ponce City Market", lat: 33.7727, lng: -84.3656 },
    { time: "15:00", title: "마틴 루터 킹 주니어 역사 지구", desc: "역사적인 생가와 박물관 관람", locName: "Martin Luther King, Jr. National Historical Park", lat: 33.7554, lng: -84.3734 }
  ],
  "2026-10-17": [
    { time: "08:00", title: "⛳️ 라운딩: 골프 (아빠, 엄마 & 작은아빠)", desc: "애틀랜타 인근 골프클럽 라운딩", locName: "Heritage Golf Links", lat: 33.8828, lng: -84.2185 },
    { time: "14:30", title: "점심 식사 및 휴식", desc: "클럽하우스 또는 주변 한식당에서 식사", locName: "Duluth Korean Town", lat: 33.9535, lng: -84.1430 },
    { time: "18:00", title: "가족 저녁 식사 및 마트 장보기", desc: "H-Mart 둘루스점에서 한식 장보기", locName: "H Mart Duluth", lat: 33.9599, lng: -84.1235 }
  ],
  "2026-10-18": [
    { time: "08:00", title: "⛳️ 라운딩: 골프 2일차 (아빠, 엄마 & 작은아빠)", desc: "다른 코스에서 두 번째 가족 라운딩", locName: "Stone Mountain Golf Club", lat: 33.8055, lng: -84.1481 },
    { time: "15:00", title: "스톤 마운틴 공원 케이블카 관람", desc: "거대한 바위산 정상에 올라가 애틀랜타 전망 감상", locName: "Stone Mountain Park", lat: 33.8083, lng: -84.1444 }
  ],
  "2026-10-19": [
    { time: "10:30", title: "하이 미술관 (High Museum of Art) 관람", desc: "아름다운 백색 건축물과 근현대 미술품 감상", locName: "High Museum of Art", lat: 33.7901, lng: -84.3856 },
    { time: "13:00", title: "점심 식사 (South City Kitchen)", desc: "세련된 남부 스타일 런치", locName: "South City Kitchen Midtown", lat: 33.7850, lng: -84.3840 },
    { time: "15:00", title: "애틀랜타 식물원 산책", desc: "실내 온실과 숲속 공중 산책로 걷기", locName: "Atlanta Botanical Garden", lat: 33.7904, lng: -84.3736 }
  ],

  // Road trip to Orlando (10/20)
  "2026-10-20": [
    { time: "08:00", title: "애틀랜타 출발 및 로드트립 시작 (🚗7시간 30분)", desc: "올랜도를 향해 남쪽으로 출발 (약 440마일)", locName: "Atlanta, GA", lat: 33.7490, lng: -84.3880 },
    { time: "12:30", title: "Valdosta (중간 지점) 점심 식사 및 주유", desc: "조지아-플로리다 경계 근처 조용한 도시에서 휴식", locName: "Valdosta, GA", lat: 30.8327, lng: -83.2784 },
    { time: "16:30", title: "올랜도 숙소 도착 및 체크인", desc: "디즈니월드 인근 리조트 체크인 및 짐 풀기", locName: "Orlando, FL", lat: 28.5383, lng: -81.3792 },
    { time: "18:30", title: "디즈니 스프링스 (Disney Springs) 산책", desc: "무료 입장 쇼핑몰가에서 저녁 식사 및 기념품 구경", locName: "Disney Springs", lat: 28.3713, lng: -81.5168 }
  ],

  // Road trip to Miami (10/21)
  "2026-10-21": [
    { time: "09:00", title: "올랜도 출발 및 로드트립 (🚗4시간)", desc: "마이애미를 향해 플로리다 턴파이크 고속도로 주행 (약 230마일)", locName: "Orlando, FL", lat: 28.5383, lng: -81.3792 },
    { time: "11:30", title: "West Palm Beach 휴게소 점심 식사", desc: "시원한 에어컨 아래에서 간단한 샌드위치 식사", locName: "West Palm Beach Service Plaza", lat: 26.6850, lng: -80.1333 },
    { time: "14:30", title: "마이애미 비치 숙소 체크인", desc: "사우스 비치 근처 호텔 체크인 및 휴식", locName: "Miami Beach, FL", lat: 25.7907, lng: -80.1300 },
    { time: "16:30", title: "사우스 비치 오션 드라이브 산책", desc: "아르데코 역사 지구의 파스텔톤 건물과 바다 구경", locName: "Ocean Drive", lat: 25.7797, lng: -80.1302 }
  ],

  // Miami Days (10/22 - 10/23)
  "2026-10-22": [
    { time: "09:30", title: "에버글레이즈 국립공원 에어보트 투어", desc: "야생 악어 관찰 및 아열대 늪지대 탐험", locName: "Everglades Safari Park", lat: 25.7615, lng: -80.6044 },
    { time: "13:30", title: "리틀 하바나 (Little Havana) 구경 및 식사", desc: "쿠바 음악을 들으며 쿠바 샌드위치 시식", locName: "Calle Ocho, Little Havana", lat: 25.7656, lng: -80.2228 },
    { time: "16:00", title: "윈우드 월스 (Wynwood Walls) 그래피티 예술 감상", desc: "화려한 야외 벽화 박물관 구경 및 카페 거리 투어", locName: "Wynwood Walls", lat: 25.8018, lng: -80.1992 }
  ],
  "2026-10-23": [
    { time: "10:00", title: "키 비스케인 (Key Biscayne) 빌 벅스 주립공원", desc: "아름다운 해변과 역사적인 등대 하이킹", locName: "Bill Baggs Cape Florida State Park", lat: 25.6792, lng: -80.1565 },
    { time: "13:30", title: "점심 식사 (Rusty Pelican)", desc: "바다 건너 마이애미 다운타운 스카이라인을 보며 식사", locName: "Rusty Pelican Miami", lat: 25.7483, lng: -80.1772 },
    { time: "16:00", title: "베이사이드 마켓플레이스 및 유람선 투어", desc: "연예인들의 저택이 있는 아일랜드 주변 보트 크루즈", locName: "Bayside Marketplace", lat: 25.7785, lng: -80.1866 }
  ],

  // New York City Days (10/24 - 11/02)
  "2026-10-24": [
    { time: "06:30", title: "마이애미 공항으로 이동 및 렌터카 반납", desc: "마이애미 국제공항 국내선 터미널", locName: "Miami International Airport", lat: 25.7959, lng: -80.2870 },
    { time: "08:30", title: "🛫 아침 비행기로 뉴욕 라구아디아 공항 출발", desc: "델타항공 DL2234편 (08:30 출발 -> 11:30 도착)", locName: "LaGuardia Airport", lat: 40.7769, lng: -73.8740 },
    { time: "13:00", title: "뉴욕 숙소(저지시티) 이동 및 체크인", desc: "맨해튼이 한눈에 보이는 저지시티 숙소 체크인", locName: "Jersey City, NJ", lat: 40.7178, lng: -74.0431 },
    { time: "16:30", title: "첼시 마켓 및 하이라인 파크", desc: "폐철길을 도심 공원으로 꾸민 하이라인 산책 및 랍스터 식사", locName: "The High Line", lat: 40.7480, lng: -74.0048 }
  ],
  "2026-10-25": [
    { time: "09:30", title: "자유의 여신상 크루즈 탑승", desc: "리버티 아일랜드와 엘리스 아일랜드 방문", locName: "Statue of Liberty National Monument", lat: 40.6892, lng: -74.0445 },
    { time: "13:00", title: "점심 식사 (월스트리트 주변)", desc: "황소 동상(Charging Bull) 앞에서 기념사진 촬영 후 델리 식사", locName: "Wall Street", lat: 40.7074, lng: -74.0113 },
    { time: "15:00", title: "원월드 전망대 (One World Observatory)", desc: "미국에서 가장 높은 건물 전망대에서 전경 감상", locName: "One World Trade Center", lat: 40.7127, lng: -74.0134 }
  ],
  "2026-10-26": [
    { time: "10:00", title: "메트로폴리탄 미술관 (The Met) 관람", desc: "세계적인 미술관의 엄청난 소장품 관람", locName: "The Metropolitan Museum of Art", lat: 40.7794, lng: -73.9632 },
    { time: "14:00", title: "센트럴 파크 샌드위치 피크닉 및 산책", desc: "쉼터에서 조용한 공원 산책 및 요한 레논 추모 광장 구경", locName: "Central Park", lat: 40.7851, lng: -73.9683 },
    { time: "17:00", title: "5번가 쇼핑 및 세인트 패트릭 대성당", desc: "맨해튼의 중심가 매장 구경", locName: "St. Patrick's Cathedral", lat: 40.7586, lng: -73.9762 }
  ],
  "2026-10-27": [
    { time: "10:00", title: "브루클린 브릿지 도보 건너기", desc: "맨해튼에서 브루클린 방향으로 다리 건너기 (뷰 최고)", locName: "Brooklyn Bridge", lat: 40.7061, lng: -73.9969 },
    { time: "12:30", title: "덤보 (DUMBO) 사진 촬영 및 피자 식사", desc: "무한도전 촬영지 골목 포토존 및 그리말디 피자 점심", locName: "DUMBO, Brooklyn", lat: 40.7033, lng: -73.9896 },
    { time: "15:00", title: "브루클린 헤이츠 산책로 야경 감상", desc: "맨해튼 다운타운 빌딩 숲의 스카이라인 조망", locName: "Brooklyn Heights Promenade", lat: 40.6970, lng: -73.9976 }
  ],
  "2026-10-28": [
    { time: "10:00", title: "자연사 박물관 (AMNH) 관람", desc: "영화 '박물관이 살아있다' 배경의 공룡 화석 관람", locName: "American Museum of Natural History", lat: 40.7813, lng: -73.9740 },
    { time: "13:30", title: "점심 식사 (Shake Shack)", desc: "자연사박물관 바로 옆 원조 쉐이크쉑 버거 시식", locName: "Shake Shack Upper West Side", lat: 40.7808, lng: -73.9767 },
    { time: "15:00", title: "링컨 센터 투어 및 주변 쇼핑", desc: "공연 예술 예술의 전당 링컨 센터 구경", locName: "Lincoln Center for the Performing Arts", lat: 40.7725, lng: -73.9835 }
  ],
  "2026-10-29": [
    { time: "10:00", title: "그랜드 센트럴 터미널 관람", desc: "세계에서 가장 승강장이 많은 유서 깊은 기차역 광장", locName: "Grand Central Terminal", lat: 40.7527, lng: -73.9772 },
    { time: "11:00", title: "숙소 이동: 뉴욕 중심가 숙소 체크인", desc: "저지시티 숙소 퇴실 후 맨해튼 미드타운 호텔 체크인", locName: "Midtown Manhattan, NY", lat: 40.7549, lng: -73.9840 },
    { time: "13:00", title: "뉴욕 공립 도서관 및 브라이언트 파크", desc: "아름다운 열람실 투어 및 잔디 광장에서 커피 브레이크", locName: "New York Public Library", lat: 40.7532, lng: -73.9822 },
    { time: "15:00", title: "엠파이어 스테이트 빌딩 전망대", desc: "뉴욕의 클래식 랜드마크 86층 야외 전망대 관람", locName: "Empire State Building", lat: 40.7484, lng: -73.9857 }
  ],
  "2026-10-30": [
    { time: "07:00", title: "나이아가라 폭포 당일치기 비행기 투어", desc: "라구아디아 공항 -> 버팔로 나이아가라 공항 이동", locName: "Buffalo Niagara International Airport", lat: 42.9405, lng: -78.7322 },
    { time: "09:30", title: "나이아가라 폭포 국립공원 관광", desc: "‘안개 속의 숙녀호(Maid of the Mist)’ 보트를 타고 낙하하는 폭포 바로 밑까지 진입", locName: "Niagara Falls State Park", lat: 43.0815, lng: -79.0642 },
    { time: "18:00", title: "뉴욕 귀환 및 저녁 식사", desc: "버팔로 공항 -> 라구아디아 복귀 후 숙소 복귀", locName: "LaGuardia Airport", lat: 40.7769, lng: -73.8740 }
  ],
  "2026-10-31": [
    { time: "13:00", title: "소호 (SOHO) 명품 및 쇼핑 스트리트 투어", desc: "아기자기한 벽돌 건물 사이 쇼핑 샵 구경", locName: "Soho, New York", lat: 40.7233, lng: -74.0030 },
    { time: "19:00", title: "🎃 뉴욕 빌리지 할로윈 퍼레이드 관람", desc: "그리니치 빌리지에서 열리는 전세계 최대 규모 할로윈 분장 행진 관람", locName: "Greenwich Village Halloween Parade", lat: 40.7336, lng: -74.0027 }
  ],
  "2026-11-01": [
    { time: "14:00", title: "뉴욕 근대 미술관 (MoMA) 관람", desc: "고흐의 '별이 빛나는 밤', 피카소의 작품 등 거장들의 미술품 감상", locName: "The Museum of Modern Art", lat: 40.7614, lng: -73.9776 },
    { time: "18:30", title: "👨‍👩‍👧‍👦 *뉴욕으로 오실 수 있다면 같이 저녁 식사", desc: "지인 가족 합류 시 코리아타운 삼원가든에서 한식 갈비 저녁", locName: "New York Korea Town", lat: 40.7477, lng: -73.9869 }
  ],
  "2026-11-02": [
    { time: "10:00", title: "타임스 스퀘어 (Times Square) 쇼핑 및 마지막 기념품", desc: "빨간 계단 사진 촬영 및 M&M, 디즈니 스토어 투어", locName: "Times Square", lat: 40.7580, lng: -73.9855 },
    { time: "13:00", title: "점심 식사 (Keens Steakhouse)", desc: "130년 넘는 역사를 지닌 뉴욕 드라이 에이징 스테이크 점심 식사", locName: "Keens Steakhouse", lat: 40.7507, lng: -73.9863 },
    { time: "16:00", title: "JFK 공항 이동 및 출국 준비", desc: "인천행 대한항공 KE082 항공편 탑승 수속", locName: "John F. Kennedy International Airport", lat: 40.6413, lng: -73.7781 }
  ]
};

const DEFAULT_EXPENSES = [
  // Accommodation
  { id: "e1", category: "accommodation", title: "애틀랜타 숙소 (Airbnb 6박)", amount: 1550000, date: "2026-10-14", memo: "에어비앤비 독채" },
  { id: "e2", category: "accommodation", title: "올랜도 디즈니 리조트 1박", amount: 350000, date: "2026-10-20", memo: "디즈니 월드 근처" },
  { id: "e3", category: "accommodation", title: "마이애미 비치 호텔 3박", amount: 980000, date: "2026-10-21", memo: "사우스비치 오션뷰" },
  { id: "e4", category: "accommodation", title: "저지시티 아파트먼트 5박", amount: 1500000, date: "2026-10-24", memo: "맨해튼 뷰 독채" },
  { id: "e5", category: "accommodation", title: "맨해튼 미드타운 호텔 4박", amount: 1920000, date: "2026-10-29", memo: "출국 전날 맨해튼 중심가" },

  // Transport
  { id: "e6", category: "transport", title: "인천-애틀랜타 / 뉴욕-인천 항공권 (3인)", amount: 4650000, date: "2026-10-14", memo: "대한항공 다구간 예약" },
  { id: "e7", category: "transport", title: "애틀랜타 렌터카 (7일, SUV)", amount: 720000, date: "2026-10-14", memo: "Hertz, 자차 포함" },
  { id: "e8", category: "transport", title: "마이애미 렌터카 (4일, SUV)", amount: 450000, date: "2026-10-21", memo: "마이애미 반납" },
  { id: "e9", category: "transport", title: "마이애미 -> 뉴욕 편도 국내선 (3인)", amount: 380000, date: "2026-10-24", memo: "델타항공 아침 비행기" },
  { id: "e10", category: "transport", title: "미국 내 고속도로 톨게이트 및 기름값", amount: 250000, date: "2026-10-20", memo: "애틀랜타-올랜도-마이애미 로드트립" },

  // Food
  { id: "e11", category: "food", title: "애틀랜타 식비 (가족 식사 모음)", amount: 650000, date: "2026-10-15", memo: "Mary Mac's, 한식 둘루스 등" },
  { id: "e12", category: "food", title: "올랜도 및 마이애미 식비", amount: 550000, date: "2026-10-21", memo: "쿠바식당, 러스티펠리컨 등" },
  { id: "e13", category: "food", title: "뉴욕 식비 (맛집 탐방)", amount: 1200000, date: "2026-10-25", memo: "랍스터, 덤보 피자, 스테이크 등" },

  // Activities
  { id: "e14", category: "activity", title: "⛳️ 골프 라운딩 그린피 (2회, 3인)", amount: 950000, date: "2026-10-17", memo: "Heritage, Stone Mountain" },
  { id: "e15", category: "activity", title: "조지아 아쿠아리움 & 코카콜라 티켓", amount: 280000, date: "2026-10-15", memo: "3인 입장권 패키지" },
  { id: "e16", category: "activity", title: "마이애미 악어 투어 & 보트 크루즈", amount: 180000, date: "2026-10-22", memo: "3인 예약" },
  { id: "e17", category: "activity", title: "뉴욕 자유의 여신상 & 원월드 & 미술관 티켓", amount: 480000, date: "2026-10-25", memo: "Met, MoMA, 자유의 여신상" },
  { id: "e18", category: "activity", title: "나이아가라 폭포 당일치기 항공&투어", amount: 1100000, date: "2026-10-30", memo: "당일 왕복 비행기표 및 투어선 탑승" }
];

const DEFAULT_TICKETS = [
  {
    id: "t1",
    category: "flight",
    title: "대한항공 KE085 (인천 ➔ 애틀랜타)",
    date: "2026-10-14",
    time: "09:20",
    details: "편명: KE085 | 좌석: 32A, 32B, 32C\n예약번호: K98DF2 | 탑승구: 254",
    imageUrl: "",
    memo: "출발 3시간 전 공항 도착 및 위탁수하물 부치기 필수"
  },
  {
    id: "t2",
    category: "museum",
    title: "뉴욕 근대 미술관 (MoMA) 입장권",
    date: "2026-11-01",
    time: "14:00",
    details: "티켓 구분: 성인 일반 입장권 (3매)\n예약 번호: MoMA-99283-UN | 입장시간: 14:00",
    imageUrl: "",
    memo: "모바일 QR코드로 현장에서 줄 서지 않고 즉시 입장 가능"
  },
  {
    id: "t3",
    category: "activity",
    title: "헤리티지 골프 링크 라운딩 예약증",
    date: "2026-10-17",
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
