const services = {
  saju: {
    eyebrow: "SAJU READING",
    title: "사주팔자",
    description: "만세력 데이터와 명리 계산값을 바탕으로 사주 구조를 분석합니다.",
    fields: [
      { name: "nickname", label: "이름", type: "text", full: true },
      { name: "birthDate", label: "생년월일", type: "dateGroup" },
      { name: "birthTime", label: "출생 시간", type: "time" },
      { name: "calendar", label: "양력/음력", type: "select", options: ["양력", "음력"] },
      {
        name: "gender",
        label: "성별",
        type: "select",
        required: true,
        placeholder: "성별 선택",
        options: [
          { label: "남성", value: "남성" },
          { label: "여성", value: "여성" },
        ],
      },
      { name: "unknownTime", label: "출생 시간을 몰라요", type: "checkbox" },
      {
        name: "question",
        label: "궁금한 점",
        type: "textarea",
        placeholder: "예: 올해 금전운 어때?",
        full: true,
      },
    ],
  },
  compatibility: {
    eyebrow: "MATCH READING",
    title: "궁합",
    description: "두 사람의 기본 흐름을 비교해 끌림과 조율 포인트를 확인합니다.",
    fields: [
      { type: "section", label: "나의 정보" },
      { name: "myName", label: "이름", type: "text", full: true },
      { name: "myBirthDate", label: "생년월일", type: "dateGroup" },
      { name: "myBirthTime", label: "출생 시간", type: "time" },
      { name: "myCalendar", label: "양력/음력", type: "select", options: ["양력", "음력"] },
      {
        name: "myGender",
        label: "성별",
        type: "select",
        required: true,
        placeholder: "성별 선택",
        options: [
          { label: "남성", value: "남성" },
          { label: "여성", value: "여성" },
        ],
      },
      { name: "myUnknownTime", label: "출생 시간을 몰라요", type: "checkbox" },
      { type: "section", label: "상대방 정보" },
      { name: "theirName", label: "이름", type: "text", full: true },
      { name: "theirBirthDate", label: "생년월일", type: "dateGroup" },
      { name: "theirBirthTime", label: "출생 시간", type: "time" },
      { name: "theirCalendar", label: "양력/음력", type: "select", options: ["양력", "음력"] },
      {
        name: "theirGender",
        label: "성별",
        type: "select",
        required: true,
        placeholder: "성별 선택",
        options: [
          { label: "남성", value: "남성" },
          { label: "여성", value: "여성" },
        ],
      },
      { name: "theirUnknownTime", label: "출생 시간을 몰라요", type: "checkbox" },
      { name: "relation", label: "관계 유형", type: "select", options: ["연인", "썸", "친구", "동료", "가족"], full: true },
      {
        name: "question",
        label: "궁금한 점",
        type: "textarea",
        placeholder: "예: 결혼까지 생각해도 괜찮을까?",
        full: true,
      },
    ],
  },
  daily: {
    eyebrow: "DAILY FLOW",
    title: "오늘의 운세",
    description: "정밀 사주 운세와 간편 띠 운세를 함께 지원합니다.",
    fields: [
      { type: "section", label: "정밀 오늘운세" },
      { name: "dailyName", label: "이름", type: "text", full: true },
      { name: "dailyBirthDate", label: "생년월일", type: "dateGroup" },
      { name: "dailyBirthTime", label: "출생 시간", type: "time" },
      { name: "dailyCalendar", label: "양력/음력", type: "select", options: ["양력", "음력"] },
      {
        name: "dailyGender",
        label: "성별",
        type: "select",
        placeholder: "성별 선택",
        options: [
          { label: "남성", value: "남성" },
          { label: "여성", value: "여성" },
        ],
      },
      { name: "dailyUnknownTime", label: "출생 시간을 몰라요", type: "checkbox" },
      { type: "section", label: "간편 띠 운세" },
      {
        name: "zodiac",
        label: "띠",
        type: "select",
        placeholder: "띠 선택",
        options: ["쥐", "소", "호랑이", "토끼", "용", "뱀", "말", "양", "원숭이", "닭", "개", "돼지"].map((animal) => ({
          label: `${animal}띠`,
          value: animal,
        })),
      },
      { name: "focus", label: "관심 분야", type: "select", options: ["전체", "연애", "일", "돈", "인간관계", "컨디션"], full: true },
      {
        name: "question",
        label: "궁금한 점",
        type: "textarea",
        placeholder: "예: 오늘 계약해도 괜찮을까?",
        full: true,
      },
    ],
  },
  naming: {
    eyebrow: "NAME IDEAS",
    title: "작명",
    description: "성씨와 원하는 이미지를 바탕으로 이름 후보와 느낌을 제안합니다.",
    fields: [
      { name: "surname", label: "성씨", type: "text", placeholder: "예: 김" },
      { name: "purpose", label: "용도", type: "select", options: ["아기 이름", "개명 아이디어", "예명", "닉네임", "브랜드명"] },
      { name: "mood", label: "원하는 느낌", type: "select", options: ["밝은", "단정한", "지적인", "부드러운", "현대적인", "고전적인"] },
      { name: "length", label: "이름 글자 수", type: "select", options: ["2글자", "3글자"] },
      { name: "avoid", label: "피하고 싶은 글자", type: "text", placeholder: "예: 민, 준" },
    ],
  },
};

const state = {
  activeService: "saju",
  recent: [
    { service: "오늘의 운세", title: "차분한 정리운", time: "방금 전" },
    { service: "작명", title: "서윤 · 하린 · 이안", time: "샘플" },
  ],
};

const stems = [
  ["갑", "목", "양"],
  ["을", "목", "음"],
  ["병", "화", "양"],
  ["정", "화", "음"],
  ["무", "토", "양"],
  ["기", "토", "음"],
  ["경", "금", "양"],
  ["신", "금", "음"],
  ["임", "수", "양"],
  ["계", "수", "음"],
];

const branches = [
  ["자", "수", "양", ["계"]],
  ["축", "토", "음", ["기", "계", "신"]],
  ["인", "목", "양", ["갑", "병", "무"]],
  ["묘", "목", "음", ["을"]],
  ["진", "토", "양", ["무", "을", "계"]],
  ["사", "화", "음", ["병", "경", "무"]],
  ["오", "화", "양", ["정", "기"]],
  ["미", "토", "음", ["기", "정", "을"]],
  ["신", "금", "양", ["경", "임", "무"]],
  ["유", "금", "음", ["신"]],
  ["술", "토", "양", ["무", "신", "정"]],
  ["해", "수", "음", ["임", "갑"]],
];

const elementOrder = ["목", "화", "토", "금", "수"];
const elementLabels = { 목: "목", 화: "화", 토: "토", 금: "금", 수: "수" };
const elementFeeds = { 목: "화", 화: "토", 토: "금", 금: "수", 수: "목" };
const elementControls = { 목: "토", 토: "수", 수: "화", 화: "금", 금: "목" };
const animals = ["쥐", "소", "호랑이", "토끼", "용", "뱀", "말", "양", "원숭이", "닭", "개", "돼지"];
const branchClashes = { 자: "오", 축: "미", 인: "신", 묘: "유", 진: "술", 사: "해", 오: "자", 미: "축", 신: "인", 유: "묘", 술: "진", 해: "사" };
const solarTerms = [
  ["소한", 1, "jie"],
  ["대한", 1, "zhong"],
  ["입춘", 2, "jie"],
  ["우수", 2, "zhong"],
  ["경칩", 3, "jie"],
  ["춘분", 3, "zhong"],
  ["청명", 4, "jie"],
  ["곡우", 4, "zhong"],
  ["입하", 5, "jie"],
  ["소만", 5, "zhong"],
  ["망종", 6, "jie"],
  ["하지", 6, "zhong"],
  ["소서", 7, "jie"],
  ["대서", 7, "zhong"],
  ["입추", 8, "jie"],
  ["처서", 8, "zhong"],
  ["백로", 9, "jie"],
  ["추분", 9, "zhong"],
  ["한로", 10, "jie"],
  ["상강", 10, "zhong"],
  ["입동", 11, "jie"],
  ["소설", 11, "zhong"],
  ["대설", 12, "jie"],
  ["동지", 12, "zhong"],
];
const solarTermConstants20 = [6.11, 20.84, 4.6295, 19.4599, 6.3826, 21.4155, 5.59, 20.888, 6.318, 21.86, 6.5, 22.2, 7.928, 23.65, 8.35, 23.95, 8.44, 23.822, 9.098, 24.218, 8.218, 23.08, 7.9, 22.6];
const solarTermConstants21 = [5.4055, 20.12, 3.87, 18.74, 5.63, 20.646, 4.81, 20.1, 5.52, 21.04, 5.678, 21.37, 7.108, 22.83, 7.5, 23.13, 7.646, 23.042, 8.318, 23.438, 7.438, 22.36, 7.18, 21.94];
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

