const cursor = document.querySelector('.custom-cursor');
const motifs = document.querySelectorAll('.motif');
const smallMotifs = document.querySelectorAll(
  '.motif:not(.ring-big-left):not(.ring-big-right)'
);

// -------------------------
// 커서
// -------------------------
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

window.addEventListener('mousemove', (event) => {
  mouseX = event.clientX;
  mouseY = event.clientY;

  if (cursor) {
    cursor.style.left = `${mouseX}px`;
    cursor.style.top = `${mouseY}px`;
  }
});

window.addEventListener('mousedown', () => {
  if (cursor) cursor.classList.add('clicking');
});

window.addEventListener('mouseup', () => {
  if (cursor) cursor.classList.remove('clicking');
});

// -------------------------
// 작은 모티프 자유 유영
// -------------------------
const floaters = [];

smallMotifs.forEach((motif) => {
  const rect = motif.getBoundingClientRect();

  // 기존 CSS 위치 무시하고 JS가 직접 위치 잡음
  motif.style.left = '0px';
  motif.style.top = '0px';
  motif.style.right = 'auto';
  motif.style.bottom = 'auto';

  floaters.push({
    el: motif,
    baseX: Math.random() * window.innerWidth,
    baseY: Math.random() * window.innerHeight,
    driftX: (Math.random() - 0.5) * 0.08,
    driftY: (Math.random() - 0.5) * 0.06,
    ampX: 18 + Math.random() * 34,
    ampY: 14 + Math.random() * 28,
    freqX: 0.00035 + Math.random() * 0.00035,
    freqY: 0.00028 + Math.random() * 0.00032,
    phaseX: Math.random() * Math.PI * 2,
    phaseY: Math.random() * Math.PI * 2,
    attractX: 0,
    attractY: 0,
    width: rect.width || 40,
    height: rect.height || 40
  });
});

function animateFloaters(time) {
  const w = window.innerWidth;
  const h = window.innerHeight;

  floaters.forEach((item) => {
    // 아주 느린 베이스 드리프트
    item.baseX += item.driftX;
    item.baseY += item.driftY;

    // 화면 밖으로 나가면 반대쪽에서 다시 등장
    if (item.baseX < -120) item.baseX = w + 120;
    if (item.baseX > w + 120) item.baseX = -120;
    if (item.baseY < -120) item.baseY = h + 120;
    if (item.baseY > h + 120) item.baseY = -120;

    // 유영하듯 흔들림
    const swimX = Math.sin(time * item.freqX + item.phaseX) * item.ampX;
    const swimY = Math.cos(time * item.freqY + item.phaseY) * item.ampY;

    // 커서 가까우면 살짝 끌려옴
    const currentX = item.baseX + swimX;
    const currentY = item.baseY + swimY;

    const dx = mouseX - currentX;
    const dy = mouseY - currentY;
    const distance = Math.hypot(dx, dy);

    const attractRange = 170;
    const attractStrength = 0.06;

    let targetAttractX = 0;
    let targetAttractY = 0;

    if (distance < attractRange) {
      targetAttractX = dx * attractStrength;
      targetAttractY = dy * attractStrength;
    }

    item.attractX += (targetAttractX - item.attractX) * 0.03;
    item.attractY += (targetAttractY - item.attractY) * 0.03;

    item.el.style.transform = `translate3d(
      ${currentX + item.attractX}px,
      ${currentY + item.attractY}px,
      0
    )`;
  });

  requestAnimationFrame(animateFloaters);
}

requestAnimationFrame(animateFloaters);

// -------------------------
// sprinkle - 작고 천천히 일정하게 떨어짐
// -------------------------
window.addEventListener('click', (event) => {
  createSoftSprinkles(event.clientX, event.clientY);
});

