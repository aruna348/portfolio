/* ===============================
   SCROLL FRAME ANIMATION
================================ */

const frameCount = 240;
const canvas = document.getElementById("animationCanvas");
const context = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const currentFrame = index =>
  `frames/ezgif-frame-${String(index).padStart(3, '0')}.jpg`;

const images = [];
const imageSeq = { frame: 1 };

for (let i = 1; i <= frameCount; i++) {
  const img = new Image();
  img.src = currentFrame(i);
  images.push(img);
}

images[0].onload = () => {
  context.drawImage(images[0], 0, 0, canvas.width, canvas.height);
};

window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY;
  const maxScroll = document.body.scrollHeight - window.innerHeight;
  const scrollFraction = scrollTop / maxScroll;
  const frameIndex = Math.min(
    frameCount - 1,
    Math.floor(scrollFraction * frameCount)
  );

  requestAnimationFrame(() => {
    context.drawImage(images[frameIndex], 0, 0, canvas.width, canvas.height);
  });
});


/* ===============================
   GEMINI CHATBOT
================================ */

const API_KEY = "YOUR_GEMINI_API_KEY";  // 🔴 Replace with your key

const SYSTEM_PROMPT = `
You are a resume assistant chatbot.

STRICT RULES:
1. Answer ONLY using the information inside the uploaded resume.
2. If the answer is not found in the resume, reply:
   "This information is not available in the resume."
3. Do not generate extra information.
4. Do not assume or fabricate.
5. Keep answers concise and professional.

Resume Content:
Aruna Devi M
Aspiring Embedded Systems Engineer
CGPA: 7.95
10th: 100%
12th: 91%
Internship: Industrial Automation and Embedded Systems - Emertxe
Project: Anti-Sleep Alarm Glass
Skills: Embedded Systems, Microcontrollers, Industrial Automation, Circuit Analysis, Electronics Fundamentals, C Programming, Embedded C
Soft Skills: Quick Learner, Analytical Thinking, Strong Academic Discipline, Team Collaboration
`;

async function sendMessage() {
  const input = document.getElementById("userInput");
  const chatBody = document.getElementById("chatBody");
  const userText = input.value;

  if (!userText) return;

  chatBody.innerHTML += `<p><strong>You:</strong> ${userText}</p>`;
  input.value = "";

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: SYSTEM_PROMPT + "\n\nUser Question: " + userText }]
        }]
      })
    }
  );

  const data = await response.json();
  const botReply = data.candidates?.[0]?.content?.parts?.[0]?.text 
    || "Error fetching response.";

  chatBody.innerHTML += `<p><strong>Bot:</strong> ${botReply}</p>`;
  chatBody.scrollTop = chatBody.scrollHeight;
}
