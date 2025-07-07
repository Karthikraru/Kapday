// Location-based hint system
class LocationHintsGame {
    constructor() {
        // Use configuration from config.js
        this.hints = HINTS_CONFIG.hints;
        this.settings = HINTS_CONFIG.settings;
        this.ui = HINTS_CONFIG.ui;

        this.currentHintIndex = 0;
        this.solvedHints = new Set();
        this.currentLocation = null;
        this.isLocationChecking = false;

        this.loadProgress();
        this.initializeEventListeners();
        this.renderHints();
        this.updateProgress();
        this.checkLocationStatus();
    }

    // Load progress from localStorage
    loadProgress() {
        const saved = localStorage.getItem('locationHintsProgress');
        if (saved) {
            const data = JSON.parse(saved);
            this.currentHintIndex = data.currentHintIndex || 0;
            this.solvedHints = new Set(data.solvedHints || []);
        }
    }

    // Save progress to localStorage
    saveProgress() {
        const data = {
            currentHintIndex: this.currentHintIndex,
            solvedHints: Array.from(this.solvedHints)
        };
        localStorage.setItem('locationHintsProgress', JSON.stringify(data));
    }

    // Reset progress
    resetProgress() {
        if (confirm('Are you sure you want to reset your progress? This will start the game over from the beginning.')) {
            this.currentHintIndex = 0;
            this.solvedHints = new Set();
            this.currentLocation = null;
            
            // Clear localStorage
            localStorage.removeItem('locationHintsProgress');
            
            // Re-render everything
            this.renderHints();
            this.updateProgress();
            this.checkLocationStatus();
            
            this.showSuccess('Progress reset! Starting fresh...');
        }
    }

