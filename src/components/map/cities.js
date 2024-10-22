const cities = [
  {
    id: 1,
    name: 'Executive Centre',
    address: '1088 BISHOP ST',
    TMK: '1-2-1-012-004',
    latitude: 21.3093313,
    longitude: -157.8629397,
  },
  {
    id: 2,
    name: 'Waikiki Grand Hotel',
    address: '134 KAPAHULU AVE',
    TMK: '1-2-6-027-031',
    latitude: 21.2718574,
    longitude: -157.823888,
  },
  {
    id: 3,
    name: 'Ilikai Apartments',
    address: '1765 Ala Moana Blvd , Honolulu, HI 96815',
    TMK: '260100070000',
    latitude: 21.2855735,
    longitude: -157.8417488,
  },
  {
    id: 4,
    name: 'Ilikai Marina',
    address: '1765 Ala Moana Blvd , Honolulu, HI 96815',
    TMK: '1-2-6-10-2-175',
    latitude: 21.2855735,
    longitude: -157.8417488,
  },
  {
    id: 5,
    name: 'Palms at Waikiki',
    address: '1850 ALA MOANA BLVD',
    TMK: '1-2-6-012-003',
    latitude: 21.2848702,
    longitude: -157.8387978,
  },
  {
    id: 6,
    name: 'Royal Aloha',
    address: '1909 ALA WAI BLVD',
    TMK: '1-2-6-014-026',
    latitude: 21.287025,
    longitude: -157.829289,
  },
  {
    id: 7,
    name: 'Kalakauan',
    address: '1911 KALAKAUA AVE',
    TMK: '1-2-6-007-004',
    latitude: 21.2865775,
    longitude: -157.8359272,
  },
  {
    id: 8,
    name: 'Trump Tower Waikiki',
    address: '200 Saratoga Road',
    TMK: '1-2-6-003-032',
    latitude: 21.2793406,
    longitude: -157.8325247,
  },
  {
    id: 9,
    name: 'Banyan',
    address: '201 OHUA AVE',
    TMK: '1-2-6-025-005',
    latitude: 21.274629,
    longitude: -157.82179,
  },
  {
    id: 10,
    name: 'Luana Waikiki',
    address: '2045 KALAKAUA AVE',
    TMK: '1-2-6-006-002',
    latitude: 21.283636,
    longitude: -157.8318,
  },
  {
    id: 11,
    name: 'Ritz-Carlton Waikiki Tower 2',
    address: '2139 Kuhio Ave, Honolulu, HI 96815',
    TMK: '',
    latitude: 21.2815556,
    longitude: -157.8310903,
  },
  {
    id: 12,
    name: 'Waikiki Shore',
    address: '2161 KALIA RD',
    TMK: '1-2-6-004-012',
    latitude: 21.2786304,
    longitude: -157.8351404,
  },
  {
    id: 13,
    name: 'Imperial Hawaii Resort',
    address: '2211 HELUMOA RD',
    TMK: '1-2-6-002-014',
    latitude: 21.278505,
    longitude: -157.8333316,
  },
  {
    id: 14,
    name: 'Bamboo',
    address: '2425 KUHIO AVENUE',
    TMK: '1-2-6-023-067',
    latitude: 21.2768411,
    longitude: -157.8261702,
  },
  {
    id: 15,
    name: 'Pacific Monarch',
    address: '2427 KUHIO AVE',
    TMK: '1-2-6-023-056',
    latitude: 21.2766886,
    longitude: -157.8259453,
  },
  {
    id: 16,
    name: 'Seashore',
    address: '2450 KOA AVE',
    TMK: '1-2-6-023-018',
    latitude: 21.2756673,
    longitude: -157.8262592,
  },
  {
    id: 17,
    name: 'Kuhio Village Tower 2',
    address: '2450 PRINCE EDWARD ST',
    TMK: '1-2-6-023-045',
    latitude: 21.2759207,
    longitude: -157.8255647,
  },
  {
    id: 18,
    name: 'Kuhio Village Tower 1',
    address: '2463 KUHIO AVE',
    TMK: '1-2-6-023-050',
    latitude: 21.2759263,
    longitude: -157.8252853,
  },
  {
    id: 19,
    name: 'Kuhio At Waikiki',
    address: '2465 KUHIO AVE',
    TMK: '1-2-6-023-072',
    latitude: 21.2757588,
    longitude: -157.8254583,
  },
  {
    id: 20,
    name: 'Niihau Apartments',
    address: '247 BEACH WALK',
    TMK: '1-2-6-003-013',
    latitude: 21.2797613,
    longitude: -157.8332958,
  },
  {
    id: 21,
    name: 'Waikiki Beach Tower',
    address: '2470 KALAKAUA AVE',
    TMK: '1-2-6-023-007',
    latitude: 21.2750791,
    longitude: -157.8261702,
  },
  {
    id: 22,
    name: 'Regency on Beachwalk',
    address: '255 BEACH WALK',
    TMK: '1-2-6-003-014',
    latitude: 21.2800064,
    longitude: -157.8331561,
  },
  {
    id: 23,
    name: 'Cabana at Waikiki',
    address: '2551 Cartwright Road',
    TMK: '1-2-6-27-27-0000',
    latitude: 221.2729457,
    longitude: -157.823795,
  },
  {
    id: 24,
    name: 'Tradewinds Plaza',
    address: '2572 LEMON RD',
    TMK: '1-2-6-027-020',
    latitude: 21.2724013,
    longitude: -157.82376,
  },
  {
    id: 25,
    name: 'Marine Surf Waikiki',
    address: '364 SEASIDE AVE',
    TMK: '1-2-6-019-001',
    latitude: 21.2802294,
    longitude: -157.8295001,
  },
  {
    id: 26,
    name: 'Ritz-Carlton Waikiki Tower 1',
    address: '383 Kalaimoku St, Honolulu, HI 96815',
    TMK: '2-6-18-43-0',
    latitude: 21.2822884,
    longitude: -157.8322945,
  },
  {
    id: 27,
    name: 'Ala Moana Hotel Condo',
    address: '410 ATKINSON DR',
    TMK: '1-2-3-038-002',
    latitude: 21.2901551,
    longitude: -157.8417488,
  },
  {
    id: 28,
    name: 'Royal Garden at Waikiki',
    address: '440 OLOHANA ST',
    TMK: '1-2-6-016-039',
    latitude: 21.2845098,
    longitude: -157.8322712,
  },
  {
    id: 29,
    name: 'Aloha Surf Hotel',
    address: '444 KANEKAPOLEI ST',
    TMK: '1-2-6-021-016',
    latitude: 21.2790803,
    longitude: -157.8257976,
  },
  {
    id: 30,
    name: 'Hawaiian Monarch',
    address: '444 NIU ST',
    TMK: '1-2-6-014-032',
    latitude: 21.2869649,
    longitude: -157.8349026,
  },
  {
    id: 31,
    name: 'Island Colony',
    address: '445 SEASIDE AVE',
    TMK: '1-2-6-021-026',
    latitude: 21.2809674,
    longitude: -157.8278235,
  },
];

export default cities;
