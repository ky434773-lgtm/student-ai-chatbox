# 🎓 EduPulse AI — Student Support & Advisory Hub

![EduPulse AI Banner](assets/mascot.jpg)

**EduPulse AI** is a 24/7 University Student Support Chatbot powered by Google's **Gemini API** (`gemini-3.6-flash`). It is designed to assist university and college students with academic advising, course registration, tuition payment plans, financial aid, IT password resets, campus library bookings, and document/syllabus analysis.

---

## 🌟 Key Features

### 1. 🤖 Gemini API Integration (`gemini-3.6-flash`)
- **Live AI Conversations**: Integrated with Google's latest `gemini-3.6-flash` model.
- **Model Switcher**: Easily switch between `gemini-3.6-flash`, `gemini-3.5-flash-lite`, and `gemini-3.1-pro-preview` in the settings menu.
- **Secure API Key Management**: API keys are saved locally in browser `localStorage`.
- **Zero-Latency Smart Demo Mode**: Works 100% out-of-the-box even without an API key using built-in student advisory fallback responses.

### 2. 📎 Document & Syllabus Upload Support
- **File Uploads**: Students can attach course syllabi, assignment guidelines, transcripts, text files (`.txt`, `.pdf`, `.md`, `.csv`, `.json`), or images.
- **AI Document Analysis**: The AI reads uploaded document content and provides key summaries, deadline extraction, or answers specific questions about the file.

### 3. 🎓 Categorized Student FAQ & Service Directory
Pre-configured quick-access cards and suggestion chips for:
- 🎓 **Academic Advising**: Course registration add/drop steps, transcript requests, Dean's list GPA requirements.
- 💳 **Tuition & Financial Aid**: Payment deadlines, 4-month deferred payment plans, FAFSA filing & scholarship applications.
- 💻 **IT & Technical Support**: Self-service password resets, Eduroam Wi-Fi setup, free Microsoft 365 & MATLAB downloads.
- 📚 **Library Services**: Library operating hours, quiet study commons, group room reservations.
- 🏠 **Campus Housing & Life**: Residence hall applications, dining flex plans.

### 4. 📞 Interactive Campus Office Directory
- Quick popup modal featuring emails, phone numbers, locations, and operating hours for:
  - Office of the Registrar
  - Financial Aid & Scholarships
  - Campus IT & Help Desk
  - University Library Services
  - Student Health & Wellness Center

### 5. 🎨 Premium UI & Accessibility
- **Ultra-Modern Dark Glassmorphic Design**: Customized CSS design system with indigo/cyan neon ambient lighting.
- **3D AI Mascot Avatar**: Custom futuristic robot advisor graphic.
- **Markdown & Code Syntax Highlighting**: Rich response rendering for step-by-step numbers, bold text, blockquotes, and code blocks.
- **🔊 Text-to-Speech (TTS)**: One-click voice playback for visually impaired students.
- **📥 Transcript Export**: Download conversation history as a formatted `.txt` transcript.
- **👍/👎 Helpful Feedback**: Quick rating buttons on bot responses.

---

## 📁 Project Structure

```
student-ai-chatbox/
├── index.html              # Main HTML dashboard layout, modals, & chat timeline
├── css/
│   └── styles.css          # Glassmorphism, animations, responsive breakpoints
├── js/
│   ├── config.js           # Student FAQs, campus directory, system prompt config
│   ├── gemini.js           # Gemini API REST client & fallback knowledge engine
│   ├── ui.js               # Markdown parser, speech synthesis, toast notifications
│   └── app.js              # Event controller, file upload handler, history exporter
├── assets/
│   ├── mascot.jpg          # 3D AI Robot Student Support Mascot Avatar
│   └── student.jpg         # Modern Student Profile Avatar
├── server.py               # Lightweight Python HTTP server runner
└── README.md               # Complete project documentation
```

---

## 🚀 Quick Start Guide

### Prerequisites
- Any modern web browser (Google Chrome, Microsoft Edge, Firefox, Safari).
- Python 3.x (optional, for running the local server).

### Running Locally

1. **Clone or Open the Project Folder**:
   ```bash
   cd student-ai-chatbox
   ```

2. **Start the Local Web Server**:
   ```bash
   python server.py
   ```

3. **Open in Browser**:
   Navigate to **`http://localhost:8000`** in your browser.

*Alternative*: You can also simply double-click **`index.html`** in File Explorer to open it directly in your browser!

---

## 🔑 Adding Your Gemini API Key

1. Get a free API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Open the app in your browser (`http://localhost:8000`).
3. Click the **Gear icon (⚙️)** in the sidebar.
4. Paste your Gemini API Key and click **Save Preferences**.
5. The top status badge will turn green: **`Gemini 3.6 Flash Active`**!

---

## 📝 Customizing FAQs & Campus Information

To customize university names, phone numbers, or add your own custom student questions:

1. Open [`js/config.js`](js/config.js) in your code editor.
2. Edit the `directory` array to update phone numbers, emails, and office hours.
3. Edit the `categories` array to add your own custom student questions and answer templates.

---

## 🌐 Free Online Deployment

### Deploying to Netlify (1-Minute Drag & Drop)
1. Go to **[app.netlify.com/drop](https://app.netlify.com/drop)**.
2. Drag and drop the `student-ai-chatbox` folder onto the webpage.
3. Your student support AI chatbot is instantly live online!

---

## 📄 License
Distributed under the MIT License. Free for academic, personal, and commercial use.
