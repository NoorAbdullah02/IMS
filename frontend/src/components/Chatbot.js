/**
 * BAUET IMS - Intelligence Assistant (Rule-Based Chatbot)
 * A premium, offline-first, role-aware guided assistant.
 */

import { showToast } from '../utils/toast.js';

const INTENTS = {
    common: [
        {
            keywords: ['hello', 'hi', 'hey', 'start', 'help'],
            responses: {
                any: "Greetings! I am the BAUET Intelligence Assistant. How can I facilitate your operation today?",
            },
            replies: ['General Help', 'System Navigation']
        },
        {
            keywords: ['navigation', 'how to use', 'where is'],
            responses: {
                any: "You can navigate using the operational sidebar on the left. Each module is role-restricted based on your security clearance."
            }
        }
    ],
    student: [
        {
            keywords: ['fee', 'payment', 'money', 'cost', 'dues'],
            responses: {
                student: "Semester fees are calculated based on your department. Engineering programs (ICE, CSE, EEE) are 7,00,000 BDT total, while non-engineering (BBA, LAW, English) are 4,00,000 BDT. You can check your specific status in the Finance Hub."
            },
            replies: ['Finance Hub', 'Payment Steps']
        },
        {
            keywords: ['registration', 'lock', 'deny', 'access', 'cannot register'],
            responses: {
                student: "Course registration and academic modules are locked if there are pending semester dues. Once your payment is verified by the Treasurer, your 'Academic Protocol' will automatically unlock."
            }
        },
        {
            keywords: ['how to pay', 'payment method', 'bkash', 'nagad', 'bank'],
            responses: {
                student: "To initiate a transfer, go to the Finance Hub, select your payment method, and send the amount to 01748269350. Afterwards, you must upload the transaction ID or proof for verification."
            }
        },
        {
            keywords: ['result', 'marks', 'gpa', 'grades'],
            responses: {
                student: "Results are published by your respective course instructors after departmental moderation. You can view them in the 'Exam Results' section if your financial protocol is clear."
            }
        }
    ],
    teacher: [
        {
            keywords: ['attendance', 'mark attendance', 'absent'],
            responses: {
                teacher: "To mark attendance, navigate to 'Attendance Management' in your sidebar, select the course and semester, and initiate the student registry."
            }
        },
        {
            keywords: ['upload result', 'marks entry', 'grading'],
            responses: {
                teacher: "Go to your 'Assigned Units', select the specific course, and use the 'Upload Result' module. You can either enter marks manually or upload a CSV/Excel record."
            }
        }
    ],
    treasurer: [
        {
            keywords: ['approve', 'verify', 'payment list'],
            responses: {
                treasurer: "All pending student payments appear in the 'Institutional Ledger'. Review the transaction ID and proof, then click 'Verify' to unlock the student's academic protocol."
            }
        }
    ],
    super_admin: [
        {
            keywords: ['create user', 'add student', 'add teacher'],
            responses: {
                super_admin: "User management is handled in the 'Security Core'. You can manually enroll students or faculty and assign their respective governance roles."
            }
        }
    ]
};

class ChatbotWidget {
    constructor(user) {
        this.user = user;
        this.isOpen = false;
        this.messages = [];
        this.container = null;
        this.init();
    }

    init() {
        // Create element
        this.container = document.createElement('div');
        this.container.id = 'chatbot-widget';
        this.container.className = 'fixed bottom-8 right-8 z-[500] flex flex-col items-end print:hidden';
        document.body.appendChild(this.container);
        this.render();

        // Add initial welcome message
        setTimeout(() => {
            this.addMessage(`System Initialized. Welcome, ${this.user.name}. How may I assist your ${this.user.role} profile?`, 'bot');
        }, 1000);
    }

    toggle() {
        this.isOpen = !this.isOpen;
        this.render();
        if (this.isOpen) {
            setTimeout(() => {
                const input = document.getElementById('chat-input');
                if (input) input.focus();
                this.scrollToBottom();
            }, 100);
        }
    }

    addMessage(text, sender = 'user', quickReplies = []) {
        const msg = {
            text,
            sender,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            replies: quickReplies
        };
        this.messages.push(msg);
        this.render();
        this.scrollToBottom();

        if (sender === 'user') {
            this.showTypingIndicator();
            setTimeout(() => {
                this.handleSearch(text);
            }, 800);
        }
    }

    showTypingIndicator() {
        const chatWindow = document.getElementById('chat-messages');
        if (!chatWindow) return;

        const typingDiv = document.createElement('div');
        typingDiv.id = 'typing-indicator';
        typingDiv.className = 'flex space-x-2 p-4 bg-white/5 backdrop-blur-md rounded-2xl w-max self-start mb-4 animate-pulse';
        typingDiv.innerHTML = `
            <div class="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></div>
            <div class="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
            <div class="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
        `;
        chatWindow.appendChild(typingDiv);
        this.scrollToBottom();
    }

    handleSearch(input) {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) indicator.remove();

        const query = input.toLowerCase();
        let found = false;

        // Check Role-Specific and Common Intents
        const categories = ['common', this.user.role];

