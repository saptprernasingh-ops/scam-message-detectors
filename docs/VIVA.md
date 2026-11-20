# Viva Questions and Answers

## About the project

**1. What is your project?**
A website that checks if an SMS or chat message is spam or a scam. It uses a machine learning model
called Naive Bayes, trained on 5,574 real SMS messages, and highlights the words that made it suspicious.

**2. Why did you choose this topic?**
Scam messages about KYC, prizes, jobs and OTPs are very common in India, and people lose money by
clicking links in them. This topic combines cybersecurity (phishing/scams) with AI, and anyone can try the demo.

**3. Which part is cybersecurity?**
Scam and phishing messages are *social engineering* attacks: they trick people rather than hack computers.
The tool helps detect them. The website also uses secure coding practices: input validation and XSS protection.

**4. Which part is AI?**
The Naive Bayes model. Nobody wrote rules like "if message contains 'prize' then spam". The model
*learned* which words are common in spam by counting them in thousands of labelled examples.

**5. What is phishing / smishing?**
Phishing is tricking someone into giving away information or money by pretending to be a trusted source.
*Smishing* is phishing done through SMS.

## Machine learning

**6. What is machine learning?**
Teaching a computer to make decisions by learning patterns from examples, rather than writing every rule by hand.

**7. What type of machine learning is this?**
*Supervised learning*, because every training message already has a label (spam or ham).
It's a *classification* problem, because the answer is a category, not a number.

**8. What is Naive Bayes?**
A method based on Bayes' theorem. It looks at the words in a message and calculates how likely those words
are in spam versus in normal messages, then picks the more likely class.

**9. What is Bayes' theorem?**
`P(A | B) = P(B | A) × P(A) / P(B)`. Here: the chance a message is spam *given* its words =
the chance of those words in spam × how common spam is, divided by how common those words are overall.

**10. Why is it called "naive"?**
It assumes each word is independent, as if "free" and "prize" appear without affecting each other.
That isn't true in real language, but the simplification makes it fast and it still works well.

**11. What is Laplace smoothing? Why +1?**
We add 1 to every word count. Without it, a word that never appeared in ham, such as "claim", gives
probability 0, and multiplying by 0 makes the whole result 0 no matter what other words say.

**12. Why do you use logarithms?**
Multiplying many small probabilities gives a number so tiny that the computer rounds it to 0
(this is called *underflow*). Logs turn multiplication into addition: `log(a×b) = log(a) + log(b)`.

**13. What is the dataset?**
The *SMS Spam Collection* from the UCI Machine Learning Repository. It has 5,574 English SMS messages:
747 spam and 4,827 ham. It's free to use under the CC BY 4.0 licence.

**14. What does "ham" mean?**
A normal, genuine message. It's the standard term used in spam-filter research.

**15. Why split the data 80/20?**
We train on 80% (4,459 messages) and test on the other 20% (1,115) that the model has never seen.
Testing on training data would be like giving students the exam paper in advance.

**16. Why a fixed seed when shuffling?**
So the shuffle is the same every time the page loads, and the accuracy shown stays the same (98.4%).

**17. What is your accuracy?**
98.4% on the 1,115 test messages. Precision is 95.9% and recall is 92.2%.

**18. Explain precision and recall.**
- *Precision*: when the model says "spam", how often it's right. 142 out of 148 = 95.9%.
- *Recall*: out of all the real spam, how much it caught. 142 out of 154 = 92.2%.

**19. What is a confusion matrix?**
A table comparing actual labels with predicted labels. Ours: 142 spam caught, 12 spam missed,
6 false alarms, 955 safe messages correctly passed.

**20. Accuracy is 98.4%. Is that enough?**
Not by itself. Only about 14% of messages are spam, so a model that always says "safe" would still get
about 86% accuracy. That's why we also show precision and recall.

**21. Which is worse here, a false positive or a false negative?**
A false negative (a missed scam) is more dangerous, because the user might trust it.
A false positive (a real message marked spam) is annoying but less harmful.

**22. Why is 50% the cut-off?**
It's the natural midpoint. I tested other cut-offs: at 30% the model catches 143 spam but gives 8 false
alarms, and at 90% it gives 0 false alarms but misses 16 spam. 50% is a good balance.

**23. Why does it sometimes show "100%"?**
The real value is something like 99.97%, which rounds to 100% on screen. It's never truly certain.

**24. Which words are the strongest spam signals?**
From the training data: "claim" (90 times in spam, 0 in ham), "prize" (68 vs 0), "txt" (130 vs 11),
"free" (188 vs 49). The strongest ham words are "ok", "home" and "love".

**25. Why Naive Bayes and not deep learning?**
Naive Bayes is simple, fast, needs no special hardware, works well on small text datasets and is easy
to explain. Deep learning needs much more data and computing power, and it's harder to understand.

## Web and code

**26. Which technologies did you use?**
HTML for structure, CSS for design, JavaScript for the model and logic, localStorage for history,
GitHub for code, and GitHub Pages for free hosting.

**27. Why no backend or Python?**
The model is small enough to run in the browser. That keeps it simple: no server to set up, free hosting,
and better privacy because messages never leave the user's device.

**28. Where does training happen?**
In the user's browser, every time the page loads. It takes less than a second.

**29. What validation have you added?**
The message can't be empty, must be at least 5 characters, at most 1000, and must contain some letters
or numbers. The `maxlength` on the text box also blocks typing past 1000.

**30. What is XSS and how did you prevent it?**
Cross-Site Scripting: an attacker puts `<script>` code into input, and the website runs it.
I show the user's message using `textContent` and `createTextNode`, which treat it as plain text,
so code inside it never runs.

**31. What is localStorage?**
Storage inside the browser that keeps data after the tab is closed. I store the last 5 checks there.
It only stores text, so I use `JSON.stringify` and `JSON.parse`.

**32. What does `addEventListener` do?**
It tells the browser to run a function when something happens, like a click or a key press.

**33. What is responsive design?**
The layout adapts to screen size. I used CSS grid and `@media (max-width: 700px)` rules so it works on phones.

**34. How did you deploy it?**
I pushed the code to a public GitHub repository and turned on GitHub Pages (Settings → Pages → main branch).
GitHub gives a free public link.

## Limitations and future

**35. What are the limitations?**
- The dataset is from around 2011 and mostly UK/Singapore SMS, so new Indian scam styles can be missed.
  A fake "parcel delivery fee" message gets only about 11% spam probability.
- It only looks at words, not meaning or word order.
- It doesn't check whether links are dangerous.
- English only.

**36. Can scammers fool it?**
Yes. Spelling tricks like "fr3e" or "pr!ze", or messages written in a friendly, normal style, can get past it.
Some spam in the test set was missed for this reason.

**37. How would you improve it?**
Add recent Indian scam messages to the data, check links against a phishing blacklist (Google Safe
Browsing), support Hindi/Hinglish, compare with other models such as Logistic Regression, and turn it into
a browser extension.

**38. Is the tool 100% reliable?**
No. It's a helper, not a guarantee. The website says so, and also tells users to verify with the official
company and report fraud at cybercrime.gov.in or 1930.

**39. Who wrote the code? Did you use AI tools?**
Answer honestly, following your college's rules. For example: "I used an AI assistant to help build and
explain the code, and I've gone through every part so I can explain it myself."
