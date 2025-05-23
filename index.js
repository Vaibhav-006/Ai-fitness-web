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

function calculateBMI() {
    const height = parseFloat(document.getElementById('bmi-height').value);
    const weight = parseFloat(document.getElementById('bmi-weight').value);

    // Validate inputs
    if (isNaN(height) || isNaN(weight) || height <= 0 || weight <= 0) {
        alert('Please enter valid height and weight values');
        return;
    }

    // Calculate BMI (weight in kg / (height in m)^2)
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    const roundedBMI = bmi.toFixed(1);

    // Determine BMI category
    let category = '';
    let categoryColor = '';

    if (bmi < 18.5) {
        category = 'Underweight';
        categoryColor = '#4CAF50'; // Green
    } else if (bmi < 25) {
        category = 'Normal weight';
        categoryColor = '#2196F3'; // Blue
    } else if (bmi < 30) {
        category = 'Overweight';
        categoryColor = '#FFC107'; // Yellow
    } else {
        category = 'Obesity';
        categoryColor = '#F44336'; // Red
    }

    // Update the result display
    document.getElementById('bmi-value').textContent = roundedBMI;
    document.getElementById('bmi-category').textContent = category;
    document.getElementById('bmi-category').style.color = categoryColor;
}

// Blog content data
const blogContents = {
    1: {
        title: "10 Ways to Stay Motivated in Your Fitness Journey",
        content: `
            <h2>10 Ways to Stay Motivated in Your Fitness Journey</h2>
            <p>Maintaining motivation in your fitness journey can be challenging, but with the right strategies, you can stay on track and achieve your goals. Here are 10 proven ways to keep yourself motivated:</p>
            
            <h3>1. Set Clear, Achievable Goals</h3>
            <p>Start by setting specific, measurable, and realistic goals. Break down your long-term goals into smaller, manageable milestones that you can celebrate along the way.</p>
            
            <h3>2. Track Your Progress</h3>
            <p>Keep a workout journal or use a fitness app to track your progress. Seeing your improvements over time can be incredibly motivating.</p>
            
            <h3>3. Find a Workout Buddy</h3>
            <p>Having a workout partner can provide accountability and make your fitness journey more enjoyable. You can motivate each other and celebrate successes together.</p>
            
            <h3>4. Mix Up Your Routine</h3>
            <p>Prevent boredom by trying new exercises, classes, or workout styles. Variety keeps things interesting and challenges different muscle groups.</p>
            
            <h3>5. Reward Yourself</h3>
            <p>Set up a reward system for reaching your milestones. Treat yourself to something you enjoy when you achieve your goals.</p>
            
            <h3>6. Focus on How You Feel</h3>
            <p>Pay attention to the positive changes in your energy levels, mood, and overall well-being. These internal rewards can be powerful motivators.</p>
            
            <h3>7. Create a Supportive Environment</h3>
            <p>Surround yourself with people who support your fitness goals and create a workout space that inspires you to exercise.</p>
            
            <h3>8. Visualize Your Success</h3>
            <p>Take time to visualize yourself achieving your fitness goals. This mental practice can strengthen your motivation and commitment.</p>
            
            <h3>9. Learn from Setbacks</h3>
            <p>View challenges and setbacks as learning opportunities rather than failures. Use them to adjust your approach and grow stronger.</p>
            
            <h3>10. Celebrate Small Wins</h3>
            <p>Acknowledge and celebrate every achievement, no matter how small. This positive reinforcement will keep you motivated to continue.</p>
        `
    },
    2: {
        title: "Essential Nutrition Tips for Muscle Growth",
        content: `
            <h2>Essential Nutrition Tips for Muscle Growth</h2>
            <p>Building muscle requires more than just lifting weights. Proper nutrition plays a crucial role in muscle development and recovery. Here's what you need to know:</p>
            
            <h3>1. Protein Intake</h3>
            <p>Protein is the building block of muscle. Aim for 1.6-2.2 grams of protein per kilogram of body weight daily. Include high-quality protein sources like:</p>
            <ul>
                <li>Lean meats (chicken, turkey, lean beef)</li>
                <li>Fish (salmon, tuna, cod)</li>
                <li>Eggs and dairy products</li>
                <li>Plant-based proteins (beans, lentils, tofu)</li>
            </ul>
            
            <h3>2. Carbohydrates for Energy</h3>
            <p>Carbs provide the energy needed for intense workouts. Focus on complex carbohydrates like:</p>
            <ul>
                <li>Whole grains (brown rice, quinoa, oats)</li>
                <li>Sweet potatoes</li>
                <li>Fruits and vegetables</li>
            </ul>
            
            <h3>3. Healthy Fats</h3>
            <p>Don't neglect healthy fats, which are essential for hormone production and overall health. Include:</p>
            <ul>
                <li>Avocados</li>
                <li>Nuts and seeds</li>
                <li>Olive oil</li>
                <li>Fatty fish</li>
            </ul>
            
            <h3>4. Timing Your Meals</h3>
            <p>Eat protein-rich meals every 3-4 hours to maintain a positive nitrogen balance. Have a protein-rich snack before and after workouts.</p>
            
            <h3>5. Hydration</h3>
            <p>Stay well-hydrated to support muscle function and recovery. Aim for at least 2-3 liters of water daily, more if you're training intensely.</p>
            
            <h3>6. Supplements</h3>
            <p>While whole foods should be your primary source of nutrients, consider these supplements:</p>
            <ul>
                <li>Whey protein</li>
                <li>Creatine</li>
                <li>BCAAs</li>
                <li>Multivitamins</li>
            </ul>
        `
    },
    3: {
        title: "Importance of Recovery in Your Workout Routine",
        content: `
            <h2>Importance of Recovery in Your Workout Routine</h2>
            <p>Recovery is just as important as the workout itself. Proper recovery allows your muscles to repair, rebuild, and grow stronger. Here's why recovery matters and how to optimize it:</p>
            
            <h3>1. Muscle Repair and Growth</h3>
            <p>During recovery, your body repairs the microscopic damage to muscle fibers caused by exercise. This repair process is what leads to muscle growth and increased strength.</p>
            
            <h3>2. Preventing Overtraining</h3>
            <p>Signs of overtraining include:</p>
            <ul>
                <li>Persistent muscle soreness</li>
                <li>Decreased performance</li>
                <li>Increased resting heart rate</li>
                <li>Mood changes</li>
                <li>Sleep disturbances</li>
            </ul>
            
            <h3>3. Recovery Strategies</h3>
            <p>Implement these recovery techniques:</p>
            <ul>
                <li>Get 7-9 hours of quality sleep</li>
                <li>Stay hydrated throughout the day</li>
                <li>Eat protein-rich meals</li>
                <li>Include active recovery days</li>
                <li>Practice stretching and mobility work</li>
            </ul>
            
            <h3>4. Active Recovery</h3>
            <p>Active recovery involves low-intensity exercise that promotes blood flow without causing additional stress. Examples include:</p>
            <ul>
                <li>Light walking</li>
                <li>Yoga</li>
                <li>Swimming</li>
                <li>Cycling at a relaxed pace</li>
            </ul>
            
            <h3>5. Nutrition for Recovery</h3>
            <p>Post-workout nutrition is crucial for recovery. Focus on:</p>
            <ul>
                <li>Protein for muscle repair</li>
                <li>Carbohydrates to replenish glycogen</li>
                <li>Anti-inflammatory foods</li>
                <li>Electrolytes for hydration</li>
            </ul>
            
            <h3>6. Listen to Your Body</h3>
            <p>Pay attention to your body's signals and adjust your training accordingly. If you're feeling excessively tired or sore, take an extra rest day.</p>
        `
    }
};

