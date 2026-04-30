const pptxgen = require('pptxgenjs');

// Create a new Presentation
let pptx = new pptxgen();

pptx.author = 'NoorAbdullah02';
pptx.company = 'BAUET';
pptx.revision = '2';
pptx.subject = 'IMS Presentation';
pptx.title = 'IMS: Next-Gen Institutional Management System';

// Define layout and theme
pptx.layout = 'LAYOUT_16x9';

// Slide 1: Title Slide
let slide1 = pptx.addSlide();
slide1.background = { color: '0f172a' }; // Dark theme
slide1.addText('IMS', { x: 1, y: 1.5, w: '80%', fontSize: 48, bold: true, color: '38bdf8', align: 'center' });
slide1.addText('Next-Gen Institutional Management System', { x: 1, y: 2.5, w: '80%', fontSize: 32, bold: true, color: 'ffffff', align: 'center' });
slide1.addText('Elevating Academic Governance through Modern Engineering', { x: 1, y: 3.5, w: '80%', fontSize: 20, color: '94a3b8', align: 'center' });

// Slide 2: Outline
let slideOutline = pptx.addSlide();
slideOutline.addText('Outline', { x: 0.5, y: 0.5, w: '90%', fontSize: 36, bold: true, color: '0f172a' });
slideOutline.addText([
    { text: 'Introduction' },
    { text: 'Literature Review' },
    { text: 'Problem Statement' },
    { text: 'Objectives' },
    { text: 'Methodology' },
    { text: 'Result' },
    { text: 'Future Work' },
    { text: 'Budget for the website' },
    { text: 'Conclusion' },
    { text: 'Reference' }
], { x: 1.0, y: 1.5, w: '80%', fontSize: 22, bullet: true, color: '333333', lineSpacing: 35 });

// Slide 3: Introduction
let slideIntro = pptx.addSlide();
slideIntro.addText('Introduction', { x: 0.5, y: 0.5, w: '90%', fontSize: 36, bold: true, color: '0f172a' });
slideIntro.addText([
    { text: 'What is IMS?', options: { bold: true } },
    { text: ' A comprehensive, modern academic platform designed to revolutionize educational institution management.' },
], { x: 0.5, y: 1.5, w: '90%', fontSize: 20, bullet: true, color: '333333', margin: 10 });
slideIntro.addText([
    { text: 'Target Audience:', options: { bold: true } },
    { text: ' Students, Teachers, Coordinators, Dept Heads, Finance Officers, and Super Admins.' },
], { x: 0.5, y: 2.5, w: '90%', fontSize: 20, bullet: true, color: '333333', margin: 10 });
slideIntro.addText([
    { text: 'Core Philosophy:', options: { bold: true } },
    { text: ' Lightning-fast performance, premium UI/UX, enterprise-grade security, and real-time updates.' },
], { x: 0.5, y: 3.5, w: '90%', fontSize: 20, bullet: true, color: '333333', margin: 10 });

// Slide 4: Literature Review
let slideLitReview = pptx.addSlide();
slideLitReview.addText('Literature Review', { x: 0.5, y: 0.5, w: '90%', fontSize: 36, bold: true, color: '0f172a' });
slideLitReview.addText([
    { text: 'Traditional Academic Portals:' },
    { text: ' Built on monolithic, legacy technologies from the early 2000s.', options: { bullet: { indent: 20 } } },
    { text: ' Lack of mobile responsiveness, making access difficult on smartphones.', options: { bullet: { indent: 20 } } },
    { text: 'Segregated Workflows:' },
    { text: ' Attendance, grading, fees, and study materials are often scattered across disparate systems.', options: { bullet: { indent: 20 } } },
    { text: 'Security and Real-time Processing:' },
    { text: ' Outdated authentication mechanisms and batched updates leading to slow data propagation.', options: { bullet: { indent: 20 } } }
], { x: 0.5, y: 1.5, w: '90%', fontSize: 18, bullet: true, color: '333333', margin: 10 });

