const services = {
  saju: {
    eyebrow: "SAJU READING",
    title: "사주팔자",
    description: "생년월일시를 바탕으로 명식과 오행 흐름을 가볍게 살펴봅니다.",
    fields: [
      { name: "nickname", label: "이름 또는 별명", type: "text", placeholder: "예: 민지" },
      {
        name: "birthDate",
        label: "생년월일",
        type: "dateGroup",
      },
      { name: "birthTime", label: "출생 시간", type: "time" },
      {
        name: "calendar",
        label: "달력 기준",
        type: "select",
        options: ["양력", "음력"],
      },
      { name: "unknownTime", label: "출생 시간을 몰라요", type: "checkbox" },
    ],
  },
  compatibility: {
    eyebrow: "MATCH READING",
    title: "궁합",
    description: "두 사람의 기본 흐름을 비교해 끌림과 조율 포인트를 확인합니다.",
    fields: [
      { name: "myName", label: "나의 이름", type: "text", placeholder: "예: 하린" },
      {
        name: "myBirthDate",
        label: "나의 생년월일",
        type: "dateGroup",
      },
      { name: "theirName", label: "상대 이름", type: "text", placeholder: "예: 도윤" },
      {
        name: "theirBirthDate",
        label: "상대 생년월일",
        type: "dateGroup",
      },
      {
        name: "relation",
        label: "관계 유형",
        type: "select",
        options: ["연인", "썸", "친구", "동료", "가족"],
      },
    ],
  },
  daily: {
    eyebrow: "DAILY FLOW",
    title: "오늘의 운세",
    description: "오늘의 기분, 일, 관계 흐름을 짧고 산뜻한 카드로 확인합니다.",
    fields: [
      { name: "nickname", label: "별명", type: "text", placeholder: "예: 수아" },
      {
        name: "focus",
        label: "관심 분야",
        type: "select",
        options: ["전체", "연애", "일", "돈", "인간관계", "컨디션"],
      },
      {
        name: "mood",
        label: "오늘의 기분",
        type: "select",
        options: ["차분함", "들뜸", "피곤함", "집중됨", "복잡함"],
      },
    ],
  },
  naming: {
    eyebrow: "NAME IDEAS",
    title: "작명",
    description: "성씨와 원하는 이미지를 바탕으로 이름 후보와 느낌을 제안합니다.",
    fields: [
      { name: "surname", label: "성씨", type: "text", placeholder: "예: 김" },
      {
        name: "purpose",
        label: "용도",
        type: "select",
        options: ["아기 이름", "개명 아이디어", "예명", "닉네임", "브랜드명"],
      },
      {
        name: "mood",
        label: "원하는 느낌",
        type: "select",
        options: ["밝은", "단정한", "지적인", "부드러운", "현대적인", "고전적인"],
      },
      {
        name: "length",
        label: "이름 글자 수",
        type: "select",
        options: ["2글자", "3글자"],
      },
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
  const formatter = new Intl.DateTimeFormat("ko-KR", {
    month: "long",
    day: "numeric",
    weekday: "long",
  });
  $("#todayLabel").textContent = formatter.format(new Date());
}

function bindEvents() {
  $$(".service-tab").forEach((button) => {
    button.addEventListener("click", () => renderService(button.dataset.service));
  });

  $("[data-action='quick-daily']").addEventListener("click", () => renderService("daily"));
  $("[data-action='reset-form']").addEventListener("click", () => renderService(state.activeService));

  $(".favorite-button").addEventListener("click", (event) => {
    event.currentTarget.classList.toggle("active");
  });
}

function renderService(serviceKey) {
  state.activeService = serviceKey;
  const service = services[serviceKey];

  $$(".service-tab").forEach((button) => {
    button.classList.toggle("active", button.dataset.service === serviceKey);
  });

  $("#serviceEyebrow").textContent = service.eyebrow;
  $("#serviceTitle").textContent = service.title;
  $("#serviceDescription").textContent = service.description;
  $("#formTitle").textContent = `${service.title} 정보 입력`;
  $("#resultTitle").textContent = `${service.title} 결과`;

  renderForm(serviceKey, service.fields);
  hideResult();
  refreshIcons();
}

function renderForm(serviceKey, fields) {
  const form = $("#fortuneForm");
  form.innerHTML = `
    <div class="field-grid">
      ${fields.map((field) => renderField(field)).join("")}
    </div>
    <div class="form-actions">
      <button class="primary-button" type="submit">
        <i data-lucide="wand-sparkles"></i>
        결과 보기
      </button>
      <button class="ghost-button" type="button" data-action="sample-fill">
        <i data-lucide="pen-line"></i>
        샘플 입력
      </button>
    </div>
  `;

  form.onsubmit = (event) => {
    event.preventDefault();
    const formData = Object.fromEntries(new FormData(form).entries());
    renderLoadingThenResult(serviceKey, formData);
  };

  form.querySelector("[data-action='sample-fill']").addEventListener("click", () => {
    fillSample(serviceKey, form);
  });
}

function renderField(field) {
  if (field.type === "select") {
    return `
      <div class="field">
        <label for="${field.name}">${field.label}</label>
        <select id="${field.name}" name="${field.name}">
          ${field.options.map((option) => `<option value="${option}">${option}</option>`).join("")}
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
      <fieldset class="field date-group full" data-date-group="${field.name}">
        <legend>${field.label}</legend>
        <div class="date-inputs">
          <input name="${field.name}Year" type="text" inputmode="numeric" autocomplete="bday-year" maxlength="4" placeholder="년" aria-label="${field.label} 년" />
          <input name="${field.name}Month" type="text" inputmode="numeric" autocomplete="bday-month" maxlength="2" placeholder="월" aria-label="${field.label} 월" />
          <input name="${field.name}Day" type="text" inputmode="numeric" autocomplete="bday-day" maxlength="2" placeholder="일" aria-label="${field.label} 일" />
        </div>
      </fieldset>
    `;
  }

  return `
    <div class="field">
      <label for="${field.name}">${field.label}</label>
      <input
        id="${field.name}"
        name="${field.name}"
        type="${field.type}"
        placeholder="${field.placeholder || ""}"
        ${field.inputMode ? `inputmode="${field.inputMode}"` : ""}
        ${field.inputMode === "numeric" ? 'autocomplete="bday"' : ""}
      />
    </div>
  `;
}

function fillSample(serviceKey, form) {
  const samples = {
    saju: {
      nickname: "민지",
      birthDateYear: "1995",
      birthDateMonth: "3",
      birthDateDay: "12",
      birthTime: "14:30",
      calendar: "양력",
    },
    compatibility: {
      myName: "하린",
      myBirthDateYear: "1994",
      myBirthDateMonth: "6",
      myBirthDateDay: "8",
      theirName: "도윤",
      theirBirthDateYear: "1992",
      theirBirthDateMonth: "11",
      theirBirthDateDay: "21",
      relation: "연인",
    },
    daily: { nickname: "수아", focus: "전체", mood: "차분함" },
    naming: { surname: "김", purpose: "아기 이름", mood: "밝은", length: "2글자", avoid: "준" },
  };

  Object.entries(samples[serviceKey]).forEach(([key, value]) => {
    const input = form.elements[key];
    if (input) input.value = value;
  });
}

function renderLoadingThenResult(serviceKey, formData) {
  const normalizedData = normalizeFormData(formData);
  showResult();
  $("#resultCard").innerHTML = `
    <div class="result-section">
      <h4>결과를 정리하는 중</h4>
      <p>입력한 흐름을 바탕으로 보기 좋은 카드로 정리하고 있습니다.</p>
    </div>
  `;

  window.setTimeout(() => {
    renderResult(serviceKey, normalizedData);
    const service = services[serviceKey].title;
    const title = makeRecentTitle(serviceKey, normalizedData);
    state.recent.unshift({ service, title, time: "방금 전" });
    state.recent = state.recent.slice(0, 5);
    renderRecent();
  }, 420);
}

function normalizeFormData(formData) {
  const normalized = { ...formData };

  ["birthDate", "myBirthDate", "theirBirthDate"].forEach((key) => {
    const year = formData[`${key}Year`];
    const month = formData[`${key}Month`];
    const day = formData[`${key}Day`];

    if (year || month || day) {
      normalized[key] = [
        String(year || "").padStart(4, "0"),
        String(month || "").padStart(2, "0"),
        String(day || "").padStart(2, "0"),
      ].join("-");
    }
  });

  return normalized;
}

function makeRecentTitle(serviceKey, data) {
  if (serviceKey === "compatibility") return `${data.myName || "나"} × ${data.theirName || "상대"}`;
  if (serviceKey === "naming") return `${data.surname || "이"}로운 이름 후보`;
  if (serviceKey === "daily") return `${data.focus || "전체"} 흐름`;
  return `${data.nickname || "나"}의 명식`;
}

function renderResult(serviceKey, formData) {
  const renderers = {
    saju: renderSajuResult,
    compatibility: renderCompatibilityResult,
    daily: renderDailyResult,
    naming: renderNamingResult,
  };
  $("#resultCard").innerHTML = renderers[serviceKey](formData);
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
  const unknownTime = data.unknownTime === "true";
  const birthInfo = getBirthInfo(data.birthDate);
  const samjae = getSamjaeInfo(birthInfo.year);
  const seed = getSajuSeed(data, birthInfo);

  return `
    <div class="score-card">
      <p>${data.nickname || "사용자"}님의 종합 사주풀이</p>
      <h4>${birthInfo.zodiac}띠 · 수 기운 중심</h4>
    </div>
    ${seed.example ? resultSection(seed.example.metaphor, seed.example.summary) : ""}
    <div class="keyword-row">
      ${["수 기운 강함", "금 기운 보완", seed.metaphor.title, "관찰형 리더십"].map((keyword) => `<span class="tag">${keyword}</span>`).join("")}
    </div>
    <div class="result-section">
      <h4>사주 명식 목업</h4>
      <div class="pillar-grid">
        ${[
          ["연주", "을해"],
          ["월주", "기묘"],
          ["일주", "임자"],
          ["시주", unknownTime ? "미상" : "정미"],
        ]
          .map(([label, value]) => `<div class="pillar"><b>${value}</b><span>${label}</span></div>`)
          .join("")}
      </div>
    </div>
    <div class="result-section">
      <h4>오행 밸런스</h4>
      <div class="element-bars">
        ${renderElementBars({ 목: 64, 화: 42, 토: 58, 금: 24, 수: 78 })}
      </div>
    </div>
    ${longSection("전체 총평", [
      `${seed.metaphor.title}로 비유할 수 있습니다. ${seed.metaphor.body}`,
      "이 명식은 수 기운이 중심에 놓이고 목의 흐름이 이를 받아주는 형태로 읽을 수 있습니다. 사람과 상황을 단번에 밀어붙이기보다 먼저 분위기를 살피고, 속으로 여러 가능성을 비교한 뒤 움직이는 타입에 가깝습니다.",
      "장점은 감각, 관찰력, 적응력입니다. 반대로 약점은 생각이 너무 많아져 결정이 늦어지거나, 본인의 기준을 분명히 말하지 않아 주변 흐름에 끌려가는 점입니다. 운을 좋게 쓰려면 머릿속에 있는 감각을 문서, 숫자, 일정, 약속처럼 눈에 보이는 구조로 바꾸는 것이 중요합니다.",
    ])}
    ${longSection("오행 해석", [
      "수 기운은 지혜, 감정, 직관, 이동성, 생각의 깊이로 볼 수 있고, 목 기운은 성장, 기획, 배움, 표현으로 볼 수 있습니다. 이 둘이 살아 있으면 새로운 것을 배우고 연결하는 능력이 좋습니다. 다만 금 기운이 약한 흐름으로 보면 마무리, 규칙, 계약, 숫자 관리, 경계 설정은 의식적으로 보완해야 합니다.",
      "쉽게 말하면 아이디어는 잘 떠오르는데 정리와 마감에서 에너지가 빠질 수 있습니다. 그래서 혼자 감으로 처리하기보다 체크리스트, 회계표, 계약서, 일정표를 곁에 두면 운의 흐름이 훨씬 안정됩니다. 금 기운을 보완하는 행동은 곧 생활의 기준을 세우는 일입니다.",
    ])}
    ${longSection("어린 시절과 성장운", [
      "어린 시절에는 주변의 말투, 표정, 분위기를 예민하게 받아들이는 편으로 볼 수 있습니다. 겉으로는 괜찮아 보여도 속으로는 오래 생각하고, 혼자 납득해야 마음이 편해지는 흐름입니다. 그래서 어릴 때부터 칭찬과 비교에 민감했을 가능성이 있습니다.",
      "초년운은 아주 강하게 치고 나가는 모습보다는 천천히 적응하며 실력을 쌓는 쪽에 가깝습니다. 초반에 눈에 띄지 않더라도, 관심 있는 분야를 오래 붙잡으면 뒤늦게 두각을 보이는 타입입니다. 어릴 때 형성된 자기 기준이 성인이 된 뒤 직업 선택과 인간관계 방식에 큰 영향을 줄 수 있습니다.",
    ])}
    ${longSection("청년기와 직업운", [
      "20대 초중반은 방향을 하나로 고정하기보다 여러 선택지를 비교하는 시기입니다. 이때는 내가 뭘 좋아하는지보다, 어떤 환경에서 오래 버틸 수 있는지 확인하는 과정이 더 중요합니다. 처음 선택이 곧 평생의 답이라고 생각하면 오히려 운이 막히는 느낌을 받을 수 있습니다.",
      "직업적으로는 기획, 분석, 교육, 상담, 콘텐츠, 브랜딩, 데이터 정리, 서비스 운영처럼 사람의 흐름과 정보를 함께 다루는 일이 잘 맞습니다. 단순 반복만 있는 일보다는 관찰하고 해석하고 개선하는 역할에서 장점이 살아납니다. 30대 이후에는 경험이 쌓이면서 말, 글, 기획, 관리 능력이 수입과 연결되기 쉬운 흐름입니다.",
      seed.luckRules.officialWeak,
    ])}
    ${longSection("금전운", [
      "재물운은 한 번에 크게 잡는 운보다 천천히 흐름을 만들고 지키는 쪽에 가깝습니다. 돈을 버는 감각 자체가 없는 사주는 아니지만, 감정이 흔들릴 때 소비나 결정도 같이 흔들릴 수 있습니다. 특히 인간관계, 기분 전환, 배움, 취향 소비 쪽으로 돈이 새기 쉽습니다.",
      "재물운을 좋게 쓰려면 자동 저축, 월별 예산, 고정비 점검, 장기 목표처럼 구조를 먼저 만들어야 합니다. 이 명식은 돈을 쫓을 때보다 실력과 신뢰가 쌓인 뒤 돈이 따라오는 흐름이 더 좋습니다. 투자성 결정은 즉흥보다 기록과 비교가 맞고, 남의 말만 듣고 움직이는 방식은 피하는 편이 안정적입니다.",
      seed.luckRules.wealthMiddle,
    ])}
    ${seed.example ? seed.example.sections.map((section) => resultSection(section.title, section.body)).join("") : ""}
    ${longSection("사업운", [
      "사업운은 있습니다. 다만 초반부터 크게 벌이는 방식보다는 작게 검증하고, 반복 고객을 만들고, 신뢰를 누적하는 방식이 맞습니다. 감각은 좋은데 운영 체계가 약하면 수익이 생겨도 새는 구멍이 생길 수 있으니, 가격표, 계약 조건, 정산 기준을 분명히 해야 합니다.",
      "잘 맞는 사업 방향은 콘텐츠, 교육, 상담, 취향 기반 브랜드, 데이터/리서치, 라이프스타일 서비스처럼 사람의 마음과 정보를 함께 읽는 분야입니다. 동업은 가능하지만 역할 분리가 핵심입니다. 내가 감각과 기획을 맡는다면 상대는 숫자, 운영, 마감에 강한 사람이 좋습니다.",
    ])}
    ${longSection("관계와 배우자운", [
      "관계운은 깊고 오래 가는 인연을 선호하는 쪽입니다. 많은 사람을 넓게 만나는 것보다 마음이 통하는 몇 사람과 안정적인 관계를 만드는 흐름이 강합니다. 다만 처음에는 상대를 오래 관찰하기 때문에 마음이 늦게 열리는 편으로 보일 수 있습니다.",
      "배우자운은 생활 리듬과 약속을 지키는 사람을 만날 때 편안해집니다. 감정 표현이 과하게 빠른 사람보다는, 속도를 맞춰주고 현실적인 책임감이 있는 사람이 잘 맞습니다. 관계에서 조심할 점은 혼자 서운함을 쌓아두는 것입니다. 한 번에 터뜨리기보다 작은 불편함을 부드럽게 말하는 연습이 필요합니다.",
    ])}
    ${longSection("자식운과 가족운", [
      "자식운과 가족운은 정서적 책임감이 강한 흐름으로 볼 수 있습니다. 가까운 사람의 기분을 잘 알아차리는 만큼, 가족 문제를 본인이 지나치게 떠안으면 피로가 쌓일 수 있습니다. 돌보는 마음은 장점이지만 모든 것을 대신 해결하려는 마음은 운을 무겁게 만듭니다.",
      "자식이나 후배, 제자와의 인연에서는 가르치고 기다려주는 역할이 잘 맞습니다. 다만 기준 없이 다 받아주기보다 규칙을 세우고 그 안에서 따뜻하게 대하는 방식이 좋습니다. 가족운은 가까울수록 각자의 경계와 역할을 분명히 할 때 편안하게 흐릅니다.",
    ])}
    ${longSection("건강/컨디션 운", [
      "건강은 사주로 질병을 단정할 수 없습니다. 다만 컨디션 패턴으로 보면 생각이 많아질수록 수면, 소화, 체온 리듬이 함께 흔들릴 수 있는 타입입니다. 머리는 계속 움직이는데 몸의 회복이 따라오지 않으면 쉽게 지치고 예민해질 수 있습니다.",
      "몸을 따뜻하게 하고, 밤에 생각을 줄이는 루틴을 만들고, 일정한 식사와 수면 시간을 유지하는 것이 좋습니다. 물 기운이 강한 사람은 감정과 피로가 몸에 쌓이기 쉬우니 걷기, 스트레칭, 목욕, 기록하기처럼 순환을 만들어주는 습관이 도움이 됩니다.",
    ])}
    <div class="result-section">
      <h4>나이대별 흐름</h4>
      <div class="timeline-list">
        ${renderTimeline([
          ["18~23세", "방향 탐색", "관심사가 넓어지고 진로 기준을 세우는 시기입니다. 이때는 결과보다 경험의 폭이 중요하고, 맞지 않는 환경을 알아차리는 것도 큰 수확입니다."],
          ["24~29세", "경험 축적", "일과 관계에서 시행착오가 늘지만 실력이 빠르게 쌓입니다. 자격, 포트폴리오, 실무 경험을 남기면 30대 운을 여는 기반이 됩니다."],
          ["30~35세", "기반 형성", "전문성, 수입 구조, 생활 루틴을 안정시키기 좋습니다. 이 시기부터는 사람을 많이 만나는 것보다 나를 오래 믿어줄 관계를 만드는 것이 중요합니다."],
          ["36~42세", "확장 운", "사람과 기회가 넓어지며 사업, 이직, 독립을 검토하기 좋은 흐름입니다. 단, 확장 전에 돈의 흐름과 계약 조건을 먼저 점검해야 합니다."],
          ["43~49세", "관리 운", "무리한 확장보다 자산, 건강 루틴, 가족 관계 정리가 중요합니다. 이미 만든 기반을 지키고 재정비하면 후반 운이 안정됩니다."],
          ["50세 이후", "정리와 권위", "경험이 말과 글, 조언, 교육, 운영 능력으로 바뀌는 시기입니다. 직접 뛰는 역할보다 기준을 제시하고 사람을 이끄는 역할이 편해집니다."],
        ])}
      </div>
    </div>
    <div class="result-section">
      <h4>삼재 흐름</h4>
      <p class="section-lead">${birthInfo.year ? `${birthInfo.year}년생 ${birthInfo.zodiac}띠 기준으로 본 삼재 흐름입니다.` : "생년월일을 입력하면 띠 기준 삼재 흐름을 계산해 보여줍니다."}</p>
      <div class="samjae-grid">
        ${samjae
          .map(
            (item) => `
              <div class="samjae-card">
                <b>${item.label}</b>
                <span>${item.year}년 · ${item.age}세</span>
                <p>${item.body}</p>
              </div>
            `,
          )
          .join("")}
      </div>
    </div>
    <div class="result-section">
      <h4>운이 트이는 구간과 조심할 구간</h4>
      <div class="flow-grid">
        ${renderFlowCards([
          ["운이 트이는 구간", "30~35세", "실력과 수입 구조가 연결되기 시작하는 구간입니다. 이때 만든 포트폴리오, 자격, 평판이 이후 확장운의 발판이 됩니다."],
          ...seed.timingRules.map((rule) => [rule.title, rule.ageRange, rule.body]),
          ["관리해야 할 구간", "45~49세", "이미 만든 것을 지키는 힘이 중요합니다. 건강 루틴, 가족 역할, 자산 구조를 정리하지 않으면 피로가 커질 수 있습니다."],
        ])}
      </div>
    </div>
    ${longSection("조심하면 좋은 선택", [
      "이 명식은 감정이 올라온 순간 바로 결정하면 손해를 볼 수 있습니다. 큰 계약, 동업, 투자성 결정, 관계 정리는 하루 이상 시간을 두고 다시 보는 편이 좋습니다. 특히 누군가 강하게 밀어붙이는 분위기에서는 그 자리에서 답하지 않는 것이 운을 지키는 방식입니다.",
      "반대로 너무 오래 고민해서 기회를 놓치는 것도 주의해야 합니다. 기준을 세운 뒤에는 작은 실행을 먼저 해보는 것이 좋습니다. 운이 트이는 사람은 운이 좋아서만 트이는 것이 아니라, 흐름이 왔을 때 이미 준비된 구조를 가지고 있는 사람입니다.",
    ])}
    ${unknownTime ? resultSection("출생 시간 미입력 안내", seed.luckRules.unknownTime) : ""}
    ${disclaimer("삼재와 나이대별 흐름은 확정 예언이 아니라 띠와 전통 명리 해석을 바탕으로 한 참고용 경향입니다. 실제 대운/세운은 정확한 생년월일시와 절기 기준 계산이 필요합니다.")}
  `;
}

function getSajuSeed(data, birthInfo) {
  const seed = window.FORTUNE_SEED?.saju || {};
  const month = getBirthMonth(data.birthDate);
  const metaphor =
    seed.seasonalMetaphors?.find((item) => item.months.includes(month)) ||
    seed.seasonalMetaphors?.[0] || {
      title: "차분히 자기 계절을 기다리는 사주",
      body: "초반보다 시간이 갈수록 자기 색이 분명해지는 흐름입니다.",
    };
  const example = seed.examples?.[data.birthDate];

  return {
    metaphor,
    example,
    timingRules: seed.timingRules || [],
    luckRules: {
      officialWeak: seed.luckRules?.officialWeak || "",
      wealthMiddle: seed.luckRules?.wealthMiddle || "",
      unknownTime: seed.luckRules?.unknownTime || "출생 시간이 없으면 시주 관련 해석은 제한됩니다.",
    },
    birthInfo,
  };
}

function longSection(title, paragraphs) {
  return `
    <div class="result-section long-reading">
      <h4>${title}</h4>
      ${paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join("")}
    </div>
  `;
}

function renderTimeline(items) {
  return items
    .map(
      ([age, title, body]) => `
        <div class="timeline-item">
          <span>${age}</span>
          <div>
            <b>${title}</b>
            <p>${body}</p>
          </div>
        </div>
      `,
    )
    .join("");
}

function renderFlowCards(items) {
  return items
    .map(
      ([label, age, body]) => `
        <div class="flow-card">
          <span>${label}</span>
          <b>${age}</b>
          <p>${body}</p>
        </div>
      `,
    )
    .join("");
}

function getBirthInfo(birthDate) {
  const year = birthDate ? Number(birthDate.slice(0, 4)) : 1995;
  const animals = ["쥐", "소", "호랑이", "토끼", "용", "뱀", "말", "양", "원숭이", "닭", "개", "돼지"];
  const index = positiveModulo(year - 2020, 12);

  return {
    year,
    zodiac: animals[index],
    zodiacIndex: index,
  };
}

function getBirthMonth(birthDate) {
  const month = birthDate ? Number(birthDate.slice(5, 7)) : 12;
  return Number.isFinite(month) && month >= 1 && month <= 12 ? month : 12;
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
  const bodies = [
    "새 변수가 들어오는 시기로 봅니다. 무리한 확장보다 계약, 관계, 지출 구조를 먼저 점검하는 편이 좋습니다.",
    "삼재 기운이 머무는 시기로 봅니다. 큰 방향을 흔들기보다 체력, 돈, 사람 문제를 차분히 관리하는 것이 좋습니다.",
    "정리하고 빠져나오는 시기로 봅니다. 오래 끌던 문제를 정돈하되, 마지막까지 방심하지 않는 태도가 필요합니다.",
  ];
  const startYear = currentYear - 12;
  const endYear = currentYear + 24;
  const matches = [];

  for (let year = startYear; year <= endYear; year += 1) {
    const yearZodiac = positiveModulo(year - 2020, 12);
    const samjaeIndex = group.targets.indexOf(yearZodiac);
    if (samjaeIndex >= 0) {
      matches.push({
        year,
        age: year - birthYear + 1,
        label: labels[samjaeIndex],
        body: bodies[samjaeIndex],
      });
    }
  }

  return matches.filter((item) => item.year >= currentYear).slice(0, 6);
}

function positiveModulo(value, divisor) {
  return ((value % divisor) + divisor) % divisor;
}

function renderCompatibilityResult(data) {
  return `
    <div class="score-card">
      <p>${data.relation || "관계"} 궁합 점수</p>
      <h4>82점</h4>
    </div>
    <div class="keyword-row">
      ${["대화의 리듬", "서로 다른 속도", "따뜻한 보완"].map((keyword) => `<span class="tag">${keyword}</span>`).join("")}
    </div>
    ${resultSection("끌리는 지점", `${data.myName || "나"}의 현실감과 ${data.theirName || "상대"}의 유연함이 만나면 서로의 선택을 넓혀주는 조합으로 볼 수 있습니다.`)}
    ${resultSection("조율 포인트", "한쪽은 빠른 결론을 원하고 다른 한쪽은 충분한 여지를 원할 수 있습니다. 약속과 감정 표현의 속도를 미리 맞추면 관계가 편해집니다.")}
    ${resultSection("오늘의 대화 팁", "정답을 고르기보다 서로의 기준을 묻는 질문이 좋습니다. 짧은 확인 한마디가 오해를 줄입니다.")}
    ${disclaimer()}
  `;
}

function renderDailyResult(data) {
  return `
    <div class="score-card">
      <p>${data.nickname || "오늘"}의 총운</p>
      <h4>맑음 76%</h4>
    </div>
    <div class="keyword-row">
      ${["세이지", "6", data.focus || "전체"].map((keyword) => `<span class="tag">${keyword}</span>`).join("")}
    </div>
    ${resultSection("오늘의 흐름", "작은 일을 끝까지 마무리할 때 기분 좋은 속도가 생깁니다. 새 일을 크게 벌이기보다 이미 시작한 것을 정리해보세요.")}
    ${resultSection("분야별 힌트", "관계에서는 짧고 다정한 확인이 좋고, 일에서는 우선순위를 세 개 이하로 줄이면 집중력이 살아납니다.")}
    ${resultSection("피하면 좋은 패턴", "기분이 복잡할수록 바로 답장을 쓰기보다 한 번 읽고 잠시 두는 편이 좋습니다.")}
    ${disclaimer()}
  `;
}

function renderNamingResult(data) {
  const surname = data.surname || "김";
  const options = [
    [`${surname}하린`, "맑고 부드러운 흐름"],
    [`${surname}서윤`, "단정하고 밝은 인상"],
    [`${surname}이안`, "현대적이고 안정적인 리듬"],
  ];

  return `
    <div class="score-card">
      <p>${data.purpose || "작명"} 후보</p>
      <h4>${data.mood || "밝은"} 결</h4>
    </div>
    <div class="result-section">
      <h4>이름 후보</h4>
      <div class="name-grid">
        ${options
          .map(([name, note]) => `<div class="name-option"><b>${name}</b><span>${note}</span></div>`)
          .join("")}
      </div>
    </div>
    ${resultSection("추천 방향", "받침이 부드럽게 이어지는 이름이 성씨와 잘 어울립니다. 밝은 이미지를 원한다면 모음이 선명한 후보를 우선 비교해보세요.")}
    ${resultSection("검토 메모", `${data.avoid ? `${data.avoid} 계열의 글자는 후보에서 제외하는 방향으로 볼 수 있습니다.` : "피하고 싶은 글자를 입력하면 후보 필터링 기준으로 사용할 수 있습니다."}`)}
    ${disclaimer("실제 출생 신고나 개명 전에는 최신 인명용 한자와 공식 기준을 별도로 확인하세요.")}
  `;
}

function renderElementBars(elements) {
  return Object.entries(elements)
    .map(
      ([label, value]) => `
        <div class="element-bar">
          <span>${label}</span>
          <div class="bar-track"><div class="bar-fill" style="width:${value}%"></div></div>
          <span>${value}</span>
        </div>
      `,
    )
    .join("");
}

function resultSection(title, body) {
  return `
    <div class="result-section">
      <h4>${title}</h4>
      <p>${body}</p>
    </div>
  `;
}

function disclaimer(extra = "") {
  return `
    <p class="disclaimer">
      본 결과는 재미와 자기이해를 위한 참고용 콘텐츠입니다.
      건강, 투자, 법률, 관계의 중대한 결정은 현실적인 정보와 함께 판단하세요.
      ${extra}
    </p>
  `;
}

function renderRecent() {
  $("#recentList").innerHTML = state.recent
    .map(
      (item) => `
      <div class="recent-item">
        <div>
          <strong>${item.title}</strong>
          <span>${item.service}</span>
        </div>
        <small>${item.time}</small>
      </div>
    `,
    )
    .join("");
}

function refreshIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

document.addEventListener("DOMContentLoaded", init);
