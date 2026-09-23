import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

function createSvgHero() {
  return `<svg width="800" height="800" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Background Gradient -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="50%" stop-color="#1e293b"/>
      <stop offset="100%" stop-color="#090d16"/>
    </linearGradient>

    <!-- Metallic/Carbon Body Gradient -->
    <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2a2e39"/>
      <stop offset="50%" stop-color="#181a20"/>
      <stop offset="100%" stop-color="#0d0e12"/>
    </linearGradient>

    <!-- Accent Red/Orange Glow -->
    <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#f97316"/>
      <stop offset="100%" stop-color="#ef4444"/>
    </linearGradient>

    <linearGradient id="cyanGlow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="100%" stop-color="#0284c7"/>
    </linearGradient>

    <!-- Digital Screen Glow -->
    <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="6" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>

    <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#000" flood-opacity="0.6"/>
    </filter>

    <!-- Carbon Fiber Pattern -->
    <pattern id="carbon" width="6" height="6" patternUnits="userSpaceOnUse">
      <rect width="3" height="3" fill="#222630"/>
      <rect x="3" width="3" height="3" fill="#181b24"/>
      <rect y="3" width="3" height="3" fill="#181b24"/>
      <rect x="3" y="3" width="3" height="3" fill="#222630"/>
    </pattern>
  </defs>

  <!-- Background Scene -->
  <rect width="800" height="800" fill="url(#bgGrad)"/>
  
  <!-- Subtle Light Beam -->
  <circle cx="400" cy="380" r="300" fill="#ef4444" opacity="0.08" filter="blur(40px)"/>
  <circle cx="400" cy="320" r="180" fill="#38bdf8" opacity="0.1" filter="blur(30px)"/>

  <!-- Grid Lines -->
  <path d="M0 200 H800 M0 400 H800 M0 600 H800 M200 0 V800 M400 0 V800 M600 0 V800" stroke="#ffffff" stroke-opacity="0.03" stroke-width="1"/>

  <!-- Top Badge: 120W FAST CHARGER -->
  <g transform="translate(40, 40)">
    <rect width="220" height="54" rx="12" fill="url(#accentGrad)" filter="url(#softShadow)"/>
    <text x="110" y="34" font-family="Arial, sans-serif" font-weight="900" font-size="22" fill="#ffffff" text-anchor="middle">120W FAST CHARGER</text>
  </g>

  <!-- 4-IN-1 BADGE -->
  <g transform="translate(560, 40)">
    <rect width="200" height="54" rx="12" fill="#1e293b" stroke="#38bdf8" stroke-width="2" filter="url(#softShadow)"/>
    <text x="100" y="34" font-family="Arial, sans-serif" font-weight="800" font-size="20" fill="#38bdf8" text-anchor="middle">4-IN-1 RETRACTABLE</text>
  </g>

  <!-- MAIN PRODUCT ILLUSTRATION -->
  <g transform="translate(240, 180)" filter="url(#softShadow)">
    
    <!-- Lighter Socket Connector Stick (Bottom) -->
    <path d="M120 340 L200 340 L180 470 L140 470 Z" fill="#2d3748" stroke="#4a5568" stroke-width="2"/>
    <circle cx="160" cy="478" r="8" fill="#e2e8f0"/>
    <rect x="114" y="380" width="8" height="24" rx="4" fill="#a0aec0"/>
    <rect x="198" y="380" width="8" height="24" rx="4" fill="#a0aec0"/>

    <!-- 180° Hinge Joint -->
    <circle cx="160" cy="330" r="26" fill="#111827" stroke="#ef4444" stroke-width="3"/>
    <circle cx="160" cy="330" r="12" fill="#374151"/>
    
    <!-- Rotation Arrow Indicator -->
    <path d="M110 330 A 50 50 0 0 1 210 330" fill="none" stroke="#f97316" stroke-width="3" stroke-dasharray="6,4"/>
    <polygon points="212,324 220,332 210,338" fill="#f97316"/>

    <!-- Main Charger Cube Body -->
    <rect x="60" y="80" width="200" height="230" rx="24" fill="url(#bodyGrad)" stroke="#374151" stroke-width="3"/>
    <!-- Carbon Overlay -->
    <rect x="68" y="88" width="184" height="214" rx="18" fill="url(#carbon)" opacity="0.75"/>

    <!-- Top Metallic Bezel -->
    <rect x="60" y="80" width="200" height="20" rx="10" fill="#374151"/>

    <!-- Retractable Cables coming out from top slot -->
    <!-- Cable 1: Type-C -->
    <g transform="translate(100, -30)">
      <rect x="-8" y="30" width="16" height="80" fill="#111827" rx="3"/>
      <rect x="-14" y="0" width="28" height="35" rx="6" fill="#1f2937" stroke="#38bdf8" stroke-width="2"/>
      <rect x="-8" y="-12" width="16" height="12" rx="3" fill="#cbd5e1"/>
      <text x="0" y="22" font-family="Arial, sans-serif" font-weight="800" font-size="10" fill="#38bdf8" text-anchor="middle">TYPE-C</text>
    </g>

    <!-- Cable 2: Lightning / iPhone -->
    <g transform="translate(220, -30)">
      <rect x="-8" y="30" width="16" height="80" fill="#111827" rx="3"/>
      <rect x="-14" y="0" width="28" height="35" rx="6" fill="#1f2937" stroke="#f97316" stroke-width="2"/>
      <rect x="-6" y="-12" width="12" height="12" rx="2" fill="#cbd5e1"/>
      <text x="0" y="22" font-family="Arial, sans-serif" font-weight="800" font-size="9" fill="#f97316" text-anchor="middle">IPHONE</text>
    </g>

    <!-- LED Digital Display Panel -->
    <rect x="85" y="115" width="150" height="75" rx="14" fill="#000000" stroke="#1e293b" stroke-width="2"/>
    
    <!-- LED Voltage Text -->
    <g filter="url(#neonGlow)">
      <text x="160" y="162" font-family="Courier New, monospace" font-weight="900" font-size="38" fill="#38bdf8" text-anchor="middle">12.4<tspan font-size="20">V</tspan></text>
    </g>
    <text x="160" y="180" font-family="Arial, sans-serif" font-size="9" font-weight="bold" fill="#22c55e" text-anchor="middle">● BATTERY HEALTHY</text>

    <!-- Extra Output Ports at Top Front -->
    <!-- USB-A Port (Orange 2.4A) -->
    <g transform="translate(100, 210)">
      <rect x="0" y="0" width="50" height="26" rx="6" fill="#000000" stroke="#f97316" stroke-width="1.5"/>
      <rect x="8" y="6" width="34" height="14" rx="3" fill="#f97316"/>
      <text x="25" y="-5" font-family="Arial, sans-serif" font-size="9" font-weight="bold" fill="#9ca3af" text-anchor="middle">USB 2.4A</text>
    </g>

    <!-- PD Type-C Port (3A) -->
    <g transform="translate(170, 210)">
      <rect x="0" y="0" width="50" height="26" rx="6" fill="#000000" stroke="#38bdf8" stroke-width="1.5"/>
      <rect x="18" y="5" width="14" height="16" rx="4" fill="#38bdf8"/>
      <text x="25" y="-5" font-family="Arial, sans-serif" font-size="9" font-weight="bold" fill="#9ca3af" text-anchor="middle">PD 3A</text>
    </g>

    <!-- Protection Icons Strip on Body -->
    <rect x="80" y="255" width="160" height="30" rx="8" fill="#111827" stroke="#374151" stroke-width="1"/>
    <text x="160" y="274" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#ef4444" text-anchor="middle">⚡ 6x SMART PROTECTION</text>
  </g>

  <!-- FEATURE HIGHLIGHT CARDS ON BOTTOM -->
  <g transform="translate(50, 680)">
    <!-- Card 1 -->
    <rect x="0" y="0" width="210" height="80" rx="14" fill="#1e293b" stroke="#334155" stroke-width="1.5"/>
    <text x="105" y="32" font-family="Arial, sans-serif" font-weight="800" font-size="15" fill="#ffffff" text-anchor="middle">80cm Retractable</text>
    <text x="105" y="56" font-family="Arial, sans-serif" font-size="12" fill="#94a3b8" text-anchor="middle">كابلات مسحوبة تلقائياً</text>

    <!-- Card 2 -->
    <rect x="240" y="0" width="220" height="80" rx="14" fill="#1e293b" stroke="#334155" stroke-width="1.5"/>
    <text x="350" y="32" font-family="Arial, sans-serif" font-weight="800" font-size="15" fill="#f97316" text-anchor="middle">180° Adjustable</text>
    <text x="350" y="56" font-family="Arial, sans-serif" font-size="12" fill="#94a3b8" text-anchor="middle">رأس دوار لجميع السيارات</text>

    <!-- Card 3 -->
    <rect x="490" y="0" width="210" height="80" rx="14" fill="#1e293b" stroke="#334155" stroke-width="1.5"/>
    <text x="595" y="32" font-family="Arial, sans-serif" font-weight="800" font-size="15" fill="#38bdf8" text-anchor="middle">LED Voltage Monitor</text>
    <text x="595" y="56" font-family="Arial, sans-serif" font-size="12" fill="#94a3b8" text-anchor="middle">مراقبة بطارية السيارة</text>
  </g>
</svg>`;
}

