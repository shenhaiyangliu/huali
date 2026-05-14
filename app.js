const heavenlyStems = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
const earthlyBranches = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
const ganzhiCycle = Array.from({ length: 60 }, (_, index) => `${heavenlyStems[index % 10]}${earthlyBranches[index % 12]}`);
const monthNames = ["正月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "冬月", "腊月"];
const lunarLabels = [
  "初一", "初二", "初三", "初四", "初五", "初六", "初七", "初八", "初九", "初十",
  "十一", "十二", "十三", "十四", "十五", "十六", "十七", "十八", "十九", "二十",
  "廿一", "廿二", "廿三", "廿四", "廿五", "廿六", "廿七", "廿八", "廿九", "三十"
];
const meanings = {
  甲: "甲属阳木，主生发开端，宜规划新事。",
  乙: "乙属阴木，重柔韧经营，宜修整关系。",
  丙: "丙属阳火，午为马。火势明朗，宜主动生发。",
  丁: "丁属阴火，贵在专注，适合打磨细节。",
  戊: "戊属阳土，稳厚承载，宜定规矩与长期安排。",
  己: "己属阴土，重养护积累，适合整理与复盘。",
  庚: "庚属阳金，果断肃整，宜处理拖延事项。",
  辛: "辛属阴金，精细澄明，适合审阅与修饰。",
  壬: "壬属阳水，流动通达，宜沟通远行。",
  癸: "癸属阴水，润下含藏，适合学习与静养。"
};
const goodSets = ["祭祀 祈福", "出行 会友", "纳采 订盟", "修整 置物", "开市 交易", "学习 写作"];
const badSets = ["动土 安葬", "远行 嫁娶", "开仓 诉讼", "搬迁 破土", "争执 借贷", "熬夜 冒进"];
const weatherCodes = {
  0: "晴",
  1: "大部晴朗",
  2: "多云",
  3: "阴",
  45: "雾",
  48: "雾凇",
  51: "小毛毛雨",
  53: "毛毛雨",
  55: "密集毛毛雨",
  61: "小雨",
  63: "中雨",
  65: "大雨",
  71: "小雪",
  73: "中雪",
  75: "大雪",
  80: "阵雨",
  81: "较强阵雨",
  82: "强阵雨",
  95: "雷雨",
  96: "雷雨伴小冰雹",
  99: "雷雨伴冰雹"
};
const termMap = {
  "01-05": ["小寒", "寒气渐深，宜温养蓄力"],
  "01-20": ["大寒", "岁末严寒，万物潜藏"],
  "02-04": ["立春", "春气始建，宜启新愿"],
  "02-19": ["雨水", "东风解冻，润泽渐起"],
  "03-05": ["惊蛰", "春雷动土，宜行动"],
  "03-20": ["春分", "昼夜均分，宜平衡取舍"],
  "04-04": ["清明", "气清景明，宜扫墓踏青"],
  "04-20": ["谷雨", "雨生百谷，宜播种学习"],
  "05-05": ["立夏", "夏气初临，宜养心"],
  "05-21": ["小满", "麦粒始满，宜稳步推进"],
  "06-06": ["芒种", "有芒之谷可种，宜忙而有序"],
  "06-21": ["夏至", "日长之至，宜清心节律"],
  "07-07": ["小暑", "暑热渐盛，宜避躁"],
  "07-22": ["大暑", "湿热交蒸，宜静养"],
  "08-07": ["立秋", "秋气初来，宜收束计划"],
  "08-23": ["处暑", "暑气渐止，宜调整作息"],
  "09-07": ["白露", "露凝而白，宜添衣养肺"],
  "09-23": ["秋分", "昼夜再平，宜取中道"],
  "10-08": ["寒露", "寒意渐起，宜收藏"],
  "10-23": ["霜降", "霜始降，宜防寒"],
  "11-07": ["立冬", "冬气始建，宜养藏"],
  "11-22": ["小雪", "天气上升地气下降，宜安静"],
  "12-07": ["大雪", "寒深雪盛，宜守暖"],
  "12-21": ["冬至", "阴极阳生，宜团聚"]
};

let viewDate = new Date(2026, 4, 1);
let selectedDate = new Date(2026, 4, 14);
let activePage = "calendar";

function ganzhiYear(year) {
  const stem = heavenlyStems[(year - 4) % 10];
  const branch = earthlyBranches[(year - 4) % 12];
  return `${stem}${branch}`;
}

function ganzhiSolarYear(date) {
  const year = date.getMonth() === 0 || (date.getMonth() === 1 && date.getDate() < 4)
    ? date.getFullYear() - 1
    : date.getFullYear();
  return ganzhiYear(year);
}

function ganzhiDay(date) {
  const utcDays = Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000);
  return ganzhiCycle[(utcDays + 17) % 60];
}

