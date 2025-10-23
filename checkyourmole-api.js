/**
 * API Integration for CheckYourMole GitHub Pages
 * Connects to Hugging Face Spaces Flask API
 */

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
  console.log('API Result:', result);
  console.log('Preprocessed image exists?', !!result.preprocessed_image);
  console.log('Grad-CAM exists?', !!result.gradcam_overlay);
  
  const diagnosisLabel = document.getElementById('diagnosisLabel');
  const confidenceValue = document.getElementById('confidenceValue');
  const resultCard = document.getElementById('resultCard');
  const originalImage = document.getElementById('originalImage');
  const originalPlaceholder = document.getElementById('originalPlaceholder');
  const gradcamImage = document.getElementById('gradcamImage');
  const gradcamPlaceholder = document.getElementById('gradcamPlaceholder');

  const isMalignant = result.prediction === 'malignant';
  const labelText = isMalignant ? 'Malignant' : 'Benign';
  const confidencePercent = (result.confidence * 100).toFixed(1);

  diagnosisLabel.textContent = `Diagnosis: ${labelText}`;
  confidenceValue.textContent = `Confidence: ${confidencePercent}%`;
  resultCard.className = `result-card ${isMalignant ? 'malignant' : 'benign'} active`;

  // Update original image with preprocessed version
  if (result.preprocessed_image) {
    console.log('Updating original image with preprocessed version');
    originalImage.onload = () => {
      console.log('Preprocessed image loaded');
      originalPlaceholder.style.display = 'none';
    };
    originalImage.src = result.preprocessed_image;
    originalImage.style.display = 'block';
  } else {
    console.warn('No preprocessed_image in API response!');
  }

  // Update Grad-CAM image and hide placeholder
  if (result.gradcam_overlay) {
    gradcamImage.onload = () => {
      console.log('Grad-CAM loaded');
      gradcamPlaceholder.style.display = 'none';
      gradcamImage.style.display = 'block';
    };
    gradcamImage.src = result.gradcam_overlay;
  } else {
    console.warn('No gradcam_overlay in API response!');
  }

  // Scroll to results
  setTimeout(() => {
    resultCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 100);
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
  const originalPlaceholder = document.getElementById('originalPlaceholder');
  const gradcamImage = document.getElementById('gradcamImage');
  const gradcamPlaceholder = document.getElementById('gradcamPlaceholder');
  const resultCard = document.getElementById('resultCard');

  let selectedFile = null;

  // Handle file selection
  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      fileInput.value = ''; // Clear the input
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('Image is too large. Please select an image under 10MB');
      fileInput.value = ''; // Clear the input
      return;
    }

    selectedFile = file;
    
    // Show original image preview and hide placeholder
    const imageUrl = URL.createObjectURL(file);
    originalImage.onload = () => {
      originalPlaceholder.style.display = 'none';
    };
    originalImage.src = imageUrl;
    originalImage.style.display = 'block';
    
    // Reset Grad-CAM to placeholder state
    gradcamImage.src = '';
    gradcamImage.style.display = 'none';
    gradcamPlaceholder.style.display = 'flex';
    gradcamPlaceholder.textContent = 'Awaiting analysis';
    
    // Hide previous results
    resultCard.classList.remove('active');
    
    // Enable analyze button
    analyzeBtn.disabled = false;
  });

  // Handle analyze button click
  analyzeBtn.addEventListener('click', async () => {
    if (!selectedFile) {
      alert('Please upload an image first');
      return;
    }
    await analyzeImage(selectedFile);
  });

  // Handle Grad-CAM image load error
  gradcamImage.addEventListener('error', () => {
    console.error('Failed to load Grad-CAM image');
    gradcamPlaceholder.style.display = 'flex';
    gradcamPlaceholder.textContent = 'Error loading heatmap';
    gradcamImage.style.display = 'none';
  });
});