// Slide 5: Problem Statement
let slideProbStmt = pptx.addSlide();
slideProbStmt.addText('Problem Statement', { x: 0.5, y: 0.5, w: '90%', fontSize: 36, bold: true, color: '0f172a' });
slideProbStmt.addText([
    { text: 'Current university management systems face significant operational challenges:' }
], { x: 0.5, y: 1.5, w: '90%', fontSize: 20, color: '333333' });
slideProbStmt.addText([
    { text: 'User Experience: ', options: { bold: true } },
    { text: 'Slow, cluttered, and confusing interfaces that frustrate users.' }
], { x: 0.5, y: 2.2, w: '90%', fontSize: 18, bullet: true, color: '333333', margin: 10 });
slideProbStmt.addText([
    { text: 'Inefficiency: ', options: { bold: true } },
    { text: 'Manual processes for attendance marking, payment tracking, and admit card issuance.' }
], { x: 0.5, y: 2.8, w: '90%', fontSize: 18, bullet: true, color: '333333', margin: 10 });
slideProbStmt.addText([
    { text: 'Data Silos: ', options: { bold: true } },
    { text: 'No unified database, making comprehensive analytics and auditing impossible.' }
], { x: 0.5, y: 3.4, w: '90%', fontSize: 18, bullet: true, color: '333333', margin: 10 });
slideProbStmt.addText([
    { text: 'Communication Gaps: ', options: { bold: true } },
    { text: 'Lack of real-time notifications for important academic events and financial updates.' }
], { x: 0.5, y: 4.0, w: '90%', fontSize: 18, bullet: true, color: '333333', margin: 10 });

// Slide 6: Objectives
let slideObj = pptx.addSlide();
slideObj.addText('Objectives', { x: 0.5, y: 0.5, w: '90%', fontSize: 36, bold: true, color: '0f172a' });
slideObj.addText([
    { text: 'Operational Excellence:', options: { bold: true } },
    { text: ' Reduce administrative overhead by 60% and automate core academic processes.' },
], { x: 0.5, y: 1.5, w: '90%', fontSize: 18, bullet: true, color: '333333', margin: 10 });
slideObj.addText([
    { text: 'Enhanced User Experience:', options: { bold: true } },
    { text: ' Deliver a mobile-first, intuitive interface with <2s page transitions.' },
], { x: 0.5, y: 2.2, w: '90%', fontSize: 18, bullet: true, color: '333333', margin: 10 });
slideObj.addText([
    { text: 'Unified Governance:', options: { bold: true } },
    { text: ' Consolidate attendance, results, materials, scheduling, and finance into one platform.' },
], { x: 0.5, y: 2.9, w: '90%', fontSize: 18, bullet: true, color: '333333', margin: 10 });
slideObj.addText([
    { text: 'Robust Security & Scalability:', options: { bold: true } },
    { text: ' Implement dual-token JWT authentication and cloud-ready infrastructure for 50,000+ users.' },
], { x: 0.5, y: 3.6, w: '90%', fontSize: 18, bullet: true, color: '333333', margin: 10 });

// Slide 7: Methodology
let slideMethod = pptx.addSlide();
slideMethod.addText('Methodology', { x: 0.5, y: 0.5, w: '90%', fontSize: 36, bold: true, color: '0f172a' });
slideMethod.addText('System Architecture & Tech Stack:', { x: 0.5, y: 1.2, w: '90%', fontSize: 20, bold: true, color: '0369a1' });
slideMethod.addText([
    { text: 'Frontend:', options: { bold: true } },
    { text: ' Vite, Vanilla JS, Tailwind CSS, GSAP, and Three.js for modular shell rendering and animations.' }
], { x: 0.5, y: 1.8, w: '90%', fontSize: 16, bullet: true, color: '333333', margin: 10 });
slideMethod.addText([
    { text: 'Backend:', options: { bold: true } },
    { text: ' Node.js with Express.js RESTful API, adhering to MVC architecture.' }
], { x: 0.5, y: 2.4, w: '90%', fontSize: 16, bullet: true, color: '333333', margin: 10 });
slideMethod.addText([
    { text: 'Database:', options: { bold: true } },
    { text: ' PostgreSQL with Drizzle ORM for type-safe schema and scalable data storage.' }
], { x: 0.5, y: 3.0, w: '90%', fontSize: 16, bullet: true, color: '333333', margin: 10 });
slideMethod.addText([
    { text: 'Real-Time & Integration:', options: { bold: true } },
    { text: ' Socket.IO for live events, Cloudinary for media, and Nodemailer for email services.' }
], { x: 0.5, y: 3.6, w: '90%', fontSize: 16, bullet: true, color: '333333', margin: 10 });
slideMethod.addText([
    { text: 'Development Process:', options: { bold: true } },
    { text: ' Phased agile approach (Foundation -> Academic Core -> Institutional Features -> Finance).' }
], { x: 0.5, y: 4.2, w: '90%', fontSize: 16, bullet: true, color: '333333', margin: 10 });