function createSoftSprinkles(x, y) {
  const count = 12;

  const colors = [
    '#fff7d8',
    '#ffffff',
    '#ffd9ec',
    '#ffc3df',
    '#c8f6ff',
    '#8fe7f2'
  ];

  for (let i = 0; i < count; i++) {
    const sprinkle = document.createElement('span');
    sprinkle.classList.add('sprinkle');

    const size = 3 + Math.random() * 3.5;

    const startX = (Math.random() - 0.5) * 10;
    const startY = (Math.random() - 0.5) * 6;

    // 처음에 위로 살짝 팝 되는 위치
    const popX = (Math.random() - 0.5) * 42;
    const popY = -15 - Math.random() * 25;

    // 이후 천천히 떨어지는 위치
    const endX = popX + (Math.random() - 0.5) * 38;
    const endY = 75 + Math.random() * 95;

    const delay = Math.random() * 220;
    const color = colors[Math.floor(Math.random() * colors.length)];

    sprinkle.style.left = `${x}px`;
    sprinkle.style.top = `${y}px`;
    sprinkle.style.width = `${size}px`;
    sprinkle.style.height = `${size}px`;
    sprinkle.style.background = color;
    sprinkle.style.animationDelay = `${delay}ms`;

    sprinkle.style.setProperty('--start-x', `${startX}px`);
    sprinkle.style.setProperty('--start-y', `${startY}px`);
    sprinkle.style.setProperty('--pop-x', `${popX}px`);
    sprinkle.style.setProperty('--pop-y', `${popY}px`);
    sprinkle.style.setProperty('--end-x', `${endX}px`);
    sprinkle.style.setProperty('--end-y', `${endY}px`);

    document.body.appendChild(sprinkle);

    setTimeout(() => {
      sprinkle.remove();
    }, 3400);
  }
}

// -------------------------
// 위젯 스크롤
// -------------------------
document.querySelectorAll('.floating-widget button').forEach((button) => {
  button.addEventListener('click', (event) => {
    event.stopPropagation();

    const targetId = button.dataset.target;
    const target = document.getElementById(targetId);

    if (target) {
      target.scrollIntoView({
        behavior: 'smooth'
      });
    }
  });
});

const pets = document.querySelectorAll(".pet-wrap");

const mouse = {
  x: window.innerWidth / 2,
  y: window.innerHeight / 2
};

window.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function animatePupils() {
  pets.forEach((pet) => {
    const pupil = pet.querySelector(".pet-pupil");

    if (!pupil) return;

    const rect = pet.getBoundingClientRect();

    const petCenterX = rect.left + rect.width / 2;
    const petCenterY = rect.top + rect.height / 2;

    const dx = mouse.x - petCenterX;
    const dy = mouse.y - petCenterY;

    const nx = dx / (window.innerWidth / 2);
    const ny = dy / (window.innerHeight / 2);

    const maxX = parseFloat(pet.dataset.maxX || 3.8);
    const maxY = parseFloat(pet.dataset.maxY || 1.4);

    const targetX = clamp(nx * maxX, -maxX, maxX);
    const targetY = clamp(ny * maxY, -maxY, maxY);

    let currentX = parseFloat(pupil.dataset.currentX || 0);
    let currentY = parseFloat(pupil.dataset.currentY || 0);

    currentX += (targetX - currentX) * 0.12;
    currentY += (targetY - currentY) * 0.12;

    pupil.dataset.currentX = currentX;
    pupil.dataset.currentY = currentY;

    const offsetX = parseFloat(pet.dataset.offsetX || 0);
    const offsetY = parseFloat(pet.dataset.offsetY || 0);

    pupil.style.transform = `translate(${currentX + offsetX}px, ${currentY + offsetY}px)`;
  });

  requestAnimationFrame(animatePupils);
}

animatePupils();

const openPetInline = document.getElementById("openPetInline");
const backPetInline = document.getElementById("backPetInline");
const petClickArea = document.getElementById("petClickArea");

if (openPetInline && backPetInline && petClickArea) {
  openPetInline.addEventListener("click", (event) => {
    event.stopPropagation();
    petClickArea.classList.add("active");
  });

  backPetInline.addEventListener("click", (event) => {
    event.stopPropagation();
    petClickArea.classList.remove("active");
  });
}