function showBlogContent(blogId) {
    const modal = document.getElementById('blogModal');
    const content = document.getElementById('blogContent');
    
    if (blogContents[blogId]) {
        content.innerHTML = blogContents[blogId].content;
        modal.style.display = 'block';
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        modal.style.zIndex = '9999';
        modal.style.overflowY = 'auto';
    }
}

function closeBlogModal() {
    const modal = document.getElementById('blogModal');
    modal.style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('blogModal');
    if (event.target == modal) {
        closeBlogModal();
    }
}

// Diet Plan Generator Functions
function openDietPlanModal() {
    const modal = document.getElementById('dietPlanModal');
    if (modal) {
        modal.style.display = 'block';
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        modal.style.zIndex = '9999';
        modal.style.overflowY = 'auto';
        
        // Clear any previous results
        const resultDiv = document.getElementById('dietPlanResult');
        if (resultDiv) {
            resultDiv.innerHTML = '';
        }
    }
}

function closeDietPlanModal() {
    const modal = document.getElementById('dietPlanModal');
    if (modal) {
        modal.style.display = 'none';
        // Clear the results
        const resultDiv = document.getElementById('dietPlanResult');
        if (resultDiv) {
            resultDiv.innerHTML = '';
        }
    }
}

function calculateBMR(weight, height, age, gender) {
    // Mifflin-St Jeor Equation
    let bmr = 10 * weight + 6.25 * height - 5 * age;
    if (gender === 'male') {
        bmr += 5;
    } else {
        bmr -= 161;
    }
    return Math.round(bmr);
}

