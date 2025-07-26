// Theme Management
class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        this.applyTheme();
        this.setupToggle();
    }

    applyTheme() {
        document.body.classList.toggle('dark', this.theme === 'dark');
        this.updateToggleIcon();
    }

    updateToggleIcon() {
        const toggle = document.getElementById('theme-toggle');
        const icon = toggle.querySelector('[data-lucide]');
        
        if (this.theme === 'dark') {
            icon.setAttribute('data-lucide', 'sun');
        } else {
            icon.setAttribute('data-lucide', 'moon');
        }
        
        // Re-initialize lucide icons
        lucide.createIcons();
    }

    setupToggle() {
        const toggle = document.getElementById('theme-toggle');
        toggle.addEventListener('click', () => {
            this.theme = this.theme === 'dark' ? 'light' : 'dark';
            localStorage.setItem('theme', this.theme);
            this.applyTheme();
        });
    }
}

// Identity Proof Manager
class IdentityProofManager {
    constructor() {
        this.setupIdentityProofFields();
    }

    setupIdentityProofFields() {
        const select = document.getElementById('identity-proof-type');
        const fieldsContainer = document.getElementById('identity-fields');

        select.addEventListener('change', (e) => {
            const type = e.target.value;
            if (type) {
                fieldsContainer.style.display = 'block';
                this.renderFields(type, fieldsContainer);
            } else {
                fieldsContainer.style.display = 'none';
            }
        });
    }

    renderFields(type, container) {
        let fieldsHTML = '';
        
        switch (type) {
            case 'aadhaar':
                fieldsHTML = `
                    <h4 class="identity-title">Aadhaar Card Details</h4>
                    <div class="grid-2">
                        <div class="form-group">
                            <label for="aadhaar-number" class="label">Aadhaar Number *</label>
                            <div class="input-wrapper">
                                <i data-lucide="credit-card" class="input-icon"></i>
                                <input type="text" id="aadhaar-number" name="aadhaar-number" placeholder="1234 5678 9012" class="input" maxlength="14" pattern="[0-9]{4}\\s[0-9]{4}\\s[0-9]{4}" required>
                            </div>
                            <p class="input-hint">Format: 1234 5678 9012</p>
                        </div>
                        <div class="form-group">
                            <label for="aadhaar-name" class="label">Name as per Aadhaar *</label>
                            <div class="input-wrapper">
                                <i data-lucide="user" class="input-icon"></i>
                                <input type="text" id="aadhaar-name" name="aadhaar-name" placeholder="Enter name as per Aadhaar" class="input" required>
                            </div>
                        </div>
                    </div>
                    ${this.getUploadField()}
                `;
                break;
            case 'passport':
                fieldsHTML = `
                    <h4 class="identity-title">Passport Details</h4>
                    <div class="grid-2">
                        <div class="form-group">
                            <label for="passport-number" class="label">Passport Number *</label>
                            <div class="input-wrapper">
                                <i data-lucide="file-text" class="input-icon"></i>
                                <input type="text" id="passport-number" name="passport-number" placeholder="A1234567" class="input" maxlength="8" style="text-transform: uppercase;" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="passport-name" class="label">Name as per Passport *</label>
                            <div class="input-wrapper">
                                <i data-lucide="user" class="input-icon"></i>
                                <input type="text" id="passport-name" name="passport-name" placeholder="Enter name as per passport" class="input" required>
                            </div>
                        </div>
                    </div>
                    <div class="grid-2">
                        <div class="form-group">
                            <label for="passport-issue-date" class="label">Issue Date *</label>
                            <input type="date" id="passport-issue-date" name="passport-issue-date" class="input" required>
                        </div>
                        <div class="form-group">
                            <label for="passport-expiry-date" class="label">Expiry Date *</label>
                            <input type="date" id="passport-expiry-date" name="passport-expiry-date" class="input" required>
                        </div>
                    </div>
                    ${this.getUploadField()}
                `;
                break;
            case 'ration':
                fieldsHTML = `
                    <h4 class="identity-title">Ration Card Details</h4>
                    <div class="grid-2">
                        <div class="form-group">
                            <label for="ration-number" class="label">Ration Card Number *</label>
                            <div class="input-wrapper">
                                <i data-lucide="credit-card" class="input-icon"></i>
                                <input type="text" id="ration-number" name="ration-number" placeholder="Enter ration card number" class="input" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="ration-name" class="label">Name as per Ration Card *</label>
                            <div class="input-wrapper">
                                <i data-lucide="user" class="input-icon"></i>
                                <input type="text" id="ration-name" name="ration-name" placeholder="Enter name as per ration card" class="input" required>
                            </div>
                        </div>
                    </div>
                    ${this.getUploadField()}
                `;
                break;
        }

        container.innerHTML = fieldsHTML;
        lucide.createIcons();
    }