        for (const cat of categories) {
            if (!INTENTS[cat]) continue;

            for (const intent of INTENTS[cat]) {
                if (intent.keywords.some(kw => query.includes(kw))) {
                    const response = intent.responses[this.user.role] || intent.responses.any;
                    if (response) {
                        this.addMessage(response, 'bot', intent.replies || []);
                        found = true;
                        break;
                    }
                }
            }
            if (found) break;
        }

        if (!found) {
            this.addMessage("I apologize, but that query is not within my current logic parameters. Try asking about finance, attendance, results, or navigation.", 'bot', ['General Help', 'Finance Hub']);
        }
    }

    scrollToBottom() {
        const chatWindow = document.getElementById('chat-messages');
        if (chatWindow) {
            chatWindow.scrollTop = chatWindow.scrollHeight;
        }
    }

    render() {
        this.container.innerHTML = `
            <!-- Chat Window -->
            <div id="chat-window" class="${this.isOpen ? 'flex' : 'hidden'} flex-col w-[calc(100vw-2rem)] sm:w-[380px] h-[70vh] sm:h-[550px] bg-slate-950/80 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.4)] overflow-hidden mb-6 animate-scaleIn origin-bottom-right">
                <!-- Header -->
                <div class="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 p-6 border-b border-white/5 flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                        <div class="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
                            <ion-icon name="rocket" class="text-xl text-white"></ion-icon>
                        </div>
                        <div>
                            <h4 class="text-sm font-black text-white uppercase tracking-widest">IMS Assistant</h4>
                            <div class="flex items-center space-x-1.5 mt-0.5">
                                <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                                <span class="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Neural Sync Active</span>
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center space-x-3">
                        <button id="reset-chat" class="text-slate-500 hover:text-indigo-400 transition-all text-xl" title="Reset Protocol">
                            <ion-icon name="refresh-outline"></ion-icon>
                        </button>
                        <button id="close-chat" class="text-slate-500 hover:text-white transition-all text-2xl">
                            <ion-icon name="close-outline"></ion-icon>
                        </button>
                    </div>
                </div>

                <!-- Messages -->
                <div id="chat-messages" class="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar flex flex-col">
                    ${this.messages.map(msg => `
                        <div class="flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} animate-fadeIn">
                            <div class="max-w-[85%] ${msg.sender === 'user' ? 'bg-indigo-600' : 'bg-white/5'} p-4 rounded-2xl ${msg.sender === 'user' ? 'rounded-tr-none' : 'rounded-tl-none'} border ${msg.sender === 'user' ? 'border-indigo-500/50' : 'border-white/5'} shadow-xl">
                                <p class="text-xs ${msg.sender === 'user' ? 'text-white' : 'text-slate-300'} leading-relaxed font-semibold">${msg.text}</p>
                            </div>
                            <span class="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-2 px-1">${msg.timestamp}</span>
                            
                            <!-- Quick Replies -->
                            ${msg.replies && msg.replies.length > 0 ? `
                                <div class="flex flex-wrap gap-2 mt-4">
                                    ${msg.replies.map(r => `
                                        <button class="quick-reply-btn px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[9px] font-black text-indigo-400 uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all">
                                            ${r}
                                        </button>
                                    `).join('')}
                                </div>
                            ` : ''}
                        </div>
                    `).join('')}
                </div>

                <!-- Input -->
                <div class="p-6 bg-black/20 border-t border-white/5">
                    <form id="chat-form" class="relative">
                        <input type="text" id="chat-input" 
                            class="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-all pr-12 font-semibold"
                            placeholder="Quantum query entry...">
                        <button type="submit" class="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center text-white hover:bg-indigo-500 transition-all shadow-lg active:scale-90">
                            <ion-icon name="send-sharp"></ion-icon>
                        </button>
                    </form>
                </div>
            </div>

            <!-- Toggle Button -->
            <button id="chatbot-toggle" class="group relative w-16 h-16 bg-gradient-to-tr ${this.isOpen ? 'from-rose-600 to-rose-500' : 'from-indigo-600 to-purple-600'} rounded-[1.8rem] flex items-center justify-center shadow-2xl transition-all hover:scale-110 active:scale-90 border-4 border-white/10 overflow-hidden">
                <div class="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-all"></div>
                <ion-icon name="${this.isOpen ? 'close' : 'chatbox-ellipses'}" class="text-3xl text-white relative z-10"></ion-icon>
            </button>
        `;

        this.bindEvents();
    }

    bindEvents() {
        const toggle = document.getElementById('chatbot-toggle');
        const close = document.getElementById('close-chat');
        const reset = document.getElementById('reset-chat');
        const form = document.getElementById('chat-form');
        const input = document.getElementById('chat-input');
        const quickBtns = document.querySelectorAll('.quick-reply-btn');

        if (toggle) toggle.addEventListener('click', () => this.toggle());
        if (close) close.addEventListener('click', () => this.toggle());
        if (reset) {
            reset.addEventListener('click', () => {
                this.messages = [];
                this.addMessage(`Protocol Reset. How can I assist you now, ${this.user.name}?`, 'bot');
            });
        }

        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const val = input.value.trim();
                if (val) {
                    this.addMessage(val, 'user');
                    input.value = '';
                }
            });
        }

        quickBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const val = btn.innerText.trim();
                this.addMessage(val, 'user');
            });
        });
    }
}

export default ChatbotWidget;