function hourBranchIndex(hour) {
  if (hour === 23 || hour === 0) return 0;
  return Math.floor((hour + 1) / 2);
}

function hourRange(branchIndex) {
  if (branchIndex === 0) return "23:00 - 00:59";
  const start = branchIndex * 2 - 1;
  const end = branchIndex * 2;
  return `${pad(start)}:00 - ${pad(end)}:59`;
}

function ganzhiHour(date) {
  const dayStem = ganzhiDay(date).slice(0, 1);
  const startStemByDayStem = { 甲: 0, 己: 0, 乙: 2, 庚: 2, 丙: 4, 辛: 4, 丁: 6, 壬: 6, 戊: 8, 癸: 8 };
  const branchIndex = hourBranchIndex(date.getHours());
  const stemIndex = (startStemByDayStem[dayStem] + branchIndex) % 10;
  return {
    name: `${heavenlyStems[stemIndex]}${earthlyBranches[branchIndex]}时`,
    range: hourRange(branchIndex)
  };
}

function ganzhiMonth(date) {
  // 干支月按十二“节”切换：立春寅、惊蛰卯、清明辰、立夏巳、芒种午……
  const starts = [
    [1, 5, "丑"], [2, 4, "寅"], [3, 5, "卯"], [4, 4, "辰"],
    [5, 5, "巳"], [6, 5, "午"], [7, 7, "未"], [8, 7, "申"],
    [9, 7, "酉"], [10, 8, "戌"], [11, 7, "亥"], [12, 7, "子"]
  ];
  const monthStartStem = { 甲: 2, 己: 2, 乙: 4, 庚: 4, 丙: 6, 辛: 6, 丁: 8, 壬: 8, 戊: 0, 癸: 0 };
  const yearStem = ganzhiSolarYear(date).slice(0, 1);
  let monthIndex = date.getMonth() === 0 && date.getDate() < 5 ? 11 : 0;

  starts.forEach(([month, day], index) => {
    const start = new Date(date.getFullYear(), month - 1, day);
    if (date >= start) {
      monthIndex = index;
    }
  });

  if (date.getMonth() === 0 && date.getDate() < 5) {
    const previousYearStem = ganzhiYear(date.getFullYear() - 1).slice(0, 1);
    const stemIndex = (monthStartStem[previousYearStem] + 11) % 10;
    return `${heavenlyStems[stemIndex]}丑`;
  }

  const stemIndex = (monthStartStem[yearStem] + monthIndex - 1 + 10) % 10;
  return `${heavenlyStems[stemIndex]}${starts[monthIndex][2]}`;
}

function ganzhiDate(date) {
  return `${ganzhiSolarYear(date)}年 ${ganzhiMonth(date)}月 ${ganzhiDay(date)}日`;
}

function fourPillars(date) {
  const hour = ganzhiHour(date).name.replace("时", "");
  return {
    year: ganzhiSolarYear(date),
    month: ganzhiMonth(date),
    day: ganzhiDay(date),
    hour
  };
}

function pad(value) {
  return String(value).padStart(2, "0");
}

