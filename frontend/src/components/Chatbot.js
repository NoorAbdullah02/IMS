import { showToast } from '../utils/toast.js';
import vapiService from '../services/vapiService.js';
import API from '../services/api.js';

const INTENTS = {
    common: [
        {
            keywords: ['hello', 'hi', 'hey', 'start', 'help'],
            responses: {
                any: "Greetings! I am the BAUET Intelligence Assistant powered by Vapi AI. How can I facilitate your operation today?",
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
        this.vapiInitialized = false;
        this.vapiConfig = null;
        this.vapiRetryCount = 0;
        this.vapiMaxRetries = 5;
        this.vapiRetryDelay = 2000; // Start with 2 seconds
        this.init();
    }

    async init() {
        this.container = document.createElement('div');
        this.container.id = 'chatbot-widget';
        this.container.className = 'fixed bottom-8 right-8 z-[500] flex flex-col items-end print:hidden';
        document.body.appendChild(this.container);

        this.initializeVapi();

        this.render();

        setTimeout(() => {
            this.addMessage(`Welcome, ${this.user.name}! I am your BAUET Intelligence Assistant powered by NVIDIA AI. How can I help you today? You can ask me about fees, courses, attendance, results, or use voice mode for hands-free assistance.`, 'bot', ['General Help', 'Fee Information', 'Voice Mode']);
        }, 1000);
    }

    async initializeVapi() {
        try {
            console.log('🔧 Initializing Vapi AI service...');

            const response = await API.post('/api/vapi/session', {});

            if (response.data.success) {
                this.vapiConfig = response.data;
                console.log('✅ Received Vapi config:', {
                    publicKey: this.vapiConfig.publicKey ? 'present' : 'missing',
                    assistantId: this.vapiConfig.assistantId
                });

                // Initialize Vapi service with proper error handling
                try {
                    await vapiService.init(response.data.publicKey, {
                        assistantId: response.data.assistantId
                    });

                    // Setup Vapi event listeners
                    vapiService.on('callStart', () => this.onCallStart());
                    vapiService.on('callEnd', () => this.onCallEnd());
                    vapiService.on('message', (msg) => this.onVapiMessage(msg));
                    vapiService.on('error', (error) => this.onVapiError(error));

                    this.vapiInitialized = true;
                    this.vapiRetryCount = 0; // Reset retry count on success
                    console.log('✅ Vapi AI initialized successfully');
                    showToast('Voice assistant ready', 'success');
                } catch (vapiError) {
                    console.error('❌ Failed to initialize Vapi service:', vapiError);
                    showToast('Voice assistant initialization failed: ' + vapiError.message, 'error');
                    this.scheduleVapiRetry();
                }
            } else {
                console.error('❌ Vapi session creation failed:', response.data);
                showToast('Failed to create Vapi session', 'error');
                this.scheduleVapiRetry();
            }
        } catch (error) {
            console.error('❌ Failed to initialize Vapi:', error);
            console.error('Error details:', {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data
            });
            showToast('Failed to connect to voice assistant', 'warning');
            this.scheduleVapiRetry();
        }
    }

    scheduleVapiRetry() {
        if (this.vapiRetryCount < this.vapiMaxRetries) {
            this.vapiRetryCount++;
            const delay = this.vapiRetryDelay * Math.pow(2, this.vapiRetryCount - 1); // Exponential backoff
            console.log(`Scheduling Vapi retry ${this.vapiRetryCount}/${this.vapiMaxRetries} in ${delay}ms`);

            setTimeout(() => {
                console.log(`Attempting Vapi retry ${this.vapiRetryCount}...`);
                this.initializeVapi();
            }, delay);
        } else {
            console.error('Max Vapi retries reached. Please refresh the page.');
            showToast('Vapi AI failed after multiple attempts. Please refresh.', 'error');
        }
    }

    onVapiMessage(message) {
        console.log('Vapi message received:', message);
        try {
            if (message.type === 'assistant') {
                // Assistant response from Vapi
                this.addMessage(message.content || message.text || message.message, 'bot');
            } else if (message.type === 'user') {
                // User message transcribed from voice
                this.addMessage(message.content || message.text || message.message, 'user');
            }
        } catch (error) {
            console.error('Error processing Vapi message:', error);
        }
    }

    onVapiError(error) {
        console.error('Vapi error:', error);
        console.error('Vapi error details:', {
            message: error?.message || 'Unknown error',
            type: error?.type,
            code: error?.code,
            toString: error?.toString?.()
        });
        this.addMessage('Vapi connection lost. Attempting to reconnect...', 'bot');
        showToast('Reconnecting to voice assistant...', 'info');

        // Auto-reinitialize Vapi on error
        this.vapiInitialized = false;
        this.scheduleVapiRetry();
    }

    addMessage(text, sender = 'user', quickReplies = []) {
        const msg = {
            text,
            sender,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            replies: quickReplies
        };
        this.messages.push(msg);
        this.updateMessagesDisplay();
        this.scrollToBottom();

        if (sender === 'user') {
            // Check if there's an active voice call
            const hasActiveCall = vapiService.isActive();

            if (hasActiveCall) {
                console.log('📞 Active voice call detected, sending to Vapi');
                try {
                    // Send to active voice call
                    const sent = vapiService.sendMessageViaVoiceCall(text);
                    console.log('Message to voice call result:', sent);

                    if (!sent) {
                        throw new Error('Failed to send message to voice call');
                    }
                } catch (error) {
                    console.error('❌ Failed to send message to voice call:', error);
                    this.showTypingIndicator();
                    setTimeout(() => {
                        this.handleSearch(text);
                    }, 800);
                }
            } else {
                // No active call - use text-based chat
                console.log('💬 No voice call active, using text-based chat');
                this.sendTextMessage(text);
            }
        }
    }

    /**
     * Send text message using backend chat endpoint with NVIDIA AI
     */
    async sendTextMessage(text) {
        try {
            this.showTypingIndicator();

            // Build conversation history from recent messages (last 10 for context)
            const conversationHistory = this.messages
                .slice(-10)
                .map(msg => ({
                    sender: msg.sender,
                    text: msg.text
                }));

            // Use API to send text message with conversation history
            const response = await API.post('/api/vapi/chat', {
                message: text,
                conversationHistory: conversationHistory
            });

            // Remove typing indicator
            const indicator = document.getElementById('typing-indicator');
            if (indicator) indicator.remove();

            if (response.data.success) {
                // Add AI response with quick replies from backend
                const replies = response.data.replies || ['General Help', 'Finance Hub', 'Voice Mode'];
                this.addMessage(response.data.message, 'bot', replies);
                console.log('✅ Got response from NVIDIA AI chat:', {
                    intent: response.data.intent,
                    replies: replies,
                    aiPowered: response.data.aiPowered
                });
            } else {
                throw new Error(response.data.error || 'No response received');
            }
        } catch (error) {
            console.error('❌ Text message error:', error);

            // Remove typing indicator
            const indicator = document.getElementById('typing-indicator');
            if (indicator) indicator.remove();

            // Fallback to local intent matching
            this.handleSearch(text);
        }
    }

    updateMessagesDisplay() {
        const chatMessages = document.getElementById('chat-messages');
        if (!chatMessages) return;

        chatMessages.innerHTML = this.messages.map(msg => `
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
        `).join('');

        this.attachQuickReplyListeners();
    }

    attachQuickReplyListeners() {
        setTimeout(() => {
            const quickBtns = document.querySelectorAll('.quick-reply-btn');
            console.log('Quick reply buttons found:', quickBtns.length);

            if (quickBtns && quickBtns.length > 0) {
                quickBtns.forEach((btn, index) => {
                    const oldListener = btn._quickReplyListener;
                    if (oldListener) {
                        btn.removeEventListener('click', oldListener);
                    }

                    const newListener = (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const val = btn.innerText.trim();
                        console.log('Quick reply clicked:', val);
                        if (val === 'Voice Mode') {
                            this.toggleVoiceCall();
                        } else {
                            this.addMessage(val, 'user');
                        }
                    };

                    btn._quickReplyListener = newListener;
                    btn.addEventListener('click', newListener);
                });
            }
        }, 50);
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
        try {
            const indicator = document.getElementById('typing-indicator');
            if (indicator) indicator.remove();

            const query = input.toLowerCase();
            let found = false;

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
                this.addMessage("I apologize, but that query is not within my current logic parameters. Try asking about finance, attendance, results, or navigation. Or use voice mode for more advanced assistance!", 'bot', ['General Help', 'Finance Hub', 'Voice Mode']);
            }
        } catch (error) {
            console.error('Error handling search:', error);
            this.addMessage('Error processing your request. Please try again.', 'bot');
        }
    }

    scrollToBottom() {
        const chatWindow = document.getElementById('chat-messages');
        if (chatWindow) {
            chatWindow.scrollTop = chatWindow.scrollHeight;
        }
    }

    async toggleVoiceCall() {
        try {
            console.log('Voice toggle clicked. Vapi initialized:', this.vapiInitialized, 'Vapi instance:', !!vapiService.getInstance());

            if (!this.vapiInitialized || !vapiService.getInstance()) {
                showToast('Initializing voice assistant...', 'info');
                console.log('Starting Vapi initialization...');
                await this.initializeVapi();

                await new Promise(resolve => setTimeout(resolve, 1500));

                if (!this.vapiInitialized || !vapiService.getInstance()) {
                    console.error('Vapi initialization failed after timeout');
                    showToast('Voice assistant not available. Please check console for errors.', 'error');
                    return;
                }
            }

            console.log('Vapi status - Initialized:', this.vapiInitialized, 'Call active:', vapiService.isActive());

            if (vapiService.isActive()) {
                console.log('Ending active Vapi call...');
                showToast('Ending voice call...', 'info');
                await vapiService.endCall();
                this.updateCallStatus(false);
                showToast('Voice call ended', 'success');
            } else {
                console.log('Starting new Vapi call with config:', this.vapiConfig);

                if (!this.vapiConfig || !this.vapiConfig.assistantId) {
                    console.error('Missing assistant ID:', this.vapiConfig);
                    showToast('Assistant not configured properly. Check backend response.', 'error');
                    return;
                }

                showToast('Starting voice call...', 'info');
                await vapiService.startCall(
                    this.vapiConfig.assistantId,
                    {
                        variableValues: {
                            userName: this.user.name,
                            userRole: this.user.role,
                            userEmail: this.user.email || 'user@bauet.edu.bd'
                        }
                    }
                );
                this.updateCallStatus(true);
                showToast('Voice call started - speak now!', 'success');
            }
        } catch (error) {
            console.error('Voice call error:', error);
            console.error('Error stack:', error.stack);
            showToast('Voice call error: ' + (error.message || 'Unknown error'), 'error');

            this.updateCallStatus(false);
        }
    }

    toggle() {
        this.isOpen = !this.isOpen;
        this.renderUI();
        setTimeout(() => {
            this.bindEvents();
            const input = document.getElementById('chat-input');
            if (input && this.isOpen) {
                input.focus();
            }
            this.scrollToBottom();
        }, 150);
    }

    onCallStart() {
        console.log('Voice call started');
        this.updateCallStatus(true);
    }

    onCallEnd() {
        console.log('Voice call ended');
        this.addMessage('Voice call ended. How else can I help?', 'bot');
        this.updateCallStatus(false);
    }

    updateCallStatus(isActive) {
        const statusBtn = document.getElementById('voice-toggle');
        const statusIndicator = document.querySelector('.voice-status-indicator');
        const statusText = document.querySelector('.voice-status-text');

        if (statusBtn) {
            statusBtn.innerHTML = `<ion-icon name="${isActive ? 'call' : 'mic'}"></ion-icon>`;
            statusBtn.className = `relative text-slate-500 hover:text-red-400 transition-all text-xl p-1.5 rounded-lg ${isActive ? 'bg-red-500/20 text-red-400' : 'hover:bg-white/5'} voice-toggle`;
        }

        if (statusIndicator) {
            statusIndicator.className = `w-1.5 h-1.5 ${isActive ? 'bg-red-500 animate-pulse' : 'bg-emerald-500 animate-pulse'} rounded-full`;
        }

        if (statusText) {
            statusText.textContent = isActive ? 'Call Active' : 'Neural Sync Active';
        }
    }

    render() {
        this.renderUI();
        setTimeout(() => {
            this.bindEvents();
        }, 150);
    }

    renderUI() {
        const isCallActive = vapiService.isActive();

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
                                <span class="w-1.5 h-1.5 voice-status-indicator ${isCallActive ? 'bg-red-500 animate-pulse' : 'bg-emerald-500 animate-pulse'} rounded-full"></span>
                                <span class="text-[9px] font-bold text-slate-500 uppercase tracking-widest voice-status-text">${isCallActive ? 'Call Active' : 'Neural Sync Active'}</span>
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center space-x-3">
                        <button id="voice-toggle" class="relative text-slate-500 hover:text-red-400 transition-all text-xl p-1.5 rounded-lg ${isCallActive ? 'bg-red-500/20 text-red-400' : 'hover:bg-white/5'}" title="Toggle Voice Call">
                            <ion-icon name="${isCallActive ? 'call' : 'mic'}"></ion-icon>
                        </button>
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
                    <div class="relative flex gap-2">
                        <input type="text" id="chat-input" 
                            class="flex-1 bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-all font-semibold"
                            placeholder="Quantum query entry...">
                        <button id="chat-send-btn" type="button" class="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white hover:bg-indigo-500 transition-all shadow-lg active:scale-90">
                            <ion-icon name="send-sharp"></ion-icon>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Toggle Button -->
            <button id="chatbot-toggle" class="group relative w-16 h-16 bg-gradient-to-tr ${this.isOpen ? 'from-rose-600 to-rose-500' : 'from-indigo-600 to-purple-600'} rounded-[1.8rem] flex items-center justify-center shadow-2xl transition-all hover:scale-110 active:scale-90 border-4 border-white/10 overflow-hidden">
                <div class="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-all"></div>
                <ion-icon name="${this.isOpen ? 'close' : 'chatbox-ellipses'}" class="text-3xl text-white relative z-10"></ion-icon>
            </button>
        `;
    }

    bindEvents() {
        const toggle = document.getElementById('chatbot-toggle');
        const close = document.getElementById('close-chat');
        const reset = document.getElementById('reset-chat');
        const voiceToggle = document.getElementById('voice-toggle');
        const sendBtn = document.getElementById('chat-send-btn');
        const input = document.getElementById('chat-input');

        console.log('📌 Binding events - Elements found:', {
            toggle: !!toggle,
            close: !!close,
            reset: !!reset,
            voiceToggle: !!voiceToggle,
            sendBtn: !!sendBtn,
            input: !!input
        });

        if (toggle) {
            if (this._toggleHandler) {
                toggle.removeEventListener('click', this._toggleHandler);
            }
            this._toggleHandler = (e) => {
                e.stopPropagation();
                this.toggle();
            };
            toggle.addEventListener('click', this._toggleHandler);
            console.log('✅ Toggle button bound');
        }

        if (close) {
            if (this._closeHandler) {
                close.removeEventListener('click', this._closeHandler);
            }
            this._closeHandler = (e) => {
                e.stopPropagation();
                this.toggle();
            };
            close.addEventListener('click', this._closeHandler);
            console.log('✅ Close button bound');
        }

        if (reset) {
            if (this._resetHandler) {
                reset.removeEventListener('click', this._resetHandler);
            }
            this._resetHandler = (e) => {
                e.stopPropagation();
                this.messages = [];
                this.addMessage(`Protocol Reset. How can I assist you now, ${this.user.name}?`, 'bot');
            };
            reset.addEventListener('click', this._resetHandler);
            console.log('✅ Reset button bound');
        }

        if (voiceToggle) {
            if (this._voiceHandler) {
                voiceToggle.removeEventListener('click', this._voiceHandler);
            }
            this._voiceHandler = (e) => {
                e.stopPropagation();
                console.log('🎤 Voice button clicked');
                this.toggleVoiceCall();
            };
            voiceToggle.addEventListener('click', this._voiceHandler);
            console.log('✅ Voice toggle bound');
        }

        if (sendBtn) {
            if (this._sendHandler) {
                sendBtn.removeEventListener('click', this._sendHandler);
            }
            this._sendHandler = (e) => {
                e.preventDefault();
                e.stopPropagation();
                const inputField = document.getElementById('chat-input');
                const val = inputField?.value?.trim();
                console.log('📤 Send button clicked, value:', val);
                if (val) {
                    inputField.value = '';
                    this.addMessage(val, 'user');
                }
            };
            sendBtn.addEventListener('click', this._sendHandler);
            console.log('✅ Send button bound');
        }

        if (input) {
            if (this._keyHandler) {
                input.removeEventListener('keypress', this._keyHandler);
            }
            this._keyHandler = (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    e.stopPropagation();
                    const val = e.target.value.trim();
                    console.log('⌨️ Enter pressed, value:', val);
                    if (val) {
                        e.target.value = '';
                        this.addMessage(val, 'user');
                    }
                }
            };
            input.addEventListener('keypress', this._keyHandler);
            console.log('✅ Input field bound');
        }

        this.attachQuickReplyListeners();
    }
}

export default ChatbotWidget;
