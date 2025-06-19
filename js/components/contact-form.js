// Contact form functionality - validation, submission, and user experience

function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) {
        console.warn('Contact form not found');
        return;
    }
    
    initFormValidation();
    initFormSubmission();
    initFormEnhancements();
    initFormAccessibility();
    
    console.log('📧 Contact form initialized');
}

// Form validation
function initFormValidation() {
    const form = document.getElementById('contactForm');
    const inputs = form.querySelectorAll('input, textarea');
    
    // Real-time validation for each input
    inputs.forEach(input => {
        // Validation on blur (when user leaves field)
        input.addEventListener('blur', () => {
            validateField(input);
        });
        
        // Clear errors on input
        input.addEventListener('input', () => {
            clearFieldError(input);
        });
        
        // Enhanced UX for specific fields
        if (input.type === 'email') {
            input.addEventListener('input', debounce(() => {
                validateEmail(input);
            }, 500));
        }
        
        if (input.type === 'tel') {
            input.addEventListener('input', () => {
                formatPhoneNumber(input);
            });
        }
    });
    
    // Form submission validation
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (validateForm()) {
            submitForm();
        } else {
            // Focus first invalid field
            const firstError = form.querySelector('.form-input.error, .form-textarea.error');
            if (firstError) {
                firstError.focus();
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });
}

// Validate individual field
function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.getAttribute('name');
    let isValid = true;
    let errorMessage = '';
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = `${getFieldLabel(field)} is required`;
    }
    
    // Specific field validations
    if (value && fieldName === 'email') {
        if (!isValidEmail(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }
    
    if (value && fieldName === 'phone') {
        if (!isValidPhone(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }
    }
    
    if (fieldName === 'firstName' || fieldName === 'lastName') {
        if (value && value.length < 2) {
            isValid = false;
            errorMessage = `${getFieldLabel(field)} must be at least 2 characters`;
        }
        if (value && !/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u.test(value)) {
            isValid = false;
            errorMessage = `${getFieldLabel(field)} contains invalid characters`;
        }
    }
    
    if (fieldName === 'message') {
        if (value && value.length < 10) {
            isValid = false;
            errorMessage = 'Message must be at least 10 characters';
        }
        if (value && value.length > 1000) {
            isValid = false;
            errorMessage = 'Message must be less than 1000 characters';
        }
    }
    
    // Update field state
    updateFieldState(field, isValid, errorMessage);
    
    return isValid;
}

// Validate entire form
function validateForm() {
    const form = document.getElementById('contactForm');
    const fields = form.querySelectorAll('input[required], textarea[required]');
    const checkboxes = form.querySelectorAll('input[type="checkbox"][required]');
    
    let isFormValid = true;
    
    // Validate regular fields
    fields.forEach(field => {
        if (!validateField(field)) {
            isFormValid = false;
        }
    });
    
    // Validate required checkboxes
    checkboxes.forEach(checkbox => {
        if (!checkbox.checked) {
            isFormValid = false;
            showFieldError(checkbox, 'This field is required');
        }
    });
    
    return isFormValid;
}

// Update field visual state
function updateFieldState(field, isValid, errorMessage) {
    const fieldContainer = field.closest('.form-group') || field.parentElement;
    
    // Remove existing state classes
    field.classList.remove('error', 'success');
    
    // Remove existing error message
    const existingError = fieldContainer.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    if (!isValid) {
        field.classList.add('error');
        showFieldError(field, errorMessage);
    } else if (field.value.trim()) {
        field.classList.add('success');
        showFieldSuccess(field);
    }
}

// Show field error
function showFieldError(field, message) {
    const fieldContainer = field.closest('.form-group') || field.parentElement;
    
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    errorElement.setAttribute('role', 'alert');
    errorElement.setAttribute('aria-live', 'polite');
    
    fieldContainer.appendChild(errorElement);
    
    // Update ARIA attributes
    field.setAttribute('aria-invalid', 'true');
    field.setAttribute('aria-describedby', `${field.name}-error`);
    errorElement.id = `${field.name}-error`;
}

// Show field success
function showFieldSuccess(field) {
    // Remove ARIA invalid state
    field.removeAttribute('aria-invalid');
    field.removeAttribute('aria-describedby');
}

// Clear field error
function clearFieldError(field) {
    const fieldContainer = field.closest('.form-group') || field.parentElement;
    const errorMessage = fieldContainer.querySelector('.error-message');
    
    if (errorMessage) {
        errorMessage.remove();
    }
    
    field.classList.remove('error');
    field.removeAttribute('aria-invalid');
    field.removeAttribute('aria-describedby');
}

// Email validation
function validateEmail(input) {
    const email = input.value.trim();
    if (!email) return;
    
    // Basic email validation
    if (isValidEmail(email)) {
        // Additional checks for common mistakes
        const commonDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'company.com'];
        const domain = email.split('@')[1];
        
        // Suggest corrections for common typos
        if (domain) {
            const suggestion = suggestEmailDomain(domain, commonDomains);
            if (suggestion && suggestion !== domain) {
                showEmailSuggestion(input, email.replace(domain, suggestion));
            }
        }
    }
}

// Email domain suggestion
function suggestEmailDomain(domain, knownDomains) {
    const threshold = 2; // Levenshtein distance threshold
    
    for (const knownDomain of knownDomains) {
        if (levenshteinDistance(domain.toLowerCase(), knownDomain.toLowerCase()) <= threshold) {
            return knownDomain;
        }
    }
    
    return null;
}

// Show email suggestion
function showEmailSuggestion(input, suggestedEmail) {
    const container = input.parentElement;
    const existingSuggestion = container.querySelector('.email-suggestion');
    
    if (existingSuggestion) {
        existingSuggestion.remove();
    }
    
    const suggestion = document.createElement('div');
    suggestion.className = 'email-suggestion';
    suggestion.innerHTML = `
        <span>Did you mean: </span>
        <button type="button" class="suggestion-btn">${suggestedEmail}</button>
    `;
    
    const suggestionBtn = suggestion.querySelector('.suggestion-btn');
    suggestionBtn.addEventListener('click', () => {
        input.value = suggestedEmail;
        suggestion.remove();
        input.focus();
        validateField(input);
    });
    
    container.appendChild(suggestion);
    
    // Auto-remove suggestion after 10 seconds
    setTimeout(() => {
        if (suggestion.parentElement) {
            suggestion.remove();
        }
    }, 10000);
}

// Phone number formatting
function formatPhoneNumber(input) {
    let value = input.value.replace(/\D/g, ''); // Remove non-digits
    
    // Format based on length (assuming US format)
    if (value.length >= 10) {
        value = value.substring(0, 10);
        value = `(${value.substring(0, 3)}) ${value.substring(3, 6)}-${value.substring(6)}`;
    } else if (value.length >= 6) {
        value = `(${value.substring(0, 3)}) ${value.substring(3, 6)}-${value.substring(6)}`;
    } else if (value.length >= 3) {
        value = `(${value.substring(0, 3)}) ${value.substring(3)}`;
    }
    
    input.value = value;
}

// Form submission
function initFormSubmission() {
    // This would typically connect to a backend service
    // For demo purposes, we'll simulate form submission
}

async function submitForm() {
    const form = document.getElementById('contactForm');
    const submitBtn = form.querySelector('button[type="submit"]');
    const formData = new FormData(form);
    
    // Show loading state
    showLoadingState(submitBtn);
    
    try {
        // Simulate API call (replace with actual endpoint)
        const success = await simulateFormSubmission(formData);
        
        if (success) {
            showSuccessMessage();
            resetForm();
            
            // Track successful submission
            if (typeof trackEvent === 'function') {
                trackEvent('Form', 'Submit Success', 'Contact Form');
            }
        } else {
            throw new Error('Submission failed');
        }
        
    } catch (error) {
        console.error('Form submission error:', error);
        showErrorMessage('There was an error submitting your form. Please try again.');
        
        // Track submission error
        if (typeof trackEvent === 'function') {
            trackEvent('Form', 'Submit Error', 'Contact Form');
        }
    } finally {
        hideLoadingState(submitBtn);
    }
}

// Simulate form submission (replace with actual implementation)
async function simulateFormSubmission(formData) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // For demo, randomly succeed or fail
    return Math.random() > 0.1; // 90% success rate
    
    // Real implementation would look like:
    /*
    const response = await fetch('/api/contact', {
        method: 'POST',
        body: formData
    });
    return response.ok;
    */
}

