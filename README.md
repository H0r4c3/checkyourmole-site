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

## 🌐 Free Live Demo
The site is available at:  
👉 **https://H0r4c3.github.io/checkyourmole-site**
![0](https://github.com/user-attachments/assets/e72be58e-9f11-4aa3-89e1-b827585613f2)

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

## Model Training Summary
![4](https://github.com/user-attachments/assets/3986ae33-927c-427e-84f7-380745a66752)

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