    getUploadField() {
        return `
            <div class="form-group">
                <label for="identity-upload" class="label">Upload Document *</label>
                <div class="input-wrapper">
                    <i data-lucide="upload" class="input-icon"></i>
                    <input type="file" id="identity-upload" name="identity-upload" accept=".pdf,.jpg,.jpeg,.png" class="input" required>
                </div>
                <p class="input-hint">Accepted formats: PDF, JPG, JPEG, PNG (Max size: 5MB)</p>
            </div>
        `;
    }
}

// Form Manager
class FormManager {
    constructor() {
        this.setupFormValidation();
        this.setupDigiLockerButton();
    }

    setupFormValidation() {
        const citizenshipCheckbox = document.getElementById('citizenship');
        const registerBtn = document.getElementById('register-btn');

        citizenshipCheckbox.addEventListener('change', (e) => {
            registerBtn.disabled = !e.target.checked;
        });

        // Form submission
        const form = document.getElementById('account-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmission();
        });

        // Account number confirmation validation
        const accountNumber = document.getElementById('account-number');
        const confirmAccountNumber = document.getElementById('confirm-account-number');

        confirmAccountNumber.addEventListener('blur', () => {
            if (accountNumber.value !== confirmAccountNumber.value) {
                confirmAccountNumber.setCustomValidity('Account numbers do not match');
            } else {
                confirmAccountNumber.setCustomValidity('');
            }
        });
    }

    setupDigiLockerButton() {
        const digilockerBtn = document.getElementById('digilocker-btn');
        digilockerBtn.addEventListener('click', () => {
            this.handleDigiLockerFetch();
        });
    }

    handleDigiLockerFetch() {
        const btn = document.getElementById('digilocker-btn');
        const originalText = btn.innerHTML;
        
        // Show loading state
        btn.innerHTML = `
            <svg class="btn-icon animate-spin" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" stroke-opacity="0.25"/>
                <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
            <span>Fetching from DigiLocker...</span>
        `;
        btn.disabled = true;

        // Simulate API call
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.disabled = false;
            alert('DigiLocker integration would fetch your documents here!');
            lucide.createIcons();
        }, 2000);
    }

    handleFormSubmission() {
        // Collect form data
        const formData = new FormData(document.getElementById('account-form'));
        const data = Object.fromEntries(formData.entries());
        
        console.log('Form submitted with data:', data);
        alert('Account registration submitted successfully!');
    }
}

// Input Formatting
class InputFormatter {
    constructor() {
        this.setupFormatting();
    }

    setupFormatting() {
        // Aadhaar number formatting
        document.addEventListener('input', (e) => {
            if (e.target.id === 'aadhaar-number') {
                this.formatAadhaar(e.target);
            }
        });

        // PAN and IFSC uppercase
        document.addEventListener('input', (e) => {
            if (e.target.id === 'pan-number' || e.target.id === 'ifsc-code') {
                e.target.value = e.target.value.toUpperCase();
            }
        });
    }

    formatAadhaar(input) {
        let value = input.value.replace(/\s/g, '').replace(/\D/g, '');
        let formattedValue = value.replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3');
        
        if (value.length <= 12) {
            input.value = formattedValue;
        }
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide icons
    lucide.createIcons();
    
    // Initialize managers
    new ThemeManager();
    new IdentityProofManager();
    new FormManager();
    new InputFormatter();
});

// Add CSS animation for spinning loader
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    .animate-spin {
        animation: spin 1s linear infinite;
    }
`;
document.head.appendChild(style);




// Fetch API for DigiLocker integration
// DigiLocker API Integration
async function fetchDigiLockerData() {
  const apiUrl = "https://dev-meripehchaan.dl6.in/public/oauth2/1/pull/doctype";

  // Form data
  const formData = new URLSearchParams();
  formData.append("clientid", "MNRNJVXE");
  formData.append("hmac", "ffefff3ff158ecc5732b7c1e8ec7b40ccd659d1eb8b024aa0d8f16218fdec804");
  formData.append("ts", "1734934002"); // Ideally this should be generated dynamically
  formData.append("orgid", "001891");

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error(`DigiLocker API Error: ${response.status}`);
    }

    const data = await response.json();
    console.log("✅ DigiLocker Data Fetched:", data);

    // You can now insert data dynamically into your form fields
    populateFormWithDigiLockerData(data);

  } catch (error) {
    console.error("❌ Error fetching from DigiLocker:", error);
    alert("Failed to fetch from DigiLocker. Please try again later.");
  }
}

function populateFormWithDigiLockerData(data) {
    if (!data) return;
  
    // Example (customize based on real API response structure):
    document.getElementById("name").value = data.name || '';
    document.getElementById("legal-name").value = data.legal_name || '';
    document.getElementById("age").value = data.age || '';
    document.getElementById("gender").value = data.gender || '';
    document.getElementById("email").value = data.email || '';
    document.getElementById("address").value = data.address || '';
  
    // ...populate PAN, account, etc. based on structure
  }

  document.getElementById("digilocker-btn").addEventListener("click", fetchDigiLockerData);