function calculateTDEE(bmr, activity) {
    const activityMultipliers = {
        'sedentary': 1.2,
        'light': 1.375,
        'moderate': 1.55,
        'very': 1.725,
        'extra': 1.9
    };
    return Math.round(bmr * activityMultipliers[activity]);
}

function adjustCaloriesForGoal(tdee, goal) {
    const adjustments = {
        'weight_loss': -500,
        'muscle_gain': 500,
        'maintenance': 0
    };
    return tdee + adjustments[goal];
}

// Add event listener for the generate button
document.addEventListener('DOMContentLoaded', function() {
    const generateBtn = document.querySelector('.generate-btn');
    if (generateBtn) {
        generateBtn.addEventListener('click', generateDietPlan);
        console.log('Generate button event listener added');
    } else {
        console.error('Generate button not found');
    }
});

async function generateDietPlan() {
    console.log('Generate Diet Plan function called');
    
    const age = document.getElementById('age').value;
    const gender = document.getElementById('gender').value;
    const weight = document.getElementById('weight').value;
    const height = document.getElementById('height').value;
    const activity = document.getElementById('activity').value;
    const goal = document.getElementById('goal').value;
    const allergies = document.getElementById('allergies').value;

    console.log('Form values:', { age, gender, weight, height, activity, goal, allergies });

    // Validate inputs
    if (!age || !weight || !height) {
        alert('Please fill in all required fields');
        return;
    }

    // Show loading state
    const resultDiv = document.getElementById('dietPlanResult');
    if (!resultDiv) {
        console.error('Result div not found');
        return;
    }
    resultDiv.innerHTML = '<p>Generating your personalized diet plan...</p>';

    try {
        // Calculate BMR and daily calorie needs
        const bmr = calculateBMR(weight, height, age, gender);
        const tdee = calculateTDEE(bmr, activity);
        const calorieGoal = adjustCaloriesForGoal(tdee, goal);

        console.log('Calculated values:', { bmr, tdee, calorieGoal });

        // Generate diet plan using Gemini API
        const prompt = `Create a concise 7-day diet plan for a ${age}-year-old ${gender} who is ${height}cm tall and weighs ${weight}kg. 
        Activity level: ${activity}. 
        Goal: ${goal}. 
        Allergies/Preferences: ${allergies}. 
        Daily calorie target: ${calorieGoal} calories. 
        Include breakfast, lunch, dinner, and 2 snacks for each day. 
        Format as a simple HTML table with days as rows and meals as columns. 
        Include approximate calories and macros for each meal. 
        Keep the response focused only on the meal plan without extra explanations.`;

        console.log('Making API request...');
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

        console.log('API Response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`API request failed with status: ${response.status}`);
        }

        const data = await response.json();
        console.log('API Response data:', data);
        
        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts || !data.candidates[0].content.parts[0]) {
            throw new Error('Invalid API response format');
        }

        const dietPlan = data.candidates[0].content.parts[0].text;
        console.log('Generated diet plan:', dietPlan);

        // Display the diet plan
        resultDiv.innerHTML = `
            <h3>Your Personalized Diet Plan</h3>
            <div class="plan-details">
                <p><strong>Daily Calorie Target:</strong> ${calorieGoal} calories</p>
            </div>
            <div class="meal-plan">
                ${dietPlan}
            </div>
        `;

        // Make sure the modal is visible and properly positioned
        const modal = document.getElementById('dietPlanModal');
        if (modal) {
            modal.style.display = 'block';
            modal.style.position = 'fixed';
            modal.style.top = '0';
            modal.style.left = '0';
            modal.style.width = '100%';
            modal.style.height = '100%';
            modal.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            modal.style.zIndex = '9999';
            modal.style.overflowY = 'auto';
        }

        // Scroll to the top of the modal content
        const modalContent = document.querySelector('.modal-content');
        if (modalContent) {
            modalContent.scrollTop = 0;
        }
    } catch (error) {
        console.error('Error generating diet plan:', error);
        resultDiv.innerHTML = `
            <p>Sorry, there was an error generating your diet plan. Please try again later.</p>
            <p>Error details: ${error.message}</p>
        `;
    }
}
       

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('dietPlanModal');
    if (event.target == modal) {
        closeDietPlanModal();
    }
}

  
// Health Trackers
let caloriesConsumed = 0;
let waterConsumed = 0;
const calorieGoal = 2000;
const waterGoal = 2000;