function createSvgRetractable() {
  return `<svg width="800" height="800" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="800" fill="#0f172a"/>
  
  <text x="400" y="80" font-family="Arial, sans-serif" font-weight="900" font-size="28" fill="#ffffff" text-anchor="middle">كابلات قابلة للسحب لمسافة 80 سم</text>
  <text x="400" y="120" font-family="Arial, sans-serif" font-weight="700" font-size="18" fill="#38bdf8" text-anchor="middle">تخلص من العشوائية والخيوط المشابكة في سيارتك</text>

  <!-- Illustration of Charger with extended cable -->
  <g transform="translate(150, 220)">
    <!-- Charger base -->
    <rect x="0" y="100" width="180" height="220" rx="20" fill="#1e293b" stroke="#3b82f6" stroke-width="3"/>
    <text x="90" y="210" font-family="Arial, sans-serif" font-weight="900" font-size="24" fill="#38bdf8" text-anchor="middle">12.4V</text>

    <!-- Cable extending out horizontally -->
    <path d="M180 160 C 280 160, 320 220, 480 200" stroke="#f97316" stroke-width="12" stroke-linecap="round" fill="none"/>
    <path d="M180 180 C 280 180, 320 240, 460 220" stroke="#38bdf8" stroke-width="12" stroke-linecap="round" fill="none"/>

    <!-- Hand pulling cable -->
    <g transform="translate(480, 160)">
      <rect x="0" y="15" width="40" height="50" rx="10" fill="#e2e8f0" stroke="#f97316" stroke-width="3"/>
      <rect x="10" y="5" width="20" height="15" rx="3" fill="#cbd5e1"/>
      <!-- Pull arrows -->
      <path d="M60 40 L90 40 M80 25 L100 40 L80 55" stroke="#22c55e" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
      <text x="130" y="46" font-family="Arial, sans-serif" font-weight="900" font-size="18" fill="#22c55e">إسحب حتى 80 سم</text>
    </g>
  </g>

  <!-- Feature callouts -->
  <g transform="translate(100, 560)">
    <rect x="0" y="0" width="280" height="150" rx="16" fill="#1e293b" stroke="#334155" stroke-width="2"/>
    <text x="140" y="45" font-family="Arial, sans-serif" font-weight="800" font-size="18" fill="#f97316" text-anchor="middle">سحب تلقائي سلس</text>
    <text x="140" y="80" font-family="Arial, sans-serif" font-size="14" fill="#cbd5e1" text-anchor="middle">جبدو خفيف ويرجع يجمع</text>
    <text x="140" y="110" font-family="Arial, sans-serif" font-size="14" fill="#cbd5e1" text-anchor="middle">راسو تلقائياً ف ثواني</text>

    <rect x="320" y="0" width="280" height="150" rx="16" fill="#1e293b" stroke="#334155" stroke-width="2"/>
    <text x="460" y="45" font-family="Arial, sans-serif" font-weight="800" font-size="18" fill="#38bdf8" text-anchor="middle">Type-C + Lightning</text>
    <text x="460" y="80" font-family="Arial, sans-serif" font-size="14" fill="#cbd5e1" text-anchor="middle">متوافق مع آيفون و أندرويد</text>
    <text x="460" y="110" font-family="Arial, sans-serif" font-size="14" fill="#cbd5e1" text-anchor="middle">وشحن جميع الهواتف</text>
  </g>
</svg>`;
}