// Slide 8: Result
let slideResult = pptx.addSlide();
slideResult.addText('Result', { x: 0.5, y: 0.5, w: '90%', fontSize: 36, bold: true, color: '0f172a' });
slideResult.addText([
    { text: 'A Fully Integrated Academic Platform' }
], { x: 0.5, y: 1.3, w: '90%', fontSize: 22, bold: true, color: '0369a1' });
slideResult.addText([
    { text: 'Role-Based Dashboards: ', options: { bold: true } },
    { text: 'Tailored interfaces for Students, Teachers, and Administrators.' }
], { x: 0.5, y: 1.9, w: '90%', fontSize: 18, bullet: true, color: '333333', margin: 10 });
slideResult.addText([
    { text: 'Smart Automation: ', options: { bold: true } },
    { text: 'Automated attendance tracking, result processing, and admit card generation.' }
], { x: 0.5, y: 2.5, w: '90%', fontSize: 18, bullet: true, color: '333333', margin: 10 });
slideResult.addText([
    { text: 'Financial Transparency: ', options: { bold: true } },
    { text: 'Real-time payment tracking and intelligent advance payment rollover systems.' }
], { x: 0.5, y: 3.1, w: '90%', fontSize: 18, bullet: true, color: '333333', margin: 10 });
slideResult.addText([
    { text: 'AI & Real-Time Ready: ', options: { bold: true } },
    { text: 'Vapi AI voice/text assistant integrated alongside Socket.IO notifications.' }
], { x: 0.5, y: 3.7, w: '90%', fontSize: 18, bullet: true, color: '333333', margin: 10 });

// Slide 9: Future Work
let slideFuture = pptx.addSlide();
slideFuture.addText('Future Work', { x: 0.5, y: 0.5, w: '90%', fontSize: 36, bold: true, color: '0f172a' });
slideFuture.addText([
    { text: 'AI and Machine Learning Integration:', options: { bold: true } },
    { text: ' Predictive analytics for student performance and drop-out risks.' }
], { x: 0.5, y: 1.5, w: '90%', fontSize: 18, bullet: true, color: '333333', margin: 10 });
slideFuture.addText([
    { text: 'Advanced Mobile App:', options: { bold: true } },
    { text: ' Developing native iOS and Android applications with offline capabilities.' }
], { x: 0.5, y: 2.3, w: '90%', fontSize: 18, bullet: true, color: '333333', margin: 10 });
slideFuture.addText([
    { text: 'Multi-language Support:', options: { bold: true } },
    { text: ' Expanding localization to support diverse institutional requirements.' }
], { x: 0.5, y: 3.1, w: '90%', fontSize: 18, bullet: true, color: '333333', margin: 10 });
slideFuture.addText([
    { text: 'Alumni Network Module:', options: { bold: true } },
    { text: ' A dedicated portal for connecting current students with alumni for mentorship.' }
], { x: 0.5, y: 3.9, w: '90%', fontSize: 18, bullet: true, color: '333333', margin: 10 });

