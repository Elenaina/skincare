const questions = [
  {
    id: "skinFeel",
    title: "Jak skóra zachowuje się 2-3 godziny po umyciu, bez kremu?",
    helper: "To pytanie najmocniej ustawia bazowy typ cery.",
    type: "single",
    options: [
      ["tight", "Ściąga się i piecze", "Często potrzebuje bogatszego kremu."],
      ["balanced", "Jest dość komfortowa", "Nie świeci się mocno i nie jest napięta."],
      ["tzone", "Świeci się w strefie T", "Policzki bywają normalne albo suche."],
      ["oily", "Szybko się przetłuszcza", "Błyszczenie pojawia się na większości twarzy."],
    ],
  },
  {
    id: "mainConcerns",
    title: "Co najbardziej chcesz poprawić?",
    helper: "Wybierz wszystkie istotne problemy. Priorytet ustalimy automatycznie.",
    type: "multi",
    options: [
      ["dehydration", "Odwodnienie", "Ściągnięcie, drobne linie, brak komfortu."],
      ["acne", "Wypryski", "Zmiany zapalne, bolesne krostki."],
      ["comedones", "Zaskórniki", "Kaszkowata tekstura, zatkane pory."],
      ["redness", "Rumień i reaktywność", "Łatwe czerwienienie, pieczenie."],
      ["pigmentation", "Przebarwienia", "Plamy po słońcu, hormonach lub zmianach."],
      ["texture", "Nierówna tekstura", "Szorstkość, rozszerzone pory."],
      ["aging", "Pierwsze zmarszczki", "Utrata jędrności, linie mimiczne."],
    ],
  },
  {
    id: "sensitivity",
    title: "Jak często skóra reaguje pieczeniem, świądem albo rumieniem?",
    helper: "To wpływa na siłę składników aktywnych i tempo wdrażania produktów.",
    type: "single",
    options: [
      ["low", "Rzadko", "Zwykle dobrze toleruje nowe kosmetyki."],
      ["medium", "Czasami", "Reaguje na część produktów lub zapachy."],
      ["high", "Często", "Łatwo się czerwieni, piecze albo łuszczy."],
    ],
  },
  {
    id: "currentRoutine",
    title: "Jak wygląda obecna pielęgnacja?",
    helper: "Zbyt dużo aktywnych składników naraz często pogarsza barierę skóry.",
    type: "multi",
    options: [
      ["cleanser", "Mycie twarzy", "Żel, pianka, emulsja lub olejek."],
      ["moisturizer", "Krem", "Nawilżający, regenerujący lub matujący."],
      ["spf", "SPF rano", "Filtr nakładany większość dni."],
      ["acids", "Kwasy", "AHA, BHA, PHA lub peelingi kwasowe."],
      ["retinoid", "Retinoid", "Retinol, retinal albo retinoid na receptę."],
      ["vitc", "Witamina C", "Serum antyoksydacyjne lub rozjaśniające."],
      ["none", "Prawie nic", "Brak stałej rutyny."],
    ],
  },
  {
    id: "barrier",
    title: "Czy ostatnio bariera skóry mogła być naruszona?",
    helper: "Objawy bariery to pieczenie po wodzie, szczypanie po kremie, łuszczenie.",
    type: "multi",
    options: [
      ["burning", "Pieczenie po kosmetykach", "Nawet po prostych kremach."],
      ["flaking", "Łuszczenie lub suchość", "Skóra jest szorstka i napięta."],
      ["overexfoliation", "Dużo złuszczania", "Peelingi, kwasy lub szczoteczki kilka razy w tygodniu."],
      ["treatment", "Leczenie dermatologiczne", "Np. izotretynoina, antybiotyki, maści lecznicze."],
      ["no", "Nie zauważam", "Skóra jest stabilna."],
    ],
  },
  {
    id: "lifestyle",
    title: "Co może wpływać na kondycję skóry?",
    helper: "Te odpowiedzi pomagają dobrać realistyczną rutynę.",
    type: "multi",
    options: [
      ["makeup", "Makijaż lub ciężki SPF", "Warto uwzględnić dwuetapowe oczyszczanie."],
      ["sport", "Częsty sport", "Pot, tarcie, częstsze mycie."],
      ["outdoor", "Dużo czasu na zewnątrz", "SPF i antyoksydanty mają większy priorytet."],
      ["stress", "Stres i mało snu", "Skóra może częściej reagować stanem zapalnym."],
      ["aircon", "Klimatyzacja/ogrzewanie", "Większe ryzyko odwodnienia."],
    ],
  },
  {
    id: "constraints",
    title: "Ograniczenia i preferencje",
    helper: "Dzięki temu rekomendacje będą praktyczne, a nie tylko „ładne na papierze”.",
    type: "fields",
    fields: [
      {
        id: "age",
        label: "Wiek",
        input: "select",
        options: ["poniżej 20", "20-29", "30-39", "40-49", "50+"],
      },
      {
        id: "budget",
        label: "Budżet na jeden produkt",
        input: "select",
        options: ["do 40 zł", "40-80 zł", "80-150 zł", "150+ zł"],
      },
      {
        id: "finish",
        label: "Preferowane wykończenie",
        input: "select",
        options: ["bez znaczenia", "lekkie/matujące", "nawilżające", "bezzapachowe"],
      },
    ],
  },
  {
    id: "notes",
    title: "Czy jest coś, czego aplikacja powinna unikać?",
    helper: "Np. alergie, zapach, oleje, konkretne marki, ciąża/karmienie, leki.",
    type: "textarea",
    placeholder: "Wpisz swoje uwagi...",
  },
];