function createSvgPain() {
  return `<svg width="800" height="600" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="600" fill="#1a0f0a"/>
  
  <text x="400" y="70" font-family="Arial, sans-serif" font-weight="900" font-size="28" fill="#ef4444" text-anchor="middle">عذاب الشواحن العادية في السيارة</text>
  <text x="400" y="110" font-family="Arial, sans-serif" font-size="18" fill="#fca5a5" text-anchor="middle">خيوط مروّنة، شاحن بطيء، وخطر طفيان بطارية السيارة</text>

  <!-- Tangled wires illustration -->
  <g transform="translate(150, 160)">
    <rect x="0" y="0" width="500" height="260" rx="20" fill="#291410" stroke="#991b1b" stroke-width="2"/>
    
    <!-- Tangled Mess -->
    <path d="M50 80 Q 150 220 250 50 T 450 180" stroke="#ef4444" stroke-width="6" fill="none" opacity="0.8"/>
    <path d="M80 200 Q 200 30 350 200 T 420 60" stroke="#f97316" stroke-width="6" fill="none" opacity="0.8"/>
    <path d="M120 40 Q 300 240 180 220 T 380 120" stroke="#dc2626" stroke-width="5" fill="none" opacity="0.7"/>

    <circle cx="250" cy="130" r="45" fill="#7f1d1d"/>
    <text x="250" y="138" font-family="Arial, sans-serif" font-weight="900" font-size="32" fill="#ffffff" text-anchor="middle">❌</text>
  </g>

  <!-- 4 Warning Bullets -->
  <g transform="translate(80, 460)">
    <rect x="0" y="0" width="300" height="90" rx="12" fill="#361311" stroke="#7f1d1d" stroke-width="1.5"/>
    <text x="150" y="38" font-family="Arial, sans-serif" font-weight="800" font-size="15" fill="#fca5a5" text-anchor="middle">خيوط مشابكة كتعيق الفيتاس</text>
    <text x="150" y="65" font-family="Arial, sans-serif" font-size="13" fill="#f87171" text-anchor="middle">منظر مروّن وعصبية أثناء السياقة</text>

    <rect x="340" y="0" width="300" height="90" rx="12" fill="#361311" stroke="#7f1d1d" stroke-width="1.5"/>
    <text x="490" y="38" font-family="Arial, sans-serif" font-weight="800" font-size="15" fill="#fca5a5" text-anchor="middle">شحن بطيء 1% ف نص ساعة</text>
    <text x="490" y="65" font-family="Arial, sans-serif" font-size="13" fill="#f87171" text-anchor="middle">التلفون كيطفى عليك مع الـ GPS</text>
  </g>
</svg>`;
}

