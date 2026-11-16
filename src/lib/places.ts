export type Category = "food" | "art" | "cafe" | "view";
export const CATEGORY_LABEL: Record<Category, string> = { food: "美食", art: "藝文", cafe: "咖啡", view: "景點" };

export interface Place {
  id: string; name: string; category: Category; lat: number; lng: number;
  address: string; source: string; confidence: number; note: string;
}

export interface Sample {
  label: string; input: string;
  steps: [string, string, string, string];
  result: Omit<Place, "id">;
}

export const SAMPLES: Sample[] = [
  {
    label: "測試範例 1：無店名神祕拉麵 Reel",
    input: "https://www.instagram.com/reel/C9xRaMeN_LA/",
    steps: [
      "偵測到杯套字樣「麺」/ 拱形紅磚牆裝潢特徵 / 木質吧檯 8 席",
      "提取口語線索「Culver City 地鐵站步行 3 分鐘」#tonkotsu #LAeats",
      "比對半徑 400m 內商家 12 家 → 拉麵類別 3 家 → 紅磚拱牆吻合 1 家",
      "鎖定座標 34.0256, -118.3895 · 信心度 94%",
    ],
    result: { name: "Menya Brick Arch Ramen", category: "food", lat: 34.0256, lng: -118.3895, address: "Washington Blvd, Culver City, CA", source: "IG Reel", confidence: 94, note: "濃厚豚骨，只有 8 個吧檯座位，建議平日 11:30 前抵達。" },
  },
  {
    label: "測試範例 2：洛杉磯隱蔽藝廊截圖",
    input: "screenshot_hidden_gallery.png",
    steps: [
      "偵測到霓虹字樣「OPEN BY APPT」/ 鋸齒狀工業屋頂 / 塗鴉牆局部",
      "解析截圖文案「Arts District 後巷，Little Tokyo 走過來 10 分鐘」",
      "比對半徑 600m 內藝廊 9 家 → 鋸齒屋頂倉庫建築 2 家 → 塗鴉牆吻合 1 家",
      "鎖定座標 34.0412, -118.2337 · 信心度 88%",
    ],
    result: { name: "Sawtooth Alley Gallery", category: "art", lat: 34.0412, lng: -118.2337, address: "Arts District, Los Angeles, CA", source: "截圖", confidence: 88, note: "預約制當代藝廊，週末傍晚有開放工作室活動。" },
  },
];

export const SEED: Place[] = [
  { id: "s1", name: "Griffith Observatory", category: "view", lat: 34.1184, lng: -118.3004, address: "2800 E Observatory Rd, LA", source: "TikTok", confidence: 99, note: "夕陽後看洛杉磯夜景最佳位置。" },
  { id: "s2", name: "Verve Coffee Roasters", category: "cafe", lat: 34.0838, lng: -118.3614, address: "8925 Melrose Ave, West Hollywood", source: "IG Reel", confidence: 91, note: "淺焙單品＋明亮落地窗。" },
];

// Fallback inference for arbitrary pasted links (demo pool).
export const POOL: Sample["result"][] = [
  { name: "Venice Canals Walkway", category: "view", lat: 33.9850, lng: -118.4695, address: "Venice, CA", source: "連結", confidence: 82, note: "運河步道，適合清晨散步拍照。" },
  { name: "Grand Central Market", category: "food", lat: 34.0508, lng: -118.2489, address: "317 S Broadway, LA", source: "連結", confidence: 86, note: "百年市場，多元小吃攤。" },
  { name: "The Last Bookstore", category: "art", lat: 34.0477, lng: -118.2496, address: "453 S Spring St, LA", source: "連結", confidence: 90, note: "書本隧道是經典打卡點。" },
];