const products = [
  {
    id: "cerave-cleanser",
    step: "cleanser",
    brand: "CeraVe",
    name: "Nawilżająca Emulsja do Mycia",
    tags: ["sucha", "wrażliwa", "bariera"],
    match: ["dry", "sensitive", "barrier"],
    price: "40-80 zł",
    why: "Łagodna baza do skóry suchej, odwodnionej lub reaktywnej.",
  },
  {
    id: "bielenda-cleanser",
    step: "cleanser",
    brand: "Bielenda",
    name: "Professional Supremelab Barrier Renew Żel-krem do mycia",
    tags: ["bariera", "komfort", "codziennie"],
    match: ["barrier", "dehydration", "sensitive"],
    price: "40-80 zł",
    why: "Dobry kierunek, gdy oczyszczanie ma nie pogarszać ściągnięcia.",
  },
  {
    id: "tolpa-cleanser",
    step: "cleanser",
    brand: "Tołpa",
    name: "Dermo Face Physio Mikrobiom Łagodny żel do mycia",
    tags: ["łagodne mycie", "wrażliwa", "codziennie"],
    match: ["all", "sensitive", "balanced"],
    price: "do 40 zł",
    why: "Prosty produkt do codziennego oczyszczania bez agresywnego odtłuszczania.",
  },
  {
    id: "basiclab-hyaluronic",
    step: "morningSerum",
    brand: "BasicLab",
    name: "Esteticus Serum z trehalozą i kwasem hialuronowym",
    tags: ["nawilżenie", "bariera", "rano"],
    match: ["dehydration", "barrier", "dry"],
    price: "80-150 zł",
    why: "Poranne serum dla skóry odwodnionej i napiętej.",
  },
  {
    id: "nacomi-niacinamide",
    step: "morningSerum",
    brand: "Nacomi",
    name: "Next Lvl Niacinamide 15%",
    tags: ["sebum", "pory", "rano"],
    match: ["oily", "comedones", "texture"],
    price: "40-80 zł",
    why: "Wsparcie kontroli sebum, jeśli skóra dobrze toleruje niacynamid.",
  },
  {
    id: "mixa-hyalurogel",
    step: "morningSerum",
    brand: "Mixa",
    name: "Hyalurogel Serum dla skóry wrażliwej",
    tags: ["wrażliwa", "nawilżenie", "lekka formuła"],
    match: ["sensitive", "dehydration", "balanced"],
    price: "40-80 zł",
    why: "Bezpieczny typ serum na start przy skórze reaktywnej.",
  },
  {
    id: "cerave-cream",
    step: "morningCream",
    brand: "CeraVe",
    name: "Nawilżający Krem do Twarzy",
    tags: ["ceramidy", "bariera", "sucha"],
    match: ["dry", "barrier", "dehydration"],
    price: "40-80 zł",
    why: "Domyka serum i wspiera barierę hydrolipidową.",
  },
  {
    id: "ziaja-cream",
    step: "morningCream",
    brand: "Ziaja",
    name: "Med Kuracja Dermatologiczna AZS Krem kojący",
    tags: ["kojenie", "wrażliwa", "budżet"],
    match: ["sensitive", "barrier", "dry"],
    price: "do 40 zł",
    why: "Budżetowa opcja kremu kojącego do skóry, która łatwo się przesusza.",
  },
  {
    id: "bielenda-cream",
    step: "morningCream",
    brand: "Bielenda",
    name: "Supremelab Barrier Renew Krem odbudowujący",
    tags: ["bariera", "komfort", "regeneracja"],
    match: ["barrier", "dehydration", "sensitive"],
    price: "40-80 zł",
    why: "Dobre zamknięcie pielęgnacji, gdy priorytetem jest regeneracja.",
  },
  {
    id: "eveline-spf",
    step: "spf",
    brand: "Eveline",
    name: "Cerabiome Lekki krem SPF50 PA++++",
    tags: ["SPF", "lekki", "bariera"],
    match: ["all", "barrier", "dehydration"],
    price: "40-80 zł",
    why: "Codzienna ochrona UV w lżejszej formule.",
  },
  {
    id: "skin79-spf",
    step: "spf",
    brand: "SKIN79",
    name: "Waterproof Sun Gel SPF50+ PA+++",
    tags: ["SPF", "lżejszy", "sebum"],
    match: ["oily", "combo", "outdoor"],
    price: "40-80 zł",
    why: "Kierunek dla osób, które wolą lżejsze wykończenie.",
  },
  {
    id: "lrp-spf",
    step: "spf",
    brand: "La Roche-Posay",
    name: "Anthelios UVmune 400 Invisible Fluid SPF50+",
    tags: ["SPF", "wysoka ochrona", "przebarwienia"],
    match: ["pigmentation", "redness", "aging"],
    price: "80-150 zł",
    why: "Mocny wybór przy przebarwieniach, rumieniu i terapii aktywnej.",
  },
  {
    id: "mixa-salicylic",
    step: "eveningSerum",
    brand: "Mixa",
    name: "Serum Kwas salicylowy + niacynamid",
    tags: ["wypryski", "zaskórniki", "sebum"],
    match: ["acne", "comedones", "oily"],
    price: "40-80 zł",
    why: "Opcja aktywna 2-3 razy w tygodniu przy skórze tłustej lub mieszanej.",
  },
  {
    id: "paulas-bha",
    step: "eveningSerum",
    brand: "Paula's Choice",
    name: "Skin Perfecting 2% BHA Liquid Exfoliant",
    tags: ["BHA", "zaskórniki", "tekstura"],
    match: ["comedones", "texture", "oily"],
    price: "150+ zł",
    why: "Mocniejszy wariant na zaskórniki, do ostrożnego wdrażania.",
  },
  {
    id: "skintra-azelaic",
    step: "eveningSerum",
    brand: "SkinTra",
    name: "Acid C Power Therapy",
    tags: ["kwas azelainowy", "rumień", "koloryt"],
    match: ["redness", "acne", "pigmentation"],
    price: "80-150 zł",
    why: "Kierunek przy rumieniu, zmianach i przebarwieniach pozapalnych.",
  },
  {
    id: "avene-cicalfate",
    step: "eveningCream",
    brand: "Avène",
    name: "Cicalfate+ Krem regenerujący",
    tags: ["regeneracja", "wrażliwa", "bariera"],
    match: ["barrier", "sensitive", "dry"],
    price: "40-80 zł",
    why: "Mocniejsze domknięcie pielęgnacji wieczornej przy podrażnieniu.",
  },
  {
    id: "cerave-pm",
    step: "eveningCream",
    brand: "CeraVe",
    name: "PM Facial Moisturising Lotion",
    tags: ["lekki krem", "ceramidy", "wieczór"],
    match: ["balanced", "combo", "barrier"],
    price: "40-80 zł",
    why: "Lżejsza opcja domykająca serum bez ciężkiego filmu.",
  },
  {
    id: "basiclab-cream",
    step: "eveningCream",
    brand: "BasicLab",
    name: "Famillias Krem regenerujący z ceramidami",
    tags: ["ceramidy", "bariera", "noc"],
    match: ["barrier", "dry", "dehydration"],
    price: "80-150 zł",
    why: "Nocne domknięcie dla skóry potrzebującej odbudowy bariery.",
  },
];

