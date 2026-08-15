/**
 * UI Renderer & Interactions for EduPulse AI
 */

class UIManager {
    constructor() {
        this.messagesContainer = document.getElementById("messages-container");
        this.chatInput = document.getElementById("chat-input");
        this.sendBtn = document.getElementById("send-btn");
        this.sidebar = document.getElementById("sidebar");

        this.speechSynth = window.speechSynthesis || null;
    }

    /**
     * Renders basic Markdown formatting to clean HTML safely
     */
    parseMarkdown(text) {
        if (!text) return "";
        let html = text
            // Code blocks
            .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
            // Headers
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/^## (.*$)/gim, '<h3>$1</h3>')
            .replace(/^# (.*$)/gim, '<h3>$1</h3>')
            // Bold
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            // Italic
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            // Inline code
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            // Blockquote
            .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
            // Bullet points
            .replace(/^\- (.*$)/gim, '<li>$1</li>')
            .replace(/^\* (.*$)/gim, '<li>$1</li>')
            // Numbers
            .replace(/^\d+\. (.*$)/gim, '<li>$1</li>')
            // Links
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

        // Wrap li tags in ul
        html = html.replace(/(<li>[\s\S]*?<\/li>)/g, '<ul>$1</ul>');
        // Clean double uls
        html = html.replace(/<\/ul>\s*<ul>/g, '');

        // Paragraph breaks
        return html.split('\n\n').map(p => {
            if (p.startsWith('<h3') || p.startsWith('<blockquote') || p.startsWith('<ul') || p.startsWith('<pre')) {
                return p;
            }
            return `<p>${p}</p>`;
        }).join('');
    }

    /**
     * Appends user or bot message bubble to the chat timeline
     */
    appendMessage(role, text, isStream = false) {
        const messageRow = document.createElement("div");
        messageRow.className = `message-row ${role}`;
        
        const avatarUrl = role === "user" ? "assets/student.jpg" : "assets/mascot.jpg";

        const messageId = `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

        const parsedContent = this.parseMarkdown(text);

        messageRow.innerHTML = `
            <img src="${avatarUrl}" alt="${role}" class="message-avatar">
            <div class="message-content-box">
                <div class="message-bubble" id="${messageId}">${parsedContent}</div>
                ${role === "bot" ? `
                <div class="message-actions">
                    <button class="action-btn" onclick="uiManager.copyMessage('${messageId}')" title="Copy response">
                        <i class="fa-regular fa-copy"></i> Copy
                    </button>
                    <button class="action-btn" onclick="uiManager.speakText('${messageId}')" title="Read Aloud">
                        <i class="fa-solid fa-volume-high"></i> Listen
                    </button>
                    <button class="action-btn" onclick="uiManager.rateHelpful(this, true)" title="Helpful">
                        <i class="fa-regular fa-thumbs-up"></i>
                    </button>
                    <button class="action-btn" onclick="uiManager.rateHelpful(this, false)" title="Not helpful">
                        <i class="fa-regular fa-thumbs-down"></i>
                    </button>
                </div>` : ""}
            </div>
        `;

        this.messagesContainer.appendChild(messageRow);
        this.scrollToBottom();

        return messageId;
    }

    /**
     * Updates an existing streaming message bubble
     */
    updateStreamMessage(messageId, text) {
        const bubble = document.getElementById(messageId);
        if (bubble) {
            bubble.innerHTML = this.parseMarkdown(text);
            this.scrollToBottom();
        }
    }

    /**
     * Shows dynamic typing indicator
     */
    showTypingIndicator() {
        const existing = document.getElementById("typing-indicator-row");
        if (existing) return;

        const indicator = document.createElement("div");
        indicator.id = "typing-indicator-row";
        indicator.className = "message-row bot";
        indicator.innerHTML = `
            <img src="assets/mascot.jpg" alt="AI Mascot" class="message-avatar">
            <div class="typing-indicator">
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
            </div>
        `;

        this.messagesContainer.appendChild(indicator);
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        const existing = document.getElementById("typing-indicator-row");
        if (existing) existing.remove();
    }

    scrollToBottom() {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    /**
     * Copies message text to clipboard
     */
    copyMessage(elementId) {
        const el = document.getElementById(elementId);
        if (el) {
            navigator.clipboard.writeText(el.innerText).then(() => {
                this.showToast("Copied to clipboard!");
            });
        }
    }

    /**
     * Text-To-Speech audio reader
     */
    speakText(elementId) {
        if (!this.speechSynth) {
            this.showToast("Text-to-Speech not supported in your browser.");
            return;
        }

        if (this.speechSynth.speaking) {
            this.speechSynth.cancel();
            this.showToast("Speech stopped.");
            return;
        }

        const el = document.getElementById(elementId);
        if (el) {
            const utterance = new SpeechSynthesisUtterance(el.innerText);
            utterance.rate = 1.0;
            utterance.pitch = 1.0;
            this.speechSynth.speak(utterance);
            this.showToast("Reading aloud...");
        }
    }

    rateHelpful(btn, isPositive) {
        btn.style.color = isPositive ? "#10b981" : "#ef4444";
        this.showToast(isPositive ? "Thanks for your positive feedback!" : "Feedback recorded.");
    }

    /**
     * Displays non-intrusive toast messages
     */
    showToast(message) {
        const container = document.getElementById("toast-container");
        const toast = document.createElement("div");
        toast.className = "toast";
        toast.innerHTML = `<i class="fa-solid fa-circle-info" style="color:#6366f1;"></i> <span>${message}</span>`;
        container.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    /**
     * Renders Quick FAQ Pills Grid on initial welcome
     */
    renderQuickTopics() {
        const container = document.getElementById("quick-topics-grid");
        if (!container) return;

        container.innerHTML = "";

        CONFIG.categories.forEach(cat => {
            cat.faqs.forEach(faq => {
                const chip = document.createElement("div");
                chip.className = "topic-chip";
                chip.onclick = () => window.app.handleQuery(faq.prompt);

                chip.innerHTML = `
                    <div class="topic-icon" style="background: ${cat.color}22; color: ${cat.color};">
                        <i class="fa-solid ${cat.icon}"></i>
                    </div>
                    <div class="topic-info">
                        <h5>${cat.name}</h5>
                        <p>${faq.q}</p>
                    </div>
                `;
                container.appendChild(chip);
            });
        });
    }

    renderDirectoryModal() {
        const container = document.getElementById("directory-modal-list");
        if (!container) return;

        container.innerHTML = CONFIG.directory.map(dept => `
            <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--glass-border); border-radius: 12px; padding: 14px; margin-bottom: 12px;">
                <h4 style="color: #a5b4fc; margin-bottom: 4px; font-size: 1rem;">${dept.name}</h4>
                <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 8px;">${dept.description}</p>
                <div style="font-size: 0.8rem; color: #cbd5e1; display: grid; gap: 4px;">
                    <div>📧 <strong>Email:</strong> <a href="mailto:${dept.email}" style="color: #38bdf8;">${dept.email}</a></div>
                    <div>☎️ <strong>Phone:</strong> ${dept.phone}</div>
                    <div>⏱️ <strong>Hours:</strong> ${dept.hours}</div>
                    <div>📍 <strong>Location:</strong> ${dept.location}</div>
                </div>
            </div>
        `).join('');
    }
}

window.uiManager = new UIManager();
