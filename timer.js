document.addEventListener('DOMContentLoaded', function() {
    // Get all elements
    const display = document.getElementById('display');
    const startBtn = document.getElementById('startBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const resetBtn = document.getElementById('resetBtn');
    const workoutTime = document.getElementById('workoutTime');
    const restTime = document.getElementById('restTime');
    const rounds = document.getElementById('rounds');
    const currentRound = document.getElementById('currentRound');
    const currentPhase = document.getElementById('currentPhase');

    // Timer variables
    let timer;
    let timeLeft;
    let isWorkout = true;
    let currentRoundCount = 1;
    let totalRounds = 3;
    let workoutDuration = 30 * 60; // 30 minutes in seconds
    let restDuration = 60; // 60 seconds

    // Initialize timer
    function initTimer() {
        // Get values from inputs
        workoutDuration = parseInt(workoutTime.value) * 60 || 30 * 60;
        restDuration = parseInt(restTime.value) || 60;
        totalRounds = parseInt(rounds.value) || 3;
        
        // Set initial time
        timeLeft = isWorkout ? workoutDuration : restDuration;
        
        // Update display
        updateDisplay();
        updateStatus();
    }

    // Update display
    function updateDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        display.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    // Update status
    function updateStatus() {
        currentRound.textContent = `Round: ${currentRoundCount}/${totalRounds}`;
        currentPhase.textContent = `Phase: ${isWorkout ? 'Workout' : 'Rest'}`;
        currentPhase.style.color = isWorkout ? 'rgb(60, 250, 60)' : 'rgb(255, 100, 100)';
    }

    // Start timer
    function startTimer() {
        if (!timer) {
            startBtn.disabled = true;
            pauseBtn.disabled = false;
            
            timer = setInterval(() => {
                timeLeft--;
                updateDisplay();

                if (timeLeft <= 0) {
                    clearInterval(timer);
                    timer = null;

                    if (isWorkout) {
                        // Switch to rest
                        isWorkout = false;
                        timeLeft = restDuration;
                    } else {
                        // Switch to workout
                        isWorkout = true;
                        timeLeft = workoutDuration;
                        currentRoundCount++;
                        
                        if (currentRoundCount > totalRounds) {
                            resetTimer();
                            return;
                        }
                    }

                    updateStatus();
                    updateDisplay();
                    playSound();
                    startTimer();
                }
            }, 1000);
        }
    }

    // Pause timer
    function pauseTimer() {
        if (timer) {
            clearInterval(timer);
            timer = null;
            startBtn.disabled = false;
            pauseBtn.disabled = true;
        }
    }

    // Reset timer
    function resetTimer() {
        clearInterval(timer);
        timer = null;
        isWorkout = true;
        currentRoundCount = 1;
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        initTimer();
    }

    // Play sound
    function playSound() {
        const audio = new Audio('notification.mp3');
        audio.play();
    }

    // Event listeners
    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', resetTimer);

    // Input change listeners
    workoutTime.addEventListener('change', () => {
        if (!timer) initTimer();
    });

    restTime.addEventListener('change', () => {
        if (!timer) initTimer();
    });

    rounds.addEventListener('change', () => {
        if (!timer) initTimer();
    });

    // Initialize
    initTimer();
}); 