function init() {
  setToday();
  bindEvents();
  renderService("saju");
  renderRecent();
  refreshIcons();
}

function setToday() {
  $("#todayLabel").textContent = new Intl.DateTimeFormat("ko-KR", {
    month: "long",
    day: "numeric",
    weekday: "long",
  }).format(new Date());
}

function bindEvents() {
  $$(".service-tab").forEach((button) => button.addEventListener("click", () => renderService(button.dataset.service)));
  $("[data-action='quick-daily']").addEventListener("click", () => renderService("daily"));
  $("[data-action='reset-form']").addEventListener("click", () => renderService(state.activeService));
  $(".favorite-button").addEventListener("click", (event) => event.currentTarget.classList.toggle("active"));
  document.addEventListener("click", async (event) => {
    const button = event.target.closest("[data-action='copy-prompt']");
    if (!button) return;
    const prompt = $("#gptPrompt")?.value || "";
    await navigator.clipboard?.writeText(prompt);
    button.innerHTML = `<i data-lucide="check"></i> 복사됨`;
    refreshIcons();
  });
}

function renderService(serviceKey) {
  state.activeService = serviceKey;
  const service = services[serviceKey];

  $$(".service-tab").forEach((button) => button.classList.toggle("active", button.dataset.service === serviceKey));
  $("#serviceEyebrow").textContent = service.eyebrow;
  $("#serviceTitle").textContent = service.title;
  $("#serviceDescription").textContent = service.description;
  $("#formTitle").textContent = `${service.title} 정보 입력`;
  $("#resultTitle").textContent = "프롬프트 생성 완료";

  renderForm(serviceKey, service.fields);
  hideResult();
  refreshIcons();
}

function renderForm(serviceKey, fields) {
  const form = $("#fortuneForm");
  form.noValidate = true;
  form.innerHTML = `
    <div class="field-grid">${fields.map((field) => renderField(field)).join("")}</div>
    <div class="form-actions">
      <button class="primary-button" type="submit"><i data-lucide="wand-sparkles"></i>프롬프트 생성</button>
    </div>
  `;

  form.onsubmit = (event) => {
    event.preventDefault();
    if (!validateForm(serviceKey, form)) return;
    renderLoadingThenResult(serviceKey, Object.fromEntries(new FormData(form).entries()));
  };
}

function renderField(field) {
  if (field.type === "section") {
    return `<div class="form-subhead">${field.label}</div>`;
  }

  if (field.type === "select") {
    const options = field.options.map((option) => (typeof option === "string" ? { label: option, value: option } : option));
    return `
      <div class="field ${field.full ? "full" : ""}">
        <label for="${field.name}">${field.label}</label>
        <select id="${field.name}" name="${field.name}" ${field.required ? "required" : ""}>
          ${field.placeholder ? `<option value="" selected disabled>${field.placeholder}</option>` : ""}
          ${options.map((option) => `<option value="${option.value}">${option.label}</option>`).join("")}
        </select>
      </div>
    `;
  }

  if (field.type === "checkbox") {
    return `
      <label class="toggle-row field full">
        <span>${field.label}</span>
        <input type="checkbox" name="${field.name}" value="true" />
      </label>
    `;
  }

  if (field.type === "dateGroup") {
    return `
      <fieldset class="field date-group ${field.full ? "full" : ""}" data-date-group="${field.name}">
        <legend>${field.label}</legend>
        <div class="date-inputs">
          <input name="${field.name}Year" type="text" inputmode="numeric" autocomplete="bday-year" maxlength="4" placeholder="년" aria-label="${field.label} 년" />
          <input name="${field.name}Month" type="text" inputmode="numeric" autocomplete="bday-month" maxlength="2" placeholder="월" aria-label="${field.label} 월" />
          <input name="${field.name}Day" type="text" inputmode="numeric" autocomplete="bday-day" maxlength="2" placeholder="일" aria-label="${field.label} 일" />
        </div>
      </fieldset>
    `;
  }

  if (field.type === "textarea") {
    return `
      <div class="field ${field.full ? "full" : ""}">
        <label for="${field.name}">${field.label}</label>
        <textarea id="${field.name}" name="${field.name}" placeholder="${field.placeholder || ""}"></textarea>
      </div>
    `;
  }

  return `
    <div class="field ${field.full ? "full" : ""}">
      <label for="${field.name}">${field.label}</label>
      <input id="${field.name}" name="${field.name}" type="${field.type}" placeholder="${field.placeholder || ""}" />
    </div>
  `;
}

function validateForm(serviceKey, form) {
  const errorBox = form.querySelector(".form-error");
  if (errorBox) errorBox.remove();

  const requiredGenderFields = {
    saju: [["gender", "성별을 선택해야 프롬프트를 생성할 수 있습니다."]],
    compatibility: [
      ["myGender", "나의 성별을 선택해야 궁합 프롬프트를 생성할 수 있습니다."],
      ["theirGender", "상대방 성별을 선택해야 궁합 프롬프트를 생성할 수 있습니다."],
    ],
  }[serviceKey] || [];

  for (const [fieldName, message] of requiredGenderFields) {
    if (!form.elements[fieldName]?.value) {
      form.insertAdjacentHTML("afterbegin", `<div class="form-error">${message}</div>`);
      form.elements[fieldName].focus();
      return false;
    }
  }

  return true;
}

function renderLoadingThenResult(serviceKey, formData) {
  const normalizedData = normalizeFormData(formData);
  showResult();
  $("#resultCard").innerHTML = `
    <div class="result-section">
      <h4>계산 중</h4>
      <p>만세력 JSON을 조회하고 사주 계산값을 구성하고 있습니다.</p>
    </div>
  `;

  window.setTimeout(async () => {
    await renderResultWithData(serviceKey, normalizedData);
    state.recent.unshift({ service: services[serviceKey].title, title: makeRecentTitle(serviceKey, normalizedData), time: "방금 전" });
    state.recent = state.recent.slice(0, 5);
    renderRecent();
  }, 180);
}

async function renderResultWithData(serviceKey, formData) {
  const enrichedData = { ...formData };
  if (serviceKey === "saju" && formData.birthDate) enrichedData.calendarDay = await fetchCalendarDay(formData.birthDate, formData.calendar);
  if (serviceKey === "compatibility") {
    if (formData.myBirthDate) enrichedData.myCalendarDay = await fetchCalendarDay(formData.myBirthDate, formData.myCalendar);
    if (formData.theirBirthDate) enrichedData.theirCalendarDay = await fetchCalendarDay(formData.theirBirthDate, formData.theirCalendar);
  }
  if (serviceKey === "daily" && formData.dailyBirthDate) {
    enrichedData.calendarDay = await fetchCalendarDay(formData.dailyBirthDate, formData.dailyCalendar);
    enrichedData.todayCalendarDay = await fetchCalendarDay(formatDate(new Date()), "양력");
  }
  renderResult(serviceKey, enrichedData);
}

