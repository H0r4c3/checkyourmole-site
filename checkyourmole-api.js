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

    if (!response.ok) throw new Error(`API request failed: ${response.status}`);

    const result = await response.json();
    showLoading(false);

    if (!result.success) throw new Error(result.error || 'Analysis failed');
    displayResults(result);

  } catch (error) {
    showLoading(false);
    alert(`Analysis failed: ${error.message}`);
    console.error(error);
  }
}

/**
 * Display analysis results nicely
 */
function displayResults(result) {
  const diagnosisLabel = document.getElementById('diagnosisLabel');
  const confidenceValue = document.getElementById('confidenceValue');
  const resultCard = document.getElementById('resultCard');

  const isMalignant = result.prediction === 'malignant';
  const labelText = isMalignant ? 'Malignant' : 'Benign';
  const confidencePercent = (result.confidence * 100).toFixed(1);

  diagnosisLabel.textContent = `Diagnosis: ${labelText}`;
  confidenceValue.textContent = `Confidence: ${confidencePercent}%`;
  resultCard.className = `result-card ${isMalignant ? 'malignant' : 'benign'} active`;

  // Update images
  document.getElementById('gradcamImage').src = result.gradcam_overlay;
  document.getElementById('originalImage').src = result.preprocessed_image;

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
  } else {
    spinner.classList.remove('active');
    analyzeBtn.disabled = false;
  }
}

/**
 * Button click handler
 */
document.addEventListener('DOMContentLoaded', () => {
  const analyzeBtn = document.getElementById('analyzeBtn');
  const fileInput = document.getElementById('file-upload');

  let selectedFile = null;
  fileInput.addEventListener('change', (e) => {
    selectedFile = e.target.files[0];
  });

  analyzeBtn.addEventListener('click', async () => {
    if (!selectedFile) {
      alert('Please upload an image first');
      return;
    }
    await analyzeImage(selectedFile);
  });
});
