# Whiteboard Explanation

Draw these in order. Each board takes about 1–2 minutes to explain.

---

## Board 1: The problem

```
   SCAM SMS  ──►  User clicks link / shares OTP  ──►  Money lost
   "Your KYC has expired. Click here or account blocked"

   Our solution:  Message ──► AI model ──► SAFE / SUSPICIOUS / SCAM
```

**Say:** "Scam messages use urgency and rewards to trick people. Our website gives a quick
second opinion and highlights the words that look suspicious."

---

## Board 2: Architecture (everything runs in the browser)

```
 ┌──────────────────── USER'S BROWSER ─────────────────────┐
 │                                                         │
 │   index.html  ── structure (text box, buttons)          │
 │   style.css   ── design (colours, layout)               │
 │   data.js     ── 5,574 labelled SMS (spam / ham)        │
 │   script.js   ── Naive Bayes model + validation + UI    │
 │                         │                               │
 │                    localStorage (last 5 checks)         │
 └─────────────────────────────────────────────────────────┘
                ▲
                │ files downloaded once
        GitHub Pages (free hosting)
```

**Say:** "There is no backend server. GitHub Pages only sends the files. All the AI work happens on
the user's own device, so the message never leaves their phone or computer. That's good for privacy."

---

## Board 3: Workflow

```
 PAGE LOADS                              USER CLICKS "CHECK"
 ──────────                              ───────────────────
 1. Load 5,574 messages                  1. Read text from box
 2. Shuffle, split 80% / 20%             2. Validate (empty? too short? too long?)
 3. TRAIN on 4,459  (count words)        3. Split into words
 4. TEST on 1,115   (accuracy 98.4%)     4. Naive Bayes → spam %
                                         5. Verdict + colour
                                         6. Highlight suspicious words
                                         7. Save to history
```

---

## Board 4: Naive Bayes with a tiny example

Training data (4 messages):

```
 SPAM:  "win free prize"     "free cash now"
 HAM:   "see you now"        "call me later"
```

Vocabulary = 10 different words. Spam has 6 words in total, ham has 6.

New message: **"free prize now"**

```
 Formula:  P(word | class) = (count + 1) / (total words in class + vocabulary)

               SPAM                      HAM
 free     (2+1)/(6+10) = 3/16     (0+1)/(6+10) = 1/16
 prize    (1+1)/16     = 2/16     (0+1)/16     = 1/16
 now      (1+1)/16     = 2/16     (1+1)/16     = 2/16

 prior          2/4 = 0.5                2/4 = 0.5

 Score   0.5 × 3×2×2 / 16³          0.5 × 1×1×2 / 16³
       = 0.5 × 12 / 4096          = 0.5 × 2 / 4096

 P(spam) = 12 / (12 + 2) = 85.7%   ──►  SCAM / SPAM
```

**Say:**
- "**Bayes**: we use probabilities learned from past data to judge new data."
- "**Naive**: we assume each word is independent of the others. That's not really true,
  but it keeps the maths simple and still works very well."
- "The **+1** is Laplace smoothing. 'free' never appears in ham, and without +1 its probability
  would be 0, which would make the whole ham score 0."
- "On the real website we add **logarithms** instead of multiplying, because multiplying hundreds of
  tiny numbers rounds down to zero in a computer."

---

## Board 5: How we know it works

```
                    Predicted SPAM   Predicted SAFE
  Actually SPAM          142              12   (missed)
  Actually SAFE            6  (false     955
                              alarm)

  Accuracy  = (142 + 955) / 1115 = 98.4%
  Precision = 142 / (142 + 6)    = 95.9%   "when it says spam, it's right"
  Recall    = 142 / (142 + 12)   = 92.2%   "how much spam it catches"
```

---

## Board 6: Security inside the website

```
 1. Input validation  ── 5 to 1000 characters, must contain letters/numbers
 2. XSS protection    ── message shown with textContent, so <script> never runs
 3. Privacy           ── no server, nothing uploaded; history stays in the browser
```
