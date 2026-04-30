const pptxgen = require('pptxgenjs');

// Create a new Presentation
let pptx = new pptxgen();

pptx.author = 'NoorAbdullah02';
pptx.company = 'BAUET';
pptx.revision = '1';
pptx.subject = 'IMS Presentation';
pptx.title = 'IMS: Next-Gen Institutional Management System';

// Define layout and theme
pptx.layout = 'LAYOUT_16x9';

// Slide 1: Title Slide
let slide1 = pptx.addSlide();
slide1.background = { color: '0f172a' }; // Dark theme slate-900
slide1.addText('IMS', { x: 1, y: 1.5, w: '80%', fontSize: 48, bold: true, color: '38bdf8', align: 'center' });
slide1.addText('Next-Gen Institutional Management System', { x: 1, y: 2.5, w: '80%', fontSize: 32, bold: true, color: 'ffffff', align: 'center' });
slide1.addText('Elevating Academic Governance through Modern Engineering', { x: 1, y: 3.5, w: '80%', fontSize: 20, color: '94a3b8', align: 'center' });
slide1.addText('Created for: BAUET / Academic Institutions', { x: 1, y: 4.5, w: '80%', fontSize: 16, color: 'cbd5e1', align: 'center' });

// Slide 2: Problem Statement
let slide2 = pptx.addSlide();
slide2.addText('Problem Statement', { x: 0.5, y: 0.5, w: '90%', fontSize: 36, bold: true, color: '0f172a' });
slide2.addText([
    { text: 'Legacy Systems: ', options: { bold: true } },
    { text: 'Slow, outdated portals built on technologies from the 2000s.' }
], { x: 0.5, y: 1.5, w: '90%', fontSize: 20, bullet: true, color: '333333', margin: 10 });
slide2.addText([
    { text: 'Poor User Experience: ', options: { bold: true } },
    { text: 'Lack of mobile responsiveness and confusing navigation.' }
], { x: 0.5, y: 2.2, w: '90%', fontSize: 20, bullet: true, color: '333333', margin: 10 });
slide2.addText([
    { text: 'Segregated Systems: ', options: { bold: true } },
    { text: 'Attendance, grades, fees, materials all in different platforms.' }
], { x: 0.5, y: 2.9, w: '90%', fontSize: 20, bullet: true, color: '333333', margin: 10 });
slide2.addText([
    { text: 'Weak Capabilities: ', options: { bold: true } },
    { text: 'No modern auth, no real-time updates, no analytics.' }
], { x: 0.5, y: 3.6, w: '90%', fontSize: 20, bullet: true, color: '333333', margin: 10 });

// Slide 3: Proposed Solution
let slide3 = pptx.addSlide();
slide3.addText('Proposed Solution: IMS', { x: 0.5, y: 0.5, w: '90%', fontSize: 36, bold: true, color: '0f172a' });
slide3.addText('A unified, cloud-native platform that consolidates all academic workflows into a single, elegant interface.', { x: 0.5, y: 1.5, w: '90%', fontSize: 22, color: '333333', margin: 10 });
slide3.addText([
    { text: 'Lightning-Fast Performance ', options: { bold: true } },
    { text: '- Shell Architecture with modular rendering.' }
], { x: 0.5, y: 2.5, w: '90%', fontSize: 18, bullet: true, color: '333333', margin: 10 });
slide3.addText([
    { text: 'Premium UI/UX ', options: { bold: true } },
    { text: '- Glassmorphic design with smooth animations.' }
], { x: 0.5, y: 3.0, w: '90%', fontSize: 18, bullet: true, color: '333333', margin: 10 });
slide3.addText([
    { text: 'Enterprise-Grade Security ', options: { bold: true } },
    { text: '- Dual-Token JWT auth, granular role-based access.' }
], { x: 0.5, y: 3.5, w: '90%', fontSize: 18, bullet: true, color: '333333', margin: 10 });
slide3.addText([
    { text: 'Full Responsiveness ', options: { bold: true } },
    { text: '- Seamless experience across all devices.' }
], { x: 0.5, y: 4.0, w: '90%', fontSize: 18, bullet: true, color: '333333', margin: 10 });

// Slide 4: Core Features (1/2)
let slide4 = pptx.addSlide();
slide4.addText('Core Features (1/2)', { x: 0.5, y: 0.5, w: '90%', fontSize: 36, bold: true, color: '0f172a' });
slide4.addText([
    { text: 'Unified Authentication Suite: ', options: { bold: true } },
    { text: '6 distinct roles, JWT dual-token, email verifications.' }
], { x: 0.5, y: 1.5, w: '90%', fontSize: 20, bullet: true, color: '333333', margin: 10 });
slide4.addText([
    { text: 'Academic Lifecycle Management: ', options: { bold: true } },
    { text: 'Smart real-time attendance, Result processing engine, Dynamic curriculum.' }
], { x: 0.5, y: 2.2, w: '90%', fontSize: 20, bullet: true, color: '333333', margin: 10 });
slide4.addText([
    { text: 'Institutional Governance Terminal: ', options: { bold: true } },
    { text: 'Admit card system, Coordinator dashboard, Notice board, Policy engine.' }
], { x: 0.5, y: 3.1, w: '90%', fontSize: 20, bullet: true, color: '333333', margin: 10 });