// Initialize trackers from localStorage
document.addEventListener('DOMContentLoaded', function() {
    // Load saved data
    const savedCalories = localStorage.getItem('caloriesConsumed');
    const savedWater = localStorage.getItem('waterConsumed');
    const savedCalorieLog = localStorage.getItem('calorieLog');
    const savedWaterLog = localStorage.getItem('waterLog');

    if (savedCalories) {
        caloriesConsumed = parseInt(savedCalories);
        updateCalorieDisplay();
    }

    if (savedWater) {
        waterConsumed = parseInt(savedWater);
        updateWaterDisplay();
    }

    if (savedCalorieLog) {
        document.getElementById('calorie-log').innerHTML = savedCalorieLog;
    }

    if (savedWaterLog) {
        document.getElementById('water-log').innerHTML = savedWaterLog;
    }
});

function addCalories() {
    const input = document.getElementById('calorie-input');
    const calories = parseInt(input.value);
    
    if (isNaN(calories) || calories <= 0) {
        alert('Please enter a valid number of calories');
        return;
    }

    caloriesConsumed += calories;
    updateCalorieDisplay();
    
    // Add to log
    const log = document.getElementById('calorie-log');
    const time = new Date().toLocaleTimeString();
    const logItem = document.createElement('li');
    logItem.innerHTML = `<span>${calories} kcal</span><span>${time}</span>`;
    log.insertBefore(logItem, log.firstChild);
    
    // Save to localStorage
    localStorage.setItem('caloriesConsumed', caloriesConsumed);
    localStorage.setItem('calorieLog', log.innerHTML);
    
    input.value = '';
}

function addWater(amount) {
    waterConsumed += amount;
    updateWaterDisplay();
    
    // Add to log
    const log = document.getElementById('water-log');
    const time = new Date().toLocaleTimeString();
    const logItem = document.createElement('li');
    logItem.innerHTML = `<span>${amount} ml</span><span>${time}</span>`;
    log.insertBefore(logItem, log.firstChild);
    
    // Save to localStorage
    localStorage.setItem('waterConsumed', waterConsumed);
    localStorage.setItem('waterLog', log.innerHTML);
}

function updateCalorieDisplay() {
    const progress = (caloriesConsumed / calorieGoal) * 100;
    document.getElementById('calorie-progress').style.width = `${Math.min(progress, 100)}%`;
    document.getElementById('calories-consumed').textContent = caloriesConsumed;
}

function updateWaterDisplay() {
    const progress = (waterConsumed / waterGoal) * 100;
    document.getElementById('water-progress').style.width = `${Math.min(progress, 100)}%`;
    document.getElementById('water-consumed').textContent = waterConsumed;
}