// Show loading state
function showLoadingState(button) {
    button.disabled = true;
    button.innerHTML = `
        <span class="loading-spinner"></span>
        Sending...
    `;
    button.classList.add('loading');
}

// Hide loading state
function hideLoadingState(button) {
    button.disabled = false;
    button.innerHTML = 'CONTACT US';
    button.classList.remove('loading');
}

// Show success message
function showSuccessMessage() {
    const form = document.getElementById('contactForm');
    const successMessage = document.createElement('div');
    successMessage.className = 'form-message success';
    successMessage.innerHTML = `
        <div class="message-icon">✓</div>
        <div class="message-content">
            <h3>Thank you for your message!</h3>
            <p>We'll get back to you within 24 hours.</p>
        </div>
    `;
    
    form.parentElement.insertBefore(successMessage, form);
    
    // Auto-remove message after 5 seconds
    setTimeout(() => {
        if (successMessage.parentElement) {
            successMessage.remove();
        }
    }, 5000);
}

// Show error message
function showErrorMessage(message) {
    const form = document.getElementById('contactForm');
    const errorMessage = document.createElement('div');
    errorMessage.className = 'form-message error';
    errorMessage.innerHTML = `
        <div class="message-icon">⚠</div>
        <div class="message-content">
            <h3>Submission Error</h3>
            <p>${message}</p>
        </div>
    `;
    
    form.parentElement.insertBefore(errorMessage, form);
    
    // Auto-remove message after 5 seconds
    setTimeout(() => {
        if (errorMessage.parentElement) {
            errorMessage.remove();
        }
    }, 5000);
}