function normalizeFormData(formData) {
  const normalized = { ...formData };
  ["birthDate", "myBirthDate", "theirBirthDate", "dailyBirthDate"].forEach((key) => {
    const year = onlyNumber(formData[`${key}Year`]);
    const month = onlyNumber(formData[`${key}Month`]);
    const day = onlyNumber(formData[`${key}Day`]);
    if (year || month || day) normalized[key] = [String(year).padStart(4, "0"), String(month).padStart(2, "0"), String(day).padStart(2, "0")].join("-");
  });
  return normalized;
}

function makeRecentTitle(serviceKey, data) {
  if (serviceKey === "compatibility") return `${data.myName || "나"} × ${data.theirName || "상대"}`;
  if (serviceKey === "naming") return `${data.surname || "새"}로운 이름 후보`;
  if (serviceKey === "daily") return `${data.focus || "전체"} 흐름`;
  return `${data.nickname || "사용자"}의 명식`;
}

function renderResult(serviceKey, formData) {
  const renderers = { saju: renderSajuResult, compatibility: renderCompatibilityResult, daily: renderDailyResult, naming: renderNamingResult };
  $("#resultTitle").textContent = "프롬프트 생성 완료";
  $("#resultCard").innerHTML = renderers[serviceKey](formData);
  refreshIcons();
}

function hideResult() {
  $(".result-area").hidden = true;
  $("#resultCard").innerHTML = "";
  $(".favorite-button").classList.remove("active");
}

function showResult() {
  $(".result-area").hidden = false;
}

function renderSajuResult(data) {
  if (!data.calendarDay) {
    return resultSection("만세력 조회 실패", "입력한 날짜의 만세력 데이터를 찾지 못했습니다. 현재 정적 JSON 범위는 1900~2050년 양력 기준입니다.");
  }

  const analysis = analyzeSaju(data);
  const prompt = buildGptPrompt(analysis);

  return `
    <div class="result-section">
      <div class="prompt-head">
        <h4>웹 GPT 붙여넣기용 프롬프트</h4>
        <button class="ghost-button compact" type="button" data-action="copy-prompt"><i data-lucide="copy"></i>프롬프트 복사</button>
      </div>
      <textarea id="gptPrompt" class="prompt-box" readonly>${escapeHtml(prompt)}</textarea>
    </div>
    <div class="score-card">
      <p>${escapeHtml(analysis.input.name)}님의 계산 기반 사주 리포트</p>
      <h4>${analysis.dayMaster.stem}일간 · ${analysis.dayMaster.element} 기운</h4>
    </div>
    <div class="keyword-row">
      ${analysis.keySignals.map((keyword) => `<span class="tag">${keyword}</span>`).join("")}
    </div>
    ${renderPillarSection(analysis)}
    ${renderElementSection(analysis)}
    ${renderTenGodSection(analysis)}
    ${renderHiddenStemSection(analysis)}
    ${renderPatternSection(analysis)}
    ${renderDaewoonSection(analysis)}
    ${renderSewoonSection(analysis)}
    ${renderCareerMoneySection(analysis)}
    ${disclaimer("이 화면은 정적 문구 풀이가 아니라 만세력/명리 계산값을 정리한 결과입니다. 다만 출생시간이 없거나 24절기 시각 데이터가 부족한 경우에는 해당 항목을 추정하지 않고 제한 사항으로 표시합니다.")}
  `;
}

function analyzeSaju(data) {
  const unknownTime = data.unknownTime === "true" || !data.birthTime;
  const yearPillar = parsePillar(data.calendarDay.year_ganji);
  const monthPillar = parsePillar(data.calendarDay.month_ganji);
  const dayPillar = parsePillar(data.calendarDay.day_ganji);
  const hourPillar = unknownTime ? null : calculateHourPillar(dayPillar.stem, data.birthTime);
  const pillars = { year: yearPillar, month: monthPillar, day: dayPillar, hour: hourPillar };
  const dayMaster = stemInfo(dayPillar.stem);
  const elementScore = calculateElementScore(pillars);
  const tenGodScore = calculateTenGodScore(dayMaster, pillars);
  const hiddenStemReport = getHiddenStemReport(dayMaster, pillars);
  const pattern = determinePattern(dayMaster, monthPillar);
  const usefulGods = determineUsefulGods(dayMaster, elementScore, monthPillar);
  const daewoon = calculateDaewoon(data, yearPillar, monthPillar);
  const sewoon = calculateSewoon(data, dayMaster, pillars);
  const luckSignals = judgeLuckSignals(dayMaster, sewoon);

  return {
    input: {
      name: data.nickname || "사용자",
      birthDate: data.birthDate,
      birthTime: unknownTime ? "미상" : data.birthTime,
      gender: data.gender,
      calendar: data.calendar || "양력",
      question: data.question?.trim() || "",
    },
    calendarDay: data.calendarDay,
    pillars,
    dayMaster,
    elementScore,
    tenGodScore,
    hiddenStemReport,
    pattern,
    usefulGods,
    daewoon,
    sewoon,
    luckSignals,
    keySignals: [
      `${dayMaster.stem}${dayMaster.element} 일간`,
      `${elementScore.strongest.element} 과다`,
      `${elementScore.weakest.element} 보완`,
      `${pattern.name}`,
      unknownTime ? "시주 미상" : `${hourPillar.stem}${hourPillar.branch} 시주`,
    ],
  };
}

function renderPillarSection(analysis) {
  const items = [
    ["연주", analysis.pillars.year],
    ["월주", analysis.pillars.month],
    ["일주", analysis.pillars.day],
    ["시주", analysis.pillars.hour],
  ];

  return `
    <div class="result-section">
      <h4>사주 명식</h4>
      <div class="pillar-grid">
        ${items
          .map(([label, pillar]) => {
            const value = pillar ? `${pillar.stem}${pillar.branch}` : "미상";
            const sub = pillar ? `${stemInfo(pillar.stem).element}/${branchInfo(pillar.branch).element}` : "출생시간 필요";
            return `<div class="pillar"><b>${value}</b><span>${label}</span><small>${sub}</small></div>`;
          })
          .join("")}
      </div>
      <p class="section-lead">음력 ${analysis.calendarDay.lunar_year}년 ${analysis.calendarDay.lunar_month}월 ${analysis.calendarDay.lunar_day}일, 세차 ${analysis.calendarDay.year_ganji}, 월건 ${analysis.calendarDay.month_ganji}, 일진 ${analysis.calendarDay.day_ganji}</p>
    </div>
  `;
}

function renderElementSection(analysis) {
  return `
    <div class="result-section">
      <h4>오행 점수</h4>
      <div class="element-bars">${renderElementBars(analysis.elementScore.percent)}</div>
      <p class="section-lead">천간, 지지 본기, 지장간을 가중치로 반영했습니다. 가장 강한 기운은 ${analysis.elementScore.strongest.element}, 가장 약한 기운은 ${analysis.elementScore.weakest.element}입니다.</p>
    </div>
  `;
}

function renderTenGodSection(analysis) {
  return `
    <div class="result-section">
      <h4>십성 분포</h4>
      <div class="calc-grid">
        ${Object.entries(analysis.tenGodScore.percent)
          .map(([name, value]) => `<div class="calc-cell"><span>${name}</span><b>${value}%</b></div>`)
          .join("")}
      </div>
    </div>
  `;
}

