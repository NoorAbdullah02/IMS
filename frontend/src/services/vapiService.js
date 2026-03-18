
import Vapi from '@vapi-ai/web';

class VapiService {
    constructor() {
        this.vapi = null;
        this.isInitialized = false;
        this.isCallActive = false;
        this.listeners = {
            message: [],
            callStart: [],
            callEnd: [],
            error: []
        };
    }

    /**
     * Initialize Vapi with public key
     * @param {String} publicKey - Vapi public key
     * @param {Object} config - Additional configuration (e.g., { assistantId: '...' })
     */
    async init(publicKey, config = {}) {
        try {
            console.log('🚀 Vapi Service initialization started', {
                publicKeyPresent: !!publicKey,
                publicKeyLength: publicKey ? publicKey.length : 0,
                configKeys: Object.keys(config)
            });

            if (this.isInitialized && this.vapi) {
                console.log('ℹ️ Vapi already initialized, returning existing instance');
                return this.vapi;
            }

            if (!publicKey) {
                throw new Error('❌ Vapi public key is required for initialization');
            }

            if (typeof Vapi !== 'function') {
                throw new Error('❌ Vapi SDK not loaded. Check @vapi-ai/web package.');
            }

            // Initialize Vapi SDK - pass PUBLIC KEY directly as first parameter
            console.log('📝 Creating new Vapi instance with public key');
            this.vapi = new Vapi(publicKey);

            console.log('✅ Vapi instance created, type:', typeof this.vapi);
            const methods = this.vapi ? Object.getOwnPropertyNames(Object.getPrototypeOf(this.vapi)) : [];
            console.log('📋 Vapi available methods:', methods.join(', '));

            // Set up event listeners AFTER creating instance
            this.setupEventListeners();

            this.isInitialized = true;
            console.log('✅ Vapi initialized successfully');

            return this.vapi;
        } catch (error) {
            console.error('❌ Failed to initialize Vapi:', error.message);
            console.error('Initialization error details:', {
                message: error.message,
                type: error.name,
                stack: error.stack?.split('\n').slice(0, 3).join('\n')
            });
            this.isInitialized = false;
            this.vapi = null;
            this.emit('error', error);
            throw error;
        }
    }

    /**
     * Handle messages from Vapi SDK callback
     */
    onVapiSDKMessage(message) {
        console.log('📨 Message from Vapi SDK:', message);
        this.emit('message', message);
    }

    /**
     * Handle errors from Vapi SDK callback
     */
    onVapiSDKError(error) {
        console.error('❌ Error from Vapi SDK:', error);
        console.error('Error details:', {
            message: error?.message || 'Unknown error',
            type: error?.type,
            code: error?.code,
            toString: error?.toString?.(),
            stack: error?.stack
        });
        this.isCallActive = false;
        this.emit('error', error);
    }

    /**
     * Setup Vapi event listeners
     */
    setupEventListeners() {
        if (!this.vapi) {
            console.error('Cannot setup listeners - Vapi not initialized');
            return;
        }

        console.log('Setting up Vapi event listeners...');

        // When call starts
        this.vapi.on('call-start', () => {
            console.log('📞 Call started event received');
            this.isCallActive = true;
            this.emit('callStart');
        });

        // When call ends
        this.vapi.on('call-end', () => {
            console.log('📵 Call ended event received');
            this.isCallActive = false;
            this.emit('callEnd');
        });

        // When messages are received (both assistant and user)
        this.vapi.on('message', (message) => {
            console.log('💬 Message received:', message);
            this.emit('message', {
                ...message,
                timestamp: new Date()
            });
        });

        // When speech starts
        this.vapi.on('speech-start', () => {
            console.log('🗣️ Speech started');
        });

        // When speech ends
        this.vapi.on('speech-end', () => {
            console.log('🗣️ Speech ended');
        });

        // Volume level changes
        this.vapi.on('volume-level', (volume) => {
            console.log('🔊 Volume level:', volume);
        });

        // Error handling
        this.vapi.on('error', (error) => {
            console.error('❌ Vapi error event:', error);
            this.isCallActive = false;
            this.emit('error', error);
        });

        console.log('✅ Event listeners configured');
    }