// Slide 5: Core Features (2/2)
let slide5 = pptx.addSlide();
slide5.addText('Core Features (2/2)', { x: 0.5, y: 0.5, w: '90%', fontSize: 36, bold: true, color: '0f172a' });
slide5.addText([
    { text: 'Financial Management System: ', options: { bold: true } },
    { text: 'Payment tracking, Advance payment rollover, Fee management.' }
], { x: 0.5, y: 1.5, w: '90%', fontSize: 20, bullet: true, color: '333333', margin: 10 });
slide5.addText([
    { text: 'AI-Powered Assistant (Vapi AI): ', options: { bold: true } },
    { text: 'Smart voice & text conversational interface.' }
], { x: 0.5, y: 2.4, w: '90%', fontSize: 20, bullet: true, color: '333333', margin: 10 });
slide5.addText([
    { text: 'Real-Time Notification System: ', options: { bold: true } },
    { text: 'Socket.IO instant updates across modules.' }
], { x: 0.5, y: 3.1, w: '90%', fontSize: 20, bullet: true, color: '333333', margin: 10 });

// Slide 6: Role-Based Access
let slide6 = pptx.addSlide();
slide6.addText('Role-Based Capabilities', { x: 0.5, y: 0.5, w: '90%', fontSize: 36, bold: true, color: '0f172a' });
slide6.addText([
    { text: 'Students: ', options: { bold: true } },
    { text: 'Access attendance, results, fees, materials, notices.' }
], { x: 0.5, y: 1.5, w: '90%', fontSize: 18, bullet: true, color: '333333', margin: 5 });
slide6.addText([
    { text: 'Teachers: ', options: { bold: true } },
    { text: 'Mark attendance, upload results & materials, grade assignments.' }
], { x: 0.5, y: 2.1, w: '90%', fontSize: 18, bullet: true, color: '333333', margin: 5 });
slide6.addText([
    { text: 'Coordinators: ', options: { bold: true } },
    { text: 'Assign courses, manage schedule, publish notices.' }
], { x: 0.5, y: 2.7, w: '90%', fontSize: 18, bullet: true, color: '333333', margin: 5 });
slide6.addText([
    { text: 'Dept Heads: ', options: { bold: true } },
    { text: 'Approve admit cards, manage policies, view analytics.' }
], { x: 0.5, y: 3.3, w: '90%', fontSize: 18, bullet: true, color: '333333', margin: 5 });
slide6.addText([
    { text: 'Finance / Admins: ', options: { bold: true } },
    { text: 'Track payments, manage treasury, full system control.' }
], { x: 0.5, y: 3.9, w: '90%', fontSize: 18, bullet: true, color: '333333', margin: 5 });

// Slide 7: Tech Stack
let slide7 = pptx.addSlide();
slide7.addText('Tech Stack', { x: 0.5, y: 0.5, w: '90%', fontSize: 36, bold: true, color: '0f172a' });

slide7.addText('Frontend:', { x: 0.5, y: 1.5, w: '40%', fontSize: 20, bold: true, color: '0369a1' });
slide7.addText('Vite, Vanilla JS\nTailwind CSS\nGSAP, Three.js\nSocket.IO Client\nAxios', { x: 0.5, y: 2.0, w: '40%', fontSize: 16, bullet: true, color: '333333' });

slide7.addText('Backend:', { x: 5.0, y: 1.5, w: '40%', fontSize: 20, bold: true, color: '0369a1' });
slide7.addText('Node.js, Express.js\nPostgreSQL\nDrizzle ORM\nJWT & Bcrypt\nSocket.IO, Cloudinary', { x: 5.0, y: 2.0, w: '40%', fontSize: 16, bullet: true, color: '333333' });

// Slide 8: Key Benefits
let slide8 = pptx.addSlide();
slide8.addText('Key Benefits', { x: 0.5, y: 0.5, w: '90%', fontSize: 36, bold: true, color: '0f172a' });
slide8.addText('Operational Excellence', { x: 0.5, y: 1.5, w: '90%', fontSize: 20, bold: true, bullet: true, color: '333333' });
slide8.addText('Reduce admin overhead by 60%, automate manual processes.', { x: 1.0, y: 1.9, w: '80%', fontSize: 16, color: '555555' });

slide8.addText('User Experience', { x: 0.5, y: 2.5, w: '90%', fontSize: 20, bold: true, bullet: true, color: '333333' });
slide8.addText('Intuitive, mobile-first interface with <2s page transitions.', { x: 1.0, y: 2.9, w: '80%', fontSize: 16, color: '555555' });

slide8.addText('Data Security & Scalability', { x: 0.5, y: 3.5, w: '90%', fontSize: 20, bold: true, bullet: true, color: '333333' });
slide8.addText('Enterprise-grade encryption, cloud-ready for up to 50k users.', { x: 1.0, y: 3.9, w: '80%', fontSize: 16, color: '555555' });

// Slide 9: Conclusion
let slide9 = pptx.addSlide();
slide9.background = { color: '0f172a' };
slide9.addText('Thank You', { x: 1, y: 2.0, w: '80%', fontSize: 48, bold: true, color: '38bdf8', align: 'center' });
slide9.addText('Transforming Academic Operations with Modern Engineering', { x: 1, y: 3.0, w: '80%', fontSize: 20, color: 'cbd5e1', align: 'center' });

// Save the Presentation
pptx.writeFile({ fileName: 'IMS_Project_Presentation.pptx' }).then(fileName => {
    console.log(`Presentation generated successfully: ${fileName}`);
}).catch(err => {
    console.error('Error generating presentation:', err);
});