    // Initialize event listeners
    initializeEventListeners() {
        document.getElementById('checkLocation').addEventListener('click', () => {
            this.checkCurrentLocation();
        });

        document.getElementById('submitOverride').addEventListener('click', () => {
            this.submitOverrideCode();
        });

        document.getElementById('overrideCode').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.submitOverrideCode();
            }
        });

        document.getElementById('resetProgress').addEventListener('click', () => {
            this.resetProgress();
        });

        document.getElementById('howToPlayBtn').addEventListener('click', () => {
            // Remove the flag so the welcome page is shown
            localStorage.removeItem('hasVisitedBefore');
            window.location.href = 'welcome.html';
        });
    }

    // Render all hints
    renderHints() {
        const container = document.getElementById('hintsContainer');
        container.innerHTML = '';

        this.hints.forEach((hint, index) => {
            const hintElement = this.createHintElement(hint, index);
            container.appendChild(hintElement);
        });
    }

    // Create individual hint element
    createHintElement(hint, index) {
        const hintDiv = document.createElement('div');
        hintDiv.className = 'hint-card';
        hintDiv.id = `hint-${hint.id}`;

        let status = 'locked';
        let statusText = '🔒 Locked';
        let statusClass = 'status-locked';
        let showContent = false;
        let showDescription = false;
        let showLocation = false;

        if (this.solvedHints.has(hint.id)) {
            status = 'solved';
            statusText = '✅ Solved';
            statusClass = 'status-solved';
            showContent = true;
            showDescription = true;
            showLocation = true;
        } else if (index === this.currentHintIndex) {
            status = 'available';
            statusText = '🎯 Current Hint';
            statusClass = 'status-available';
            showContent = true;
            // Show description immediately for current hint, but location only when at location
            showDescription = true;
            showLocation = this.isAtLocation(hint);
        } else if (index < this.currentHintIndex) {
            status = 'solved';
            statusText = '✅ Solved';
            statusClass = 'status-solved';
            showContent = true;
            showDescription = true;
            showLocation = true;
        }

        if (status === 'locked') {
            hintDiv.classList.add('locked');
        } else if (status === 'solved') {
            hintDiv.classList.add('solved');
        }

        const descriptionContent = showDescription ? 
            `<div class="hint-description">${hint.description}</div>` : 
            '<div class="hint-description locked-description">🔒 Visit the location to see the hint description</div>';

        const locationContent = showLocation ? 
            `<div class="hint-location">
                <strong>📍 Location:</strong> ${hint.location.name}
            </div>` : 
            '<div class="hint-location locked-location">🔒 Location will be revealed when you get there</div>';

        // Add additional hint button for current hint
        const additionalHintButton = (index === this.currentHintIndex && !this.solvedHints.has(hint.id)) ? 
            `<button class="additional-hint-btn" onclick="game.showAdditionalHint(${hint.id})" title="Get an additional hint">
                💡 Additional Hint
            </button>` : '';

        hintDiv.innerHTML = `
            <div class="hint-number">Hint #${hint.id}</div>
            <div class="hint-title">${hint.title}</div>
            ${descriptionContent}
            ${locationContent}
            <div class="hint-status ${statusClass}">
                <span>${statusText}</span>
            </div>
            ${additionalHintButton}
        `;

        return hintDiv;
    }

    // Check if user is at the specified location
    isAtLocation(hint) {
        if (!this.currentLocation) return false;
        
        const distance = this.calculateDistance(
            this.currentLocation.latitude,
            this.currentLocation.longitude,
            hint.location.latitude,
            hint.location.longitude
        );
        
        return distance <= hint.location.radius;
    }

    // Show additional hint
    showAdditionalHint(hintId) {
        const hint = this.hints.find(h => h.id === hintId);
        if (!hint) return;

        const additionalHint = hint.additionalHint || "No additional hint available for this location.";
        
        this.showNotification(`💡 Additional Hint: ${additionalHint}`, 'info');
    }

    // Update progress bar and text
    updateProgress() {
        const totalHints = this.hints.length;
        const solvedCount = this.solvedHints.size;
        const progressPercentage = (solvedCount / totalHints) * 100;

        document.getElementById('progressFill').style.width = `${progressPercentage}%`;
        document.getElementById('progressText').textContent = `${solvedCount}/${totalHints}`;
    }

    // Check current location using geolocation API
    async checkCurrentLocation() {
        if (this.isLocationChecking) return;

        this.isLocationChecking = true;
        const checkBtn = document.getElementById('checkLocation');
        const statusIndicator = document.getElementById('locationStatus');
        
        checkBtn.disabled = true;
        checkBtn.textContent = 'Checking...';
        statusIndicator.innerHTML = '<span class="status-icon">⏳</span><span class="status-text">Getting your location...</span>';

        try {
            const position = await this.getCurrentPosition();
            this.currentLocation = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            };

            this.checkLocationStatus();
            this.verifyCurrentHint();
            this.renderHints(); // Re-render to show/hide locations
            
        } catch (error) {
            console.error('Error getting location:', error);
            statusIndicator.innerHTML = '<span class="status-icon">❌</span><span class="status-text">Location access denied or unavailable</span>';
        } finally {
            this.isLocationChecking = false;
            checkBtn.disabled = false;
            checkBtn.textContent = 'Check Current Location';
        }
    }

    // Get current position with timeout
    getCurrentPosition() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation not supported'));
                return;
            }

            const timeout = setTimeout(() => {
                reject(new Error('Location request timed out'));
            }, this.settings.locationTimeout);

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    clearTimeout(timeout);
                    resolve(position);
                },
                (error) => {
                    clearTimeout(timeout);
                    reject(error);
                },
                {
                    enableHighAccuracy: this.settings.locationAccuracy,
                    timeout: this.settings.locationTimeout,
                    maximumAge: this.settings.locationMaxAge
                }
            );
        });
    }

    // Check and update location status display
    checkLocationStatus() {
        const statusIndicator = document.getElementById('locationStatus');
        
        if (!this.currentLocation) {
            statusIndicator.innerHTML = '<span class="status-icon">📍</span><span class="status-text">Location not checked yet</span>';
            return;
        }

        const currentHint = this.hints[this.currentHintIndex];
        if (!currentHint) {
            statusIndicator.innerHTML = '<span class="status-icon">🎉</span><span class="status-text">All hints completed!</span>';
            return;
        }

        const distance = this.calculateDistance(
            this.currentLocation.latitude,
            this.currentLocation.longitude,
            currentHint.location.latitude,
            currentHint.location.longitude
        );

        if (distance <= currentHint.location.radius) {
            statusIndicator.innerHTML = `<span class="status-icon">✅</span><span class="status-text">You're at the correct location! (${Math.round(distance)}m away)</span>`;
        } else {
            statusIndicator.innerHTML = `<span class="status-icon">📍</span><span class="status-text">You're ${Math.round(distance)}m away from the target location</span>`;
        }
    }

    // Calculate distance between two points using Haversine formula
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371e3; // Earth's radius in meters
        const φ1 = lat1 * Math.PI / 180;
        const φ2 = lat2 * Math.PI / 180;
        const Δφ = (lat2 - lat1) * Math.PI / 180;
        const Δλ = (lon2 - lon1) * Math.PI / 180;

        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
                  Math.cos(φ1) * Math.cos(φ2) *
                  Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    }

    // Verify if current hint can be solved
    verifyCurrentHint() {
        if (!this.currentLocation) return;

        const currentHint = this.hints[this.currentHintIndex];
        if (!currentHint) return;

        const distance = this.calculateDistance(
            this.currentLocation.latitude,
            this.currentLocation.longitude,
            currentHint.location.latitude,
            currentHint.location.longitude
        );

        if (distance <= currentHint.location.radius) {
            this.solveHint(currentHint.id);
        }
    }

    // Submit override code
    submitOverrideCode() {
        const codeInput = document.getElementById('overrideCode');
        const code = codeInput.value.trim().toUpperCase();

        if (!code) {
            this.showError('Please enter an override code');
            return;
        }

        // Check for master override code
        if (code === HINTS_CONFIG.masterOverride) {
            this.solveAllHints();
            codeInput.value = '';
            this.showSuccess('Master override activated! All hints unlocked!');
            return;
        }

        const currentHint = this.hints[this.currentHintIndex];
        if (!currentHint) {
            this.showError('All hints are already completed!');
            return;
        }

        if (code === currentHint.overrideCode) {
            this.solveHint(currentHint.id);
            codeInput.value = '';
            this.showSuccess('Override code accepted!');
        } else {
            this.showError('Invalid override code');
            codeInput.classList.add('error-shake');
            setTimeout(() => codeInput.classList.remove('error-shake'), this.settings.animationDuration);
        }
    }

    // Solve all hints (master override)
    solveAllHints() {
        this.hints.forEach(hint => {
            this.solvedHints.add(hint.id);
        });
        this.currentHintIndex = this.hints.length;
        this.saveProgress();
        this.renderHints();
        this.updateProgress();
        this.checkLocationStatus();
    }

    // Solve a hint
    solveHint(hintId) {
        if (this.solvedHints.has(hintId)) return;

        this.solvedHints.add(hintId);
        
        // Move to next hint if this was the current one
        if (hintId === this.hints[this.currentHintIndex].id) {
            this.currentHintIndex = Math.min(this.currentHintIndex + 1, this.hints.length);
        }

        this.saveProgress();
        this.renderHints();
        this.updateProgress();
        this.checkLocationStatus();

        // Show success animation
        const hintElement = document.getElementById(`hint-${hintId}`);
        hintElement.classList.add('success-flash');
        setTimeout(() => hintElement.classList.remove('success-flash'), this.settings.animationDuration);

        this.showSuccess(`Hint #${hintId} solved!`);
    }

    // Show success message
    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    // Show error message
    showError(message) {
        this.showNotification(message, 'error');
    }

    // Show info message
    showInfo(message) {
        this.showNotification(message, 'info');
    }

    // Show notification
    showNotification(message, type) {
        // Remove existing notifications
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        let backgroundColor;
        switch(type) {
            case 'success':
                backgroundColor = this.ui.theme.successColor;
                break;
            case 'error':
                backgroundColor = this.ui.theme.errorColor;
                break;
            case 'info':
                backgroundColor = this.ui.theme.warningColor;
                break;
            default:
                backgroundColor = this.ui.theme.primaryColor;
        }

        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 1000;
            animation: slideInRight 0.3s ease;
            background: ${backgroundColor};
            max-width: 400px;
            word-wrap: break-word;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, this.settings.notificationDuration);
    }
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Initialize the game when the page loads
let game;
document.addEventListener('DOMContentLoaded', () => {
    game = new LocationHintsGame();
}); 