function toInputDate(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function sameDate(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function getLunarParts(date) {
  try {
    const formatter = new Intl.DateTimeFormat("zh-CN-u-ca-chinese", {
      month: "long",
      day: "numeric"
    });
    return formatter.format(date).replace(/^闰/, "闰");
  } catch {
    const dayIndex = (date.getDate() + 13) % lunarLabels.length;
    return `${monthNames[date.getMonth()]}${lunarLabels[dayIndex]}`;
  }
}

function lunarDayLabel(date) {
  const text = getLunarParts(date);
  const hit = lunarLabels.find((label) => text.includes(label));
  return hit || (date.getDate() === 1 ? monthNames[date.getMonth()] : lunarLabels[(date.getDate() + 13) % lunarLabels.length]);
}

function dateScore(date) {
  return date.getFullYear() * 372 + (date.getMonth() + 1) * 31 + date.getDate();
}

function nearestSolarTerm(date) {
  const key = `${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  if (termMap[key]) {
    return termMap[key];
  }

  const current = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  let best = null;
  Object.entries(termMap).forEach(([termKey, value]) => {
    const [month, day] = termKey.split("-").map(Number);
    const termDate = new Date(date.getFullYear(), month - 1, day);
    const distance = Math.abs(termDate - current);
    if (!best || distance < best.distance) {
      best = { value, distance, termDate };
    }
  });
  return [`${best.value[0]}将至`, best.value[1]];
}

function updateDetails(date) {
  const yearGz = ganzhiYear(date.getFullYear());
  const stem = yearGz.slice(0, 1);
  const branch = yearGz.slice(1);
  const score = dateScore(date);
  const term = nearestSolarTerm(date);
  const moonIcons = ["●", "◔", "◐", "◕", "○", "◕", "◐", "◔"];

  document.querySelector("#monthTitle").textContent = `${yearGz}年 ${date.getFullYear()}年${date.getMonth() + 1}月`;
  document.querySelector("#ganzhiYear").textContent = `${yearGz}年`;
  document.querySelector("#yearMeaning").textContent = meanings[stem] || `${stem}${branch}之年，宜顺时而为。`;
  document.querySelector(".seal").textContent = branch;
  document.querySelector("#solarDate").textContent = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  document.querySelector("#lunarDate").textContent = `农历${getLunarParts(date)}`;
  document.querySelector("#ganzhiDate").textContent = ganzhiDate(date);
  document.querySelector("#yearPillar").textContent = ganzhiSolarYear(date);
  document.querySelector("#monthPillar").textContent = ganzhiMonth(date);
  document.querySelector("#dayPillar").textContent = ganzhiDay(date);
  document.querySelector("#selectedLabel").textContent = sameDate(date, new Date()) ? "今日" : "所选日期";
  document.querySelector("#moonIcon").textContent = moonIcons[score % moonIcons.length];
  document.querySelector("#solarTerm").textContent = term[0];
  document.querySelector("#solarTermText").textContent = term[1];
  document.querySelector("#goodThings").textContent = goodSets[score % goodSets.length];
  document.querySelector("#goodText").textContent = "适合安排低风险、可推进的事项";
  document.querySelector("#badThings").textContent = badSets[(score + 2) % badSets.length];
  document.querySelector("#badText").textContent = "重要决定建议留出复核时间";
  updateCurrentHour();
  document.querySelector("#dateInput").value = toInputDate(date);
}

function updateCurrentHour() {
  const now = new Date();
  const hour = ganzhiHour(now);
  document.querySelector("#hourStem").textContent = hour.name;
  document.querySelector("#hourText").textContent = `此刻 ${pad(now.getHours())}:${pad(now.getMinutes())}，${hour.range}`;
}

function setWeather(title, text) {
  document.querySelector("#weatherTitle").textContent = title;
  document.querySelector("#weatherText").textContent = text;
}

async function loadLocalWeather() {
  if (!("geolocation" in navigator)) {
    setWeather("无法定位", "当前浏览器不支持定位服务");
    return;
  }

  navigator.geolocation.getCurrentPosition(async (position) => {
    const { latitude, longitude } = position.coords;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude.toFixed(4)}&longitude=${longitude.toFixed(4)}&current=temperature_2m,weather_code,wind_speed_10m&timezone=auto`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("weather request failed");
      const data = await response.json();
      const current = data.current;
      const weather = weatherCodes[current.weather_code] || "天气变化";
      setWeather(`${Math.round(current.temperature_2m)}°C ${weather}`, `当地实时天气，风速 ${Math.round(current.wind_speed_10m)} km/h`);
    } catch {
      setWeather("天气暂不可用", "请检查网络后刷新页面重试");
    }
  }, () => {
    setWeather("未授权定位", "允许浏览器定位后可显示当地天气");
  }, {
    enableHighAccuracy: false,
    maximumAge: 900000,
    timeout: 10000
  });
}

function renderCalendar() {
  const days = document.querySelector("#calendarDays");
  const today = new Date();
  const firstDay = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay();
  const totalDays = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
  const prevMonthDays = new Date(viewDate.getFullYear(), viewDate.getMonth(), 0).getDate();

  const cells = [];
  for (let i = 0; i < firstDay; i += 1) {
    cells.push(`<button class="day muted" type="button" disabled><strong>${prevMonthDays - firstDay + i + 1}</strong><small></small></button>`);
  }

  for (let day = 1; day <= totalDays; day += 1) {
    const cellDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    const key = `${pad(cellDate.getMonth() + 1)}-${pad(cellDate.getDate())}`;
    const isToday = sameDate(cellDate, today);
    const isSelected = sameDate(cellDate, selectedDate);
    const isFestival = Boolean(termMap[key]);
    const label = isFestival ? termMap[key][0] : lunarDayLabel(cellDate);
    cells.push(`
      <button class="day ${isToday ? "today" : ""} ${isSelected ? "selected" : ""} ${isFestival ? "festival" : ""}" type="button" data-date="${toInputDate(cellDate)}">
        <strong>${day}</strong>
        <small>${label}</small>
      </button>
    `);
  }

  const trailing = 42 - cells.length;
  for (let i = 1; i <= trailing; i += 1) {
    cells.push(`<button class="day muted" type="button" disabled><strong>${i}</strong><small></small></button>`);
  }

  days.innerHTML = cells.join("");
}

