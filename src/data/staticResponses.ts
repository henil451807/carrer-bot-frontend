export const staticResponses: Record<string, string> = {
    default: "I'm here to help you with your career! I can provide guidance on career paths, education, skills development, and job opportunities. What would you like to know?",

    greeting: "Hello! Welcome to Career Bot. I'm here to assist you in navigating your career journey. How can I help you today?",

    career: "Career planning is an important step! I can help you explore different career paths, understand required qualifications, and guide you through the decision-making process. What specific area are you interested in?",

    education: "Education is key to career success! Whether you're looking for degree programs, certifications, or skill development courses, I can provide recommendations based on your career goals. What field interests you?",

    skills: "Building the right skills is crucial! I can suggest relevant skills for your desired career path, recommend learning resources, and help you create a development plan. What skills are you looking to develop?",

    job: "Looking for job opportunities? I can help you understand job market trends, prepare for interviews, and guide you on how to make your application stand out. What type of role are you targeting?",
};

export const getResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();

    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
        return staticResponses.greeting;
    }

    if (message.includes('career') || message.includes('path')) {
        return staticResponses.career;
    }

    if (message.includes('education') || message.includes('study') || message.includes('degree')) {
        return staticResponses.education;
    }

    if (message.includes('skill') || message.includes('learn')) {
        return staticResponses.skills;
    }

    if (message.includes('job') || message.includes('work') || message.includes('employment')) {
        return staticResponses.job;
    }

    return staticResponses.default;
};

export const initialMessages = [
    {
        id: '1',
        text: "Welcome to Career Bot! I'm here to help you navigate your career journey. I can assist you with career guidance, education paths, skill development, and job opportunities.",
        sender: 'bot' as const,
        timestamp: new Date(),
    },
    {
        id: '2',
        text: "To get started, feel free to ask me anything about careers, education, or professional development. What would you like to know?",
        sender: 'bot' as const,
        timestamp: new Date(),
    },
];
