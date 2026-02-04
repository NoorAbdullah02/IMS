export const renderSystemLogs = (logs) => {
    let html = `
    <div class="space-y-6">
        <h2 class="text-2xl font-bold text-gray-800 flex items-center">
            <ion-icon name="hardware-chip-outline" class="mr-2 text-indigo-600"></ion-icon>
            System Activity Logs
        </h2>

        <div class="bg-white shadow overflow-hidden sm:rounded-lg">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-indigo-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">Timestamp</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">User</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">Action</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">Details</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
    `;

    if (!logs || logs.length === 0) {
        // Sample data since we don't have a real logs table yet
        const sampleLogs = [
            { id: 1, time: new Date().toISOString(), user: 'admin@bauet.edu', action: 'LOGIN', details: 'Successful login from 192.168.1.1' },
            { id: 2, time: new Date(Date.now() - 3600000).toISOString(), user: 'admin@bauet.edu', action: 'USER_CREATE', details: 'Created user ice.head@bauet.edu' },
            { id: 3, time: new Date(Date.now() - 7200000).toISOString(), user: 'ice.head@bauet.edu', action: 'ADMIT_CARD_GENERATE', details: 'Generated admit cards for Level 3 Semester 2' }
        ];

        sampleLogs.forEach(log => {
            html += `
                <tr class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${new Date(log.time).toLocaleString()}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${log.user}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">${log.action}</span>
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-500">${log.details}</td>
                </tr>
            `;
        });
    } else {
        logs.forEach(log => {
            html += `
                <tr class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${new Date(log.time).toLocaleString()}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${log.user}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">${log.action}</span>
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-500">${log.details}</td>
                </tr>
            `;
        });
    }

    html += `
                </tbody>
            </table>
        </div>
    </div>
    `;

    return html;
};