function renderAuspiciousDates() {
  const list = document.querySelector("#auspiciousList");
  const purpose = document.querySelector("#purposeSelect").value;
  const rules = {
    搬家: ["入宅", "安床", "整理"],
    开业: ["开市", "交易", "纳财"],
    出行: ["出行", "会友", "拜访"],
    签约: ["订盟", "纳采", "签约"],
    学习: ["学习", "写作", "进修"]
  };
  const cards = [];
  let date = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());

  for (let i = 1; cards.length < 5 && i <= 45; i += 1) {
    date = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() + i);
    const score = dateScore(date);
    if ((score + purpose.length) % 3 !== 0) continue;

    const pillars = fourPillars(new Date(date.getFullYear(), date.getMonth(), date.getDate(), 10, 0));
    const term = nearestSolarTerm(date);
    const dateText = `${date.getMonth() + 1}月${date.getDate()}日`;
    cards.push(`
      <article class="date-card">
        <header>
          <time>${dateText}</time>
          <em>${purpose}吉日</em>
        </header>
        <strong>${pillars.year}年 ${pillars.month}月 ${pillars.day}日</strong>
        <p>宜：${rules[purpose].join("、")}。参考：${term[0]}，${term[1]}。</p>
      </article>
    `);
  }

  list.innerHTML = cards.join("");
}

function updateStemsQuery() {
  const input = document.querySelector("#stemsInput");
  const date = input.value ? new Date(input.value) : new Date();
  const pillars = fourPillars(date);
  document.querySelector("#stemsFull").textContent = `${pillars.year}年 ${pillars.month}月 ${pillars.day}日 ${pillars.hour}时`;
  document.querySelector("#stemsYear").textContent = pillars.year;
  document.querySelector("#stemsMonth").textContent = pillars.month;
  document.querySelector("#stemsDay").textContent = pillars.day;
  document.querySelector("#stemsHour").textContent = pillars.hour;
}

function switchPage(pageName) {
  activePage = pageName;
  document.querySelectorAll(".page").forEach((page) => {
    page.classList.toggle("active", page.dataset.page === pageName);
  });
  document.querySelectorAll(".tabbar button").forEach((button) => {
    button.classList.toggle("active", button.dataset.tab === pageName);
  });

  const titles = {
    calendar: null,
    choose: "择日推荐",
    stems: "干支查询",
    mine: "我的"
  };
  document.querySelector("#prevMonth").style.visibility = pageName === "calendar" ? "visible" : "hidden";
  document.querySelector("#nextMonth").style.visibility = pageName === "calendar" ? "visible" : "hidden";

  if (pageName === "calendar") {
    updateDetails(selectedDate);
  } else {
    document.querySelector("#monthTitle").textContent = titles[pageName];
  }

  if (pageName === "choose") renderAuspiciousDates();
  if (pageName === "stems") updateStemsQuery();
}

function selectDate(date) {
  selectedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  viewDate = new Date(date.getFullYear(), date.getMonth(), 1);
  updateDetails(selectedDate);
  renderCalendar();
}

function init() {
  document.querySelectorAll(".tabbar button").forEach((button) => {
    button.addEventListener("click", () => switchPage(button.dataset.tab));
  });
  document.querySelector("#prevMonth").addEventListener("click", () => {
    viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1);
    renderCalendar();
  });
  document.querySelector("#nextMonth").addEventListener("click", () => {
    viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1);
    renderCalendar();
  });
  document.querySelector("#calendarDays").addEventListener("click", (event) => {
    const button = event.target.closest("[data-date]");
    if (!button) return;
    selectDate(new Date(`${button.dataset.date}T00:00:00`));
  });
  document.querySelector("#goDate").addEventListener("click", () => {
    const value = document.querySelector("#dateInput").value;
    if (value) selectDate(new Date(`${value}T00:00:00`));
  });
  document.querySelector("#dateInput").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      document.querySelector("#goDate").click();
    }
  });
  document.querySelector("#todayButton").addEventListener("click", () => {
    const now = new Date();
    selectDate(new Date(now.getFullYear(), now.getMonth(), now.getDate()));
  });
  document.querySelector("#refreshAuspicious").addEventListener("click", renderAuspiciousDates);
  document.querySelector("#purposeSelect").addEventListener("change", renderAuspiciousDates);
  document.querySelector("#stemsSearch").addEventListener("click", updateStemsQuery);
  document.querySelector("#stemsInput").addEventListener("change", updateStemsQuery);
  document.querySelector("#reloadWeather").addEventListener("click", loadLocalWeather);

  updateDetails(selectedDate);
  renderCalendar();
  renderAuspiciousDates();
  updateStemsQuery();
  loadLocalWeather();
  setInterval(updateCurrentHour, 60000);
}

init();
