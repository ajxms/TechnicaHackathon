// Student data storage
let studentData = {
    name: '',
    email: '',
    university: '',
    grade: '',
    major: '',
    degree: '',
    credits: 0,
    partTime: false,
    courses: [], // Completed courses only
    plannedCourses: [], // Courses added from recommendations
    selectedGoal: ''
};

let selectedGoal = '';
let screenHistory = [];
let currentScreen = 'startScreen';

// Screen navigation
function showScreen(screenId, addToHistory = true) {
    if (addToHistory && currentScreen !== screenId) {
        screenHistory.push(currentScreen);
    }
    
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
    currentScreen = screenId;
    
    updateBackButton();
    updateProfileButton();
}

function goBack() {
    if (screenHistory.length > 0) {
        const previousScreen = screenHistory.pop();
        showScreen(previousScreen, false);
    }
}

function updateBackButton() {
    const backButton = document.getElementById('backButton');
    const noBackScreens = ['loginScreen', 'signupScreen'];
    
    if (noBackScreens.includes(currentScreen) || screenHistory.length === 0) {
        backButton.style.display = 'none';
    } else {
        backButton.style.display = 'block';
    }
}

function updateProfileButton() {
    const profileButton = document.getElementById('profileButton');
    const noProfileScreens = ['loginScreen', 'signupScreen'];
    
    if (noProfileScreens.includes(currentScreen)) {
        profileButton.style.display = 'none';
    } else {
        profileButton.style.display = 'block';
    }
}

function showProfile() {
    updateProfileDisplay();
    showScreen('profileScreen');
}

function updateProfileDisplay() {
    document.getElementById('profileName').textContent = studentData.name || '-';
    document.getElementById('profileEmail').textContent = studentData.email || '-';
    document.getElementById('profileUniversity').textContent = studentData.university || '-';
    document.getElementById('profileGrade').textContent = studentData.grade || '-';
    document.getElementById('profileMajor').textContent = studentData.major || '-';
    document.getElementById('profileDegree').textContent = studentData.degree || '-';
    document.getElementById('profileCredits').textContent = studentData.credits || '0';
    document.getElementById('profileStatus').textContent = studentData.partTime ? 'Part-time' : 'Full-time';
    
    const courseListDiv = document.getElementById('profileCourseList');
    const allCourses = [
        ...studentData.courses.map(c => ({...c, status: 'completed'})),
        ...studentData.plannedCourses.map(c => ({...c, status: 'planned'}))
    ];
    
    if (allCourses.length === 0) {
        courseListDiv.innerHTML = '<p style="color: #8b92a8;">No courses added yet</p>';
    } else {
        courseListDiv.innerHTML = allCourses.map((course, index) => `
            <div class="profile-row">
                <span class="profile-label">${course.name}</span>
                <span class="profile-value ${course.status === 'planned' ? 'planned-badge' : ''}">${course.grade || (course.status === 'planned' ? '📅 Planned' : 'No grade')}</span>
            </div>
        `).join('');
    }
}

// Login/Signup functions
function login() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        alert('Please enter email and password');
        return;
    }

    // Use in-memory storage instead of localStorage
    const users = window.usersData || {};
    if (users[email] && users[email].password === password) {
        studentData = users[email].data;
        screenHistory = [];
        if (studentData.university) {
            showScreen('goalScreen');
        } else {
            showScreen('infoScreen');
        }
    } else {
        alert('Invalid credentials');
    }
}

function signup() {
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    
    if (!name || !email || !password) {
        alert('Please fill all fields');
        return;
    }

    const users = window.usersData || {};
    if (users[email]) {
        alert('User already exists');
        return;
    }

    studentData.name = name;
    studentData.email = email;
    users[email] = { password, data: studentData };
    window.usersData = users;
    
    screenHistory = [];
    showScreen('infoScreen');
}

function logout() {
    studentData = {
        name: '',
        email: '',
        university: '',
        grade: '',
        major: '',
        degree: '',
        credits: 0,
        partTime: false,
        courses: [],
        plannedCourses: [],
        selectedGoal: ''
    };
    selectedGoal = '';
    screenHistory = [];
    showScreen('loginScreen', false);
    document.getElementById('loginEmail').value = '';
    document.getElementById('loginPassword').value = '';
}