function createSvgSolution() {
  return `<svg width="800" height="800" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="800" fill="#09131f"/>
  
  <text x="400" y="70" font-family="Arial, sans-serif" font-weight="900" font-size="28" fill="#38bdf8" text-anchor="middle">الحل الذكي لكل سائق سيارة في المغرب</text>
  <text x="400" y="110" font-family="Arial, sans-serif" font-weight="700" font-size="18" fill="#e2e8f0" text-anchor="middle">ترتيب تام + شحن فائق 120W + حماية للسيارة والهاتف</text>

  <!-- Split Comparison or Clean Setup -->
  <g transform="translate(100, 160)">
    <rect x="0" y="0" width="600" height="420" rx="24" fill="#0f172a" stroke="#1e293b" stroke-width="3"/>
    
    <!-- Big glowing charger icon -->
    <circle cx="300" cy="180" r="110" fill="#0284c7" opacity="0.15"/>
    <circle cx="300" cy="180" r="80" fill="#1e293b" stroke="#38bdf8" stroke-width="3"/>
    <text x="300" y="175" font-family="Arial, sans-serif" font-weight="900" font-size="34" fill="#38bdf8" text-anchor="middle">120W</text>
    <text x="300" y="205" font-family="Arial, sans-serif" font-weight="800" font-size="14" fill="#22c55e" text-anchor="middle">PD 3A FAST</text>

    <!-- 4 key benefit blocks inside -->
    <g transform="translate(40, 310)">
      <rect x="0" y="0" width="240" height="80" rx="12" fill="#1e293b"/>
      <text x="120" y="32" font-family="Arial, sans-serif" font-weight="800" font-size="15" fill="#ffffff" text-anchor="middle">⚡ 80% فـ 30 دقيقة</text>
      <text x="120" y="56" font-family="Arial, sans-serif" font-size="12" fill="#94a3b8" text-anchor="middle">سرعة شحن خيالية</text>

      <rect x="280" y="0" width="240" height="80" rx="12" fill="#1e293b"/>
      <text x="400" y="32" font-family="Arial, sans-serif" font-weight="800" font-size="15" fill="#ffffff" text-anchor="middle">🔌 4 أجهزة ف دقة وحدة</text>
      <text x="400" y="56" font-family="Arial, sans-serif" font-size="12" fill="#94a3b8" text-anchor="middle">لك ولجميع الركاب</text>
    </g>
  </g>

  <!-- Bottom CTA badge -->
  <g transform="translate(200, 640)">
    <rect x="0" y="0" width="400" height="70" rx="35" fill="linear-gradient(90deg, #f97316, #ef4444)"/>
    <text x="200" y="42" font-family="Arial, sans-serif" font-weight="900" font-size="20" fill="#ffffff" text-anchor="middle">شاحن أصلي 100% مع ضمان 30 يوم</text>
  </g>
</svg>`;
}