    /**
     * Start a voice call
     * @param {String|Object} assistantIdOrConfig - Assistant ID or full config object
     * @param {Object} overrides - Optional assistant overrides (assistantName, recordingEnabled, variableValues, etc.)
     */
    async startCall(assistantIdOrConfig, overrides = {}) {
        try {
            if (!this.isInitialized) {
                throw new Error('Vapi not initialized. Call init() first.');
            }

            if (!this.vapi) {
                throw new Error('Vapi instance not available');
            }

            if (this.isCallActive) {
                console.warn('Call already active');
                return;
            }

            console.log('📞 Starting Vapi call...');

            // Handle both string and object parameters
            let assistantId = assistantIdOrConfig;
            if (typeof assistantIdOrConfig === 'object') {
                assistantId = assistantIdOrConfig.assistantId;
            }

            console.log('Assistant config:', {
                assistantId,
                hasOverrides: Object.keys(overrides).length > 0
            });

            if (!assistantId) {
                throw new Error('Assistant ID is required to start a call');
            }

            if (typeof this.vapi.start !== 'function') {
                throw new Error('vapi.start() is not a function. Available methods: ' +
                    Object.getOwnPropertyNames(Object.getPrototypeOf(this.vapi)).join(', '));
            }

            // Start the call with assistant ID and optional overrides
            const startPromise = this.vapi.start(assistantId, overrides);

            // Wrap in timeout for safety
            const callStarted = await Promise.race([
                startPromise,
                new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Call start timeout after 10s')), 10000)
                )
            ]);

            this.isCallActive = true;
            console.log('✅ Vapi call started successfully');
            return callStarted;
        } catch (error) {
            console.error('❌ Failed to start call:', error);
            this.isCallActive = false;
            this.emit('error', error);
            throw error;
        }
    }

    /**
     * End active call
     */
    async endCall() {
        try {
            if (!this.isCallActive) {
                console.warn('No active call to end');
                return;
            }

            if (!this.vapi) {
                throw new Error('Vapi instance not available');
            }

            console.log('Ending Vapi call...');

            // Try the stop method
            if (typeof this.vapi.stop === 'function') {
                await this.vapi.stop();
            } else {
                console.warn('vapi.stop() method not available');
            }

            this.isCallActive = false;
            console.log('Call ended successfully');
        } catch (error) {
            console.error('Failed to end call:', error);
            this.isCallActive = false;
            this.emit('error', error);
        }
    }

    /**
     * Send text message to Vapi via voice call
     * @param {String|Object} message - Message text or message object
     */
    sendMessageViaVoiceCall(message) {
        try {
            if (!this.isInitialized) {
                console.warn('⚠️ Vapi not initialized yet, cannot send message');
                return false;
            }

            if (!message) {
                console.warn('⚠️ Empty message, skipping send');
                return false;
            }

            console.log('📤 Sending message to Vapi voice call:', message, 'Call active:', this.isCallActive);

            if (!this.vapi) {
                console.error('❌ Vapi instance not available');
                return false;
            }

            // Only send if there's an active call
            if (!this.isCallActive) {
                console.warn('⚠️ No active voice call. Use text chat instead.');
                return false;
            }

            // According to Vapi SDK docs, use send() method with message object
            if (typeof this.vapi.send === 'function') {
                try {
                    this.vapi.send({
                        type: 'add-message',
                        message: {
                            role: 'user',
                            content: typeof message === 'string' ? message : JSON.stringify(message)
                        }
                    });
                    console.log('✅ Message sent via voice call');
                    return true;
                } catch (e) {
                    console.log('⚠️ send() failed:', e.message);
                }
            }

            // Fallback: try other possible methods
            const methods = ['sendMessage', 'sendUserInput', 'sendText'];
            for (const methodName of methods) {
                if (typeof this.vapi[methodName] === 'function') {
                    try {
                        this.vapi[methodName](typeof message === 'string' ? message : JSON.stringify(message));
                        console.log(`✅ Message sent via ${methodName}()`);
                        return true;
                    } catch (e) {
                        console.log(`⚠️ ${methodName}() failed:`, e.message);
                        continue;
                    }
                }
            }

            console.warn('⚠️ No message sending method available on Vapi instance');
            console.log('Available methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(this.vapi)));
            return false;
        } catch (error) {
            console.error('❌ Error sending message:', error);
            this.emit('error', error);
            return false;
        }
    }

    /**
     * Send text message to backend for processing
     * This enables text-based chat without requiring an active voice call
     * @param {String} message - Message text
     * @returns {Promise<Object>} - Response from backend
     */
    async sendTextMessage(message) {
        try {
            if (!message || typeof message !== 'string') {
                throw new Error('Message must be a non-empty string');
            }

            console.log('💬 Sending text message:', message);

            // Import axios for HTTP requests
            const axios = (await import('axios')).default;

            // Get auth token from localStorage if available
            const token = localStorage.getItem('token');
            const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

            // Send message to backend chat endpoint
            const response = await axios.post('/api/vapi/chat', { message }, { headers });

            if (response.data.success) {
                console.log('✅ Response from AI:', response.data.message);
                this.emit('message', {
                    type: 'assistant',
                    content: response.data.message,
                    timestamp: new Date()
                });
                return response.data;
            } else {
                throw new Error(response.data.error || 'Failed to get response');
            }
        } catch (error) {
            console.error('❌ Error sending text message:', error.message);
            this.emit('error', error);
            throw error;
        }
    }

    /**
     * Check if call is currently active
     */
    isActive() {
        return this.isCallActive;
    }

    /**
     * Check if service is initialized
     */
    isInitializedService() {
        return this.isInitialized;
    }

    /**
     * Toggle call on/off
     * @param {String|Object} config - Assistant ID or call configuration
     */
    async toggleCall(config) {
        if (this.isCallActive) {
            await this.endCall();
        } else {
            await this.startCall(config);
        }
    }

    /**
     * Register event listener
     * @param {String} event - Event name
     * @param {Function} callback - Callback function
     */
    on(event, callback) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
        console.log(`✅ Listener registered for event: ${event}`);
    }

    /**
     * Emit event to all listeners
     * @param {String} event - Event name
     * @param {*} data - Event data
     */
    emit(event, data) {
        console.log(`📡 Emitting event: ${event}`, data);
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        if (this.listeners[event].length > 0) {
            this.listeners[event].forEach(callback => {
                try {
                    callback(data);
                } catch (err) {
                    console.error(`Error in ${event} listener:`, err);
                }
            });
        }
    }

    /**
     * Get Vapi instance
     */
    getInstance() {
        return this.vapi;
    }

    /**
     * Cleanup
     */
    destroy() {
        if (this.isCallActive) {
            this.endCall();
        }
        this.vapi = null;
        this.isInitialized = false;
        this.listeners = {
            message: [],
            callStart: [],
            callEnd: [],
            error: []
        };
    }
}

// Export singleton
export default new VapiService();