// Reset trackers at midnight
function resetTrackers() {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const timeUntilMidnight = tomorrow - now;
    
    setTimeout(() => {
        caloriesConsumed = 0;
        waterConsumed = 0;
        updateCalorieDisplay();
        updateWaterDisplay();
        document.getElementById('calorie-log').innerHTML = '';
        document.getElementById('water-log').innerHTML = '';
        localStorage.removeItem('caloriesConsumed');
        localStorage.removeItem('waterConsumed');
        localStorage.removeItem('calorieLog');
        localStorage.removeItem('waterLog');
        resetTrackers(); // Set up next reset
    }, timeUntilMidnight);
}

// Start the reset timer
resetTrackers();

// Fitness Quotes Array
const fitnessQuotes = [
    {
        quote: "The only bad workout is the one that didn't happen.",
        author: "Unknown"
    },
    {
        quote: "Success starts with self-discipline.",
        author: "Unknown"
    },
    {
        quote: "Your body can stand almost anything. It's your mind that you have to convince.",
        author: "Unknown"
    },
    {
        quote: "The pain you feel today will be the strength you feel tomorrow.",
        author: "Unknown"
    },
    {
        quote: "Don't stop when you're tired. Stop when you're done.",
        author: "Unknown"
    },
    {
        quote: "The only way to do great work is to love what you do.",
        author: "Steve Jobs"
    },
    {
        quote: "The difference between try and triumph is just a little umph!",
        author: "Marvin Phillips"
    },
    {
        quote: "The body achieves what the mind believes.",
        author: "Unknown"
    },
    {
        quote: "Every day is another chance to get stronger, to eat better, to live healthier, and to be the best version of you.",
        author: "Unknown"
    },
    {
        quote: "Fitness is not about being better than someone else. It's about being better than you used to be.",
        author: "Unknown"
    }
];

// Function to generate a random quote
function generateNewQuote() {
    const randomIndex = Math.floor(Math.random() * fitnessQuotes.length);
    const quote = fitnessQuotes[randomIndex];
    
    document.getElementById('daily-quote').textContent = quote.quote;
    document.getElementById('quote-author').textContent = `- ${quote.author}`;
}

// Generate initial quote when page loads
document.addEventListener('DOMContentLoaded', generateNewQuote);

// Weekly Challenge Functionality
const challenges = [
    {
        title: "Complete 3 Workouts",
        description: "Complete any 3 workouts this week"
    },
    {
        title: "30 Minutes of Cardio",
        description: "Do 30 minutes of cardio exercise"
    },
    {
        title: "Strength Training",
        description: "Complete a strength training session"
    },
    {
        title: "Stretching Session",
        description: "Do a 15-minute stretching routine"
    },
    {
        title: "Healthy Meal Prep",
        description: "Prepare 3 healthy meals"
    },
    {
        title: "8 Hours of Sleep",
        description: "Get 8 hours of sleep for 3 nights"
    },
    {
        title: "Hydration Goal",
        description: "Drink 2 liters of water daily"
    }
];

let completedChallenges = JSON.parse(localStorage.getItem('completedChallenges')) || [];

function updateProgress() {
    const progressBar = document.querySelector('.progress');
    const progressText = document.querySelector('.progress-text');
    const totalChallenges = challenges.length;
    const completedCount = completedChallenges.length;
    
    const progressPercentage = (completedCount / totalChallenges) * 100;
    progressBar.style.width = `${progressPercentage}%`;
    progressText.textContent = `${completedCount}/${totalChallenges} Challenges Completed`;
}

function renderChallenges() {
    const challengesList = document.querySelector('.challenges-list');
    if (!challengesList) {
        console.error('Challenges list element not found');
        return;
    }
    
    challengesList.innerHTML = '';
    
    challenges.forEach((challenge, index) => {
        const isCompleted = completedChallenges.includes(index);
        const challengeItem = document.createElement('div');
        challengeItem.className = 'challenge-item';
        
        challengeItem.innerHTML = `
            <div class="challenge-content">
                <h3 class="challenge-title">${challenge.title}</h3>
                <p class="challenge-description">${challenge.description}</p>
            </div>
            <div class="challenge-checkbox ${isCompleted ? 'checked' : ''}" data-index="${index}"></div>
        `;
        
        challengesList.appendChild(challengeItem);
    });
    
    // Add event listeners to checkboxes
    document.querySelectorAll('.challenge-checkbox').forEach(checkbox => {
        checkbox.addEventListener('click', () => {
            const index = parseInt(checkbox.dataset.index);
            if (completedChallenges.includes(index)) {
                completedChallenges = completedChallenges.filter(i => i !== index);
            } else {
                completedChallenges.push(index);
            }
            localStorage.setItem('completedChallenges', JSON.stringify(completedChallenges));
            updateProgress();
            renderChallenges();
        });
    });
}