function renderHiddenStemSection(analysis) {
  return `
    <div class="result-section">
      <h4>지장간 반영</h4>
      <div class="data-table">
        ${analysis.hiddenStemReport
          .map((row) => `<div><b>${row.label}</b><span>${row.branch}지장간: ${row.hidden.map((item) => `${item.stem}(${item.tenGod})`).join(", ")}</span></div>`)
          .join("")}
      </div>
    </div>
  `;
}

function renderPatternSection(analysis) {
  return `
    <div class="result-section">
      <h4>격국 · 용신 후보</h4>
      <div class="flow-grid">
        <div class="flow-card"><span>격국 후보</span><b>${analysis.pattern.name}</b><p>${analysis.pattern.reason}</p></div>
        <div class="flow-card"><span>용신 후보</span><b>${analysis.usefulGods.yongshin}</b><p>${analysis.usefulGods.reason}</p></div>
        <div class="flow-card"><span>희신/기신 후보</span><b>${analysis.usefulGods.heeshin} / ${analysis.usefulGods.gishin}</b><p>오행 과다/부족과 일간 강약을 기준으로 잡은 1차 후보입니다.</p></div>
      </div>
    </div>
  `;
}

function renderDaewoonSection(analysis) {
  return `
    <div class="result-section">
      <h4>대운 분석</h4>
      <p class="section-lead">${analysis.daewoon.note}</p>
      <div class="timeline-list">
        ${analysis.daewoon.cycles
          .map((cycle) => `<div class="timeline-item"><span>${cycle.ageText}</span><div><b>${cycle.pillar}</b><p>${cycle.summary}</p></div></div>`)
          .join("")}
      </div>
    </div>
  `;
}

function renderSewoonSection(analysis) {
  return `
    <div class="result-section">
      <h4>세운 신호</h4>
      <div class="timeline-list">
        ${analysis.sewoon
          .map((year) => `<div class="timeline-item"><span>${year.year}년</span><div><b>${year.pillar} · ${year.age}세</b><p>${year.signals.join(" / ")}</p></div></div>`)
          .join("")}
      </div>
    </div>
  `;
}

function renderCareerMoneySection(analysis) {
  return `
    <div class="result-section">
      <h4>관운 · 재물운 · 이직운 계산 신호</h4>
      <div class="flow-grid">
        <div class="flow-card"><span>관운</span><b>${analysis.luckSignals.official.level}</b><p>${analysis.luckSignals.official.reason}</p></div>
        <div class="flow-card"><span>재물운</span><b>${analysis.luckSignals.wealth.level}</b><p>${analysis.luckSignals.wealth.reason}</p></div>
        <div class="flow-card"><span>이직운</span><b>${analysis.luckSignals.change.level}</b><p>${analysis.luckSignals.change.reason}</p></div>
      </div>
    </div>
  `;
}

function buildGptPrompt(analysis) {
  return `너는 100년 경력의 명리학 상담가이자 사주풀이 전문가다.
고전 명리의 용어를 이해하기 쉽게 풀어 쓰되, 아래에 제공된 계산값을 벗어나 새로운 만세력 값이나 없는 데이터를 만들어내면 안 된다.

작업 목표:
아래 사주 계산 결과를 바탕으로 전문 상담 문서처럼 읽히는 한국어 장문 사주 리포트를 작성한다.

${buildReportOutputInstructions("사주 리포트")}

해석 규칙:
- 계산값에 근거해서만 해석하고, 없는 데이터를 지어내지 말 것.
- 출생시간이 미상이어도 답변을 회피하지 말 것. 시주가 없어 정확도가 제한된다고 밝힌 뒤, 제공된 연주/월주/일주와 오행/십성/대운/세운 기준으로 가능한 범위에서 최대한 구체적으로 해석할 것.
- 어린 시절, 성향, 건강/컨디션, 금전운, 직업운, 사업운, 배우자/관계운, 자식운, 대운/세운, 조심할 시기, 운이 트이는 시기를 충분히 길게 풀어쓸 것.
- 사용자가 별도 질문을 입력했다면, 사주 원국/대운/세운/운 신호에 근거해 별도 상담 답변을 작성할 것.
- 질병 진단, 투자 확정, 합격/이직/사업 성공 보장처럼 단정적인 표현은 피하고 참고용으로 쓸 것.
- 사주 용어를 쓸 때는 괄호나 짧은 문장으로 의미를 풀어 설명할 것.

[입력]
이름: ${analysis.input.name}
생년월일: ${analysis.input.birthDate} (${analysis.input.calendar})
출생시간: ${analysis.input.birthTime}
성별: ${analysis.input.gender}
궁금한 점: ${analysis.input.question || "없음"}

[만세력]
음력: ${analysis.calendarDay.lunar_year}-${analysis.calendarDay.lunar_month}-${analysis.calendarDay.lunar_day}
연주: ${pillarText(analysis.pillars.year)}
월주: ${pillarText(analysis.pillars.month)}
일주: ${pillarText(analysis.pillars.day)}
시주: ${pillarText(analysis.pillars.hour)}
일간: ${analysis.dayMaster.stem}(${analysis.dayMaster.element}, ${analysis.dayMaster.yinyang})

[오행 점수]
${Object.entries(analysis.elementScore.raw).map(([key, value]) => `${key}: ${value}점 (${analysis.elementScore.percent[key]}%)`).join("\n")}

[십성 분포]
${Object.entries(analysis.tenGodScore.raw).map(([key, value]) => `${key}: ${value}점 (${analysis.tenGodScore.percent[key]}%)`).join("\n")}

[지장간]
${analysis.hiddenStemReport.map((row) => `${row.label} ${row.branch}: ${row.hidden.map((item) => `${item.stem}/${item.tenGod}`).join(", ")}`).join("\n")}

[격국/용신 후보]
격국 후보: ${analysis.pattern.name} - ${analysis.pattern.reason}
용신 후보: ${analysis.usefulGods.yongshin}
희신 후보: ${analysis.usefulGods.heeshin}
기신 후보: ${analysis.usefulGods.gishin}
판단 이유: ${analysis.usefulGods.reason}

[대운]
${analysis.daewoon.note}
${analysis.daewoon.cycles.map((cycle) => `${cycle.ageText}: ${cycle.pillar} - ${cycle.summary}`).join("\n")}

[세운]
${analysis.sewoon.map((year) => `${year.year}년(${year.age}세) ${year.pillar}: ${year.signals.join(", ")}`).join("\n")}

[운 신호]
관운: ${analysis.luckSignals.official.level} - ${analysis.luckSignals.official.reason}
재물운: ${analysis.luckSignals.wealth.level} - ${analysis.luckSignals.wealth.reason}
이직운: ${analysis.luckSignals.change.level} - ${analysis.luckSignals.change.reason}

[사용자 질문 답변 지시]
${analysis.input.question ? `질문: ${analysis.input.question}
이 질문에 대해 특정 연도 몇 개만 보지 말고, 원국의 구조, 오행/십성 분포, 지장간, 격국/용신 후보, 출생 이후 전체 대운 흐름, 현재 대운, 현재 이후 주요 세운을 종합해서 별도 섹션으로 답변하라.
출생시간이 미상이어도 답변을 회피하지 말고, 시주가 없어 정확도가 제한된다는 점을 밝힌 뒤 제공된 연주/월주/일주와 대운 전체 흐름 기준으로 가능한 범위에서 최대한 구체적으로 설명하라.
질문 주제에 맞춰 가능성, 유리한 시기, 조심할 조건, 현실적으로 확인해야 할 점, 준비하면 좋은 점, 실행 전 점검표를 포함하라.` : "사용자 질문이 없으므로 별도 질문 답변 섹션은 생략하거나 짧게 처리하라."}`;
}

