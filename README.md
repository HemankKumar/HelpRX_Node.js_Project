# 🩺 Helprx – Medicine Donation & AI Assistance Platform

Helprx is a full-stack web application designed to connect medicine donors with recipients in need.  
The platform integrates secure backend services, cloud-hosted databases, and AI-powered features to improve accessibility and decision-making in healthcare assistance.

---

## 🚀 Live Demo

🔗 **Live Application:**  
https://helprx-node-js-project.onrender.com  

---

## 🛠️ Tech Stack

**Frontend**
- HTML, CSS, JavaScript
- Bootstrap

**Backend**
- Node.js
- Express.js
- REST APIs

**Database**
- MySQL (Aiven – Cloud Hosted, SSL enabled)

**AI / Microservice**
- Python
- Flask
- Pandas
- CSV-based medical dataset

**Deployment & Tools**
- Render (Backend & AI Service Deployment)
- Git & GitHub
- MySQL Workbench

---

## ✨ Key Features

- 👥 Role-based system supporting **Donor**, **Needy**, and **Admin**
- 🔐 Secure user authentication and session management
- 💊 Medicine donation and request workflow
- 🤖 AI-powered symptom-based medicine recommendation
- 💬 Interactive chatbot for user assistance
- ☁️ Cloud deployment with scalable architecture
- 🔒 Secure database connectivity using environment variables and SSL

---

## 🧠 AI Architecture Overview

- AI logic implemented as a **Flask-based microservice**
- Uses a medicine dataset to map symptoms to probable diseases and medicines
- Node.js backend communicates with AI service via REST APIs
- Decoupled microservice architecture for scalability

---
Frontend (Browser)
↓
Node.js / Express Backend (Render)
↓
Aiven Cloud MySQL (SSL secured)
↓
Flask AI Microservice (Render)



---

## ▶️ How to Run Locally (Optional)

```bash
git clone https://github.com/your-username/helprx.git
cd helprx
npm install
node server2.js

## 🏗️ System Architecture

