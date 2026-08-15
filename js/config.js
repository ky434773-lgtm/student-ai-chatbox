/**
 * Config & Knowledge Base for EduPulse AI - Student Support Service
 */

const CONFIG = {
    appName: "EduPulse AI",
    tagline: "24/7 University Student Advisory & Support Hub",
    defaultModel: "gemini-3.6-flash",
    availableModels: [
        { id: "gemini-3.6-flash", name: "Gemini 3.6 Flash (Recommended - Fast & Smart)" },
        { id: "gemini-3.5-flash-lite", name: "Gemini 3.5 Flash-Lite (High Speed)" },
        { id: "gemini-3.1-pro-preview", name: "Gemini 3.1 Pro (Deep Academic Reasoning)" }
    ],
    systemPrompt: `You are EduPulse AI, an official, friendly, highly empathetic, and professional Student Support Officer for University Students.
Your goal is to guide students through academic advising, course registration, tuition/financial aid, campus IT support, library services, student housing, and health & wellness.

Guidelines for responses:
1. Always maintain a warm, welcoming, clear, and supportive tone.
2. Break down complex administrative processes into easy-to-follow, numbered step-by-step instructions.
3. Provide direct links or department contact info (e.g. Registrar, Financial Aid, IT Helpdesk) whenever relevant.
4. Format output using clean Markdown (bold headers, bullet points, code snippets if applicable).
5. If a student is stressed or anxious about exams/financial issues, express genuine empathy first before offering actionable solutions.
6. Include follow-up suggestion prompts at the end of answers when helpful.`,

    // Campus Department Directory
    directory: [
        {
            name: "Office of the Registrar",
            description: "Course enrollment, add/drop, official transcripts, graduation status.",
            email: "registrar@university.edu",
            phone: "+1 (800) 555-REG1",
            hours: "Mon-Fri: 8:00 AM - 5:00 PM",
            location: "Student Services Bldg, Rm 102"
        },
        {
            name: "Financial Aid & Scholarships",
            description: "FAFSA, grants, work-study programs, tuition payment plans.",
            email: "finaid@university.edu",
            phone: "+1 (800) 555-PAID",
            hours: "Mon-Fri: 8:30 AM - 4:30 PM",
            location: "Administration Hall, Rm 210"
        },
        {
            name: "Campus IT & Help Desk",
            description: "Student portal login, Wi-Fi connectivity, Canvas LMS, Microsoft 365.",
            email: "ithelp@university.edu",
            phone: "+1 (800) 555-TECH",
            hours: "24/7 Phone Support | Desk: Mon-Sat 8 AM - 8 PM",
            location: "Technology Complex, 1st Floor"
        },
        {
            name: "University Library Services",
            description: "Study room bookings, research database access, laptop checkouts.",
            email: "library@university.edu",
            phone: "+1 (800) 555-BOOK",
            hours: "Mon-Thu: 7:30 AM - Midnight | Fri-Sun: 9 AM - 9 PM",
            location: "Main Central Campus Library"
        },
        {
            name: "Student Health & Wellness Center",
            description: "Medical consultations, counseling services, emergency mental health support.",
            email: "health@university.edu",
            phone: "+1 (800) 555-WELL",
            hours: "Mon-Fri: 8:00 AM - 6:00 PM (24/7 Nurse Hotline)",
            location: "Wellness Pavilion, East Gate"
        }
    ],

    // Categorized Student FAQ Topics & Chips
    categories: [
        {
            id: "academic",
            name: "Academic Advising",
            icon: "fa-graduation-cap",
            color: "#6366f1",
            faqs: [
                {
                    q: "How do I register for classes or add/drop a course?",
                    prompt: "How do I register for my semester courses or drop a class before the deadline?",
                    answer: `### 🎓 Course Registration & Add/Drop Process

To add or drop a course for the current term, follow these simple steps:

1. **Log into Student Portal**: Go to [portal.university.edu](https://portal.university.edu) and sign in with your campus credentials.
2. **Navigate to Student Center**: Select **Academic Records** > **Enrollment & Registration**.
3. **Select Term**: Choose the upcoming semester (e.g., Fall 2026).
4. **Add/Drop Action**:
   - **To Add**: Search by Course ID (e.g., CS-101) or Subject, select an open section, and click **Add to Shopping Cart** -> **Finish Enrolling**.
   - **To Drop**: View **My Class Schedule**, check the box next to the course, and select **Drop Selected Classes**.
5. **Verify Confirmation**: Check your updated schedule for the green checkmark icon.

> ⚠️ **Important Deadlines**:
> - **Add Without Fee Penalty**: End of Week 2
> - **Drop with Full Refund**: End of Week 2
> - **Withdrawal (W Grade)**: End of Week 10`
                },
                {
                    q: "How do I request an official academic transcript?",
                    prompt: "What is the procedure to request my official academic transcript?",
                    answer: `### 📜 Requesting Official & Unofficial Transcripts

You can request both digital (PDF) and physical paper transcripts easily:

1. **Unofficial Transcript (Free & Instant)**:
   - Log into **Student Portal** > **Academic Progress** > **View Unofficial Transcript**.
   - Download the instant PDF report.

2. **Official Transcript**:
   - Visit the **Parchment Storefront** link in your portal under **Registrar Services**.
   - Select destination (University, Employer, or Personal Email).
   - Standard processing time: **1-2 business days** (Digital PDF: $5.00 fee).

Need assistance? Contact the Registrar at \`registrar@university.edu\`.`
                },
                {
                    q: "What are the requirements for Academic Honors / Dean's List?",
                    prompt: "What GPA is required to qualify for the Dean's List?",
                    answer: `### 🌟 Dean's List & Graduation Honors

- **Dean's List**: Earned per term by completing at least **12 letter-graded units** with a Term GPA of **3.50 or higher**, with no incomplete (I) or failing (F) grades.
- **Cum Laude**: Cumulative GPA of 3.50 – 3.69
- **Magna Cum Laude**: Cumulative GPA of 3.70 – 3.89
- **Summa Cum Laude**: Cumulative GPA of 3.90 – 4.00`
                }
            ]
        },
        {
            id: "financial",
            name: "Tuition & Financial Aid",
            icon: "fa-credit-card",
            color: "#10b981",
            faqs: [
                {
                    q: "When is the tuition fee payment deadline?",
                    prompt: "When is tuition due for the upcoming term and how can I set up a payment plan?",
                    answer: `### 💳 Tuition Deadlines & Deferred Payment Plans

**Key Payment Dates**:
- **Fall Semester Tuition Due**: August 25th
- **Spring Semester Tuition Due**: January 15th

#### 🗓️ Monthly Tuition Payment Plan Options:
If you cannot pay the full balance at once, you can set up a 4-Month Payment Plan:
1. Log into **Student Portal** > **Finances & Account Balance**.
2. Click **Set Up Payment Plan** ($30 enrollment fee).
3. Auto-deductions occur on the 1st of every month.

> 💡 *Note*: Setting up a payment plan prevents late fees and holds on course registration!`
                },
                {
                    q: "How do I apply for Scholarships & FAFSA Financial Aid?",
                    prompt: "How can I apply for university scholarships or update my FAFSA?",
                    answer: `### 🎁 Financial Aid & Scholarship Guide

1. **Submit FAFSA / State Aid**:
   - Visit [fafsa.gov](https://fafsa.gov) and enter **University Code: 004812**.
   - Priority filing deadline: **March 2nd**.

2. **University Scholarship Portal**:
   - Access **ScholarshipUniverse** via your student dashboard.
   - Complete your general application profile to automatically match with 200+ internal scholarships!`
                }
            ]
        },
        {
            id: "tech",
            name: "IT & Technical Support",
            icon: "fa-laptop-code",
            color: "#3b82f6",
            faqs: [
                {
                    q: "How do I reset my student Wi-Fi or portal password?",
                    prompt: "How do I reset my forgotten student portal password or reconnect to Eduroam Wi-Fi?",
                    answer: `### 🔐 Password Reset & Campus Wi-Fi Setup

#### 1️⃣ Self-Service Password Reset:
- Go to [identity.university.edu](https://identity.university.edu)
- Click **Forgot Password** and verify via Duo 2FA / Recovery Email.

#### 2️⃣ Connecting to Campus Wi-Fi (Eduroam):
- Network SSID: **eduroam**
- Username: \`your_student_id@university.edu\`
- Password: Your portal password
- Security: WPA2-Enterprise (EAP method: PEAP, Phase 2 authentication: MSCHAPv2).`
                },
                {
                    q: "Where can I get free student software (Microsoft 365, MATLAB)?",
                    prompt: "How do I download free software like Microsoft Office and Adobe Creative Cloud as a student?",
                    answer: `### 💻 Free Student Software Suite

As an enrolled student, you have free access to premium software:
- **Microsoft 365 (Word, Excel, PowerPoint)**: Log in at [office.com](https://office.com) with student email.
- **MATLAB & AutoCAD**: Download via Campus Tech Portal.
- **Adobe Creative Cloud**: Request single sign-on license via IT Helpdesk.`
                }
            ]
        },
        {
            id: "library",
            name: "Library & Study Rooms",
            icon: "fa-book-open",
            color: "#f59e0b",
            faqs: [
                {
                    q: "What are the library hours and how do I reserve a study room?",
                    prompt: "How can I book a group study room in the central library?",
                    answer: `### 📚 Library Hours & Room Booking

#### ⏱️ Library Operating Hours:
- **Monday – Thursday**: 7:30 AM – Midnight
- **Friday – Saturday**: 9:00 AM – 8:00 PM
- **Sunday**: 11:00 AM – Midnight *(24-Hour Study Commons open all night during finals!)*

#### 🚪 Book a Private Study Room:
1. Visit [libcal.university.edu](https://libcal.university.edu).
2. Select your preferred floor (Floors 2-4: Quiet Study, Floor 1: Group Work).
3. Reserve up to **3 hours per day** using your student email.`
                }
            ]
        },
        {
            id: "campus",
            name: "Housing & Campus Life",
            icon: "fa-building-columns",
            color: "#ec4899",
            faqs: [
                {
                    q: "How do I apply for on-campus housing or dining plans?",
                    prompt: "Where do I apply for dormitory housing and select a meal plan?",
                    answer: `### 🏠 Housing Application & Dining Plans

- **Housing Portal**: Apply at [housing.university.edu](https://housing.university.edu) before **May 1st** for fall guarantee.
- **Meal Plans**: Choose between Unlimited Access, 14-Meal Flex, or Commuter Plans via the **Campus Card Office** in the Student Union.`
                }
            ]
        }
    ]
};

// Export to window
if (typeof window !== "undefined") {
    window.CONFIG = CONFIG;
}