// -------------------------
// Expression interaction
// -------------------------
const expressionItems = document.querySelectorAll(".expression-item");

expressionItems.forEach((item) => {
  item.addEventListener("mouseenter", () => {
    item.classList.add("is-active");
  });

  item.addEventListener("mouseleave", () => {
    item.classList.remove("is-active");
  });
});

// -------------------------
// Expression background symbols
// 골고루 퍼지는 버전
// -------------------------
const expressionSymbols = document.querySelector(".expression-symbols");

if (expressionSymbols) {
  const symbolImages = [
    "./assets/images/symbol_web-01.png",
    "./assets/images/symbol_web-02.png",
    "./assets/images/symbol_web-03.png",
    "./assets/images/symbol_web-04.png",
    "./assets/images/symbol_web-05.png"
  ];

  // 가로 x 세로 칸 수
  const cols = 8;
  const rows = 4;

  // 총 개수 = cols * rows
  const symbolCount = cols * rows;

  for (let i = 0; i < symbolCount; i++) {
    const img = document.createElement("img");
    const randomSrc = symbolImages[Math.floor(Math.random() * symbolImages.length)];

    img.src = randomSrc;
    img.alt = "";
    img.className = "expr-symbol";

    const col = i % cols;
    const row = Math.floor(i / cols);

    // 각 칸의 중심 위치
    const baseLeft = ((col + 0.5) / cols) * 100;
    const baseTop = ((row + 0.5) / rows) * 100;

    // 칸 안에서만 살짝 랜덤 이동
    const jitterX = -4 + Math.random() * 8;
    const jitterY = -5 + Math.random() * 10;

    const left = baseLeft + jitterX;
    const top = baseTop + jitterY;

    // 크기 다양하게
    const size = 24 + Math.random() * 170;

    // 투명도
    const opacity = 0.16 + Math.random() * 0.24;

    const duration = 6 + Math.random() * 8;
    const delay = -Math.random() * 8;
    const floatY = -10 - Math.random() * 30;
    const rotateStart = -8 + Math.random() * 16;
    const rotateEnd = rotateStart + (-8 + Math.random() * 16);

    img.style.width = `${size}px`;
    img.style.left = `${left}%`;
    img.style.top = `${top}%`;
    img.style.opacity = opacity.toFixed(2);
    img.style.animationDuration = `${duration}s`;
    img.style.animationDelay = `${delay}s`;

    img.style.setProperty("--float-y", `${floatY}px`);
    img.style.setProperty("--rotate-start", `${rotateStart}deg`);
    img.style.setProperty("--rotate-end", `${rotateEnd}deg`);

    expressionSymbols.appendChild(img);
  }
}

// -------------------------
// Docking interaction
// -------------------------
const dockStage = document.getElementById("dockStage");
const dockHub = document.getElementById("dockHub");
const dockPets = document.querySelectorAll(".dock-pet");
const dockChoicePanel = document.getElementById("dockChoicePanel");
const dockOwnerLabel = document.getElementById("dockOwnerLabel");
const dockMakeSymbol = document.getElementById("dockMakeSymbol");
const dockResetSymbol = document.getElementById("dockResetSymbol");
const hubSymbolStage = document.getElementById("hubSymbolStage");


// topic 06~15 / feeling 16~25
const topicSymbolMap = {
  career: 6,        // 진로
  love: 7,          // 연애
  health: 8,        // 건강
  money: 9,         // 돈
  future: 10,       // 미래
  dream: 11,        // 꿈
  independence: 12, // 독립
  family: 13,       // 가족
  study: 14,        // 공부
  work: 15          // 일
};

const feelingSymbolMap = {
  anxiety: 16,    // 불안
  longing: 17,    // 그리움
  warmth: 18,     // 따뜻함
  waiting: 19,    // 기다림
  loneliness: 20, // 외로움
  joy: 21,        // 기쁨
  sadness: 22,    // 슬픔
  stuffy: 23,     // 답답함
  thanks: 24,     // 고마움
  flutter: 25     // 설렘
};

