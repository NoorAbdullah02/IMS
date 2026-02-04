export const renderDepartmentsView = (stats) => {
    let html = `
    <div class="space-y-6">
        <h2 class="text-2xl font-bold text-gray-800">Department Overview</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    `;

    stats.forEach(dept => {
        html += `
            <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 border-l-4 border-indigo-500">
                <div class="flex justify-between items-start">
                    <div>
                        <h3 class="text-xl font-bold text-gray-800">${dept.name}</h3>
                        <p class="text-gray-500 text-sm mt-1">Head: ${dept.head}</p>
                    </div>
                    <div class="bg-indigo-100 p-2 rounded-full text-indigo-600">
                        <ion-icon name="business-outline" class="text-xl"></ion-icon>
                    </div>
                </div>
                
                <div class="mt-6 grid grid-cols-2 gap-4">
                    <div class="text-center p-3 bg-gray-50 rounded">
                        <span class="block text-2xl font-bold text-indigo-600">${dept.studentCount}</span>
                        <span class="text-xs text-gray-500 uppercase tracking-wide">Students</span>
                    </div>
                    <div class="text-center p-3 bg-gray-50 rounded">
                        <span class="block text-2xl font-bold text-green-600">${dept.teacherCount}</span>
                        <span class="text-xs text-gray-500 uppercase tracking-wide">Teachers</span>
                    </div>
                </div>
                
                <div class="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                    <button onclick="window.handleNavigation('viewDeptDetails', '${dept.name}')" class="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center">
                        View Details <ion-icon name="arrow-forward-outline" class="ml-1"></ion-icon>
                    </button>
                </div>
            </div>
        `;
    });

    html += `
        </div>
    </div>
    `;

    return html;
};
