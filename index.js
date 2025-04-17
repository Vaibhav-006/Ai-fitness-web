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