// Save student info
function saveInfoAndNext() {
    studentData.university = document.getElementById('university').value;
    studentData.grade = document.getElementById('grade').value;
    studentData.major = document.getElementById('major').value;
    studentData.degree = document.getElementById('degree').value;
    studentData.credits = parseInt(document.getElementById('credits').value) || 0;
    studentData.partTime = document.getElementById('partTime').checked;

    if (!studentData.university || !studentData.grade || !studentData.major) {
        alert('Please fill all required fields');
        return;
    }

    // Save to in-memory storage
    const users = window.usersData || {};
    if (users[studentData.email]) {
        users[studentData.email].data = studentData;
        window.usersData = users;
    }

    showScreen('courseHistoryScreen');
}

// Course management
function addCourse() {
    const name = document.getElementById('courseName').value;
    const grade = document.getElementById('courseGrade').value;

    if (!name) {
        alert('Please enter a course name');
        return;
    }

    studentData.courses.push({ name, grade });
    document.getElementById('courseName').value = '';
    document.getElementById('courseGrade').value = '';
    
    renderCourseList();
}

function removeCourse(index) {
    studentData.courses.splice(index, 1);
    renderCourseList();
}

function renderCourseList() {
    const list = document.getElementById('courseList');
    list.innerHTML = studentData.courses.map((course, i) => `
        <div class="course-item">
            <div class="course-info">
                <div class="course-name">${course.name}</div>
                ${course.grade ? `<div class="course-grade">Grade: ${course.grade}</div>` : ''}
            </div>
            <button class="btn-remove" onclick="removeCourse(${i})">Remove</button>
        </div>
    `).join('');
}

// Goal selection
function selectGoal(goal) {
    document.querySelectorAll('.goal-card').forEach(c => c.classList.remove('selected'));
    event.target.closest('.goal-card').classList.add('selected');
    selectedGoal = goal;
    studentData.selectedGoal = goal;
}

// Generate recommendations using Gemini API
async function generateRecommendations() {
    if (!selectedGoal) {
        alert('Please select a goal first');
        return;
    }

    showScreen('loadingScreen', false);

    const minCredits = document.getElementById('minCredits').value;
    const maxCredits = document.getElementById('maxCredits').value;
    const additionalPrompt = document.getElementById('additionalPrompt').value;

    const prompt = `You are a college academic advisor AI. Based on the following student information, recommend 4-6 courses for the next semester.

Student Profile:
- University: ${studentData.university}
- Year: ${studentData.grade}
- Major: ${studentData.major}
- Degree: ${studentData.degree}
- Total Credits Completed: ${studentData.credits}
- Part-time Student: ${studentData.partTime ? 'Yes' : 'No'}
- Goal: ${getGoalDescription(selectedGoal)}
- Credit Range: ${minCredits}-${maxCredits} credits

Courses Already COMPLETED (with grades):
${studentData.courses.length > 0 ? studentData.courses.map(c => `- ${c.name}${c.grade ? ' (Grade: ' + c.grade + ')' : ''}`).join('\n') : 'No completed courses listed'}

Courses PLANNED for Future Semesters (do NOT recommend these):
${studentData.plannedCourses.length > 0 ? studentData.plannedCourses.map(c => `- ${c.name}`).join('\n') : 'No planned courses'}

${additionalPrompt ? `Additional Preferences:\n${additionalPrompt}` : ''}

Please provide a course schedule recommendation. For each course, include:
1. Course name and code
2. Number of credits
3. A detailed reason why this course is recommended (2-3 sentences)

Format your response as a JSON array with this structure:
[
  {
    "courseName": "Course Code: Full Course Name",
    "credits": 3,
    "reason": "Detailed explanation of why this course is recommended"
  }
]
CRITICAL INSTRUCTIONS: 
- Review BOTH the completed courses AND planned courses lists
- DO NOT recommend any course from the "Courses PLANNED" list
- DO NOT recommend any course that is clearly a lower-level prerequisite or equivalent of courses already completed
- The courses selected must advance the student's degree progress beyond what they've already completed AND planned`;

    try {
        const response = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=AIzaSyC6MQh4_Kh9Vt9a49YPbc_Mqy8LMz4ezq4', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`API Error: ${errorData.error?.message || response.statusText}`);
        }

        const data = await response.json();
        console.log('API Response:', data);
        
        if (!data.candidates || !data.candidates[0]) {
            throw new Error('No response from API');
        }
        
        const text = data.candidates[0].content.parts[0].text;
        console.log('Generated text:', text);
        
        // Parse the JSON response - handle markdown code blocks
        let jsonText = text;
        if (text.includes('```json')) {
            jsonText = text.split('```json')[1].split('```')[0].trim();
        } else if (text.includes('```')) {
            jsonText = text.split('```')[1].split('```')[0].trim();
        }
        
        const jsonMatch = jsonText.match(/\[[\s\S]*\]/);
        if (!jsonMatch) {
            throw new Error('Could not parse course recommendations from response');
        }
        
        const courses = JSON.parse(jsonMatch[0]);
        
        if (!courses || courses.length === 0) {
            throw new Error('No courses were recommended');
        }
        
        displayResults(courses);
    } catch (error) {
        console.error('Full Error:', error);
        document.getElementById('resultsContainer').innerHTML = `
            <div class="error-message">
                <strong>Error generating recommendations:</strong><br>
                ${error.message}<br><br>
                <small>Check the browser console (F12) for more details.</small>
            </div>
        `;
        showScreen('resultsScreen');
    }
}