function calculateHourPillar(dayStem, birthTime) {
  const hour = Number(String(birthTime).slice(0, 2));
  if (!Number.isFinite(hour)) return null;
  const branchIndex = hour === 23 ? 0 : Math.floor((hour + 1) / 2) % 12;
  const startStemByDayStem = { 갑: 0, 기: 0, 을: 2, 경: 2, 병: 4, 신: 4, 정: 6, 임: 6, 무: 8, 계: 8 };
  const stemIndex = (startStemByDayStem[dayStem] + branchIndex) % 10;
  return makePillar(stems[stemIndex][0], branches[branchIndex][0]);
}

function calculateElementScore(pillars) {
  const raw = Object.fromEntries(elementOrder.map((element) => [element, 0]));
  Object.values(pillars)
    .filter(Boolean)
    .forEach((pillar) => {
      raw[stemInfo(pillar.stem).element] += 10;
      raw[branchInfo(pillar.branch).element] += 6;
      branchInfo(pillar.branch).hidden.forEach((stem, index) => {
        raw[stemInfo(stem).element] += [5, 3, 1][index] || 1;
      });
    });
  const total = Object.values(raw).reduce((sum, value) => sum + value, 0) || 1;
  const percent = Object.fromEntries(Object.entries(raw).map(([key, value]) => [key, Math.round((value / total) * 100)]));
  const sorted = Object.entries(raw).sort((a, b) => b[1] - a[1]);
  return { raw, percent, strongest: { element: sorted[0][0], score: sorted[0][1] }, weakest: { element: sorted.at(-1)[0], score: sorted.at(-1)[1] } };
}

function calculateTenGodScore(dayMaster, pillars) {
  const names = ["비견", "겁재", "식신", "상관", "편재", "정재", "편관", "정관", "편인", "정인"];
  const raw = Object.fromEntries(names.map((name) => [name, 0]));
  Object.values(pillars)
    .filter(Boolean)
    .forEach((pillar) => {
      raw[getTenGod(dayMaster, stemInfo(pillar.stem))] += 10;
      branchInfo(pillar.branch).hidden.forEach((stem, index) => {
        raw[getTenGod(dayMaster, stemInfo(stem))] += [5, 3, 1][index] || 1;
      });
    });
  const total = Object.values(raw).reduce((sum, value) => sum + value, 0) || 1;
  const percent = Object.fromEntries(Object.entries(raw).map(([key, value]) => [key, Math.round((value / total) * 100)]));
  return { raw, percent };
}

function getTenGod(dayMaster, target) {
  const sameYinYang = dayMaster.yinyang === target.yinyang;
  if (dayMaster.element === target.element) return sameYinYang ? "비견" : "겁재";
  if (elementFeeds[dayMaster.element] === target.element) return sameYinYang ? "식신" : "상관";
  if (elementControls[dayMaster.element] === target.element) return sameYinYang ? "편재" : "정재";
  if (elementControls[target.element] === dayMaster.element) return sameYinYang ? "편관" : "정관";
  if (elementFeeds[target.element] === dayMaster.element) return sameYinYang ? "편인" : "정인";
  return "비견";
}

function getHiddenStemReport(dayMaster, pillars) {
  return Object.entries(pillars)
    .filter(([, pillar]) => pillar)
    .map(([key, pillar]) => ({
      label: { year: "연지", month: "월지", day: "일지", hour: "시지" }[key],
      branch: pillar.branch,
      hidden: branchInfo(pillar.branch).hidden.map((stem) => ({ stem, tenGod: getTenGod(dayMaster, stemInfo(stem)) })),
    }));
}

function determinePattern(dayMaster, monthPillar) {
  const monthBranch = branchInfo(monthPillar.branch);
  const mainStem = monthBranch.hidden[0];
  const tenGod = getTenGod(dayMaster, stemInfo(mainStem));
  return {
    name: `${tenGod}격 후보`,
    reason: `월지 ${monthPillar.branch}의 주 지장간 ${mainStem}이 일간 ${dayMaster.stem} 기준 ${tenGod}으로 작동합니다.`,
  };
}

function determineUsefulGods(dayMaster, elementScore, monthPillar) {
  const strongest = elementScore.strongest.element;
  const weakest = elementScore.weakest.element;
  const controllingStrong = Object.entries(elementControls).find(([, controlled]) => controlled === strongest)?.[0] || weakest;
  const dayElementWeak = elementScore.raw[dayMaster.element] <= elementScore.weakest.score + 4;
  const yongshin = dayElementWeak ? dayMaster.element : controllingStrong;
  const heeshin = dayElementWeak ? Object.entries(elementFeeds).find(([, fed]) => fed === dayMaster.element)?.[0] || weakest : weakest;
  return {
    yongshin,
    heeshin,
    gishin: strongest,
    reason: `월지 ${monthPillar.branch} 계절성과 오행 점수상 ${strongest}이 강하고 ${weakest}이 약합니다. 일간 ${dayMaster.stem}의 강약과 균형을 기준으로 1차 후보를 잡았습니다.`,
  };
}

function calculateDaewoon(data, yearPillar, monthPillar) {
  const gender = data.gender || "선택 안 함";
  const yearStem = stemInfo(yearPillar.stem);
  const forward = gender === "남성" ? yearStem.yinyang === "양" : gender === "여성" ? yearStem.yinyang === "음" : null;
  const directionText = forward === null ? "성별 미선택으로 순행/역행 판단 보류" : forward ? "순행" : "역행";
  const monthIndex = gapjaIndex(monthPillar.stem, monthPillar.branch);
  const birthYear = Number(data.birthDate?.slice(0, 4)) || new Date().getFullYear();
  const start = forward === null ? null : calculateDaewoonStart(data.birthDate, forward);
  const cycles = Array.from({ length: 8 }, (_, index) => {
    const step = forward === false ? -(index + 1) : index + 1;
    const pillar = gapjaAt(monthIndex + step);
    const ageStart = start ? `${start.age + index * 10}~${start.age + index * 10 + 9}세` : `${index + 1}번째 대운`;
    const stemTenGod = getTenGod(stemInfo(parsePillar(data.calendarDay.day_ganji).stem), stemInfo(pillar.stem));
    return {
      ageText: ageStart,
      pillar: `${pillar.stem}${pillar.branch}`,
      summary: `${stemTenGod} 기운이 열리는 10년 단위 흐름입니다.${start ? ` ${start.termName} 기준 ${start.days}일 차이로 시작 나이를 계산했습니다.` : ` ${birthYear}년 출생자의 정확 시작 나이는 성별과 절기 기준이 필요합니다.`}`,
    };
  });
  const startText = start
    ? `대운 시작 나이: 약 ${start.age}세 ${start.months}개월. ${start.termName}까지 ${start.days}일을 3일=1년 기준으로 환산했습니다.`
    : "대운 시작 나이: 성별 미선택으로 계산 보류.";
  return {
    note: `${directionText}. ${startText} 현재 계산은 절기 날짜 기준 근사치이며, 시/분 단위 정밀 보정은 한국천문연구원 24절기 시각 데이터 연결 후 더 정확해집니다.`,
    cycles,
  };
}

function calculateDaewoonStart(birthDate, forward) {
  const birth = parseLocalDate(birthDate);
  if (!birth) return null;
  const terms = getJieTermsAround(birth.getFullYear());
  const target = forward
    ? terms.find((term) => term.date > birth)
    : [...terms].reverse().find((term) => term.date < birth);
  if (!target) return null;
  const msPerDay = 24 * 60 * 60 * 1000;
  const days = Math.max(1, Math.round(Math.abs(target.date - birth) / msPerDay));
  const totalMonths = Math.round(days * 4);
  const age = Math.max(1, Math.floor(totalMonths / 12));
  const months = totalMonths % 12;
  return { age, months, days, termName: target.name };
}

