document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registrationForm');
    const messageDiv = document.getElementById('message');
    
    // Form submission handler
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const userData = {
            name: formData.get('name').trim(),
            gender: formData.get('gender'),
            email: formData.get('email').trim(),
            country: formData.get('country')
        };
        
        // Validate form data
        if (!validateForm(userData)) {
            return;
        }
        
        // Show loading message
        showMessage('Registering...', 'loading');
        
        // Disable form during submission
        setFormEnabled(false);
        
        try {
            // Send registration request
            const response = await fetch('/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)
            });
            
            const result = await response.json();
            
            if (result.success) {
                showMessage(result.message, 'success');
                form.reset(); // Clear form on success
                
                // Optionally show user ID
                setTimeout(() => {
                    showMessage(`Registration successful! Your user ID is: ${result.userId}`, 'success');
                }, 2000);
            } else {
                showMessage(result.message, 'error');
            }
            
        } catch (error) {
            console.error('Registration error:', error);
            showMessage('Network error. Please check your connection and try again.', 'error');
        } finally {
            // Re-enable form
            setFormEnabled(true);
        }
    });
    
    // Form validation function
    function validateForm(data) {
        // Check required fields
        if (!data.name) {
            showMessage('Please enter your full name.', 'error');
            return false;
        }
        
        if (!data.gender) {
            showMessage('Please select your gender.', 'error');
            return false;
        }
        
        if (!data.email) {
            showMessage('Please enter your email address.', 'error');
            return false;
        }
        
        if (!data.country) {
            showMessage('Please select your country.', 'error');
            return false;
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            showMessage('Please enter a valid email address.', 'error');
            return false;
        }
        
        // Validate name length
        if (data.name.length < 2) {
            showMessage('Name must be at least 2 characters long.', 'error');
            return false;
        }
        
        if (data.name.length > 100) {
            showMessage('Name must be less than 100 characters.', 'error');
            return false;
        }
        
        return true;
    }
    
    // Show message function
    function showMessage(text, type) {
        messageDiv.textContent = text;
        messageDiv.className = `message ${type}`;
        messageDiv.style.display = 'block';
        
        // Auto-hide success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                hideMessage();
            }, 5000);
        }
    }
    
    // Hide message function
    function hideMessage() {
        messageDiv.style.display = 'none';
        messageDiv.className = 'message';
    }
    
    // Enable/disable form function
    function setFormEnabled(enabled) {
        const inputs = form.querySelectorAll('input, select, button');
        inputs.forEach(input => {
            input.disabled = !enabled;
        });
        
        if (enabled) {
            form.style.opacity = '1';
        } else {
            form.style.opacity = '0.7';
        }
    }
    
    // Real-time email validation
    const emailInput = document.getElementById('email');
    emailInput.addEventListener('blur', function() {
        const email = this.value.trim();
        if (email && !validateEmail(email)) {
            showMessage('Please enter a valid email address.', 'error');
            this.focus();
        } else {
            hideMessage();
        }
    });
    
    // Email validation helper
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Clear error messages when user starts typing
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            const messageDiv = document.getElementById('message');
            if (messageDiv.classList.contains('error')) {
                hideMessage();
            }
        });
    });
    
    // Keyboard navigation enhancements
    form.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && e.target.tagName !== 'BUTTON') {
            e.preventDefault();
            const inputs = Array.from(form.querySelectorAll('input, select'));
            const currentIndex = inputs.indexOf(e.target);
            const nextInput = inputs[currentIndex + 1];
            
            if (nextInput) {
                nextInput.focus();
            } else {
                // If last input, focus submit button
                const submitButton = form.querySelector('button[type="submit"]');
                if (submitButton) {
                    submitButton.focus();
                }
            }
        }
    });
});

// Optional: Function to fetch and display all users (for testing)
async function getAllUsers() {
    try {
        const response = await fetch('/users');
        const result = await response.json();
        
        if (result.success) {
            console.log('Registered users:', result.users);
            return result.users;
        } else {
            console.error('Error fetching users:', result.message);
        }
    } catch (error) {
        console.error('Network error:', error);
    }
}

// Make function available globally for testing
window.getAllUsers = getAllUsers;