// Slide 10: Budget for the website
let slideBudget = pptx.addSlide();
slideBudget.addText('Budget for the Website', { x: 0.5, y: 0.5, w: '90%', fontSize: 36, bold: true, color: '0f172a' });
slideBudget.addText('Estimated Annual Infrastructure & Service Costs:', { x: 0.5, y: 1.3, w: '90%', fontSize: 20, bold: true, color: '333333' });
slideBudget.addText([
    { text: 'Cloud Hosting (AWS/Vercel): ', options: { bold: true } },
    { text: '~$1,200 - $2,500/year (Based on traffic/load).' }
], { x: 0.5, y: 2.0, w: '90%', fontSize: 18, bullet: true, color: '333333', margin: 10 });
slideBudget.addText([
    { text: 'Database Management (PostgreSQL): ', options: { bold: true } },
    { text: '~$600 - $1,200/year (Managed instances).' }
], { x: 0.5, y: 2.6, w: '90%', fontSize: 18, bullet: true, color: '333333', margin: 10 });
slideBudget.addText([
    { text: 'Media & Asset Storage (Cloudinary): ', options: { bold: true } },
    { text: '~$500/year (For heavy document/image uploads).' }
], { x: 0.5, y: 3.2, w: '90%', fontSize: 18, bullet: true, color: '333333', margin: 10 });
slideBudget.addText([
    { text: 'AI & APIs (Vapi AI, Email Services): ', options: { bold: true } },
    { text: '~$800/year (Usage-based pricing).' }
], { x: 0.5, y: 3.8, w: '90%', fontSize: 18, bullet: true, color: '333333', margin: 10 });
slideBudget.addText([
    { text: 'Maintenance & Security: ', options: { bold: true } },
    { text: 'Ongoing IT personnel and security audits.' }
], { x: 0.5, y: 4.4, w: '90%', fontSize: 18, bullet: true, color: '333333', margin: 10 });

// Slide 11: Conclusion
let slideConclusion = pptx.addSlide();
slideConclusion.addText('Conclusion', { x: 0.5, y: 0.5, w: '90%', fontSize: 36, bold: true, color: '0f172a' });
slideConclusion.addText([
    { text: 'IMS fundamentally transforms how academic institutions operate.' }
], { x: 0.5, y: 1.5, w: '90%', fontSize: 22, bold: true, color: '0369a1' });
slideConclusion.addText([
    { text: 'Centralizes Data: ', options: { bold: true } },
    { text: 'Moves away from fragmented systems into a single source of truth.' }
], { x: 0.5, y: 2.3, w: '90%', fontSize: 20, bullet: true, color: '333333', margin: 10 });
slideConclusion.addText([
    { text: 'Empowers Users: ', options: { bold: true } },
    { text: 'Provides real-time analytics, mobile access, and automated governance.' }
], { x: 0.5, y: 3.1, w: '90%', fontSize: 20, bullet: true, color: '333333', margin: 10 });
slideConclusion.addText([
    { text: 'Scalable Foundation: ', options: { bold: true } },
    { text: 'Built on modern web technologies ensuring longevity and adaptability for future expansions.' }
], { x: 0.5, y: 3.9, w: '90%', fontSize: 20, bullet: true, color: '333333', margin: 10 });

// Slide 12: Reference
let slideRef = pptx.addSlide();
slideRef.addText('Reference', { x: 0.5, y: 0.5, w: '90%', fontSize: 36, bold: true, color: '0f172a' });
slideRef.addText([
    { text: 'Project Repository: ', options: { bold: true } },
    { text: 'https://github.com/NoorAbdullah02/IMS' }
], { x: 0.5, y: 1.5, w: '90%', fontSize: 20, bullet: true, color: '333333', margin: 10 });
slideRef.addText([
    { text: 'Tech Stack Documentation:' }
], { x: 0.5, y: 2.2, w: '90%', fontSize: 20, bold: true, color: '333333', margin: 10 });
slideRef.addText([
    { text: 'Vite: https://vitejs.dev/' },
    { text: 'Express.js: https://expressjs.com/' },
    { text: 'PostgreSQL: https://www.postgresql.org/' },
    { text: 'Socket.IO: https://socket.io/' },
    { text: 'Drizzle ORM: https://orm.drizzle.team/' }
], { x: 0.5, y: 2.6, w: '90%', fontSize: 18, bullet: true, color: '555555', margin: 10, bullet: { indent: 20 } });
slideRef.addText([
    { text: 'IMS README & Architectural Blueprints' }
], { x: 0.5, y: 4.2, w: '90%', fontSize: 18, bullet: true, color: '333333', margin: 10 });

// Save the Presentation
pptx.writeFile({ fileName: 'IMS_Project_Presentation.pptx' }).then(fileName => {
    console.log(`Presentation generated successfully: ${fileName}`);
}).catch(err => {
    console.error('Error generating presentation:', err);
});