const state = {
  step: 0,
  answers: {},
};

const introScreen = document.querySelector("#introScreen");
const quizScreen = document.querySelector("#quizScreen");
const resultScreen = document.querySelector("#resultScreen");
const questionHost = document.querySelector("#questionHost");
const stepLabel = document.querySelector("#stepLabel");
const progressPercent = document.querySelector("#progressPercent");
const progressBar = document.querySelector("#progressBar");
const backButton = document.querySelector("#backButton");
const nextButton = document.querySelector("#nextButton");
const skipButton = document.querySelector("#skipButton");

document.querySelector("#startButton").addEventListener("click", () => showScreen("quiz"));
document.querySelector("#restartButton").addEventListener("click", restart);
document.querySelector("#editAnswersButton").addEventListener("click", () => showScreen("quiz"));
backButton.addEventListener("click", previousStep);
nextButton.addEventListener("click", nextStep);
skipButton.addEventListener("click", skipStep);

document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => setTab(tab.dataset.tab));
});

renderQuestion();

function showScreen(screen) {
  introScreen.classList.toggle("hidden", screen !== "intro");
  quizScreen.classList.toggle("hidden", screen !== "quiz");
  resultScreen.classList.toggle("hidden", screen !== "result");
}

function renderQuestion() {
  const question = questions[state.step];
  const percent = Math.round(((state.step + 1) / questions.length) * 100);
  stepLabel.textContent = `Krok ${state.step + 1} z ${questions.length}`;
  progressPercent.textContent = `${percent}%`;
  progressBar.style.width = `${percent}%`;
  backButton.disabled = state.step === 0;
  nextButton.textContent = state.step === questions.length - 1 ? "Pokaż plan" : "Dalej";

  questionHost.innerHTML = "";
  const card = document.createElement("section");
  card.className = "question-card";
  card.innerHTML = `<div><h2>${question.title}</h2><p>${question.helper || ""}</p></div>`;

  if (question.type === "single" || question.type === "multi") {
    const options = document.createElement("div");
    options.className = "options-grid";
    question.options.forEach(([value, label, description]) => {
      const item = document.createElement("label");
      item.className = "option";
      const inputType = question.type === "single" ? "radio" : "checkbox";
      const selected = getArrayAnswer(question.id).includes(value);
      item.innerHTML = `
        <input type="${inputType}" name="${question.id}" value="${value}" ${selected ? "checked" : ""} />
        <strong>${label}</strong>
        <span>${description}</span>
      `;
      options.appendChild(item);
    });
    card.appendChild(options);
  }

  if (question.type === "fields") {
    const fields = document.createElement("div");
    fields.className = "field-grid";
    question.fields.forEach((field) => {
      const value = state.answers[field.id] || "";
      const wrap = document.createElement("div");
      wrap.className = "field";
      wrap.innerHTML = `
        <label for="${field.id}">${field.label}</label>
        <select id="${field.id}" name="${field.id}">
          <option value="">Wybierz</option>
          ${field.options.map((option) => `<option ${value === option ? "selected" : ""}>${option}</option>`).join("")}
        </select>
      `;
      fields.appendChild(wrap);
    });
    card.appendChild(fields);
  }

  if (question.type === "textarea") {
    const value = state.answers[question.id] || "";
    const field = document.createElement("div");
    field.className = "field";
    field.innerHTML = `
      <label for="${question.id}">Uwagi</label>
      <textarea id="${question.id}" name="${question.id}" placeholder="${question.placeholder}">${value}</textarea>
    `;
    card.appendChild(field);
  }

  questionHost.appendChild(card);
}

