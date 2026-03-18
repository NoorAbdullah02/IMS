/**
 * Vapi Integration Testing Script
 * Run this from the browser console to test all Vapi functionality
 */

(async function testVapiIntegration() {
    console.log('🔍 Starting Vapi Integration Test');

    try {
        // Test 1: Check Vapi SDK availability
        console.log('\n✅ Test 1: Check Vapi SDK');
        if (typeof Vapi === 'function') {
            console.log('✓ Vapi SDK is available');
        } else {
            console.error('✗ Vapi SDK not found. Check @vapi-ai/web import.');
            return;
        }

        // Test 2: Get current user
        console.log('\n✅ Test 2: Check User Authentication');
        const userJson = localStorage.getItem('user');
        if (userJson) {
            const user = JSON.parse(userJson);
            console.log('✓ User authenticated:', user.name, '(' + user.role + ')');
        } else {
            console.error('✗ User not authenticated');
            return;
        }

        // Test 3: Check API configuration
        console.log('\n✅ Test 3: Check API Configuration');
        const apiUrl = import.meta.env?.VITE_API_URL || 'http://localhost:4000';
        console.log('✓ API URL:', apiUrl);

        // Test 4: Test Vapi Health Endpoint
        console.log('\n✅ Test 4: Test Vapi Health Endpoint');
        try {
            const healthResponse = await fetch(`${apiUrl}/api/vapi/health`);
            const health = await healthResponse.json();
            console.log('✓ Health check response:', health);
        } catch (e) {
            console.error('✗ Health check failed:', e.message);
        }

        // Test 5: Test Vapi Session Endpoint (With Auth)
        console.log('\n✅ Test 5: Test Vapi Session Endpoint');
        const token = localStorage.getItem('accessToken');
        if (!token) {
            console.error('✗ No access token found');
            return;
        }

        try {
            const sessionResponse = await fetch(`${apiUrl}/api/vapi/session`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({})
            });

            if (!sessionResponse.ok) {
                throw new Error(`HTTP ${sessionResponse.status}`);
            }

            const sessionData = await sessionResponse.json();
            console.log('✓ Session response:', {
                success: sessionData.success,
                publicKey: sessionData.publicKey ? 'present' : 'missing',
                assistantId: sessionData.assistantId ? sessionData.assistantId.substring(0, 8) + '...' : 'missing'
            });

            // Test 6: Initialize Vapi Service
            console.log('\n✅ Test 6: Initialize Vapi Service');
            if (window.vapiService) {
                try {
                    await window.vapiService.init(sessionData.publicKey, {
                        assistantId: sessionData.assistantId
                    });
                    console.log('✓ Vapi Service initialized successfully');
                    console.log('✓ Vapi initialized:', window.vapiService.isInitialized);
                } catch (e) {
                    console.error('✗ Vapi Service init failed:', e.message);
                }
            } else {
                console.log('⚠️ window.vapiService not available. Check if imported in page.');
            }

            // Test 7: Check Chatbot Instance
            console.log('\n✅ Test 7: Check Chatbot Instance');
            if (window.assistant) {
                console.log('✓ Chatbot instance available');
                console.log('✓ Chatbot initialized:', window.assistant.vapiInitialized);
                console.log('✓ Call active:', window.assistant.vapiService?.isActive?.());
            } else {
                console.log('⚠️ window.assistant not available. May not be initialized yet.');
            }

        } catch (e) {
            console.error('✗ Session test failed:', e.message);
        }

    } catch (error) {
        console.error('❌ Test failed:', error);
    }

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 Test Summary:');
    console.log('Next steps:');
    console.log('1. Open the dashboard (authenticated page)');
    console.log('2. Check browser console for all logs');
    console.log('3. Try sending a message in chatbot');
    console.log('4. Try starting a voice call');
    console.log('='.repeat(50));
})();