const dockData = {
  daughter: {
    docked: false,
    topic: null,
    feel: null
  },
  mom: {
    docked: false,
    topic: null,
    feel: null
  },
  currentOwner: null
};

const createdSymbolIds = {
  daughter: new Set(),
  mom: new Set()
};

// -------------------------
// Hub symbol creation
// -------------------------
const symbolLayout = [
  { id: 6,  x: 28, y: 28, size: 82 },
  { id: 7,  x: 50, y: 24, size: 88 },
  { id: 8,  x: 72, y: 30, size: 82 },
  { id: 9,  x: 32, y: 48, size: 86 },
  { id: 10, x: 58, y: 46, size: 88 },
  { id: 11, x: 76, y: 50, size: 82 },
  { id: 12, x: 26, y: 70, size: 82 },
  { id: 13, x: 46, y: 68, size: 86 },
  { id: 14, x: 68, y: 70, size: 88 },
  { id: 15, x: 82, y: 72, size: 78 },

  { id: 16, x: 38, y: 34, size: 76 },
  { id: 17, x: 62, y: 32, size: 76 },
  { id: 18, x: 50, y: 55, size: 84 },
  { id: 19, x: 30, y: 58, size: 78 },
  { id: 20, x: 72, y: 58, size: 78 },
  { id: 21, x: 40, y: 80, size: 82 },
  { id: 22, x: 62, y: 82, size: 82 },
  { id: 23, x: 22, y: 42, size: 74 },
  { id: 24, x: 82, y: 42, size: 74 },
  { id: 25, x: 50, y: 76, size: 78 }
];

function createHubSymbol({ id, x, y, size }) {
  const symbolId = String(id).padStart(2, "0");

  const el = document.createElement("div");
  el.className = "hub-symbol state-idle";
  el.dataset.id = id;
  el.style.left = `${x}%`;
  el.style.top = `${y}%`;
  el.style.width = `${size}px`;

  const floatY = `${5 + Math.random() * 8}px`;
  const dur = `${4.8 + Math.random() * 2.2}s`;
  const delay = `-${Math.random() * 2.8}s`;

  el.innerHTML = `
    <div class="hub-symbol-inner" style="--float-y:${floatY}; --dur:${dur}; --delay:${delay};">
      <span
        class="hub-symbol-layer hub-symbol-bone"
        style="--mask:url('./assets/images/symbol-bone/symbol-bone-${symbolId}.svg');"
      ></span>

      <span
        class="hub-symbol-layer hub-symbol-core"
        style="--mask:url('./assets/images/symbol-core/symbol-core-${symbolId}.svg');"
      ></span>
    </div>
  `;

  return el;
}

function buildHubSymbols() {
  if (!hubSymbolStage) return;

  hubSymbolStage.innerHTML = "";

  symbolLayout.forEach((item) => {
    hubSymbolStage.appendChild(createHubSymbol(item));
  });
}

function getOwnerSymbolIds(owner) {
  const data = dockData[owner];
  const ids = [];

  if (data.topic && topicSymbolMap[data.topic]) {
    ids.push(topicSymbolMap[data.topic]);
  }

  if (data.feel && feelingSymbolMap[data.feel]) {
    ids.push(feelingSymbolMap[data.feel]);
  }

  return ids;
}

function applyDockState(daughterIds = [], momIds = []) {
  if (!hubSymbolStage) return;

  const allSymbols = hubSymbolStage.querySelectorAll(".hub-symbol");

  allSymbols.forEach((el) => {
    const id = Number(el.dataset.id);

    const isDaughter = daughterIds.includes(id);
    const isMom = momIds.includes(id);

    el.classList.remove(
      "state-idle",
      "state-daughter",
      "state-mom",
      "state-shared"
    );

    if (isDaughter && isMom) {
      el.classList.add("state-shared");
    } else if (isDaughter) {
      el.classList.add("state-daughter");
    } else if (isMom) {
      el.classList.add("state-mom");
    } else {
      el.classList.add("state-idle");
    }
  });
}

