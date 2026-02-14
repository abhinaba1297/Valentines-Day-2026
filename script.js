// ✅ Edit these questions/answers freely.
// Each question has: text, options (array), hint (optional).
// The LAST item is the final "Will you be my valentine..." with runaway logic.
const QUIZ = [
  {
    text: "Important research question: are you the cutest most beautiful human on Earth?",
    options: ["Yes", "Heck yes"],
    hint: "Peer review says: accepted with zero revisions."
  },
  {
    text: "Do you officially approve unlimited forehead kisses as a valid currency?",
    options: ["Yes", "Ofcourse baby!"],
    hint: "Exchange rate: 1 kiss = 1 happiness."
  },
  {
    text: "Should I keep loving you forever in the most annoying (and loyal) way possible?",
    options: ["Is that even a question", "Yeaaaah baby"],
    hint: "Warning: includes random compliments + ‘I miss you’ attacks."
  },
  {
    text: "Would you like a lifetime subscription to bad jokes + good hugs + kisses + cuddles?",
    options: ["Yes", "Absolutely heck yes"],
    hint: "No refunds (only more hugs)."
  },
  {
    text: "Do you agree that you and me = elite duo energy?",
    options: ["Yes", "Heck yes"],
    hint: "We’re basically a power couple… but cuter."
  },
  {
    text: "Will you be my Valentine for today and forever? 💘",
    options: ["Let me think", "I was going to say yes anyway 😌"],
    hint: "Try picking the ‘Let me think’ option… if you can 😈",
    final: true
  }
];

// ✅ Replace with her name if you want
const HER_NAME = "Meu Amor Clara";

// ✅ Customize the final letter/message here (inspired by your screenshot)
const FINAL_NOTE =
`Happy Valentine’s Day, ${HER_NAME}.

I don’t say it enough, but I appreciate you more than words can express.
You’ve been my best decision, my safe place, and my favorite part of every day.
Thank you for being patient with me, for making me laugh when I need it most, and for simply being you.

No matter where life takes us, I know I’ll always want to share it with you.
Today is just a reminder of how lucky I am to have you by my side.

I love you, always.
— Abhi ❤️`;

// -------------------- App logic --------------------
let idx = 0;

const titleEl = document.getElementById("title");
const subtitleEl = document.getElementById("subtitle");
const questionEl = document.getElementById("questionText");
const choicesEl = document.getElementById("choices");
const hintEl = document.getElementById("hintText");
const stepEl = document.getElementById("stepText");
const barEl = document.getElementById("bar");

const backBtn = document.getElementById("backBtn");
const restartBtn = document.getElementById("restartBtn");
const stageEl = document.getElementById("stage");

function clamp(n, min, max){ return Math.max(min, Math.min(max, n)); }

function render(){
  const total = QUIZ.length;
  const q = QUIZ[idx];

  // Header
  stepEl.textContent = `Question ${idx + 1} of ${total}`;
  barEl.style.width = `${((idx) / (total - 1)) * 100}%`;

  // Content
  questionEl.textContent = q.text;
  hintEl.textContent = q.hint || "";

  // Buttons
  choicesEl.innerHTML = "";
  backBtn.disabled = idx === 0;

  // Special layout for final question: one normal "YES" + one runaway "NO-ish"
  if (q.final){
    const wrap = document.createElement("div");
    wrap.className = "runawayWrap";
    wrap.id = "runawayWrap";

    const yesBtn = makeChoiceButton(q.options[1], true);
    yesBtn.addEventListener("click", () => showFinal());

    const runawayBtn = makeChoiceButton(q.options[0], false);
    runawayBtn.id = "runawayBtn";
    runawayBtn.setAttribute("aria-label", "runaway choice");
    runawayBtn.style.position = "absolute";
    runawayBtn.style.left = "10px";
    runawayBtn.style.top = "10px";

    // Run away on hover/touch
    const runAway = () => moveRunaway(runawayBtn, wrap);
    runawayBtn.addEventListener("mouseenter", runAway);
    runawayBtn.addEventListener("touchstart", (e) => { e.preventDefault(); runAway(); }, {passive:false});
    runawayBtn.addEventListener("click", runAway);

    wrap.appendChild(runawayBtn);

    // Put YES button outside the runaway zone so it's easy to click
    choicesEl.appendChild(yesBtn);
    choicesEl.appendChild(wrap);

    return;
  }

  // Normal questions (2 buttons)
  q.options.forEach((label, i) => {
    const btn = makeChoiceButton(label, i === 1);
    btn.addEventListener("click", () => next());
    choicesEl.appendChild(btn);
  });
}

function makeChoiceButton(label, primary){
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "choice" + (primary ? " primary" : "");
  btn.textContent = label;
  return btn;
}

function next(){
  idx = clamp(idx + 1, 0, QUIZ.length - 1);
  render();
}

function back(){
  idx = clamp(idx - 1, 0, QUIZ.length - 1);
  render();
}

function restart(){
  idx = 0;
  // Restore normal stage if we had shown the final message
  titleEl.textContent = "Hi, my love 🥰";
  subtitleEl.textContent = "I made you a tiny website. Answer a few extremely serious questions.";
  stageEl.innerHTML = `
    <div class="question" id="questionText"></div>
    <div class="choices" id="choices"></div>
    <p class="hint" id="hintText"></p>
  `;
  // Re-bind elements after stage reset
  window.location.reload();
}

function moveRunaway(btn, container){
  const pad = 8;
  const cRect = container.getBoundingClientRect();

  // If container is too small (mobile), keep it sane
  const maxX = Math.max(pad, cRect.width - btn.offsetWidth - pad);
  const maxY = Math.max(pad, cRect.height - btn.offsetHeight - pad);

  const x = Math.random() * maxX;
  const y = Math.random() * maxY;

  btn.style.left = `${x}px`;
  btn.style.top = `${y}px`;
}

function showFinal(){
  barEl.style.width = "100%";
  stepEl.textContent = "✅ Completed";

  titleEl.textContent = "YAYYYY 💞";
  subtitleEl.textContent = "You just made me the happiest person.";

  stageEl.innerHTML = `
    <div class="question">Confirmed: you are officially my Valentine 🥹💘</div>
    <div class="finalMessage">${escapeHtml(FINAL_NOTE)}</div>
    <div class="small">P.S. Screenshot this page and send it to me 😌</div>
  `;
}

function escapeHtml(str){
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// Buttons
backBtn.addEventListener("click", back);
restartBtn.addEventListener("click", restart);

// Start
render();