// Reset form
function resetForm() {
    const form = document.getElementById('contactForm');
    form.reset();
    
    // Clear all validation states
    const fields = form.querySelectorAll('input, textarea');
    fields.forEach(field => {
        field.classList.remove('error', 'success');
        clearFieldError(field);
    });
}

// Form enhancements
function initFormEnhancements() {
    // Character counter for message field
    const messageField = document.querySelector('textarea[name="message"]');
    if (messageField) {
        addCharacterCounter(messageField, 1000);
    }
    
    // Auto-resize textarea
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach(textarea => {
        autoResizeTextarea(textarea);
    });
    
    // Save form data to localStorage (privacy-conscious)
    initFormSaving();
}

// Character counter
function addCharacterCounter(textarea, maxLength) {
    const container = textarea.parentElement;
    const counter = document.createElement('div');
    counter.className = 'character-counter';
    counter.textContent = `0 / ${maxLength}`;
    
    container.appendChild(counter);
    
    textarea.addEventListener('input', () => {
        const length = textarea.value.length;
        counter.textContent = `${length} / ${maxLength}`;
        
        if (length > maxLength * 0.9) {
            counter.classList.add('warning');
        } else {
            counter.classList.remove('warning');
        }
        
        if (length > maxLength) {
            counter.classList.add('error');
        } else {
            counter.classList.remove('error');
        }
    });
}

// Auto-resize textarea
function autoResizeTextarea(textarea) {
    textarea.addEventListener('input', () => {
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
    });
}

// Form saving to localStorage
function initFormSaving() {
    const form = document.getElementById('contactForm');
    const saveKey = 'contactFormData';
    
    // Load saved data on page load
    loadFormData();
    
    // Save data on input (debounced)
    const inputs = form.querySelectorAll('input:not([type="checkbox"]), textarea');
    inputs.forEach(input => {
        input.addEventListener('input', debounce(() => {
            saveFormData();
        }, 1000));
    });
    
    // Clear saved data on successful submission
    form.addEventListener('formSubmitSuccess', () => {
        clearSavedFormData();
    });
    
    function saveFormData() {
        const formData = {};
        inputs.forEach(input => {
            if (input.value.trim()) {
                formData[input.name] = input.value;
            }
        });
        
        if (Object.keys(formData).length > 0) {
            localStorage.setItem(saveKey, JSON.stringify(formData));
        }
    }
    
    function loadFormData() {
        try {
            const savedData = localStorage.getItem(saveKey);
            if (savedData) {
                const formData = JSON.parse(savedData);
                Object.keys(formData).forEach(key => {
                    const input = form.querySelector(`[name="${key}"]`);
                    if (input) {
                        input.value = formData[key];
                    }
                });
            }
        } catch (error) {
            console.warn('Error loading saved form data:', error);
        }
    }
    
    function clearSavedFormData() {
        localStorage.removeItem(saveKey);
    }
}

// Accessibility enhancements
function initFormAccessibility() {
    const form = document.getElementById('contactForm');
    
    // Add proper ARIA labels and descriptions
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        const label = getFieldLabel(input);
        if (label && !input.getAttribute('aria-label')) {
            input.setAttribute('aria-label', label);
        }
        
        // Add required indicator to screen readers
        if (input.hasAttribute('required')) {
            const currentLabel = input.getAttribute('aria-label') || '';
            input.setAttribute('aria-label', `${currentLabel} (required)`);
        }
    });
    
    // Improve checkbox accessibility
    const checkboxes = form.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        const label = checkbox.closest('.checkbox-label');
        if (label && !checkbox.getAttribute('aria-describedby')) {
            const labelText = label.querySelector('span:not(.checkmark)');
            if (labelText) {
                const descId = `${checkbox.name}-desc`;
                labelText.id = descId;
                checkbox.setAttribute('aria-describedby', descId);
            }
        }
    });
}

// Utility functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    const digitsOnly = phone.replace(/\D/g, '');
    return digitsOnly.length >= 10 && phoneRegex.test(digitsOnly);
}

function getFieldLabel(field) {
    const placeholder = field.getAttribute('placeholder');
    if (placeholder) {
        return placeholder.replace('*', '').trim();
    }
    
    const label = document.querySelector(`label[for="${field.id}"]`);
    if (label) {
        return label.textContent.trim();
    }
    
    return field.getAttribute('name') || 'Field';
}

function levenshteinDistance(str1, str2) {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
        matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
        matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
        for (let j = 1; j <= str1.length; j++) {
            if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j] + 1
                );
            }
        }
    }
    
    return matrix[str2.length][str1.length];
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Export contact form functions
window.ContactForm = {
    init: initContactForm,
    validate: validateForm,
    submit: submitForm,
    reset: resetForm
};

// Auto-initialize if DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initContactForm);
} else {
    initContactForm();
}