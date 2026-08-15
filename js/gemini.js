/**
 * Gemini API Integration for EduPulse Student Support AI
 */

class GeminiService {
    constructor() {
        this.apiKey = localStorage.getItem("EDUPULSE_GEMINI_KEY") || "";
        this.selectedModel = localStorage.getItem("EDUPULSE_GEMINI_MODEL") || CONFIG.defaultModel;
        this.history = [];
    }

    setApiKey(key) {
        this.apiKey = key.trim();
        if (this.apiKey) {
            localStorage.setItem("EDUPULSE_GEMINI_KEY", this.apiKey);
        } else {
            localStorage.removeItem("EDUPULSE_GEMINI_KEY");
        }
    }

    getApiKey() {
        return this.apiKey;
    }

    setModel(modelId) {
        this.selectedModel = modelId;
        localStorage.setItem("EDUPULSE_GEMINI_MODEL", modelId);
    }

    clearHistory() {
        this.history = [];
    }

    /**
     * Sends a query to the Gemini API using gemini-3.6-flash REST endpoint
     * Accepts optional document/file attachment
     */
    async sendMessage(userInput, attachedFile = null, onChunkCallback = null) {
        // Handle callback signature flexibility
        if (typeof attachedFile === "function") {
            onChunkCallback = attachedFile;
            attachedFile = null;
        }

        let fullPrompt = userInput;
        let partsArray = [];

        if (attachedFile) {
            if (attachedFile.type && attachedFile.type.startsWith("image/") && attachedFile.content.includes("base64,")) {
                const base64Data = attachedFile.content.split("base64,")[1];
                partsArray = [
                    { inline_data: { mime_type: attachedFile.type, data: base64Data } },
                    { text: userInput }
                ];
                fullPrompt = `[Attached Image: ${attachedFile.name}]\n` + userInput;
            } else {
                fullPrompt = `[Attached Document: ${attachedFile.name} (${attachedFile.size})]\n--- FILE CONTENT START ---\n${attachedFile.content.substring(0, 15000)}\n--- FILE CONTENT END ---\n\nStudent Question: ${userInput}`;
                partsArray = [{ text: fullPrompt }];
            }
        } else {
            partsArray = [{ text: userInput }];
        }

        // Track user turn in history
        this.history.push({ role: "user", parts: partsArray });

        // If no API key is provided, use high-speed intelligent Fallback Knowledge Base Engine
        if (!this.apiKey) {
            const fallbackResponse = this.generateFallbackAnswer(userInput, attachedFile);
            this.history.push({ role: "model", parts: [{ text: fallbackResponse }] });
            
            // Simulate natural typing stream effect
            if (onChunkCallback) {
                await this.simulateStream(fallbackResponse, onChunkCallback);
            }
            return fallbackResponse;
        }

        // Live API call to Gemini API
        try {
            const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${this.selectedModel}:generateContent?key=${this.apiKey}`;

            const systemInstructionContent = {
                parts: [{ text: CONFIG.systemPrompt }]
            };

            const payload = {
                system_instruction: systemInstructionContent,
                contents: this.history,
                generationConfig: {
                    temperature: 0.7,
                    topP: 0.95,
                    maxOutputTokens: 2048
                }
            };

            const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                const msg = errData?.error?.message || `API Error: ${response.status} ${response.statusText}`;
                throw new Error(msg);
            }

            const data = await response.json();
            const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

            if (!textResponse) {
                throw new Error("No response content generated from Gemini API.");
            }

            // Push model turn to history
            this.history.push({ role: "model", parts: [{ text: textResponse }] });

            if (onChunkCallback) {
                await this.simulateStream(textResponse, onChunkCallback);
            }

            return textResponse;
        } catch (error) {
            console.warn("Gemini API call failed, reverting to intelligent Student Support KB fallback:", error);
            const notice = `> ⚠️ **Gemini API Note**: *${error.message}*\n\nUsing fallback University Knowledge Base:\n\n` + this.generateFallbackAnswer(userInput);
            
            this.history.push({ role: "model", parts: [{ text: notice }] });
            if (onChunkCallback) {
                await this.simulateStream(notice, onChunkCallback);
            }
            return notice;
        }
    }

    /**
     * Simulates natural token streaming effect for smooth UX
     */
    async simulateStream(fullText, callback) {
        const words = fullText.split(" ");
        let currentText = "";
        const chunkSize = Math.max(1, Math.floor(words.length / 30));
        
        for (let i = 0; i < words.length; i += chunkSize) {
            currentText += (i === 0 ? "" : " ") + words.slice(i, i + chunkSize).join(" ");
            callback(currentText);
            await new Promise(res => setTimeout(res, 25));
        }
        callback(fullText);
    }

    /**
     * Fallback Knowledge Engine for instantly resolving student questions when offline/no API Key
     */
    generateFallbackAnswer(query, attachedFile = null) {
        if (attachedFile) {
            return `### 📄 Document Analysis Summary: \`${attachedFile.name}\`

**File Details**: ${attachedFile.name} (${attachedFile.size})

**Attached Content Preview**:
> *"${attachedFile.content ? attachedFile.content.substring(0, 300).replace(/\n/g, ' ') + '...' : 'Binary/Image content received.'}"*

---

#### 💡 Student Advisory Analysis:
1. **Document Identified**: I have processed your uploaded file **\`${attachedFile.name}\`**.
2. **Actionable Next Steps**:
   - For **Course Syllabi**: Check assignment due dates, office hours, and grading rubrics.
   - For **Transcripts / Forms**: Verify official registrar stamps and course ID codes.
   - For **Financial Aid Statements**: Cross-reference payment deadlines with the Financial Aid Office.

> 🔑 **Tip**: To ask deep custom questions directly about this uploaded document, add your **Gemini API Key** in the top-right Settings (⚙️) menu!`;
        }

        const cleanQuery = query.toLowerCase();

        // 1. Direct match in FAQ list
        for (const cat of CONFIG.categories) {
            for (const faq of cat.faqs) {
                if (cleanQuery.includes(faq.q.toLowerCase()) || cleanQuery.includes(cat.name.toLowerCase())) {
                    return faq.answer;
                }
            }
        }

        // 2. Keyword based matching
        if (cleanQuery.includes("register") || cleanQuery.includes("add") || cleanQuery.includes("drop") || cleanQuery.includes("course") || cleanQuery.includes("class")) {
            return CONFIG.categories[0].faqs[0].answer;
        }
        if (cleanQuery.includes("transcript") || cleanQuery.includes("gpa") || cleanQuery.includes("grade")) {
            return CONFIG.categories[0].faqs[1].answer;
        }
        if (cleanQuery.includes("tuition") || cleanQuery.includes("pay") || cleanQuery.includes("fee") || cleanQuery.includes("bill") || cleanQuery.includes("due")) {
            return CONFIG.categories[1].faqs[0].answer;
        }
        if (cleanQuery.includes("scholarship") || cleanQuery.includes("fafsa") || cleanQuery.includes("financial aid") || cleanQuery.includes("grant")) {
            return CONFIG.categories[1].faqs[1].answer;
        }
        if (cleanQuery.includes("wifi") || cleanQuery.includes("wi-fi") || cleanQuery.includes("password") || cleanQuery.includes("portal") || cleanQuery.includes("login")) {
            return CONFIG.categories[2].faqs[0].answer;
        }
        if (cleanQuery.includes("software") || cleanQuery.includes("office") || cleanQuery.includes("download") || cleanQuery.includes("matlab")) {
            return CONFIG.categories[2].faqs[1].answer;
        }
        if (cleanQuery.includes("library") || cleanQuery.includes("book") || cleanQuery.includes("study room") || cleanQuery.includes("hours")) {
            return CONFIG.categories[3].faqs[0].answer;
        }
        if (cleanQuery.includes("housing") || cleanQuery.includes("dorm") || cleanQuery.includes("dining") || cleanQuery.includes("meal plan")) {
            return CONFIG.categories[4].faqs[0].answer;
        }
        if (cleanQuery.includes("contact") || cleanQuery.includes("phone") || cleanQuery.includes("email") || cleanQuery.includes("office") || cleanQuery.includes("department")) {
            let info = "### 📞 University Campus Directory\n\nHere are key contacts for student services:\n\n";
            CONFIG.directory.forEach(d => {
                info += `- **${d.name}**: 📧 \`${d.email}\` | ☎️ \`${d.phone}\` | 📍 ${d.location}\n`;
            });
            return info;
        }

        // Generic intelligent fallback
        return `### 🎓 EduPulse Student Support

Thank you for reaching out! Here is how I can assist you:

- 🎓 **Academic Advising**: Course registration, add/drop deadlines, transcripts & GPA honors.
- 💳 **Tuition & Financial Aid**: Fee deadlines, 4-month payment plans, FAFSA & scholarships.
- 💻 **IT Help Desk**: Password resets, Eduroam Wi-Fi, free Microsoft 365 software.
- 📚 **Library & Facilities**: Group study room reservations & library operating hours.
- 🏠 **Campus Housing**: Dorm applications & dining flex plans.

> 💡 **Tip**: Enter your **Gemini API Key** in the top-right Settings (⚙️) menu to unlock full AI conversation capabilities with \`gemini-3.6-flash\`! Or choose one of the quick topic pills below.`;
    }
}

window.geminiService = new GeminiService();