function updateCreatedSymbols() {
  applyDockState(
    Array.from(createdSymbolIds.daughter),
    Array.from(createdSymbolIds.mom)
  );
}

function saveCurrentSymbols(owner) {
  const ids = getOwnerSymbolIds(owner);

  ids.forEach((id) => {
    createdSymbolIds[owner].add(id);
  });
}

function hasSharedKeyword() {
  return Array.from(createdSymbolIds.daughter).some((id) =>
    createdSymbolIds.mom.has(id)
  );
}

function updateDockVisual() {
  if (!dockStage || !dockHub) return;

  const daughterDocked = dockData.daughter.docked;
  const momDocked = dockData.mom.docked;

  dockStage.classList.remove(
    "daughter-active",
    "mom-active",
    "shared-active"
  );

  dockPets.forEach((pet) => {
    const owner = pet.dataset.owner;
    pet.classList.toggle("is-docked", dockData[owner].docked);
  });

  if (daughterDocked && momDocked) {
    dockStage.classList.add("shared-active");
    dockHub.querySelector(".dock-hub-status").textContent = "두 옴피가 연결됐어요";
  } else if (daughterDocked) {
    dockStage.classList.add("daughter-active");
    dockHub.querySelector(".dock-hub-status").textContent = "딸의 마음 신호";
  } else if (momDocked) {
    dockStage.classList.add("mom-active");
    dockHub.querySelector(".dock-hub-status").textContent = "엄마의 마음 신호";
  } else if (
    createdSymbolIds.daughter.size > 0 ||
    createdSymbolIds.mom.size > 0
  ) {
    dockHub.querySelector(".dock-hub-status").textContent = "심볼이 남아 있어요";
  } else {
    dockHub.querySelector(".dock-hub-status").textContent = "옴피를 눌러 시작해요";
  }
}

function resetDocking() {
  dockData.daughter.docked = false;
  dockData.daughter.topic = null;
  dockData.daughter.feel = null;

  dockData.mom.docked = false;
  dockData.mom.topic = null;
  dockData.mom.feel = null;

  dockData.currentOwner = null;

  createdSymbolIds.daughter.clear();
  createdSymbolIds.mom.clear();

  document.querySelectorAll("[data-topic], [data-feel]").forEach((button) => {
    button.classList.remove("is-selected");
  });

  if (dockChoicePanel) {
    dockChoicePanel.classList.remove("is-open");
  }

  if (dockResetSymbol) {
    dockResetSymbol.classList.remove("is-visible");
  }

  applyDockState([], []);
  updateDockVisual();

  if (dockHub) {
    dockHub.querySelector(".dock-hub-status").textContent = "옴피를 눌러 시작해요";
  }
}

function openDockChoice(owner) {
  dockData.currentOwner = owner;

  if (dockChoicePanel) {
    dockChoicePanel.classList.add("is-open");
  }

  if (dockOwnerLabel) {
    dockOwnerLabel.textContent = owner === "daughter" ? "딸 옴피" : "엄마 옴피";
  }

  document.querySelectorAll("[data-topic]").forEach((btn) => {
    btn.classList.toggle("is-selected", btn.dataset.topic === dockData[owner].topic);
  });

  document.querySelectorAll("[data-feel]").forEach((btn) => {
    btn.classList.toggle("is-selected", btn.dataset.feel === dockData[owner].feel);
  });
}