function createSvgHowTo() {
  return `<svg width="800" height="600" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="600" fill="#0f172a"/>
  
  <text x="400" y="60" font-family="Arial, sans-serif" font-weight="900" font-size="26" fill="#ffffff" text-anchor="middle">طريقة الاستعمال ف 3 خطوات بسيطة</text>

  <!-- Step 1 -->
  <g transform="translate(60, 130)">
    <rect x="0" y="0" width="200" height="380" rx="20" fill="#1e293b" stroke="#334155" stroke-width="2"/>
    <circle cx="100" cy="50" r="28" fill="#f97316"/>
    <text x="100" y="58" font-family="Arial, sans-serif" font-weight="900" font-size="22" fill="#ffffff" text-anchor="middle">1</text>
    <text x="100" y="120" font-family="Arial, sans-serif" font-weight="800" font-size="18" fill="#38bdf8" text-anchor="middle">ركّب الشاحن</text>
    <text x="100" y="160" font-family="Arial, sans-serif" font-size="14" fill="#cbd5e1" text-anchor="middle">ضع الشاحن ف منفذ</text>
    <text x="100" y="185" font-family="Arial, sans-serif" font-size="14" fill="#cbd5e1" text-anchor="middle">ولاعة السيارة 12V-24V</text>
    <text x="100" y="210" font-family="Arial, sans-serif" font-size="14" fill="#22c55e" font-weight="bold" text-anchor="middle">يشتغل ضوء LED فوراً</text>
  </g>

  <!-- Step 2 -->
  <g transform="translate(300, 130)">
    <rect x="0" y="0" width="200" height="380" rx="20" fill="#1e293b" stroke="#334155" stroke-width="2"/>
    <circle cx="100" cy="50" r="28" fill="#f97316"/>
    <text x="100" y="58" font-family="Arial, sans-serif" font-weight="900" font-size="22" fill="#ffffff" text-anchor="middle">2</text>
    <text x="100" y="120" font-family="Arial, sans-serif" font-weight="800" font-size="18" fill="#38bdf8" text-anchor="middle">إسحب الكابل</text>
    <text x="100" y="160" font-family="Arial, sans-serif" font-size="14" fill="#cbd5e1" text-anchor="middle">إسحب الكابل المطلوب</text>
    <text x="100" y="185" font-family="Arial, sans-serif" font-size="14" fill="#cbd5e1" text-anchor="middle">(Type-C أو iPhone)</text>
    <text x="100" y="210" font-family="Arial, sans-serif" font-size="14" fill="#cbd5e1" text-anchor="middle">حسب الطول المناسب</text>
  </g>

  <!-- Step 3 -->
  <g transform="translate(540, 130)">
    <rect x="0" y="0" width="200" height="380" rx="20" fill="#1e293b" stroke="#334155" stroke-width="2"/>
    <circle cx="100" cy="50" r="28" fill="#f97316"/>
    <text x="100" y="58" font-family="Arial, sans-serif" font-weight="900" font-size="22" fill="#ffffff" text-anchor="middle">3</text>
    <text x="100" y="120" font-family="Arial, sans-serif" font-weight="800" font-size="18" fill="#38bdf8" text-anchor="middle">عدّل واشحن</text>
    <text x="100" y="160" font-family="Arial, sans-serif" font-size="14" fill="#cbd5e1" text-anchor="middle">دور الرأس 180°</text>
    <text x="100" y="185" font-family="Arial, sans-serif" font-size="14" fill="#cbd5e1" text-anchor="middle">وشحن حسيّ بـ 120W</text>
    <text x="100" y="210" font-family="Arial, sans-serif" font-size="14" fill="#22c55e" font-weight="bold" text-anchor="middle">عند الانتهاء سحب خفيف</text>
  </g>
</svg>`;
}

async function main() {
  const targetDirs = [
    path.join(process.cwd(), 'public', 'images'),
    path.join(process.cwd(), 'frontend', 'public', 'images')
  ];

  for (const dir of targetDirs) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  const tasks = [
    { svg: createSvgHero(), name: 'car-charger.webp' },
    { svg: createSvgRetractable(), name: 'car-charger-2.webp' },
    { svg: createSvgSolution(), name: 'car-charger-3.webp' },
    { svg: createSvgPain(), name: 'car-charger-pain.webp' },
    { svg: createSvgSolution(), name: 'car-charger-solution.webp' },
    { svg: createSvgHowTo(), name: 'car-charger-how.webp' },
  ];

  for (const task of tasks) {
    const buffer = Buffer.from(task.svg);
    const webpBuffer = await sharp(buffer).webp({ quality: 90 }).toBuffer();

    for (const dir of targetDirs) {
      const filePath = path.join(dir, task.name);
      fs.writeFileSync(filePath, webpBuffer);
      console.log(`Generated: ${filePath}`);
    }
  }
}

main().catch(console.error);