function getJieTermsAround(year) {
  return [year - 1, year, year + 1]
    .flatMap((itemYear) => getSolarTermsForYear(itemYear))
    .filter((term) => term.type === "jie")
    .sort((a, b) => a.date - b.date);
}

function getSolarTermsForYear(year) {
  const constants = year < 2000 ? solarTermConstants20 : solarTermConstants21;
  const yy = year % 100;
  return solarTerms.map(([name, month, type], index) => {
    const day = Math.floor(yy * 0.2422 + constants[index] - Math.floor((yy - 1) / 4));
    return { name, type, date: new Date(year, month - 1, day) };
  });
}

function parseLocalDate(value) {
  const [year, month, day] = String(value || "").split("-").map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}

function calculateSewoon(data, dayMaster, pillars) {
  const birthYear = Number(data.birthDate?.slice(0, 4)) || new Date().getFullYear();
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 10 }, (_, index) => {
    const year = currentYear + index;
    const pillar = yearGanji(year);
    const tenGod = getTenGod(dayMaster, stemInfo(pillar.stem));
    const clashTargets = [pillars.year, pillars.month, pillars.day, pillars.hour].filter(Boolean).filter((item) => branchClashes[item.branch] === pillar.branch);
    const signals = [`천간 ${pillar.stem}${topicParticle(pillar.stem)} ${tenGod}`];
    if (["정관", "편관"].includes(tenGod)) signals.push("관운/직장/책임 신호");
    if (["정재", "편재"].includes(tenGod)) signals.push("재물/계약/거래 신호");
    if (["식신", "상관"].includes(tenGod)) signals.push("표현/성과/이직 검토 신호");
    if (clashTargets.length) signals.push(`${clashTargets.map((item) => item.branch).join(",")}지와 충: 변화 압력`);
    return { year, age: year - birthYear + 1, pillar: `${pillar.stem}${pillar.branch}`, tenGod, signals };
  });
}

function topicParticle(value) {
  const code = String(value).charCodeAt(0);
  if (code < 0xac00 || code > 0xd7a3) return "은";
  return (code - 0xac00) % 28 === 0 ? "는" : "은";
}

function judgeLuckSignals(dayMaster, sewoon) {
  const officialYears = sewoon.filter((year) => year.signals.some((signal) => signal.includes("관운")));
  const wealthYears = sewoon.filter((year) => year.signals.some((signal) => signal.includes("재물")));
  const changeYears = sewoon.filter((year) => year.signals.some((signal) => signal.includes("이직") || signal.includes("변화")));
  return {
    official: {
      level: officialYears.length ? "활성" : "약함",
      reason: officialYears.length ? `${officialYears.map((item) => `${item.year}년`).join(", ")}에 관성 세운이 들어옵니다.` : "향후 10년 세운 천간에서 관성 신호가 강하게 잡히지 않습니다.",
    },
    wealth: {
      level: wealthYears.length ? "활성" : "보통",
      reason: wealthYears.length ? `${wealthYears.map((item) => `${item.year}년`).join(", ")}에 재성 세운이 들어옵니다.` : "향후 10년 세운 천간에서 재성 신호가 적어 무리한 확장보다 구조 관리가 중요합니다.",
    },
    change: {
      level: changeYears.length ? "강함" : "보통",
      reason: changeYears.length ? `${changeYears.map((item) => `${item.year}년`).join(", ")}에 식상/충 신호가 있어 변화와 이동 압력이 커집니다.` : "충이나 식상 신호가 크게 몰리지 않아 급한 변화보다 누적형 흐름입니다.",
    },
  };
}

function parsePillar(value = "") {
  const short = formatGanjiShort(value);
  return makePillar(short.charAt(0), short.charAt(1));
}

function makePillar(stem, branch) {
  return { stem, branch };
}

function stemInfo(stem) {
  const item = stems.find(([name]) => name === stem) || stems[0];
  return { stem: item[0], element: item[1], yinyang: item[2] };
}

function branchInfo(branch) {
  const item = branches.find(([name]) => name === branch) || branches[0];
  return { branch: item[0], element: item[1], yinyang: item[2], hidden: item[3] };
}

function formatGanjiShort(value) {
  return String(value || "").split("(")[0].trim();
}

function gapjaIndex(stem, branch) {
  return Array.from({ length: 60 }, (_, index) => gapjaAt(index)).findIndex((item) => item.stem === stem && item.branch === branch);
}

function gapjaAt(index) {
  const normalized = positiveModulo(index, 60);
  return { stem: stems[normalized % 10][0], branch: branches[normalized % 12][0] };
}

function yearGanji(year) {
  return gapjaAt(year - 1984);
}

function pillarText(pillar) {
  return pillar ? `${pillar.stem}${pillar.branch}` : "미상";
}

