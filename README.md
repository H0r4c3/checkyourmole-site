# checkyourmole-site
Frontend for CheckYourMole AI Demo

# 🧪 CheckYourMole — AI Mole Classification Demo (Frontend)

This repository hosts the **frontend website** for the **CheckYourMole AI Demo**.  
It provides a simple and user-friendly interface where visitors can upload mole images.  
The uploaded images are securely sent to a **private backend model** hosted on Hugging Face, which performs:

- ✅ Image preprocessing (contrast enhancement, hair removal, color normalization)  
- ✅ Mole classification (probability of malignancy)  
- ✅ Grad-CAM visualization (to highlight the region of focus)  

---

## 🌐 Live Demo
Once deployed, the site will be available at:  
👉 **https://H0r4c3.github.io/checkyourmole-site**

---

## ⚙️ How It Works
1. **Frontend (this repo)**  
   - Static website hosted on GitHub Pages  
   - Provides upload form and displays results  

2. **Backend (Hugging Face Space)**  
   - Runs the private ML model (Fine‑tuned EfficientNet on a dermoscopic lesion dataset)
   - Handles preprocessing, evaluation, and Grad-CAM visualization  
   - Returns results to the frontend as JSON  

3. **Workflow**  
   - User uploads an image → frontend sends it to backend → backend returns prediction + heatmap → frontend displays results  

---

## 📂 Repository Structure

---

## 🚀 Deployment
- Hosted via **GitHub Pages**  
- Backend powered by **Hugging Face Spaces** (FastAPI/Flask or Gradio, depending on setup)  

---

## ⚠️ Disclaimer
This tool is provided **for educational and research purposes only**.  
It is **not a medical device** and must not be used for diagnosis or treatment.  
Always consult a qualified dermatologist for medical concerns.

---

## 👤 Author
**Horatiu Crista**  
- Software Test Engineer (15+ years automotive & software QA)  
- Transitioning into Python automation & Machine Learning  
- [LinkedIn](https://www.linkedin.com/in/horatiu-crista/) | [Hugging Face](https://huggingface.co/horatiu-crista)

---

## 📌 Next Steps
- [ ] Connect frontend upload form to Hugging Face backend  
- [ ] Add Grad-CAM visualization display  
- [ ] Improve UI/UX with responsive design  

