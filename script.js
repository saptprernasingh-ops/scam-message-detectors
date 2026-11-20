// ============================================================
//  Scam Message Detector - script.js
//  A Naive Bayes model (a simple AI / machine learning method)
//  that learns from 5,574 labelled SMS messages and then
//  predicts whether a new message is SPAM/SCAM or SAFE.
//
//  DATASET comes from data.js (loaded before this file).
// ============================================================


// ---------- PART 1: Turning text into words ----------

// Breaks a message into lowercase words.
// "WIN a FREE prize!!" -> ["win", "a", "free", "prize"]
function getWords(text) {
  const words = text.toLowerCase().match(/[a-z0-9]+/g);
  return words || []; // match() gives null when nothing is found
}


// ---------- PART 2: Splitting the data ----------

// Shuffles the list in the same order every time (fixed "seed"),
// so the accuracy shown on the website does not change on every reload.
function shuffleWithSeed(list, seed) {
  const copy = list.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    seed = (seed * 9301 + 49297) % 233280; // simple pseudo-random number
    const j = Math.floor((seed / 233280) * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const shuffled = shuffleWithSeed(DATASET, 42);
const splitPoint = Math.floor(shuffled.length * 0.8);
const trainingData = shuffled.slice(0, splitPoint); // 80% to learn from
const testingData = shuffled.slice(splitPoint);     // 20% to check the model


// ---------- PART 3: Training (learning) ----------

// The model just counts things:
//  - how many spam and ham messages there are
//  - how many times each word appears in spam and in ham
const model = {
  messageCount: { spam: 0, ham: 0 },
  wordCount: { spam: {}, ham: {} },
  totalWords: { spam: 0, ham: 0 },
  vocabulary: new Set() // every different word seen
};

function train(data) {
  for (const [label, message] of data) {
    model.messageCount[label]++;
    for (const word of getWords(message)) {
      model.wordCount[label][word] = (model.wordCount[label][word] || 0) + 1;
      model.totalWords[label]++;
      model.vocabulary.add(word);
    }
  }
}


// ---------- PART 4: Predicting ----------

// How likely is this word in a message of this label?
// We add 1 to every count ("Laplace smoothing") so a word never seen
// in spam does not give a probability of zero and break the maths.
function wordProbability(word, label) {
  const count = model.wordCount[label][word] || 0;
  return (count + 1) / (model.totalWords[label] + model.vocabulary.size);
}

// Returns a number from 0 to 1: the chance that the message is spam.
function predictSpamProbability(message) {
  const total = model.messageCount.spam + model.messageCount.ham;

  // Start with how common each label is (the "prior").
  // We add logarithms instead of multiplying many tiny numbers,
  // because multiplying them would round down to 0 in a computer.
  let spamScore = Math.log(model.messageCount.spam / total);
  let hamScore = Math.log(model.messageCount.ham / total);

  for (const word of getWords(message)) {
    if (!model.vocabulary.has(word)) continue; // skip words never seen
    spamScore += Math.log(wordProbability(word, "spam"));
    hamScore += Math.log(wordProbability(word, "ham"));
  }

  // Convert the two scores back into a probability between 0 and 1
  return 1 / (1 + Math.exp(hamScore - spamScore));
}

// Finds the words that pushed the message most towards "spam".
function findSuspiciousWords(message) {
  const unique = [...new Set(getWords(message))];
  const scored = [];
  for (const word of unique) {
    if (!model.vocabulary.has(word)) continue;
    const ratio = wordProbability(word, "spam") / wordProbability(word, "ham");
    if (ratio > 2) scored.push({ word: word, ratio: ratio }); // 2x more common in spam
  }
  scored.sort((a, b) => b.ratio - a.ratio);
  return scored.slice(0, 6).map(item => item.word);
}


// ---------- PART 5: Testing the model ----------

// Runs the model on the 20% test messages it has never seen
// and counts right and wrong answers.
function evaluate(data) {
  let tp = 0, tn = 0, fp = 0, fn = 0;
  for (const [label, message] of data) {
    const saysSpam = predictSpamProbability(message) >= 0.5;
    if (label === "spam" && saysSpam) tp++;        // caught a spam
    else if (label === "ham" && !saysSpam) tn++;   // correctly safe
    else if (label === "ham" && saysSpam) fp++;    // false alarm
    else fn++;                                     // missed a spam
  }
  return {
    accuracy: (tp + tn) / data.length,
    precision: tp / (tp + fp),
    recall: tp / (tp + fn),
    tp: tp, tn: tn, fp: fp, fn: fn
  };
}

train(trainingData);
const results = evaluate(testingData);


// ---------- PART 6: Connecting to the web page ----------

const input = document.getElementById("message");
const checkBtn = document.getElementById("check-btn");
const clearBtn = document.getElementById("clear-btn");
const errorBox = document.getElementById("error");
const charCount = document.getElementById("char-count");
const resultBox = document.getElementById("result");
const MAX_LENGTH = 1000;

// Show the real test results in the "Model Performance" section
function percent(value) {
  return (value * 100).toFixed(1) + "%";
}
document.getElementById("stat-accuracy").textContent = percent(results.accuracy);
document.getElementById("stat-precision").textContent = percent(results.precision);
document.getElementById("stat-recall").textContent = percent(results.recall);
document.getElementById("stat-train").textContent = trainingData.length;
document.getElementById("stat-test").textContent = testingData.length;
document.getElementById("cm-tp").textContent = results.tp;
document.getElementById("cm-tn").textContent = results.tn;
document.getElementById("cm-fp").textContent = results.fp;
document.getElementById("cm-fn").textContent = results.fn;

// Live character counter
input.addEventListener("input", function () {
  charCount.textContent = input.value.length + " / " + MAX_LENGTH;
  errorBox.textContent = "";
});

// Checks the input before running the model.
// Returns an error message, or "" when the input is fine.
function validate(text) {
  if (text.length === 0) return "Please paste or type a message first.";
  if (text.length < 5) return "Message is too short. Enter at least 5 characters.";
  if (text.length > MAX_LENGTH) return "Message is too long. Keep it under " + MAX_LENGTH + " characters.";
  if (getWords(text).length === 0) return "Message must contain some letters or numbers.";
  return "";
}

checkBtn.addEventListener("click", function () {
  const text = input.value.trim();
  const error = validate(text);
  if (error) {
    errorBox.textContent = error;
    resultBox.hidden = true;
    return;
  }

  const probability = predictSpamProbability(text);
  // Only point out words when the message is actually flagged
  const suspicious = probability >= 0.5 ? findSuspiciousWords(text) : [];
  showResult(text, probability, suspicious);
  saveToHistory(text, probability);
});

clearBtn.addEventListener("click", function () {
  input.value = "";
  charCount.textContent = "0 / " + MAX_LENGTH;
  errorBox.textContent = "";
  resultBox.hidden = true;
});

// Gives a label and colour based on the spam probability
function getVerdict(probability) {
  if (probability >= 0.85) return { text: "Scam / Spam", css: "danger" };
  if (probability >= 0.5) return { text: "Suspicious", css: "warning" };
  return { text: "Looks Safe", css: "safe" };
}

function showResult(text, probability, suspicious) {
  const verdict = getVerdict(probability);
  const spamPercent = Math.round(probability * 100);

  resultBox.className = "result " + verdict.css;
  document.getElementById("verdict").textContent = verdict.text;
  document.getElementById("score").textContent = spamPercent + "% chance of spam";
  document.getElementById("meter-fill").style.width = spamPercent + "%";

  // Show the message again with suspicious words highlighted.
  // We build it with textContent (not innerHTML) so that any HTML or
  // script inside the pasted message is shown as plain text and never runs.
  const preview = document.getElementById("preview");
  preview.innerHTML = "";
  for (const part of text.split(/([A-Za-z0-9]+)/)) {
    if (suspicious.includes(part.toLowerCase())) {
      const mark = document.createElement("mark");
      mark.textContent = part;
      preview.appendChild(mark);
    } else {
      preview.appendChild(document.createTextNode(part));
    }
  }

  const reason = document.getElementById("reason");
  if (suspicious.length > 0) {
    reason.textContent = "Words that appear much more often in spam: " + suspicious.join(", ");
  } else {
    reason.textContent = "No strongly spam-like words were found in this message.";
  }

  resultBox.hidden = false;
}


// ---------- PART 7: Sample messages ----------

// Clicking a sample button copies its text into the box
document.querySelectorAll(".sample").forEach(function (button) {
  button.addEventListener("click", function () {
    input.value = button.dataset.text;
    input.dispatchEvent(new Event("input")); // update the counter
    checkBtn.click();
  });
});


// ---------- PART 8: Recent checks (saved in this browser) ----------

const HISTORY_KEY = "scamDetectorHistory";

function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
  } catch (e) {
    return []; // storage blocked or data broken: start empty
  }
}

function saveToHistory(text, probability) {
  const history = loadHistory();
  const shortText = text.length > 80 ? text.slice(0, 80) + "…" : text;
  history.unshift({ text: shortText, probability: probability });
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 5)));
  } catch (e) {
    // If the browser blocks storage, the checker still works without history
  }
  showHistory();
}

function showHistory() {
  const list = document.getElementById("history-list");
  const history = loadHistory();
  list.innerHTML = "";
  if (history.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty";
    empty.textContent = "No messages checked yet.";
    list.appendChild(empty);
    return;
  }
  for (const item of history) {
    const verdict = getVerdict(item.probability);
    const li = document.createElement("li");
    const badge = document.createElement("span");
    badge.className = "badge " + verdict.css;
    badge.textContent = verdict.text;
    const msg = document.createElement("span");
    msg.className = "history-text";
    msg.textContent = item.text;
    li.append(badge, msg);
    list.appendChild(li);
  }
}

document.getElementById("clear-history").addEventListener("click", function () {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (e) {}
  showHistory();
});

showHistory();