function onlyNumber(value) {
  return String(value || "").replace(/\D/g, "");
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function renderElementBars(values) {
  return Object.entries(values)
    .map(
      ([label, value]) => `
        <div class="element-bar">
          <span>${elementLabels[label] || label}</span>
          <div><i style="width: ${value}%"></i></div>
          <b>${value}%</b>
        </div>
      `,
    )
    .join("");
}

async function fetchCalendarDay(date, calendar = "양력") {
  const staticDay = await fetchStaticCalendarDay(date, calendar);
  if (staticDay) return staticDay;

  const config = window.SUPABASE_CONFIG;
  if (!config?.url || !config?.anonKey) return null;
  const [year, month, day] = String(date || "").split("-").map(Number);
  const filter =
    calendar === "음력"
      ? `lunar_year=eq.${year}&lunar_month=eq.${month}&lunar_day=eq.${day}`
      : `date=eq.${encodeURIComponent(date)}`;
  const endpoint = `${config.url.replace(/\/$/, "")}/rest/v1/calendar_days?${filter}&select=*`;

  try {
    const response = await fetch(endpoint, {
      headers: { apikey: config.anonKey, Authorization: `Bearer ${config.anonKey}` },
    });
    if (!response.ok) return null;
    const rows = await response.json();
    return rows[0] || null;
  } catch {
    return null;
  }
}

async function fetchStaticCalendarDay(date, calendar = "양력") {
  const year = Number(date?.slice(0, 4));
  if (!year) return null;

  try {
    const rows = (await Promise.all(getCalendarYearsToSearch(year, calendar).map(loadCalendarRows))).flat();
    const [inputYear, inputMonth, inputDay] = String(date || "").split("-").map(Number);
    const row =
      calendar === "음력"
        ? rows.find((item) => item.ly === inputYear && item.lm === inputMonth && item.ld === inputDay)
        : rows.find((item) => item.date === date);
    if (!row) return null;
    return {
      date: row.date,
      solar_year: row.sy,
      solar_month: row.sm,
      solar_day: row.sd,
      lunar_year: row.ly,
      lunar_month: row.lm,
      lunar_day: row.ld,
      is_leap_month: row.leap,
      year_ganji: row.yg,
      month_ganji: row.mg,
      day_ganji: row.dg,
      julian_day: row.jd,
      weekday: row.wd,
      source: "static-calendar-json",
    };
  } catch {
    return null;
  }
}

async function loadCalendarRows(year) {
  const response = await fetch(`data/calendar/${year}.json`);
  if (!response.ok) return [];
  return response.json();
}

function getCalendarYearsToSearch(year, calendar) {
  return calendar === "음력" ? [year - 1, year, year + 1] : [year];
}

function getBirthInfo(birthDate) {
  const year = birthDate ? Number(birthDate.slice(0, 4)) : new Date().getFullYear();
  const index = positiveModulo(year - 2020, 12);
  return { year, zodiac: animals[index], zodiacIndex: index };
}

function getSamjaeInfo(birthYear) {
  const currentYear = new Date().getFullYear();
  const zodiacIndex = getBirthInfo(`${birthYear}-01-01`).zodiacIndex;
  const groups = [
    { members: [11, 3, 7], targets: [5, 6, 7] },
    { members: [2, 6, 10], targets: [8, 9, 10] },
    { members: [5, 9, 1], targets: [11, 0, 1] },
    { members: [8, 0, 4], targets: [2, 3, 4] },
  ];
  const group = groups.find((item) => item.members.includes(zodiacIndex)) || groups[0];
  const labels = ["들삼재", "눌삼재", "날삼재"];
  const matches = [];
  for (let year = currentYear - 12; year <= currentYear + 24; year += 1) {
    const samjaeIndex = group.targets.indexOf(positiveModulo(year - 2020, 12));
    if (samjaeIndex >= 0) matches.push({ year, age: year - birthYear + 1, label: labels[samjaeIndex] });
  }
  return matches.filter((item) => item.year >= currentYear).slice(0, 6);
}

function positiveModulo(value, divisor) {
  return ((value % divisor) + divisor) % divisor;
}

function renderCompatibilityResult(data) {
  const prompt = buildCompatibilityPrompt(data);
  return `
    <div class="score-card"><p>${data.myName || "나"} × ${data.theirName || "상대"} 궁합</p><h4>궁합 프롬프트</h4></div>
    <div class="keyword-row">
      ${[data.relation || "관계", data.question ? "질문 포함" : "일반 궁합", data.myCalendarDay && data.theirCalendarDay ? "만세력 포함" : "입력 기반"].map((keyword) => `<span class="tag">${keyword}</span>`).join("")}
    </div>
    ${resultSection("궁합 프롬프트 안내", "두 사람의 입력 정보와 조회 가능한 만세력 값을 바탕으로 웹 GPT에 붙여넣을 궁합 리포트 프롬프트를 생성했습니다.")}
    <div class="result-section">
      <div class="prompt-head">
        <h4>웹 GPT 붙여넣기용 프롬프트</h4>
        <button class="ghost-button compact" type="button" data-action="copy-prompt"><i data-lucide="copy"></i>프롬프트 복사</button>
      </div>
      <textarea id="gptPrompt" class="prompt-box" readonly>${escapeHtml(prompt)}</textarea>
    </div>
    ${disclaimer("궁합 결과는 참고용입니다. 출생시간이 없거나 한쪽 만세력 조회가 실패한 경우에는 해당 한계를 명확히 표시하도록 프롬프트에 포함했습니다.")}
  `;
}

function buildCompatibilityPrompt(data) {
  return `너는 100년 경력의 명리학 상담가이자 궁합 상담 전문가다.
두 사람의 관계를 단정하거나 겁주는 방식이 아니라, 명리학적 신호를 바탕으로 관계의 강점, 충돌 지점, 조율 방법을 현실적으로 설명하라.

작업 목표:
아래 궁합 입력 정보를 바탕으로 전문 상담 문서처럼 읽히는 한국어 장문 궁합 리포트를 작성한다.

${buildReportOutputInstructions("궁합 리포트")}

해석 규칙:
- 제공된 입력값과 만세력 값에 근거해서만 해석하고, 없는 사주값을 지어내지 말 것.
- 출생시간이 미상이어도 답변을 회피하지 말 것. 시주가 없어 정확도가 제한된다고 밝힌 뒤, 제공된 연주/월주/일주와 관계 입력 기준으로 가능한 범위에서 최대한 구체적으로 해석할 것.
- 특정 현재 연도 몇 개만 중심으로 보지 말고, 두 사람 각각의 원국 구조와 출생 이후 생애 전체 흐름, 대운 흐름, 현재 이후 주요 시기, 관계가 쌓여온 흐름을 종합해서 해석할 것.
- 두 사람의 일간/일지, 오행 균형, 관계 유형, 대화 방식, 갈등 패턴, 장기 관계 가능성, 조율 팁을 충분히 길게 작성할 것.
- 결혼/이별/재회/성공을 확정적으로 단정하지 말고 참고용으로 표현할 것.
- 사용자가 궁금한 점을 입력했다면 별도 상담 답변 섹션에서 구체적으로 답할 것.

[관계 입력]
관계 유형: ${data.relation || "미입력"}
궁금한 점: ${data.question?.trim() || "없음"}

[나의 정보]
이름: ${data.myName || "나"}
생년월일: ${data.myBirthDate || "미입력"} (${data.myCalendar || "양력"})
출생시간: ${data.myUnknownTime === "true" || !data.myBirthTime ? "미상" : data.myBirthTime}
성별: ${data.myGender || "미입력"}
만세력: ${formatCalendarSummary(data.myCalendarDay)}

[상대방 정보]
이름: ${data.theirName || "상대"}
생년월일: ${data.theirBirthDate || "미입력"} (${data.theirCalendar || "양력"})
출생시간: ${data.theirUnknownTime === "true" || !data.theirBirthTime ? "미상" : data.theirBirthTime}
성별: ${data.theirGender || "미입력"}
만세력: ${formatCalendarSummary(data.theirCalendarDay)}

[사용자 질문 답변 지시]
${data.question?.trim() ? `질문: ${data.question.trim()}
이 질문에 대해 특정 연도 몇 개만 보지 말고, 두 사람 각각의 원국 구조, 출생 이후 생애 전체 흐름, 대운 흐름, 현재 이후 주요 시기, 관계가 쌓여온 흐름을 종합해서 별도 섹션으로 답변하라.
가능성, 유리한 시기, 조심할 조건, 현실적으로 확인해야 할 점, 두 사람이 준비하면 좋은 점, 결정 전 체크리스트를 포함하라.` : "사용자 질문이 없으므로 질문 답변 섹션은 생략하거나 짧게 처리하라."}`;
}

function renderDailyResult(data) {
  const hasPreciseInput = Boolean(data.dailyBirthDate && data.dailyGender && data.calendarDay);
  const prompt = buildDailyPrompt(data, hasPreciseInput);
  const title = hasPreciseInput ? `${data.dailyName || "사용자"}님의 정밀 오늘운세` : `${data.zodiac || "간편"}띠 오늘운세`;

  return `
    <div class="score-card"><p>${title}</p><h4>${hasPreciseInput ? "사주 기반" : "띠 기반"} 프롬프트</h4></div>
    <div class="keyword-row">
      ${[hasPreciseInput ? "정밀 오늘운세" : "간편 띠 운세", data.focus || "전체", data.question ? "질문 포함" : "일반 운세"].map((keyword) => `<span class="tag">${keyword}</span>`).join("")}
    </div>
    ${resultSection(
      "입력 방식",
      hasPreciseInput
        ? "생년월일 기반 만세력 데이터와 오늘 날짜의 만세력 데이터를 함께 사용해 GPT 프롬프트를 생성했습니다."
        : "정밀 정보가 부족하므로 띠와 관심 분야 중심의 간편 운세 프롬프트를 생성했습니다.",
    )}
    <div class="result-section">
      <div class="prompt-head">
        <h4>웹 GPT 붙여넣기용 프롬프트</h4>
        <button class="ghost-button compact" type="button" data-action="copy-prompt"><i data-lucide="copy"></i>프롬프트 복사</button>
      </div>
      <textarea id="gptPrompt" class="prompt-box" readonly>${escapeHtml(prompt)}</textarea>
    </div>
    ${disclaimer("오늘의 운세는 참고용입니다. 정밀 모드는 사주 원국과 오늘 일진을 함께 보지만, 실제 선택은 현실 정보와 함께 판단하세요.")}
  `;
}

function buildDailyPrompt(data, hasPreciseInput) {
  const today = new Date();
  const todayText = new Intl.DateTimeFormat("ko-KR", { dateStyle: "full" }).format(today);
  const common = `너는 100년 경력의 명리학과 생활 상담에 능한 오늘의 운세 전문가다.
아래 입력값을 바탕으로 한국어 오늘의 운세 리포트를 작성하라.

${buildReportOutputInstructions("오늘의 운세 리포트")}

해석 규칙:
- 결과는 제목, 요약 카드, 분야별 운세, 주의할 점, 오늘의 행동 가이드, 사용자 질문 답변으로 구성한다.
- 정밀 오늘운세라도 오늘 하루만 고립해서 보지 말고, 기본적으로 원국과 생애 전체 흐름, 대운 흐름, 현재 이후 주요 시기 위에서 오늘의 흐름을 해석한다.
- 사용자가 질문을 입력했다면 질문의 성격에 따라 생애 전체 흐름과 오늘의 운을 함께 연결해 답변한다.
- 단정적인 예언, 투자/계약/건강 결과 보장, 질병 진단은 피하고 참고용으로 표현한다.

[공통 입력]
오늘 날짜: ${todayText}
관심 분야: ${data.focus || "전체"}
궁금한 점: ${data.question?.trim() || "없음"}`;

  if (!hasPreciseInput) {
    return `${common}

[간편 띠 운세 입력]
띠: ${data.zodiac || "미입력"}

[작성 지시]
- 띠 운세는 정밀 사주풀이가 아니라 간편 참고 운세임을 먼저 밝혀라.
- 오늘의 기분 흐름, 관계, 일/돈, 컨디션, 조심할 말과 행동을 짧지 않게 풀되, 띠 운세는 생애 전체를 정밀하게 판단할 수 없다는 한계를 함께 밝혀라.
- 사용자가 질문을 입력했다면 띠 운세 수준에서 답하되, 정밀 판단은 생년월일 기반 운세가 필요하다고 안내하라.`;
  }

  const dayMaster = getDayMasterFromCalendar(data.calendarDay);
  return `${common}

[정밀 오늘운세 입력]
이름: ${data.dailyName || "사용자"}
생년월일: ${data.dailyBirthDate} (${data.dailyCalendar || "양력"})
출생시간: ${data.dailyUnknownTime === "true" || !data.dailyBirthTime ? "미상" : data.dailyBirthTime}
성별: ${data.dailyGender}

[사용자 만세력]
음력: ${data.calendarDay.lunar_year}-${data.calendarDay.lunar_month}-${data.calendarDay.lunar_day}
연주: ${data.calendarDay.year_ganji}
월주: ${data.calendarDay.month_ganji}
일주: ${data.calendarDay.day_ganji}
일간: ${dayMaster.stem}(${dayMaster.element}, ${dayMaster.yinyang})

[오늘 만세력]
세차: ${data.todayCalendarDay?.year_ganji || "미상"}
월건: ${data.todayCalendarDay?.month_ganji || "미상"}
일진: ${data.todayCalendarDay?.day_ganji || "미상"}

[작성 지시]
- 사용자 일간과 오늘 일진/월건/세차의 관계를 보되, 원국 구조와 출생 이후 생애 전체 흐름, 대운 흐름, 현재 이후 주요 시기 위에서 오늘 운세를 해석하라.
- 관심 분야를 우선해서 풀이하라.
- 출생시간이 미상이어도 답변을 회피하지 말 것. 시주가 없어 정확도가 제한된다고 밝힌 뒤, 제공된 연주/월주/일주와 오늘 일진 기준으로 가능한 범위에서 최대한 구체적으로 해석하라.
- 사용자가 질문을 입력했다면 오늘 날짜만 보지 말고, 생애 전체 흐름과 현재 운의 흐름을 함께 연결해 유리한 점, 조심할 점, 실행 전 체크리스트를 별도 섹션으로 작성하라.`;
}

function getDayMasterFromCalendar(day) {
  const pillar = parsePillar(day?.day_ganji);
  return stemInfo(pillar.stem);
}

function buildReportOutputInstructions(reportType) {
  const fileName = getReportFileName();
  return `출력 형식:
1. 먼저 웹 GPT 답변 창에 사용자가 바로 읽을 수 있는 ${reportType}를 일반 답변 형태로 작성한다.
   - HTML 코드부터 보여주지 말 것.
   - 제목, 핵심 요약, 표, 상세 해석, 조언, 주의 문구를 보기 좋게 구성한다.
2. 일반 답변을 모두 작성한 뒤, 같은 내용을 담은 HTML 문서를 별도 파일로 생성한다.
   - 파일명은 반드시 ${fileName} 으로 한다.
   - HTML 파일은 요약본이 아니라 1번에서 작성한 일반 답변의 전체 내용을 빠짐없이 포함해야 한다.
   - 핵심 요약만 넣거나 일부 섹션을 생략하지 말 것.
   - 일반 답변의 모든 제목, 표, 문단, 사용자 질문 답변, 주의 문구를 HTML에도 동일한 분량으로 옮길 것.
   - 파일 생성/첨부 기능을 사용할 수 있으면 다운로드 가능한 파일로 제공한다.
   - 파일 생성 기능이 없다면 답변 맨 마지막에만 완성형 HTML 전체 코드를 하나의 html 코드블록으로 제공한다.
3. HTML 문서에는 <!doctype html>, html/head/body, 모바일 대응 CSS, 인쇄용 스타일을 포함한다.
4. HTML 문서는 일반 답변과 동일한 해석 내용을 담되, 보관/인쇄하기 좋은 리포트 레이아웃으로 만든다.
5. HTML 파일 생성 전에, 누락된 섹션이 없는지 스스로 점검하고 전체 분량이 일반 답변보다 짧아지지 않게 하라.`;
}

function getReportFileName() {
  return `saju_report_${formatTimestamp(new Date())}.html`;
}

function formatTimestamp(date) {
  const pad = (value) => String(value).padStart(2, "0");
  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
    pad(date.getHours()),
    pad(date.getMinutes()),
    pad(date.getSeconds()),
  ].join("");
}

