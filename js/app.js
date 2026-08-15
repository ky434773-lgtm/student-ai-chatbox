/**
 * Main Application Controller for EduPulse AI Student Support
 */

class App {
    constructor() {
        this.isProcessing = false;
        this.attachedFile = null;
        this.init();
    }

    init() {
        // Initialize UI components
        window.uiManager.renderQuickTopics();
        window.uiManager.renderDirectoryModal();
        this.updateApiBadgeStatus();

        // Event Listeners
        const chatInput = document.getElementById("chat-input");
        const sendBtn = document.getElementById("send-btn");
        const attachBtn = document.getElementById("attach-btn");
        const fileInput = document.getElementById("file-input");
        const removeFileBtn = document.getElementById("remove-attachment-btn");

        chatInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                this.submitInput();
            }
        });

        sendBtn.addEventListener("click", () => this.submitInput());

        if (attachBtn && fileInput) {
            attachBtn.addEventListener("click", () => fileInput.click());
            fileInput.addEventListener("change", (e) => this.handleFileSelected(e));
        }

        if (removeFileBtn) {
            removeFileBtn.addEventListener("click", () => this.clearAttachment());
        }

        // Model selector in settings
        const modelSelect = document.getElementById("settings-model");
        if (modelSelect) {
            modelSelect.innerHTML = CONFIG.availableModels.map(m => 
                `<option value="${m.id}" ${m.id === window.geminiService.selectedModel ? "selected" : ""}>${m.name}</option>`
            ).join('');
        }

        // Fill current API Key in modal input if exists
        const keyInput = document.getElementById("settings-api-key");
        if (keyInput) {
            keyInput.value = window.geminiService.getApiKey();
        }
    }

    handleFileSelected(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target.result;
            this.attachedFile = {
                name: file.name,
                size: this.formatFileSize(file.size),
                type: file.type,
                content: content
            };

            // Update UI preview bar
            const bar = document.getElementById("file-attachment-bar");
            const nameEl = document.getElementById("attachment-name");
            const sizeEl = document.getElementById("attachment-size");

            if (bar && nameEl && sizeEl) {
                nameEl.textContent = file.name;
                sizeEl.textContent = `(${this.attachedFile.size})`;
                bar.style.display = "flex";
            }

            window.uiManager.showToast(`Document "${file.name}" attached!`);
        };

        // Read plain text / markdown / csv / json files as text
        if (file.type.startsWith("image/")) {
            reader.readAsDataURL(file);
        } else {
            reader.readAsText(file);
        }
    }

    clearAttachment() {
        this.attachedFile = null;
        const bar = document.getElementById("file-attachment-bar");
        const fileInput = document.getElementById("file-input");
        if (bar) bar.style.display = "none";
        if (fileInput) fileInput.value = "";
    }

    formatFileSize(bytes) {
        if (bytes < 1024) return bytes + " B";
        else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
        else return (bytes / 1048576).toFixed(1) + " MB";
    }

    async submitInput() {
        const inputEl = document.getElementById("chat-input");
        let query = inputEl.value.trim();
        if ((!query && !this.attachedFile) || this.isProcessing) return;

        if (!query && this.attachedFile) {
            query = `Please review and summarize key information from the attached document "${this.attachedFile.name}".`;
        }

        const fileToPass = this.attachedFile;
        inputEl.value = "";
        this.clearAttachment();

        await this.handleQuery(query, fileToPass);
    }

    async handleQuery(query, attachedFile = null) {
        if (this.isProcessing) return;
        this.isProcessing = true;

        // Hide welcome hero on first message
        const welcomeCard = document.getElementById("welcome-card");
        if (welcomeCard) welcomeCard.style.display = "none";
        const quickTopics = document.getElementById("quick-topics-section");
        if (quickTopics) quickTopics.style.display = "none";

        // 1. Render User Message with attached file badge if present
        let displayQuery = query;
        if (attachedFile) {
            displayQuery = `📎 **[Attached Document: ${attachedFile.name} (${attachedFile.size})]**\n\n${query}`;
        }
        window.uiManager.appendMessage("user", displayQuery);

        // 2. Show Typing indicator
        window.uiManager.showTypingIndicator();

        // 3. Render Bot Response Placeholder
        let botMsgId = null;

        try {
            await window.geminiService.sendMessage(query, attachedFile, (partialText) => {
                if (!botMsgId) {
                    window.uiManager.hideTypingIndicator();
                    botMsgId = window.uiManager.appendMessage("bot", partialText, true);
                } else {
                    window.uiManager.updateStreamMessage(botMsgId, partialText);
                }
            });
        } catch (err) {
            window.uiManager.hideTypingIndicator();
            window.uiManager.appendMessage("bot", `❌ Error processing request: ${err.message}`);
        } finally {
            this.isProcessing = false;
        }
    }

    updateApiBadgeStatus() {
        const badge = document.getElementById("api-status-badge");
        if (!badge) return;

        const hasKey = !!window.geminiService.getApiKey();
        if (hasKey) {
            badge.className = "api-badge";
            badge.innerHTML = `<i class="fa-solid fa-bolt"></i> <span>Gemini 3.6 Flash Active</span>`;
        } else {
            badge.className = "api-badge no-key";
            badge.innerHTML = `<i class="fa-solid fa-circle-question"></i> <span>Demo Mode (Click to Add Key)</span>`;
        }
    }

    saveSettings() {
        const keyInput = document.getElementById("settings-api-key");
        const modelSelect = document.getElementById("settings-model");

        if (keyInput) {
            window.geminiService.setApiKey(keyInput.value);
        }
        if (modelSelect) {
            window.geminiService.setModel(modelSelect.value);
        }

        this.updateApiBadgeStatus();
        this.toggleModal("settings-modal", false);
        window.uiManager.showToast("Settings saved successfully!");
    }

    toggleModal(modalId, show = true) {
        const modal = document.getElementById(modalId);
        if (modal) {
            if (show) modal.classList.add("active");
            else modal.classList.remove("active");
        }
    }

    toggleSidebar() {
        const sidebar = document.getElementById("sidebar");
        if (sidebar) {
            sidebar.classList.toggle("open");
        }
    }

    clearChat() {
        if (confirm("Are you sure you want to clear conversation history?")) {
            window.geminiService.clearHistory();
            const container = document.getElementById("messages-container");
            container.innerHTML = `
                <div class="welcome-card" id="welcome-card">
                    <img src="assets/mascot.jpg" alt="EduPulse AI Mascot" class="welcome-avatar">
                    <div class="welcome-content">
                        <h3>Hi! I'm EduPulse AI 👋</h3>
                        <p>Your 24/7 University Student Support Advisor. How can I help you excel today?</p>
                    </div>
                </div>
                <div class="quick-topics-section" id="quick-topics-section">
                    <h4 class="sidebar-section-title">Frequently Asked Student Topics</h4>
                    <div class="topics-grid" id="quick-topics-grid"></div>
                </div>
            `;
            window.uiManager.renderQuickTopics();
            window.uiManager.showToast("Chat cleared.");
        }
    }

    exportHistory() {
        const history = window.geminiService.history;
        if (history.length === 0) {
            window.uiManager.showToast("No chat history to export.");
            return;
        }

        let content = `EduPulse AI - Student Support Transcript\nExported on: ${new Date().toLocaleString()}\n\n` + "=".repeat(50) + "\n\n";

        history.forEach(turn => {
            const speaker = turn.role === "user" ? "STUDENT" : "EDUPULSE AI";
            content += `[${speaker}]:\n${turn.parts[0].text}\n\n` + "-".repeat(30) + "\n\n";
        });

        const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `EduPulse_Support_Transcript_${Date.now()}.txt`;
        a.click();
        URL.revokeObjectURL(url);
        window.uiManager.showToast("Transcript downloaded!");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    window.app = new App();
});
