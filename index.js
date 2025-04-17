const toggleFormButton = document.getElementById('toggleFormButton');
        const feedbackForm = document.getElementById('form-container');

        toggleFormButton.addEventListener('click', () => {
            if (feedbackForm.style.display === 'none'  || feedbackForm.style.display === '') {
                feedbackForm.style.display = 'block';
                toggleFormButton.innerText = 'Hide Feedback Form';
            } else {
                feedbackForm.style.display = 'none';
                toggleFormButton.innerText = 'Show Feedback Form';
            }
        });

// AI Health Assistant functionality
const API_KEY = 'AIzaSyA4UzU2Kx-iTxRKpxkHdHWVsfhvyRXTTgs';

// Track conversation state
let isHealthConversation = false;

// List of fitness and mental health related keywords
const healthKeywords = [
    // Greetings
    'hi', 'hello', 'hey', 'whatsup', 'what\'s up', 'howdy', 'greetings',
    'good morning', 'good afternoon', 'good evening', 'sup',
    
    // Fitness related keywords
    'fitness', 'exercise', 'workout', 'gym', 'training', 'muscle', 'weight',
    'diet', 'nutrition', 'protein', 'cardio', 'strength', 'flexibility',
    'yoga', 'pilates', 'aerobics', 'bodybuilding', 'health', 'wellness',
    'abs', 'biceps', 'triceps', 'chest', 'back', 'legs', 'shoulders',
    'calories', 'fat', 'weight loss', 'weight gain', 'recovery', 'stretching',
    'posture', 'endurance', 'sports', 'running', 'swimming', 'cycling',
    'fitness goals', 'fitness routine', 'workout plan', 'exercise form',
    'injury prevention', 'rehabilitation', 'fitness equipment', 'supplements',
    
    // Mental health related keywords
    'mental health', 'stress', 'anxiety', 'depression', 'mindfulness',
    'meditation', 'self-care', 'mental wellness', 'emotional health',
    'psychological', 'therapy', 'counseling', 'mental fitness', 'mindset',
    'motivation', 'confidence', 'self-esteem', 'mental strength',
    'cognitive health', 'brain health', 'mental clarity', 'focus',
    'concentration', 'sleep', 'relaxation', 'mental resilience',
    'emotional intelligence', 'mental balance', 'psychological well-being',
    'stress management', 'anxiety relief', 'depression management',
    'mental recovery', 'mental energy', 'mental fatigue', 'brain fog',
    'mental performance', 'cognitive function', 'mental focus',
    'emotional stability', 'mental toughness', 'psychological health',
    
    // Emotional and mood-related keywords
    'sad', 'happy', 'angry', 'fear', 'worry', 'lonely', 'isolated',
    'overwhelmed', 'hopeless', 'worthless', 'guilty', 'shame',
    'emotional pain', 'emotional distress', 'mood swings', 'mood',
    'feelings', 'emotions', 'emotional support', 'coping',
    'suicidal thoughts', 'self-harm', 'panic', 'panic attack',
    'social anxiety', 'phobia', 'trauma', 'ptsd', 'bipolar',
    'eating disorder', 'ocd', 'adhd', 'autism', 'schizophrenia',
    'mental illness', 'mental disorder', 'psychiatric',
    'emotional well-being', 'emotional healing', 'emotional recovery',
    'emotional support', 'emotional crisis', 'emotional breakdown',
    'emotional stability', 'emotional regulation', 'emotional intelligence',
    'emotional health', 'emotional wellness', 'emotional balance'
];

function isHealthRelated(question) {
    const lowerQuestion = question.toLowerCase();
    return healthKeywords.some(keyword => lowerQuestion.includes(keyword.toLowerCase()));
}

function isGreeting(question) {
    const greetings = ['hi', 'hello', 'hey', 'whatsup', 'what\'s up', 'howdy', 'greetings', 'good morning', 'good afternoon', 'good evening', 'sup'];
    return greetings.some(greeting => question.toLowerCase().includes(greeting));
}

async function sendMessage() {
    const userInput = document.getElementById('user-input');
    const chatMessages = document.getElementById('chat-messages');
    
    if (userInput.value.trim() === '') return;

    const userQuestion = userInput.value;
    
    // Add user message to chat
    const userMessage = document.createElement('div');
    userMessage.className = 'message user';
    userMessage.innerHTML = `<p>${userQuestion}</p>`;
    chatMessages.appendChild(userMessage);

    // Clear input
    userInput.value = '';

    // Handle greetings
    if (isGreeting(userQuestion)) {
        const greetingMessage = document.createElement('div');
        greetingMessage.className = 'message bot';
        greetingMessage.innerHTML = '<p>Hello! I\'m your AI Health Assistant. How can I help you with fitness or mental health today?</p>';
        chatMessages.appendChild(greetingMessage);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return;
    }

    // Check if the question is health-related (only for first interaction)
    if (!isHealthConversation && !isHealthRelated(userQuestion)) {
        const notHealthMessage = document.createElement('div');
        notHealthMessage.className = 'message bot';
        notHealthMessage.innerHTML = '<p>I can only answer questions related to physical fitness, mental health, and overall wellness. Please ask me about exercise, nutrition, mental health, or other health-related topics.</p>';
        chatMessages.appendChild(notHealthMessage);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return;
    }

    // Set conversation state to health-related if it's a health question
    if (isHealthRelated(userQuestion)) {
        isHealthConversation = true;
    }

    // Show loading indicator
    const loadingMessage = document.createElement('div');
    loadingMessage.className = 'message bot';
    loadingMessage.innerHTML = '<p>Thinking...</p>';
    chatMessages.appendChild(loadingMessage);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    try {
        // Prepare the prompt based on conversation state
        let prompt;
        if (isHealthConversation) {
            prompt = `As a helpful AI assistant, please provide a concise but informative response (3-4 sentences maximum) to this question. Focus on the key points and most important information. If it's about health, fitness, or mental wellness, provide expert advice. For other topics, provide clear and helpful information. Keep the response brief but complete. Question: ${userQuestion}`;
        } else {
            prompt = `As a certified fitness and mental health expert, please provide a brief, concise response (2-3 sentences maximum) to this health-related question. Focus on the most important information. Question: ${userQuestion}`;
        }

        // Call Gemini API
        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + API_KEY, {
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

        const data = await response.json();
        
        // Remove loading message
        chatMessages.removeChild(loadingMessage);

        // Add bot response
        const botMessage = document.createElement('div');
        botMessage.className = 'message bot';
        botMessage.innerHTML = `<p>${data.candidates[0].content.parts[0].text}</p>`;
        chatMessages.appendChild(botMessage);
    } catch (error) {
        // Remove loading message
        chatMessages.removeChild(loadingMessage);

        // Add error message
        const errorMessage = document.createElement('div');
        errorMessage.className = 'message bot';
        errorMessage.innerHTML = '<p>Sorry, I encountered an error. Please try again later.</p>';
        chatMessages.appendChild(errorMessage);
    }

    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Add event listener for Enter key
document.getElementById('user-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});