// Initialize weekly challenge section
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing weekly challenges...');
    updateProgress();
    renderChallenges();
});

// Workout Plan Modal Functions
function openWorkoutPlanModal() {
    document.getElementById('workoutPlanModal').style.display = 'block';
}

function closeWorkoutPlanModal() {
    document.getElementById('workoutPlanModal').style.display = 'none';
}

function generateWorkoutPlan() {
    const goal = document.getElementById('workout-goal').value;
    const level = document.getElementById('workout-level').value;
    const days = document.getElementById('workout-days').value;
    const time = document.getElementById('workout-time').value;
    const injuries = document.getElementById('workout-injuries').value;

    // Get selected equipment
    const equipmentCheckboxes = document.querySelectorAll('input[name="equipment"]:checked');
    const equipment = Array.from(equipmentCheckboxes).map(cb => cb.value);

    // Get selected focus areas
    const focusCheckboxes = document.querySelectorAll('input[name="focus"]:checked');
    const focusAreas = Array.from(focusCheckboxes).map(cb => cb.value);

    // Generate workout plan based on inputs
    const plan = generateWorkoutPlanContent(goal, level, days, time, equipment, focusAreas, injuries);
    
    // Display the plan
    const resultDiv = document.getElementById('workoutPlanResult');
    resultDiv.innerHTML = plan;
    resultDiv.scrollIntoView({ behavior: 'smooth' });
}

function generateWorkoutPlanContent(goal, level, days, time, equipment, focusAreas, injuries) {
    // This is a mock implementation - in a real app, this would use AI or a database
    let plan = `
        <h3>Your Personalized Workout Plan</h3>
        <p><strong>Goal:</strong> ${goal.replace('_', ' ').toUpperCase()}</p>
        <p><strong>Level:</strong> ${level.toUpperCase()}</p>
        <p><strong>Schedule:</strong> ${days} days per week, ${time} minutes per session</p>
        
        <h4>Weekly Schedule</h4>
        <ul>
            <li>Day 1: Upper Body Focus</li>
            <li>Day 2: Lower Body Focus</li>
            <li>Day 3: Core & Cardio</li>
            ${days > 3 ? `<li>Day 4: Full Body Workout</li>` : ''}
            ${days > 4 ? `<li>Day 5: Strength Training</li>` : ''}
            ${days > 5 ? `<li>Day 6: Active Recovery</li>` : ''}
        </ul>

        <h4>Sample Workout (Day 1)</h4>
        <ul>
            <li>Warm-up: 5-10 minutes dynamic stretching</li>
            <li>Push-ups: 3 sets of 10-15 reps</li>
            <li>Dumbbell Shoulder Press: 3 sets of 8-12 reps</li>
            <li>Bent-over Rows: 3 sets of 10-12 reps</li>
            <li>Bicep Curls: 3 sets of 12-15 reps</li>
            <li>Cool-down: 5-10 minutes stretching</li>
        </ul>

        <h4>Equipment Used</h4>
        <ul>
            ${equipment.map(eq => `<li>${eq.replace('_', ' ').toUpperCase()}</li>`).join('')}
        </ul>

        <h4>Focus Areas</h4>
        <ul>
            ${focusAreas.map(area => `<li>${area.replace('_', ' ').toUpperCase()}</li>`).join('')}
        </ul>
    `;

    if (injuries) {
        plan += `
            <h4>Special Considerations</h4>
            <p>${injuries}</p>
            <p>Please consult with a fitness professional before starting this program.</p>
        `;
    }

    return plan;
}

// Close modals when clicking outside
window.onclick = function(event) {
    if (event.target == document.getElementById('workoutPlanModal')) {
        closeWorkoutPlanModal();
    }
    if (event.target == document.getElementById('dietPlanModal')) {
        closeDietPlanModal();
    }
}