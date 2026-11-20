# 🛡️ Scam Message Detector

A website that checks whether an SMS or chat message looks like spam or a scam.
It uses **Naive Bayes**, a simple machine learning method, trained on 5,574 real SMS messages.
Everything runs inside the browser, using only HTML, CSS and JavaScript. No server or database is needed.

**Live demo:** `https://<your-github-username>.github.io/scam-message-detector/` (add your link after deploying)

> BCA project by **[Your Name]**, **[College Name]**, [Year]

---

## Why this project?

Scam messages ("Your KYC has expired", "You won a prize", "Work from home, earn ₹5000 daily") trick people
into clicking fake links or sharing OTPs. This tool gives a quick second opinion and shows *which words* made
the message look suspicious, so the user also learns to spot scams.

## Features

- Paste a message and get a verdict: **Looks Safe**, **Suspicious** or **Scam / Spam**
- Spam percentage with a colour meter
- Suspicious words highlighted inside the message
- Input validation (empty, too short, too long, no letters)
- 5 sample messages to try with one click
- Recent checks history (last 5, saved only in your browser)
- Live model accuracy, precision, recall and confusion matrix
- Scam awareness tips and the Indian cyber-crime helpline
- Works on mobile screens

## Model results

Measured on 1,115 test messages the model never saw while learning:

| Accuracy | Precision | Recall |
|---|---|---|
| 98.4% | 95.9% | 92.2% |

|  | Predicted Spam | Predicted Safe |
|---|---|---|
| **Actually Spam** | 142 | 12 |
| **Actually Safe** | 6 | 955 |

## Technologies

| Part | Used for |
|---|---|
| HTML | Page structure: text box, buttons, sections |
| CSS | Design, colours, layout, mobile view |
| JavaScript | The Naive Bayes model, validation, showing results |
| localStorage | Saving recent checks in the browser |
| GitHub Pages | Free hosting with a public link |

## Folder structure

```
scam-message-detector/
├── index.html          # The web page
├── style.css           # All the design
├── script.js           # The AI model + page logic
├── data.js             # The dataset as a JavaScript list
├── data/
│   ├── SMSSpamCollection.tsv   # Original dataset file
│   └── DATASET_README.txt      # Original dataset description
├── screenshots/        # Screenshots used in the PPT
├── presentation/       # PowerPoint file
├── docs/
│   ├── CODE_EXPLAINED.md   # Line-by-line explanation
│   ├── WHITEBOARD.md       # What to draw on the board
│   └── VIVA.md             # Viva questions and answers
└── README.md
```

## How to run on your computer

1. Download or clone this folder.
2. Double-click `index.html`. It opens in your browser and works right away.

There's nothing to install.

## How to upload to GitHub

1. Create a free account at [github.com](https://github.com).
2. Click **+** (top right) → **New repository**.
   - Name: `scam-message-detector`
   - Visibility: **Public**
   - Don't tick "Add a README" (this project already has one)
   - Click **Create repository**.
3. Upload the code using **one** of these methods:

   **A) Website upload (easiest)**
   - On the new repository page, click **uploading an existing file**.
   - Drag in everything *inside* the project folder (files and folders).
   - Click **Commit changes**.

   **B) Using Git commands**
   ```bash
   cd scam-message-detector
   git init
   git add .
   git commit -m "Scam Message Detector - first version"
   git branch -M main
   git remote add origin https://github.com/<your-username>/scam-message-detector.git
   git push -u origin main
   ```

## How to publish the website (free, with GitHub Pages)

1. Open your repository on GitHub → **Settings** → **Pages** (left menu).
2. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
3. Choose branch **main** and folder **/ (root)** → **Save**.
4. Wait 1–2 minutes and refresh. GitHub shows your link:
   `https://<your-username>.github.io/scam-message-detector/`
5. Paste that link at the top of this README.

Any later change you push to `main` updates the live site automatically.

## Limitations

- The dataset has English SMS from 2011–2012 (mostly UK and Singapore). Newer scam styles can be missed.
  For example, a fake "parcel delivery fee" message scores only about 11% spam.
- Naive Bayes looks at words only. It doesn't understand meaning, word order or sarcasm.
- It doesn't check whether links in the message are actually dangerous.
- Hindi or Hinglish messages are not supported.

## Future improvements

- Add newer Indian scam messages (UPI, KYC, courier, job scams) to the training data
- Check links against a phishing blacklist such as Google Safe Browsing
- Support Hindi and Hinglish
- Try other models (Logistic Regression) and compare accuracy
- Make a browser extension or WhatsApp/SMS integration

## Dataset credit

SMS Spam Collection v.1, by Tiago A. Almeida and José María Gómez Hidalgo,
[UCI Machine Learning Repository](https://archive.ics.uci.edu/dataset/228/sms+spam+collection), licensed under CC BY 4.0.

## AI assistance

[If your college requires it, describe here how AI tools were used, e.g. "Claude (Anthropic) was used
to help write and explain the code. I have reviewed and understood every part."]