function getGoalDescription(goal) {
    const goals = {
        'major': 'Focus on challenging courses specific to the major',
        'gateway': 'Fulfill gateway and prerequisite requirements for the major',
        'gened': 'Complete general education requirements',
        'balanced': 'A balanced mix of major courses and general education'
    };
    return goals[goal] || '';
}

function displayResults(courses) {
    const container = document.getElementById('resultsContainer');
    const totalCredits = courses.reduce((sum, c) => sum + c.credits, 0);
    
    container.innerHTML = `
        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <strong>Total Credits: ${totalCredits}</strong>
        </div>
        ${courses.map((course, i) => `
            <div class="result-card">
                <div class="result-header">
                    <div class="course-title">${course.courseName}</div>
                    <div class="course-credits">${course.credits} credits</div>
                </div>
                <div class="course-reason">${course.reason}</div>
                <button class="btn-remove" onclick="removeCourseFromResults(${i})">Remove from Schedule</button>
            </div>
        `).join('')}
    `;
    
    showScreen('resultsScreen');
}

function removeCourseFromResults(index) {
    const container = document.getElementById('resultsContainer');
    const cards = container.querySelectorAll('.result-card');
    cards[index].remove();
}

// Add recommended courses to student history
function addRecommendedCoursesToHistory() {
    const container = document.getElementById('resultsContainer');
    const cards = container.querySelectorAll('.result-card');
    
    if (cards.length === 0) {
        alert('No courses to add!');
        return;
    }
    
    let addedCount = 0;
    cards.forEach(card => {
        const courseName = card.querySelector('.course-title').textContent;
        
        // Check if course already exists in completed OR planned courses
        const existsInCompleted = studentData.courses.some(c => c.name === courseName);
        const existsInPlanned = studentData.plannedCourses.some(c => c.name === courseName);
        
        if (!existsInCompleted && !existsInPlanned) {
            studentData.plannedCourses.push({ 
                name: courseName, 
                grade: '' // No grade yet since they haven't taken it
            });
            addedCount++;
        }
    });
    
    // Save to in-memory storage
    const users = window.usersData || {};
    if (users[studentData.email]) {
        users[studentData.email].data = studentData;
        window.usersData = users;
    }
    
    // Show success message
    if (addedCount > 0) {
        const successMsg = document.createElement('div');
        successMsg.className = 'success-message';
        successMsg.innerHTML = `<strong>Success!</strong> ${addedCount} course(s) added to your planned courses. You can view them in your profile.`;
        
        const resultsContainer = document.getElementById('resultsContainer');
        resultsContainer.insertBefore(successMsg, resultsContainer.firstChild);
        
        // Remove success message after 5 seconds
        setTimeout(() => {
            successMsg.remove();
        }, 5000);
        
        // Update course list if we're on that screen
        renderCourseList();
    } else {
        alert('All courses are already in your history or planned courses!');
    }
}

// Initialize
renderCourseList();