function collectCurrentAnswer() {
  const question = questions[state.step];

  if (question.type === "single") {
    const checked = document.querySelector(`input[name="${question.id}"]:checked`);
    if (checked) state.answers[question.id] = checked.value;
  }

  if (question.type === "multi") {
    state.answers[question.id] = [...document.querySelectorAll(`input[name="${question.id}"]:checked`)].map(
      (input) => input.value,
    );
  }

  if (question.type === "fields") {
    question.fields.forEach((field) => {
      const input = document.querySelector(`[name="${field.id}"]`);
      state.answers[field.id] = input.value;
    });
  }

  if (question.type === "textarea") {
    state.answers[question.id] = document.querySelector(`[name="${question.id}"]`).value.trim();
  }
}

function nextStep() {
  collectCurrentAnswer();
  if (state.step < questions.length - 1) {
    state.step += 1;
    renderQuestion();
    return;
  }
  renderResults();
  showScreen("result");
}

function skipStep() {
  if (state.step < questions.length - 1) {
    state.step += 1;
    renderQuestion();
  } else {
    renderResults();
    showScreen("result");
  }
}

function previousStep() {
  collectCurrentAnswer();
  if (state.step > 0) {
    state.step -= 1;
    renderQuestion();
  }
}

function restart() {
  state.step = 0;
  state.answers = {};
  renderQuestion();
  showScreen("intro");
}