function formatCalendarSummary(day) {
  if (!day) return "만세력 조회값 없음";
  return `음력 ${day.lunar_year}-${day.lunar_month}-${day.lunar_day}, 연주 ${day.year_ganji || "미상"}, 월주 ${day.month_ganji || "미상"}, 일주 ${day.day_ganji || "미상"}`;
}

function renderNamingResult(data) {
  const names = ["서윤", "하린", "이안", "나겸"];
  return `
    <div class="score-card"><p>${data.surname || "새"}씨 이름 후보</p><h4>${data.mood || "밝은"} 결</h4></div>
    <div class="name-grid">
      ${names.map((name) => `<div class="name-option"><b>${data.surname || ""}${name}</b><span>${data.purpose || "이름"} 후보</span></div>`).join("")}
    </div>
    ${resultSection("작명 메모", "작명은 음오행, 한자 자원오행, 발음, 획수, 가족 선호도를 함께 봐야 하므로 다음 단계에서 별도 계산 데이터로 확장합니다.")}
    ${disclaimer()}
  `;
}

function resultSection(title, body) {
  return `<div class="result-section"><h4>${title}</h4><p>${body}</p></div>`;
}

function disclaimer(text = "이 결과는 재미와 자기이해를 위한 참고용입니다. 중요한 의사결정은 현실의 정보와 전문가 조언을 함께 확인하세요.") {
  return `<div class="disclaimer">${text}</div>`;
}

function renderRecent() {
  $("#recentList").innerHTML = state.recent
    .map(
      (item) => `
        <article class="recent-item">
          <span>${item.service}</span>
          <b>${item.title}</b>
          <small>${item.time}</small>
        </article>
      `,
    )
    .join("");
}

function refreshIcons() {
  if (window.lucide) window.lucide.createIcons();
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

init();