dockPets.forEach((pet) => {
  pet.addEventListener("click", () => {
    const owner = pet.dataset.owner;

    // 이미 붙어 있으면: 펫만 떼기
    if (dockData[owner].docked) {
      dockData[owner].docked = false;
      dockData.currentOwner = null;

      // 선택창만 닫기
      if (dockChoicePanel) {
        dockChoicePanel.classList.remove("is-open");
      }

      // 현재 선택 버튼 표시만 지우기
      document.querySelectorAll("[data-topic], [data-feel]").forEach((button) => {
        button.classList.remove("is-selected");
      });

      // 중요: createdSymbolIds는 건드리지 않음
      updateCreatedSymbols();
      updateDockVisual();
      return;
    }

    // 안 붙어 있으면: 도킹 + 선택창 열기
    dockData[owner].docked = true;

    openDockChoice(owner);
    updateCreatedSymbols();
    updateDockVisual();
  });
});

document.querySelectorAll("[data-topic]").forEach((button) => {
  button.addEventListener("click", () => {
    const owner = dockData.currentOwner;
    if (!owner) return;

    dockData[owner].topic = button.dataset.topic;

    document.querySelectorAll("[data-topic]").forEach((btn) => {
      btn.classList.remove("is-selected");
    });

    button.classList.add("is-selected");
  });
});

document.querySelectorAll("[data-feel]").forEach((button) => {
  button.addEventListener("click", () => {
    const owner = dockData.currentOwner;
    if (!owner) return;

    dockData[owner].feel = button.dataset.feel;

    document.querySelectorAll("[data-feel]").forEach((btn) => {
      btn.classList.remove("is-selected");
    });

    button.classList.add("is-selected");
  });
});

if (dockMakeSymbol) {
  dockMakeSymbol.addEventListener("click", () => {
    const owner = dockData.currentOwner;

    if (!owner) return;

    const current = dockData[owner];

    if (!current.topic || !current.feel) {
      if (dockHub) {
        dockHub.querySelector(".dock-hub-status").textContent = "choose both";
      }
      return;
    }

    saveCurrentSymbols(owner);
    updateCreatedSymbols();
    updateDockVisual();

    if (dockChoicePanel) {
      dockChoicePanel.classList.remove("is-open");
    }

    if (dockResetSymbol) {
      dockResetSymbol.classList.add("is-visible");
    }

    if (dockHub) {
      dockHub.querySelector(".dock-hub-status").textContent =
        hasSharedKeyword() ? "symbol merged" : "심볼이 만들어졌어요!";
    }
  });
}

if (dockResetSymbol) {
  dockResetSymbol.addEventListener("click", () => {
    resetDocking();
  });
}

buildHubSymbols();
applyDockState([], []);
updateDockVisual();

// -------------------------
// Symbol flip cards
// -------------------------
document.querySelectorAll(".flip-symbol-card").forEach((card) => {
  card.addEventListener("click", () => {
    card.classList.toggle("is-flipped");
  });
});

// -------------------------
// Accordion leaflet open / front-back
// -------------------------
const accordionLeaflets = document.querySelectorAll(".accordion-leaflet");

accordionLeaflets.forEach((leaflet) => {
  const openButton = leaflet.querySelector(".leaflet-toggle");
  const sideButton = leaflet.querySelector(".leaflet-side-toggle");

  if (!openButton || !sideButton) return;

  openButton.addEventListener("click", (event) => {
    event.stopPropagation();

    const isOpen = leaflet.classList.toggle("is-open");

    if (!isOpen) {
      leaflet.classList.remove("show-back");
      openButton.textContent = "open";
      sideButton.textContent = "back";
    } else {
      openButton.textContent = "close";
    }
  });

  sideButton.addEventListener("click", (event) => {
    event.stopPropagation();

    if (!leaflet.classList.contains("is-open")) {
      leaflet.classList.add("is-open");
      openButton.textContent = "close";
    }

    const isBack = leaflet.classList.toggle("show-back");
    sideButton.textContent = isBack ? "front" : "back";
  });
});

// -------------------------
// Package loose item modal
// -------------------------
const looseItems = document.querySelectorAll(".loose-item");
const looseModal = document.getElementById("looseModal");

