# Code Explained (read this before your viva)

The project has only 4 files that matter:

| File | What it does | Simple comparison |
|---|---|---|
| `index.html` | The structure of the page: headings, text box, buttons, empty boxes for results | The skeleton |
| `style.css` | How everything looks: colours, spacing, layout, mobile view | The clothes |
| `script.js` | The AI model and everything that happens when you click a button | The brain |
| `data.js` | 5,574 messages, each labelled `spam` or `ham` | The textbook the brain studies |

> **ham** = a normal, genuine message. It's the standard word in spam-filter research (the opposite of spam).

The browser loads them in this order: `index.html` → `style.css` → `data.js` → `script.js`.
`data.js` must come before `script.js` because the script uses the `DATASET` list from it.

---

## 1. index.html

Main parts, from top to bottom:

- **`<head>`**: the page title, `viewport` meta (makes it fit phone screens) and the link to `style.css`.
- **Navbar**: links like `href="#checker"` jump to the section with `id="checker"`.
- **Hero**: the purple banner with the heading.
- **Message Checker**:
  - `<textarea id="message" maxlength="1000">` is the input box. `maxlength` stops typing after 1000 characters.
  - `<p id="error">` is empty at first. JavaScript writes error messages into it.
  - Sample buttons store their message in `data-text="..."`. JavaScript reads it with `button.dataset.text`.
  - `<div id="result" hidden>` stays hidden until a message is checked.
- **Recent Checks**: an empty `<ul id="history-list">` that JavaScript fills in.
- **How It Works**: plain text, 4 steps.
- **Model Performance**: the numbers show `-` at first. JavaScript replaces them with real results.
- **Tips** and **footer**: plain text.
- At the bottom: `<script src="data.js">` then `<script src="script.js">`.
  Scripts go at the end so the HTML elements already exist when the code looks for them.

**Key idea:** `id`s are name tags. JavaScript finds elements with `document.getElementById("message")`.

---

## 2. style.css

- **`:root { --primary: #4f46e5; ... }`**: colour variables. Change a colour once and it updates everywhere.
- **`.card`**: the white rounded boxes with a soft shadow.
- **`.result.safe / .warning / .danger`**: three colour themes for the result box (green, orange, red).
  JavaScript just changes the class name, and CSS changes the colours.
- **`.meter-fill`**: the bar inside the meter. JavaScript sets its `width` to the spam percentage.
  `transition: width 0.6s` animates it.
- **`mark`**: the red highlight on suspicious words.
- **`display: grid; grid-template-columns: repeat(4, 1fr)`**: puts the "How It Works" steps in 4 equal columns.
- **`@media (max-width: 700px)`**: rules for phone screens. Columns become 2 or 1, and the nav links hide.

---

## 3. script.js, part by part

### Part 1: `getWords(text)`
```js
text.toLowerCase().match(/[a-z0-9]+/g)
```
Converts to lowercase, then picks out groups of letters and numbers.
`"WIN a FREE prize!!"` → `["win", "a", "free", "prize"]`.
The `/[a-z0-9]+/g` is a *regular expression*: "one or more letters or digits, find all of them".
If nothing matches, `match` returns `null`, so we return an empty list `[]` instead.

### Part 2: splitting the data
- `shuffleWithSeed` mixes the messages randomly, but uses a fixed seed (42), so the mix is the
  **same every time**. That keeps the accuracy on the website the same on every reload.
- The first **80% (4,459 messages)** become `trainingData`, which the model learns from.
- The last **20% (1,115 messages)** become `testingData`, used only for checking the model.

Why split? If you test on the same messages you learned from, it's like a student seeing the exam
paper in advance. The score would look better than it really is.

### Part 3: training, `train(data)`
The `model` object only stores counts:
- `messageCount`: how many spam and ham messages (593 spam, 3,866 ham in training)
- `wordCount.spam["free"]`: how many times "free" appeared in spam (188), and in ham (49)
- `totalWords`: total words in all spam / all ham messages
- `vocabulary`: a `Set` of every different word (7,862 words). A Set stores each item only once.

That's all "training" means here: going through every message and counting words.

### Part 4: predicting
**`wordProbability(word, label)`**
```
(times word appeared in label + 1) / (total words in label + vocabulary size)
```
The `+ 1` is **Laplace smoothing**. Without it, a word never seen in spam (count 0) would make
the whole spam probability 0, even if every other word screams spam.

**`predictSpamProbability(message)`**
1. Start each score with the **prior**: how common spam and ham are overall (593/4459 vs 3866/4459).
2. For each word in the message, add `log(probability of that word in spam)` to the spam score,
   and do the same for ham.
3. Words the model never saw are skipped.
4. Turn the two scores into one number between 0 and 1:
   `1 / (1 + e^(hamScore - spamScore))`

Why **log**? Multiplying many small numbers like 0.001 × 0.002 × ... quickly becomes so small
that the computer rounds it to 0. Logs turn multiplication into addition, which stays safe.
`log(a × b) = log(a) + log(b)`.

**`findSuspiciousWords(message)`**
For each word: `P(word | spam) ÷ P(word | ham)`. If it's more than 2, the word is at least twice as
likely in spam. The top 6 are highlighted. Example: "claim" appears 90 times in spam and 0 times in ham.

### Part 5: testing, `evaluate(data)`
Runs every test message through the model and counts four results:

| | Meaning |
|---|---|
| **TP** (true positive) | Spam, and the model said spam ✅ |
| **TN** (true negative) | Safe, and the model said safe ✅ |
| **FP** (false positive) | Safe, but the model said spam ❌ (false alarm) |
| **FN** (false negative) | Spam, but the model said safe ❌ (missed) |

- **Accuracy** = (TP + TN) / all = how often it's right overall
- **Precision** = TP / (TP + FP) = when it says spam, how often it's really spam
- **Recall** = TP / (TP + FN) = of all real spam, how much it caught

### Part 6: connecting to the page
- `document.getElementById(...)` grabs page elements.
- The stats section is filled with the real `results`.
- `input.addEventListener("input", ...)` runs on every key press and updates the character counter.
- **`validate(text)`** returns an error message, or `""` if the message is fine:
  empty / under 5 characters / over 1000 / no letters or digits.
- **Check button click**: trim spaces → validate → predict → find words → `showResult` → `saveToHistory`.
- **`getVerdict`**: 85% or more → *Scam / Spam* (red), 50–85% → *Suspicious* (orange), under 50% → *Looks Safe* (green).
- **`showResult`**: sets the class (colour), the text, the meter width, and rebuilds the message with
  `<mark>` around suspicious words.

**Security point:** the message is added with `textContent` and `createTextNode`, never `innerHTML`.
If someone pastes `<script>alert(1)</script>`, it's shown as plain text and does **not** run.
This prevents **XSS (Cross-Site Scripting)**.

### Part 7: sample buttons
`querySelectorAll(".sample")` finds all 5 buttons. Each click copies `data-text` into the box,
updates the counter and clicks *Check*.

### Part 8: history
- `localStorage` is a small storage space in the browser that keeps data even after closing the tab.
- It can only store text, so `JSON.stringify` turns the list into text, and `JSON.parse` turns it back.
- Only the last 5 checks are kept (`slice(0, 5)`), and only the first 80 characters of each.
- `try / catch` makes sure the site still works if the browser blocks storage (for example, private mode).

---

## 4. data.js
Made once from `data/SMSSpamCollection.tsv` (tab-separated: `label<TAB>message`).
It's stored as a JavaScript list so the site works by double-clicking `index.html`, with no server needed.
