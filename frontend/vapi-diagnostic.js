/**
 * Vapi Diagnostic Tool
 * Run this in browser console to diagnose Vapi issues
 */

async function diagnosisVapi() {
    console.clear();
    console.log('%c=== VAPI DIAGNOSTIC ===', 'color: blue; font-size: 16px; font-weight: bold;');

    // 1. Check if Vapi SDK is loaded
    console.log('\n1️⃣ Checking Vapi SDK...');
    try {
        const VapiModule = await import('./src/services/vapiService.js');
        const vapiService = VapiModule.default;
        console.log('✅ vapiService loaded:', !!vapiService);
    } catch (error) {
        console.error('❌ Failed to load vapiService:', error.message);
        return;
    }

    // 2. Check if @vapi-ai/web is available
    console.log('\n2️⃣ Checking @vapi-ai/web SDK...');
    try {
        const VapiSDK = (await import('@vapi-ai/web')).default;
        console.log('✅ @vapi-ai/web SDK available');
        console.log('SDK version check:', VapiSDK.toString().substring(0, 100));
    } catch (error) {
        console.error('❌ @vapi-ai/web SDK not available:', error.message);
        return;
    }

    // 3. Check environment and config
    console.log('\n3️⃣ Checking environment...');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    console.log('User info:', {
        name: user.name || 'N/A',
        role: user.role || 'N/A',
        id: user.id || 'N/A'
    });

    // 4. Test API connectivity
    console.log('\n4️⃣ Testing API connectivity...');
    try {
        const response = await fetch('/api/vapi/session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
            },
            body: JSON.stringify({})
        });

        if (response.ok) {
            const data = await response.json();
            console.log('✅ Vapi session API responded');
            console.log('Config:', {
                publicKeyPresent: !!data.publicKey,
                assistantId: data.assistantId || 'N/A',
                success: data.success
            });

            // 5. Test Vapi initialization
            console.log('\n5️⃣ Testing Vapi initialization...');
            if (data.publicKey && data.assistantId) {
                try {
                    const VapiSDK = (await import('@vapi-ai/web')).default;
                    const testVapi = new VapiSDK({
                        apiKey: data.publicKey,
                        assistantId: data.assistantId
                    });
                    console.log('✅ Vapi instance created successfully');
                    console.log('Vapi methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(testVapi)).slice(0, 10).join(', '));
                    console.log('Full methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(testVapi)));

                    // Check for key methods
                    const requiredMethods = ['start', 'stop', 'send', 'on', 'off'];
                    const available = requiredMethods.filter(m => typeof testVapi[m] === 'function');
                    console.log('Required methods available:', available);
                    const missing = requiredMethods.filter(m => typeof testVapi[m] !== 'function');
                    if (missing.length > 0) {
                        console.warn('Missing methods:', missing);
                    }
                } catch (error) {
                    console.error('❌ Failed to create Vapi instance:', error.message);
                }
            }
        } else {
            console.error('❌ API error:', response.status, response.statusText);
            const errorData = await response.json();
            console.error('Error details:', errorData);
        }
    } catch (error) {
        console.error('❌ API connection failed:', error.message);
    }

    console.log('\n%c=== DIAGNOSTIC COMPLETE ===', 'color: green; font-size: 16px; font-weight: bold;');
}

// Export for console usage
window.diagnosisVapi = diagnosisVapi;
console.log('%cType: diagnosisVapi() to run diagnostics', 'color: orange; font-weight: bold;');