if (looseModal) {
  const closeBtn = looseModal.querySelector(".loose-close");
  const prevBtn = looseModal.querySelector(".modal-prev");
  const nextBtn = looseModal.querySelector(".modal-next");
  const title = looseModal.querySelector(".modal-title");
  const modalStage = looseModal.querySelector(".loose-modal-stage");
  const zoomBtn = looseModal.querySelector(".modal-zoom");
  const minibookImg = looseModal.querySelector(".modal-page-img");
  const symbolModal = looseModal.querySelector(".modal-symbol");

  const minibookPages = [
    "./assets/images/leaflet-minibook-01.png",
    "./assets/images/leaflet-minibook-02.png",
    "./assets/images/leaflet-minibook-03.png",
    "./assets/images/leaflet-minibook-04.png",
    "./assets/images/leaflet-minibook-05.png",
    "./assets/images/leaflet-minibook-06.png",
    "./assets/images/leaflet-minibook-07.png",
    "./assets/images/leaflet-minibook-08.png"
  ];

  let activeItem = null;
  let minibookIndex = 0;

  function resetModalState() {
    looseModal.classList.remove("brand-open", "brand-back", "page-changing", "is-zooming");
    if (symbolModal) symbolModal.classList.remove("is-flipped");

    resetWheelZoom();
  }

  if (zoomBtn) {
    zoomBtn.addEventListener("click", (event) => {
      event.stopPropagation();

      const isZoomed = looseModal.classList.toggle("is-zoomed");
      zoomBtn.textContent = isZoomed ? "zoom out" : "zoom";
    });
  }

  function openLooseModal(item) {
    activeItem = item;
    resetModalState();

    looseModal.classList.add("is-open");
    looseModal.dataset.active = item;
    looseModal.setAttribute("aria-hidden", "false");

    if (item === "brand") {
      title.textContent = "Brand Story Leaflet";
      prevBtn.textContent = "close";
      nextBtn.textContent = "open";
    }

    if (item === "minibook") {
      title.textContent = "Mini Book";
      prevBtn.textContent = "prev";
      nextBtn.textContent = "next";
      minibookIndex = 0;
      if (minibookImg) minibookImg.src = minibookPages[minibookIndex];
    }

    if (item === "symbol") {
      title.textContent = "Symbol Card";
      prevBtn.textContent = "front";
      nextBtn.textContent = "flip";
    }
  }

  function closeLooseModal() {
    looseModal.classList.remove("is-open");
    looseModal.setAttribute("aria-hidden", "true");
    activeItem = null;
    resetModalState();
  }

  looseItems.forEach((item) => {
    item.addEventListener("click", (event) => {
      event.stopPropagation();
      openLooseModal(item.dataset.item);
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      closeLooseModal();
    });
  }

  looseModal.addEventListener("click", (event) => {
    if (event.target.classList.contains("loose-modal-bg")) {
      closeLooseModal();
    }
  });

  if (nextBtn) {
    nextBtn.addEventListener("click", (event) => {
      event.stopPropagation();

      if (activeItem === "brand") {
        if (!looseModal.classList.contains("brand-open")) {
          looseModal.classList.add("brand-open");
          nextBtn.textContent = "back";
          prevBtn.textContent = "close";
        } else {
          looseModal.classList.toggle("brand-back");
          nextBtn.textContent = looseModal.classList.contains("brand-back") ? "front" : "back";
        }
      }

      if (activeItem === "minibook") {
        minibookIndex = (minibookIndex + 1) % minibookPages.length;
        looseModal.classList.add("page-changing");

        setTimeout(() => {
          if (minibookImg) minibookImg.src = minibookPages[minibookIndex];
        }, 120);

        setTimeout(() => {
          looseModal.classList.remove("page-changing");
        }, 360);
      }

      if (activeItem === "symbol" && symbolModal) {
        symbolModal.classList.toggle("is-flipped");
      }
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", (event) => {
      event.stopPropagation();

      if (activeItem === "brand") {
        closeLooseModal();
      }

      if (activeItem === "minibook") {
        minibookIndex =
          (minibookIndex - 1 + minibookPages.length) % minibookPages.length;

        looseModal.classList.add("page-changing");

        setTimeout(() => {
          if (minibookImg) minibookImg.src = minibookPages[minibookIndex];
        }, 120);

        setTimeout(() => {
          looseModal.classList.remove("page-changing");
        }, 360);
      }

      if (activeItem === "symbol" && symbolModal) {
        symbolModal.classList.remove("is-flipped");
      }
    });
  }

  if (symbolModal) {
    symbolModal.addEventListener("click", (event) => {
      event.stopPropagation();
      symbolModal.classList.toggle("is-flipped");
    });
  }

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && looseModal.classList.contains("is-open")) {
      closeLooseModal();
    }
  });

  // -------------------------
  // Mouse wheel zoom in modal
  // -------------------------
  let zoomScale = 1;
  let zoomX = 0;
  let zoomY = 0;

  function getActiveZoomTarget() {
    if (!looseModal.classList.contains("is-open")) return null;

    if (activeItem === "brand") {
      resetWheelZoom();

      if (!looseModal.classList.contains("brand-open")) {
        looseModal.classList.add("brand-open");
        nextBtn.textContent = "back";
        prevBtn.textContent = "close";
      } else {
        looseModal.classList.toggle("brand-back");
        nextBtn.textContent = looseModal.classList.contains("brand-back") ? "front" : "back";
      }
    }

    if (activeItem === "brand") {
      resetWheelZoom();

      if (!looseModal.classList.contains("brand-open")) {
        looseModal.classList.add("brand-open");
        nextBtn.textContent = "back";
        prevBtn.textContent = "close";
      } else {
        looseModal.classList.toggle("brand-back");
        nextBtn.textContent = looseModal.classList.contains("brand-back") ? "front" : "back";
      }
    }

    if (activeItem === "symbol" && symbolModal) {
      resetWheelZoom();
      symbolModal.classList.toggle("is-flipped");
    }

    return null;
  }

  function resetWheelZoom() {
    const targets = looseModal.querySelectorAll(".zoom-target");

    targets.forEach((target) => {
      target.classList.remove("zoom-target");
      target.style.removeProperty("--zoom-scale");
      target.style.removeProperty("--zoom-x");
      target.style.removeProperty("--zoom-y");
    });

    zoomScale = 1;
    zoomX = 0;
    zoomY = 0;
    looseModal.classList.remove("is-zooming");
  }

  function applyWheelZoom(target) {
    if (!target) return;

    target.classList.add("zoom-target");
    target.style.setProperty("--zoom-scale", zoomScale);
    target.style.setProperty("--zoom-x", `${zoomX}px`);
    target.style.setProperty("--zoom-y", `${zoomY}px`);

    if (zoomScale > 1.02) {
      looseModal.classList.add("is-zooming");
    } else {
      looseModal.classList.remove("is-zooming");
    }
  }

  if (modalStage) {
    modalStage.addEventListener(
      "wheel",
      (event) => {
        if (!looseModal.classList.contains("is-open")) return;

        event.preventDefault();

        const target = getActiveZoomTarget();
        if (!target) return;

        const oldScale = zoomScale;

        // 휠 위로 = 확대, 아래로 = 축소
        const zoomDelta = event.deltaY < 0 ? 0.12 : -0.12;
        zoomScale = Math.max(1, Math.min(3.2, zoomScale + zoomDelta));

        // 확대된 상태에서만 살짝 팬 이동
        if (zoomScale > 1) {
          const rect = modalStage.getBoundingClientRect();
          const offsetX = event.clientX - (rect.left + rect.width / 2);
          const offsetY = event.clientY - (rect.top + rect.height / 2);

          const scaleDiff = zoomScale - oldScale;

          zoomX -= offsetX * scaleDiff * 0.28;
          zoomY -= offsetY * scaleDiff * 0.28;
        } else {
          zoomX = 0;
          zoomY = 0;
        }

        applyWheelZoom(target);
      },
      { passive: false }
    );
  }
}