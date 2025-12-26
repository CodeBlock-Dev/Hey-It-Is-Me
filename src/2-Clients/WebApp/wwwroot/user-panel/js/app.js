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

// Image Cropper Functions
window.imageCropper = {
    cropperInstance: null,
    imageElement: null,
    containerElement: null,
    cropBoxElement: null,
    isDragging: false,
    dragStartX: 0,
    dragStartY: 0,
    imageOffsetX: 0,
    imageOffsetY: 0,
    imageScale: 1,
    cropSize: 400, // 1:1 aspect ratio, 400x400px (will be adjusted for mobile)
    isReady: false,

    // Initialize cropper with image data URL
    initialize: function(imageDataUrl, containerId, imageId, cropBoxId) {
        const container = document.getElementById(containerId);
        const image = document.getElementById(imageId);
        const cropBox = document.getElementById(cropBoxId);
        
        if (!container || !image || !cropBox) {
            return false;
        }

        this.containerElement = container;
        this.imageElement = image;
        this.cropBoxElement = cropBox;

        // Reset state
        this.isDragging = false;
        this.imageOffsetX = 0;
        this.imageOffsetY = 0;
        this.imageScale = 1;
        this.isReady = false;

        // Setup event listeners first (they can be set up before image loads)
        this.setupEventListeners();

        // Set image source
        image.src = imageDataUrl;

        // Load image
        if (image.complete && image.naturalWidth > 0) {
            // Image already loaded
            setTimeout(() => {
                this.setupCropper();
            }, 100);
        } else {
            // Wait for image to load
            image.onload = () => {
                setTimeout(() => {
                    this.setupCropper();
                }, 100);
            };
            image.onerror = () => {
                console.error('Failed to load image for cropper');
            };
        }

        return true;
    },

    // Setup cropper positioning
    setupCropper: function() {
        const img = this.imageElement;
        const container = this.containerElement;
        const cropBox = this.cropBoxElement;

        if (!img || !container || !cropBox) {
            console.error('Cropper elements not found');
            return;
        }

        // Ensure image is loaded
        if (!img.complete || img.naturalWidth === 0 || img.naturalHeight === 0) {
            console.error('Image not fully loaded');
            return;
        }

        // Calculate initial scale to fit image in crop area
        const containerRect = container.getBoundingClientRect();
        const imgAspect = img.naturalWidth / img.naturalHeight;
        
        // Calculate responsive crop size (max 400px, but adapt to container)
        const maxCropSize = Math.min(400, Math.min(containerRect.width, containerRect.height) - 40);
        this.cropSize = maxCropSize;
        
        // Scale to cover crop area (1:1)
        let scale;
        if (imgAspect > 1) {
            // Landscape image
            scale = this.cropSize / img.naturalHeight;
        } else {
            // Portrait or square image
            scale = this.cropSize / img.naturalWidth;
        }
        
        // Make sure image covers the crop area
        scale = Math.max(scale, this.cropSize / Math.min(img.naturalWidth, img.naturalHeight));
        this.imageScale = scale;

        // Center the image
        const scaledWidth = img.naturalWidth * scale;
        const scaledHeight = img.naturalHeight * scale;
        this.imageOffsetX = (containerRect.width - scaledWidth) / 2;
        this.imageOffsetY = (containerRect.height - scaledHeight) / 2;

        // Center crop box
        const cropBoxLeft = (containerRect.width - this.cropSize) / 2;
        const cropBoxTop = (containerRect.height - this.cropSize) / 2;
        cropBox.style.left = cropBoxLeft + 'px';
        cropBox.style.top = cropBoxTop + 'px';
        cropBox.style.width = this.cropSize + 'px';
        cropBox.style.height = this.cropSize + 'px';
        
        // Make sure crop box is visible and has proper styling
        cropBox.style.display = 'block';
        cropBox.style.visibility = 'visible';
        cropBox.style.opacity = '1';
        cropBox.style.border = '3px solid #667eea';
        cropBox.style.zIndex = '10';
        cropBox.style.pointerEvents = 'none';
        cropBox.style.boxSizing = 'border-box';

        this.updateImagePosition();
        this.isReady = true;
    },

    // Setup event listeners for dragging
    setupEventListeners: function() {
        const container = this.containerElement;
        const img = this.imageElement;

        // Remove existing listeners if any
        this.removeEventListeners();

        // Mouse events
        this.mouseDownHandler = (e) => this.handleMouseDown(e);
        this.mouseMoveHandler = (e) => this.handleMouseMove(e);
        this.mouseUpHandler = () => this.handleMouseUp();
        this.touchStartHandler = (e) => this.handleTouchStart(e);
        this.touchMoveHandler = (e) => this.handleTouchMove(e);
        this.touchEndHandler = () => this.handleTouchEnd();

        container.addEventListener('mousedown', this.mouseDownHandler);
        document.addEventListener('mousemove', this.mouseMoveHandler);
        document.addEventListener('mouseup', this.mouseUpHandler);

        // Touch events for mobile (with passive: false to allow preventDefault)
        container.addEventListener('touchstart', this.touchStartHandler, { passive: false });
        document.addEventListener('touchmove', this.touchMoveHandler, { passive: false });
        document.addEventListener('touchend', this.touchEndHandler, { passive: false });
    },

    // Remove event listeners
    removeEventListeners: function() {
        if (!this.containerElement) return;

        if (this.mouseDownHandler) {
            this.containerElement.removeEventListener('mousedown', this.mouseDownHandler);
            document.removeEventListener('mousemove', this.mouseMoveHandler);
            document.removeEventListener('mouseup', this.mouseUpHandler);
            this.containerElement.removeEventListener('touchstart', this.touchStartHandler);
            document.removeEventListener('touchmove', this.touchMoveHandler);
            document.removeEventListener('touchend', this.touchEndHandler);
        }
    },

    // Handle mouse down
    handleMouseDown: function(e) {
        // Allow dragging from anywhere in the container (not just image or crop box)
        const target = e.target;
        if (target === this.containerElement || 
            target === this.cropBoxElement || 
            target === this.imageElement ||
            this.containerElement.contains(target)) {
            this.isDragging = true;
            const containerRect = this.containerElement.getBoundingClientRect();
            this.dragStartX = e.clientX - containerRect.left - this.imageOffsetX;
            this.dragStartY = e.clientY - containerRect.top - this.imageOffsetY;
            e.preventDefault();
            e.stopPropagation();
        }
    },

    // Handle mouse move
    handleMouseMove: function(e) {
        if (!this.isDragging) return;

        const containerRect = this.containerElement.getBoundingClientRect();
        const newX = e.clientX - containerRect.left - this.dragStartX;
        const newY = e.clientY - containerRect.top - this.dragStartY;

        this.constrainImagePosition(newX, newY);
        e.preventDefault();
    },

    // Handle mouse up
    handleMouseUp: function() {
        this.isDragging = false;
    },

    // Handle touch start
    handleTouchStart: function(e) {
        if (e.touches.length === 1) {
            const target = e.target;
            // Allow dragging from anywhere in the container
            if (target === this.containerElement || 
                target === this.cropBoxElement || 
                target === this.imageElement ||
                this.containerElement.contains(target)) {
                const touch = e.touches[0];
                const containerRect = this.containerElement.getBoundingClientRect();
                this.isDragging = true;
                this.dragStartX = touch.clientX - containerRect.left - this.imageOffsetX;
                this.dragStartY = touch.clientY - containerRect.top - this.imageOffsetY;
                e.preventDefault();
                e.stopPropagation();
            }
        }
    },

    // Handle touch move
    handleTouchMove: function(e) {
        if (!this.isDragging || e.touches.length !== 1) return;

        const touch = e.touches[0];
        const containerRect = this.containerElement.getBoundingClientRect();
        const newX = touch.clientX - containerRect.left - this.dragStartX;
        const newY = touch.clientY - containerRect.top - this.dragStartY;

        this.constrainImagePosition(newX, newY);
        e.preventDefault();
    },

    // Handle touch end
    handleTouchEnd: function() {
        this.isDragging = false;
    },

    // Constrain image position to keep crop area filled
    constrainImagePosition: function(newX, newY) {
        const containerRect = this.containerElement.getBoundingClientRect();
        const cropBoxRect = this.cropBoxElement.getBoundingClientRect();
        const scaledWidth = this.imageElement.naturalWidth * this.imageScale;
        const scaledHeight = this.imageElement.naturalHeight * this.imageScale;

        // Calculate bounds
        const maxX = cropBoxRect.left - containerRect.left + this.cropSize;
        const minX = cropBoxRect.left - containerRect.left - scaledWidth + this.cropSize;
        const maxY = cropBoxRect.top - containerRect.top + this.cropSize;
        const minY = cropBoxRect.top - containerRect.top - scaledHeight + this.cropSize;

        this.imageOffsetX = Math.max(minX, Math.min(maxX, newX));
        this.imageOffsetY = Math.max(minY, Math.min(maxY, newY));

        this.updateImagePosition();
    },

    // Update image position
    updateImagePosition: function() {
        this.imageElement.style.transform = `translate(${this.imageOffsetX}px, ${this.imageOffsetY}px) scale(${this.imageScale})`;
    },

    // Check if cropper is ready
    checkReady: function() {
        return this.isReady === true && 
               this.imageElement !== null && 
               this.cropBoxElement !== null && 
               this.containerElement !== null &&
               this.imageElement.complete &&
               this.imageElement.naturalWidth > 0 &&
               this.imageElement.naturalHeight > 0;
    },

    // Get cropped image as base64
    getCroppedImage: function() {
        if (!this.imageElement || !this.cropBoxElement || !this.containerElement) {
            throw new Error('Cropper not initialized');
        }

        if (!this.isReady) {
            throw new Error('Cropper not ready - please wait for initialization');
        }

        const img = this.imageElement;
        const cropBox = this.cropBoxElement;
        const container = this.containerElement;

        // Ensure image is loaded
        if (!img.complete || img.naturalWidth === 0 || img.naturalHeight === 0) {
            throw new Error('Image not loaded');
        }

        // Create canvas
        const canvas = document.createElement('canvas');
        canvas.width = this.cropSize;
        canvas.height = this.cropSize;
        const ctx = canvas.getContext('2d');

        // Calculate source rectangle
        const containerRect = container.getBoundingClientRect();
        const cropBoxRect = cropBox.getBoundingClientRect();
        
        const sourceX = (cropBoxRect.left - containerRect.left - this.imageOffsetX) / this.imageScale;
        const sourceY = (cropBoxRect.top - containerRect.top - this.imageOffsetY) / this.imageScale;
        const sourceWidth = this.cropSize / this.imageScale;
        const sourceHeight = this.cropSize / this.imageScale;

        // Draw cropped image
        ctx.drawImage(
            img,
            sourceX, sourceY, sourceWidth, sourceHeight,
            0, 0, this.cropSize, this.cropSize
        );

        // Convert to base64
        return canvas.toDataURL('image/png');
    },

    // Reset cropper
    reset: function() {
        this.isDragging = false;
        this.imageOffsetX = 0;
        this.imageOffsetY = 0;
        this.imageScale = 1;
        this.isReady = false;
        this.removeEventListeners();
        if (this.imageElement) {
            this.imageElement.src = '';
        }
        this.containerElement = null;
        this.imageElement = null;
        this.cropBoxElement = null;
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