function getArrayAnswer(id) {
  const value = state.answers[id];
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function analyseAnswers() {
  const concerns = getArrayAnswer("mainConcerns");
  const routine = getArrayAnswer("currentRoutine");
  const barrier = getArrayAnswer("barrier");
  const lifestyle = getArrayAnswer("lifestyle");
  const skinFeel = state.answers.skinFeel || "balanced";
  const sensitivity = state.answers.sensitivity || "medium";

  const flags = {
    dry: skinFeel === "tight",
    oily: skinFeel === "oily",
    combo: skinFeel === "tzone",
    balanced: skinFeel === "balanced",
    sensitive: sensitivity === "high" || concerns.includes("redness"),
    barrier:
      barrier.some((item) => ["burning", "flaking", "overexfoliation", "treatment"].includes(item)) ||
      sensitivity === "high",
    needsSpf: !routine.includes("spf") || concerns.some((item) => ["pigmentation", "aging", "redness"].includes(item)),
    acne: concerns.includes("acne"),
    comedones: concerns.includes("comedones"),
    pigmentation: concerns.includes("pigmentation"),
    dehydration: concerns.includes("dehydration") || lifestyle.includes("aircon"),
    aging: concerns.includes("aging") || ["30-39", "40-49", "50+"].includes(state.answers.age),
    makeup: lifestyle.includes("makeup"),
    outdoor: lifestyle.includes("outdoor"),
  };

  const type = flags.oily
    ? "tłusta"
    : flags.combo
      ? "mieszana"
      : flags.dry
        ? "sucha lub odwodniona"
        : "raczej zrównoważona";

  const priority = flags.barrier
    ? "odbudowa bariery"
    : flags.acne || flags.comedones
      ? "kontrola niedoskonałości"
      : flags.pigmentation
        ? "wyrównanie kolorytu"
        : flags.dehydration
          ? "nawilżenie"
          : "utrzymanie stabilności";

  return { concerns, routine, barrier, lifestyle, skinFeel, sensitivity, flags, type, priority };
}

function renderResults() {
  const analysis = analyseAnswers();
  document.querySelector("#resultTitle").textContent = `Cera ${analysis.type}`;
  document.querySelector("#resultSubtitle").textContent =
    `Priorytet: ${analysis.priority}. Plan jest kosmetyczny i nie zastępuje konsultacji dermatologicznej.`;

  renderInsights(analysis);
  renderRoutine(analysis);
  renderProducts(analysis);
  renderRules(analysis);
  setTab("routine");
}

function renderInsights({ flags, sensitivity, priority }) {
  const sensitivityLabel = sensitivity === "high" ? "wysoka" : sensitivity === "medium" ? "umiarkowana" : "niska";
  const items = [
    ["Typ skóry", document.querySelector("#resultTitle").textContent.replace("Cera ", "")],
    ["Priorytet", priority],
    ["Reaktywność", sensitivityLabel],
    ["Tempo wdrażania", flags.barrier || flags.sensitive ? "powolne" : "standardowe"],
  ];
  document.querySelector("#insightGrid").innerHTML = items
    .map(([label, value]) => `<article class="insight"><span>${label}</span><strong>${value}</strong></article>`)
    .join("");
}

function renderRoutine({ flags }) {
  const morning = [
    "Delikatne mycie lub samo opłukanie wodą, jeśli skóra jest sucha albo reaktywna.",
    flags.dehydration || flags.barrier
      ? "Serum nawilżające lub regenerujące, dobrane do bariery i poziomu odwodnienia."
      : "Lekkie serum wspierające aktualny cel, np. niacynamid przy sebum.",
    "Krem domykający serum: lekki przy cerze tłustej lub bogatszy przy suchości i ściągnięciu.",
    flags.needsSpf
      ? "SPF 50 codziennie jako ostatni poranny krok ochronny."
      : "SPF 30-50, szczególnie przy ekspozycji na zewnątrz.",
  ];

  const evening = [
    flags.makeup
      ? "Dwuetapowe oczyszczanie: produkt do SPF/makijażu, potem łagodny żel lub emulsja."
      : "Łagodne oczyszczanie bez mocnego odtłuszczania.",
    flags.barrier
      ? "Serum regenerujące lub nawilżające; przez 2-3 tygodnie bez kwasów i retinoidów."
      : activeStep(flags),
    "Krem domykający serum i zmniejszający ryzyko przesuszenia po aktywnych składnikach.",
  ];

  document.querySelector("#routinePanel").innerHTML = `
    ${routineSection("Rano", morning)}
    ${routineSection("Wieczorem", evening)}
    <div class="notice">Wprowadzaj jeden nowy produkt co 7-14 dni. Jeśli pojawi się pieczenie, łuszczenie lub wysyp, wróć do prostego zestawu: mycie, krem, SPF.</div>
  `;
}

function activeStep(flags) {
  if (flags.acne || flags.comedones) return "Serum aktywne 2-3 razy w tygodniu: BHA lub kwas azelainowy; w pozostałe dni serum regenerujące.";
  if (flags.pigmentation) return "Serum rozjaśniające albo kwas azelainowy, a retinoid dopiero po stabilizacji rutyny.";
  if (flags.aging) return "Serum z retinoidem niskiej mocy 1-2 razy w tygodniu, jeśli skóra nie jest reaktywna.";
  if (flags.dehydration) return "Serum nawilżające i krem barierowy; aktywne złuszczanie nie jest teraz priorytetem.";
  return "Serum regenerujące lub antyoksydacyjne; aktywne składniki dodawaj tylko, gdy pojawi się konkretny cel.";
}

function routineSection(title, steps) {
  return `
    <article class="routine-section">
      <h3>${title}</h3>
      <ol class="step-list">
        ${steps.map((step, index) => `<li><b>${index + 1}</b><span>${step}</span></li>`).join("")}
      </ol>
    </article>
  `;
}

function renderProducts({ flags }) {
  const groups = [
    ["cleanser", "Oczyszczanie"],
    ["morningSerum", "Serum rano"],
    ["morningCream", "Krem domykający rano"],
    ["spf", "SPF"],
    ["eveningSerum", "Serum wieczorem"],
    ["eveningCream", "Krem domykający wieczorem"],
  ];

  document.querySelector("#productsPanel").innerHTML = `
    <div class="notice">Propozycje są przykładowe i pokazują logikę MVP: 3 produkty różnych marek na każdy punkt rutyny. Docelowo baza powinna mieć ceny, INCI, dostępność i datę aktualizacji.</div>
    ${groups.map(([step, title]) => productGroup(step, title, flags)).join("")}
  `;
}

function productGroup(step, title, flags) {
  const selected = products
    .filter((product) => product.step === step)
    .map((product) => {
      const score = product.match.reduce((sum, key) => sum + (key === "all" || flags[key] ? 1 : 0), 0);
      return { ...product, score };
    })
    .sort((a, b) => b.score - a.score)
    .reduce((items, product) => {
      if (items.length < 3 && !items.some((item) => item.brand === product.brand)) items.push(product);
      return items;
    }, []);

  return `
    <section class="product-group">
      <h3>${title}</h3>
      <div class="product-list">
        ${selected.map(productCard).join("")}
      </div>
    </section>
  `;
}

function productCard(product) {
  return `
    <article class="product-card">
      <div>
        <h4>${product.brand}</h4>
        <h3>${product.name}</h3>
        <p>${product.why}</p>
      </div>
      <div class="product-meta">
        <span class="chip">${product.price}</span>
        ${product.tags.map((tag) => `<span class="chip">${tag}</span>`).join("")}
      </div>
    </article>
  `;
}

function renderRules({ flags }) {
  const rules = [
    ["Granica medyczna", "Silny stan zapalny, ból, sączenie, nagłe pogorszenie albo zmiany znamion wymagają dermatologa."],
    ["SPF przed aktywami", "Przy przebarwieniach, retinoidach i kwasach ochrona UV jest warunkiem sensownej rutyny."],
    ["Mniej, ale konsekwentnie", "Lepsze są 3 dobrze dobrane kroki niż 8 produktów zmienianych co kilka dni."],
  ];

  if (flags.barrier) {
    rules.unshift([
      "Najpierw bariera",
      "Przy pieczeniu i łuszczeniu aplikacja ogranicza składniki aktywne i proponuje pielęgnację naprawczą.",
    ]);
  }

  document.querySelector("#rulesPanel").innerHTML = rules
    .map(([title, body]) => `<article class="rule-card"><h3>${title}</h3><p>${body}</p></article>`)
    .join("");
}

function setTab(activeTab) {
  document.querySelectorAll(".tab").forEach((tab) => tab.classList.toggle("active", tab.dataset.tab === activeTab));
  document.querySelector("#routinePanel").classList.toggle("hidden", activeTab !== "routine");
  document.querySelector("#productsPanel").classList.toggle("hidden", activeTab !== "products");
  document.querySelector("#rulesPanel").classList.toggle("hidden", activeTab !== "rules");
}
