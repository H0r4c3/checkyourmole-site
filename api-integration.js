/**
 * API Integration for CheckYourMole GitHub Pages
 * Connects to Hugging Face Spaces Flask API
 * 
 * Add this to your index.html or as a separate .js file
 */

// IMPORTANT: Update this with your actual Hugging Face Space URL
const API_URL = 'https://horatiu-crista-checkyourmole-api.hf.space/analyze';

/**
 * Upload and analyze image
 * @param {File} imageFile - The uploaded image file
 * @returns {Promise<Object>} Analysis results
 */
async function analyzeImage(imageFile) {
    try {
        // Create FormData for file upload
        const formData = new FormData();
        formData.append('file', imageFile);
        
        // Show loading state
        showLoading(true);
        
        // Make API request
        const response = await fetch(API_URL, {
            method: 'POST',
            body: formData,
            // Don't set Content-Type header - browser will set it with boundary
        });
        
        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }
        
        // Parse JSON response
        const result = await response.json();
        
        // Hide loading
        showLoading(false);
        
        if (!result.success) {
            throw new Error(result.error || 'Analysis failed');
        }
        
        return result;
        
    } catch (error) {
        showLoading(false);
        console.error('Error analyzing image:', error);
        throw error;
    }
}

/**
 * Alternative: Upload image as base64 (for drag-and-drop from canvas)
 * @param {string} base64String - Base64 encoded image
 * @returns {Promise<Object>} Analysis results
 */
async function analyzeImageBase64(base64String) {
    try {
        showLoading(true);
        
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                image: base64String
            })
        });
        
        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }
        
        const result = await response.json();
        showLoading(false);
        
        if (!result.success) {
            throw new Error(result.error || 'Analysis failed');
        }
        
        return result;
        
    } catch (error) {
        showLoading(false);
        console.error('Error analyzing image:', error);
        throw error;
    }
}

/**
 * Display analysis results on the page
 * @param {Object} result - API response
 */
function displayResults(result) {
    // Update diagnosis label and box
    const diagnosisLabel = document.getElementById('diagnosisLabel');
    const diagnosisResult = document.getElementById('diagnosisResult');
    const confidenceValue = document.getElementById('confidenceValue');
    
    // Set diagnosis text
    diagnosisLabel.textContent = result.prediction.toUpperCase();
    
    // Apply color coding
    const isMalignant = result.prediction === 'malignant';
    diagnosisResult.className = `diagnosis-result ${result.prediction}`;
    confidenceValue.className = `confidence-value ${result.prediction}`;
    
    // Set confidence
    confidenceValue.textContent = `${(result.confidence * 100).toFixed(1)}%`;
    
    // Update images
    document.getElementById('originalImage').src = result.preprocessed_image;
    document.getElementById('gradcamImage').src = result.gradcam_overlay;
    
    // Show results section
    document.getElementById('resultsSection').classList.add('active');
    
    // Scroll to results
    document.getElementById('resultsSection').scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
    });
}

/**
 * Show/hide loading spinner
 * @param {boolean} show - Whether to show loading
 */
function showLoading(show) {
    const spinner = document.getElementById('loadingSpinner');
    const analyzeBtn = document.getElementById('analyzeBtn');
    
    if (show) {
        spinner.classList.add('active');
        analyzeBtn.disabled = true;
    } else {
        spinner.classList.remove('active');
        analyzeBtn.disabled = false;
    }
}

/**
 * Handle analyze button click
 */
async function handleAnalyzeClick() {
    if (!uploadedFile) {
        alert('Please upload an image first');
        return;
    }
    
    try {
        // Call API
        const result = await analyzeImage(uploadedFile);
        
        // Display results
        displayResults(result);
        
    } catch (error) {
        alert(`Analysis failed: ${error.message}`);
    }
}

/**
 * Test API connection
 * @returns {Promise<boolean>} Whether API is reachable
 */
async function testAPIConnection() {
    try {
        const healthURL = API_URL.replace('/analyze', '/health');
        const response = await fetch(healthURL);
        const data = await response.json();
        
        console.log('API Health Check:', data);
        return data.status === 'healthy';
        
    } catch (error) {
        console.error('API Connection Failed:', error);
        return false;
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🔬 CheckYourMole - Initializing...');
    
    // Test API connection
    const apiConnected = await testAPIConnection();
    
    if (apiConnected) {
        console.log('✅ API connection successful');
    } else {
        console.warn('⚠️ API connection failed - check API_URL in script');
    }
    
    // Connect analyze button
    const analyzeBtn = document.getElementById('analyzeBtn');
    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', handleAnalyzeClick);
    }
});

/**
 * USAGE EXAMPLE:
 * 
 * // In your existing file upload handler:
 * fileInput.addEventListener('change', async (e) => {
 *     const file = e.target.files[0];
 *     if (file) {
 *         uploadedFile = file;
 *         // Show preview
 *         imagePreview.src = URL.createObjectURL(file);
 *         previewContainer.classList.add('active');
 *         analyzeBtn.disabled = false;
 *     }
 * });
 * 
 * // The analyze button will call handleAnalyzeClick() which uses analyzeImage()

 */
