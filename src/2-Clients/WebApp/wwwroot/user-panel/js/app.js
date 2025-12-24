// Create Page Wizard JavaScript Functions

window.createPageWizard = {
    // Initialize wizard functionality
    initializeWizard: function() {
        // Wizard initialization code can go here if needed
    },

    // Copy text to clipboard
    copyToClipboard: async function(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                return true;
            } catch (err) {
                return false;
            } finally {
                document.body.removeChild(textArea);
            }
        }
    },

    // Show toast notification
    showToast: function(message, type = 'info') {
        // This would integrate with your existing toast system
        console.log(`${type.toUpperCase()}: ${message}`);
    },

    // Validate route input
    validateRoute: function(route) {
        const routeRegex = /^[a-zA-Z0-9-]+$/;
        return routeRegex.test(route);
    },

    // Format file size
    formatFileSize: function(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
};

// Scroll to element by ID
window.scrollToElement = function(id) {
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return true;
    }
    return false;
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.createPageWizard.initializeWizard();
    
    // Handle anchor navigation after page load
    if (window.location.hash) {
        const hash = window.location.hash.substring(1);
        setTimeout(function() {
            window.scrollToElement(hash);
        }, 300);
    }
});
