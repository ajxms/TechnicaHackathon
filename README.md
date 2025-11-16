# TechnicaHackathon
AI Course Advisor: Functionality and Real-World Application
    This application serves as a dynamic, AI-powered tool to assist university students in optimizing their academic course selection for an upcoming semester. By combining structured user input with        100generative AI, it addresses the common real-world challenge of building a balanced and progress-focused schedule.

Core Problem
    Many college students are confused about what classes to take at the beginning of their college life or their next semester. Sure they could talk to an advisor, but it would mean going through the       hassle of being on weekdays in the office hours and schedule an appointment with the advisor, which takes an unnecessarily long amount of time. They wouldn’t get immediate feedback on their problems.

Functionality
    The program's functionality is structured across several sequential screens, designed to gather comprehensive data before generating recommendations.

1. Student Profile Data Collection
    The initial screens focus on building a foundational profile by capturing crucial details like University, Major, Year, and Degree Program (B.S., B.A.). It records the Total Credits Completed,           allowing the AI to gauge the student's current standing and remaining requirements. The Course History feature allows students to log courses taken and their grades. This data is critical for the AI     to avoid recommending redundant courses, determine if a student meets prerequisites, and gauge their academic strengths and weaknesses.

2. Goal Setting and Constraint Definition
    This is where the student defines the parameters for the AI's task. The student explicitly chooses an overall focus (e.g., Major Courses, Gen Eds), which steers the AI's recommendations        toward the student's immediate and long term priorities. Students also define a desired Credit Range, ensuring the schedule meets full-time requirements while respecting the student’s capacity. Furthermore, the Additional Preferences allows for the use of natural language constraints.

3. AI-Powered Recommendation Generation
    The core function dynamically assembles a single, detailed prompt using all the collected data points (profile, history, goals, and constraints). This prompt is sent to the Gemini API, which             acts as an academic advisor. The AI is instructed to return a strict JSON array format, providing a list of recommended courses, credits, and a clear, detailed justification explaining why the           course was selected. The final Results Screen displays this justified schedule.

Real-World Uses and Value
    The AI Course Advisor provides immense value in an academic setting by solving logistical and strategic planning issues for both students and advisors.

Streamlining Academic Advising
    The tool acts as a powerful supplement to human advising. It reduces the time professional advisors spend on routine tasks like initial schedule creation and prerequisite checking. By automating the     first draft of the schedule, it frees up advisors to focus on more complex, high-value tasks such as career counseling, mentoring, and assisting students with mental health or academic struggles.

Preventing Scheduling Errors
    Students often make costly mistakes, such as registering for courses they aren't qualified for or selecting courses that don't satisfy degree requirements. The AI's ability to analyze a student's        history and match it against the optimal degree path minimizes the chance of these scheduling errors, reducing the risk of delayed graduation and wasted tuition money.

Optimizing Degree Completion
    The application helps students choose the most efficient path to graduation. By prioritizing bottleneck courses or strategically tackling difficult General Education requirements, the AI ensures the     student is always moving forward. For students managing outside obligations, the tool creates schedules that are not only academically sound but also sustainable, by incorporating part-time status       and time-of-day preferences.

Personalized Exploration and Electives
    Beyond core requirements, the application leverages the generative AI's knowledge to provide unique course discovery. Students can input broad interests and receive relevant, tailored course             suggestions that they might not have found by simply scrolling through a static course catalog. This encourages exploration while maintaining focus on degree progress.
