const services = {
  saju: {
    eyebrow: "SAJU READING",
    title: "사주팔자",
    description: "생년월일시를 바탕으로 명식과 오행 흐름을 가볍게 살펴봅니다.",
    fields: [
      { name: "nickname", label: "이름 또는 별명", type: "text", placeholder: "예: 민지" },
      { name: "birthDate", label: "생년월일", type: "date" },
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
      { name: "myBirthDate", label: "나의 생년월일", type: "date" },
      { name: "theirName", label: "상대 이름", type: "text", placeholder: "예: 도윤" },
      { name: "theirBirthDate", label: "상대 생년월일", type: "date" },
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
  $("#resultTitle").textContent = `${service.title} 미리보기`;

  renderForm(serviceKey, service.fields);
  renderResult(serviceKey, {});
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

  return `
    <div class="field">
      <label for="${field.name}">${field.label}</label>
      <input id="${field.name}" name="${field.name}" type="${field.type}" placeholder="${field.placeholder || ""}" />
    </div>
  `;
}

function fillSample(serviceKey, form) {
  const samples = {
    saju: { nickname: "민지", birthDate: "1995-03-12", birthTime: "14:30", calendar: "양력" },
    compatibility: {
      myName: "하린",
      myBirthDate: "1994-06-08",
      theirName: "도윤",
      theirBirthDate: "1992-11-21",
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
  $("#resultCard").innerHTML = `
    <div class="result-section">
      <h4>결과를 정리하는 중</h4>
      <p>입력한 흐름을 바탕으로 보기 좋은 카드로 정리하고 있습니다.</p>
    </div>
  `;

  window.setTimeout(() => {
    renderResult(serviceKey, formData);
    const service = services[serviceKey].title;
    const title = makeRecentTitle(serviceKey, formData);
    state.recent.unshift({ service, title, time: "방금 전" });
    state.recent = state.recent.slice(0, 5);
    renderRecent();
  }, 420);
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

function renderSajuResult(data) {
  const unknownTime = data.unknownTime === "true";

  return `
    <div class="score-card">
      <p>${data.nickname || "사용자"}님의 종합 사주풀이</p>
      <h4>수 기운 중심</h4>
    </div>
    <div class="keyword-row">
      ${["수 기운 강함", "금 기운 보완", "늦게 단단해지는 운", "관찰형 리더십"].map((keyword) => `<span class="tag">${keyword}</span>`).join("")}
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
    ${resultSection("타고난 성향", "수 기운이 중심이 되는 명식으로 보면 감정과 상황의 흐름을 읽는 감각이 좋고, 겉으로 바로 드러내기보다 안에서 충분히 생각한 뒤 움직이는 편입니다. 생각이 깊은 만큼 결정을 미루면 기회가 지나갈 수 있어, 기준을 정한 뒤 실행으로 옮기는 습관이 중요합니다.")}
    ${resultSection("오행 해석", "수와 목의 흐름은 비교적 살아 있고 금 기운은 보완 포인트로 봅니다. 아이디어와 감각은 좋은데, 이를 문서화하거나 숫자화하거나 규칙으로 만드는 과정이 더해질 때 결과가 단단해집니다.")}
    ${resultSection("어린 시절과 성장운", "유년기에는 주변 분위기와 말의 뉘앙스에 민감하게 반응하는 흐름이 있습니다. 인정받고 싶은 마음이 강하지만 속마음을 바로 꺼내기보다 혼자 정리하는 쪽에 가까워, 안정적인 환경을 만날수록 재능이 늦지 않게 드러나는 타입으로 볼 수 있습니다.")}
    ${resultSection("청년기와 직업운", "20대 초중반에는 방향을 자주 비교하고 바꾸는 흐름이 생기기 쉽습니다. 한 번에 천직을 고르기보다 여러 경험을 통해 본인만의 기준을 만드는 시기로 보는 것이 좋습니다. 기획, 분석, 상담, 콘텐츠, 데이터, 교육, 브랜드처럼 관찰력과 언어 감각을 쓰는 일이 잘 맞는 편입니다.")}
    ${resultSection("금전운", "한 번에 크게 벌기보다 흐름을 읽고 꾸준히 모으는 재물운에 가깝습니다. 감정에 따라 소비가 흔들릴 수 있으니 자동 저축, 예산표, 장기 목표처럼 금 기운에 해당하는 구조를 만들면 재물운이 안정됩니다. 투기성 판단보다는 기록과 분산이 어울립니다.")}
    ${resultSection("사업운", "혼자 빠르게 밀어붙이는 사업보다 신뢰, 기획력, 전문성, 반복 고객을 쌓는 방식이 어울립니다. 초기에는 파트너나 운영 규칙이 중요하고, 본인이 잘하는 감각적 판단을 상품 구조와 수익 모델로 바꾸는 순간 성과가 커질 수 있습니다.")}
    ${resultSection("관계와 배우자운", "겉으로는 담담해 보여도 속으로는 관계의 온도를 세밀하게 살피는 편입니다. 상대가 너무 몰아붙이면 부담을 느끼고, 반대로 기준이 없는 관계에는 쉽게 지칠 수 있습니다. 편안한 대화 리듬과 약속을 지키는 사람이 잘 맞습니다.")}
    ${resultSection("자식운과 가족운", "보살피는 마음은 있으나 모든 것을 대신 해결해주려 하면 피로가 쌓일 수 있습니다. 가족운은 정서적 거리를 적절히 두고 각자의 역할을 존중할 때 편안해지는 흐름으로 볼 수 있습니다.")}
    ${resultSection("건강/컨디션 운", "건강은 질병을 단정할 수 없지만, 명식 흐름상 생각이 많아지면 수면 리듬과 소화 컨디션이 함께 흔들리는 패턴을 주의하는 편이 좋습니다. 몸을 따뜻하게 하고 일정한 루틴을 유지하면 전체 컨디션 관리에 도움이 됩니다.")}
    <div class="result-section">
      <h4>나이대별 흐름</h4>
      <div class="timeline-list">
        ${renderTimeline([
          ["18~23세", "방향 탐색", "관심사가 넓어지고 진로 기준을 세우는 시기입니다."],
          ["24~29세", "경험 축적", "일과 관계에서 시행착오가 늘지만 실력이 빠르게 쌓입니다."],
          ["30~35세", "기반 형성", "전문성, 수입 구조, 생활 루틴을 안정시키기 좋습니다."],
          ["36~42세", "확장 운", "사람과 기회가 넓어지며 사업/이직/독립을 검토하기 좋은 흐름입니다."],
          ["43~49세", "관리 운", "무리한 확장보다 자산, 건강 루틴, 관계 정리가 중요합니다."],
        ])}
      </div>
    </div>
    ${resultSection("조심하면 좋은 시기", "운이 약한 시기라기보다 선택을 서두르면 손실이 커질 수 있는 구간이 있습니다. 특히 큰 계약, 동업, 투자성 결정은 감정이 올라온 날 바로 결정하지 말고 하루 이상 시간을 두는 쪽이 좋습니다.")}
    ${unknownTime ? resultSection("출생 시간 미입력 안내", "출생 시간이 없으면 시주와 말년운, 자식운, 세부 흐름 해석이 제한됩니다. 실제 서비스에서는 출생 시간을 입력했을 때 더 촘촘한 풀이를 제공합니다.") : ""}
    ${disclaimer("나이대별 흐름은 확정 예언이 아니라 전통 명리 해석을 바탕으로 한 참고용 경향입니다. 건강 관련 내용은 진단이 아니며, 불편한 증상이 있으면 전문가와 상담하세요.")}
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
