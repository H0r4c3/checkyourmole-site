/**
 * API Integration for CheckYourMole GitHub Pages
 * Connects to Hugging Face Spaces Flask API
 */

// Update with your actual Hugging Face Space URL
const API_URL = 'https://horatiu-crista-checkyourmole-api.hf.space/analyze';

/**
 * Upload and analyze image
 */
async function analyzeImage(imageFile) {
  try {
    const formData = new FormData();
    formData.append('file', imageFile);
    showLoading(true);

    const response = await fetch(API_URL, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const result = await response.json();
    showLoading(false);

    if (!result.success) {
      throw new Error(result.error || 'Analysis failed');
    }
    
    displayResults(result);

  } catch (error) {
    showLoading(false);
    const errorMessage = error.message.includes('Failed to fetch') 
      ? 'Cannot connect to API. Please check if the Hugging Face Space is running.'
      : error.message;
    alert(`Analysis failed: ${errorMessage}`);
    console.error('Analysis error:', error);
  }
}

/**
 * Display analysis results
 */
function displayResults(result) {
  const diagnosisLabel = document.getElementById('diagnosisLabel');
  const confidenceValue = document.getElementById('confidenceValue');
  const resultCard = document.getElementById('resultCard');
  const gradcamImage = document.getElementById('gradcamImage');

  const isMalignant = result.prediction === 'malignant';
  const labelText = isMalignant ? 'Malignant' : 'Benign';
  const confidencePercent = (result.confidence * 100).toFixed(1);

  diagnosisLabel.textContent = `Diagnosis: ${labelText}`;
  confidenceValue.textContent = `Confidence: ${confidencePercent}%`;
  resultCard.className = `result-card ${isMalignant ? 'malignant' : 'benign'} active`;

  // Update Grad-CAM image
  gradcamImage.src = result.gradcam_overlay;
  gradcamImage.classList.remove('placeholder');

  // Scroll to results
  resultCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/**
 * Show or hide loading spinner
 */
function showLoading(show) {
  const spinner = document.getElementById('loadingSpinner');
  const analyzeBtn = document.getElementById('analyzeBtn');
  
  if (show) {
    spinner.classList.add('active');
    analyzeBtn.disabled = true;
    analyzeBtn.textContent = 'Analyzing...';
  } else {
    spinner.classList.remove('active');
    analyzeBtn.disabled = false;
    analyzeBtn.textContent = 'Analyze Image';
  }
}

/**
 * Initialize the application
 */
document.addEventListener('DOMContentLoaded', () => {
  const analyzeBtn = document.getElementById('analyzeBtn');
  const fileInput = document.getElementById('file-upload');
  const originalImage = document.getElementById('originalImage');
  const gradcamImage = document.getElementById('gradcamImage');
  const resultCard = document.getElementById('resultCard');

  let selectedFile = null;

  // Handle file selection
  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('Image is too large. Please select an image under 10MB');
        return;
      }

      selectedFile = file;
      
      // Show preview
      originalImage.src = URL.createObjectURL(file);
      originalImage.style.display = 'block';
      
      // Reset Grad-CAM and results
      gradcamImage.src = '';
      gradcamImage.classList.add('placeholder');
      resultCard.classList.remove('active');
      
      // Enable analyze button
      analyzeBtn.disabled = false;
    }
  });

  // Handle analyze button click
  analyzeBtn.addEventListener('click', async () => {
    if (!selectedFile) {
      alert('Please upload an image first');
      return;
    }
    await analyzeImage(selectedFile);
  });

  // Handle Grad-CAM image load
  gradcamImage.addEventListener('load', () => {
    if (gradcamImage.src && gradcamImage.src !== '') {
      gradcamImage.classList.remove('placeholder');
      gradcamImage.style.display = 'block';
    }
  });

  // Handle Grad-CAM image error
  gradcamImage.addEventListener('error', () => {
    console.error('Failed to load Grad-CAM image');
  });
});