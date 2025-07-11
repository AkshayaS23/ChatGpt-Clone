# 💬 ChatGPT Clone

A full-featured ChatGPT clone built using **React**, with Markdown support, syntax highlighting, context-aware conversations, and beautiful UI. Supports integration with **Cohere AI** or **OpenAI** APIs.

🟢 Live: [https://AkshayaS23.github.io/ChatGPT-clone](https://AkshayaS23.github.io/ChatGPT-clone)

📁 [**Download this Project**](https://github.com/AkshayaS23/ChatGPT-clone/archive/refs/heads/main.zip)

---

## ✨ Features

- 🧠 Conversational AI via Cohere or OpenAI
- 📝 Markdown support with `react-markdown`
- 💡 Syntax highlighting with `highlight.js`
- 🗂 Sidebar with saved chat history and new chat creation
- 💾 Local storage for chat persistence
- 🧵 Multi-turn memory support
- 🎯 GitHub Pages deployment
- 📦 API keys stored securely in `.env` (ignored by Git)

---

## 📷 Screenshots

<img width="1852" height="870" alt="image" src="https://github.com/user-attachments/assets/a3f8d248-dc43-48dd-99ef-abc0a59247e4" />
<img width="1859" height="850" alt="image" src="https://github.com/user-attachments/assets/9bb1c6d7-bf7b-4a21-af9c-eb5a4051a824" />




## 🛠 Project Structure

```

ChatGPT-clone/
├── public/
│   └── index.html
├── src/
│   ├── assets/
│   ├── components/
│   ├── App.jsx
│   └── index.js
├── .env (ignored)
├── package.json
├── .gitignore
└── README.md

````

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/AkshayaS23/ChatGPT-clone.git
cd ChatGPT-clone
````

### 2. Install dependencies

```bash
npm install
```

### 3. Add environment variables

Create a `.env` file at the root:

```env
REACT_APP_COHERE_API_KEY=your_cohere_api_key
(or)
REACT_APP_OPENAI_API_KEY=your_openai_api_key
```

### 4. Run the app locally

```bash
npm start
```

### 5. Build for production

```bash
npm run build
```

---

## 🌍 Deployment (GitHub Pages)

### First-time setup (one-time):

1. Install the deployment tool:

```bash
npm install gh-pages --save-dev
```

2. Add these lines to `package.json`:

```json
"homepage": "https://AkshayaS23.github.io/ChatGPT-clone",(your page link)
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d build"
}
```

3. Deploy the app:

```bash
npm run deploy
```

Done! 🎉

---

## 🧠 Tech Stack

* React 19
* React Markdown
* Highlight.js
* Cohere AI / OpenAI
* GitHub Pages
* Dotenv

---

## 👩‍💻 Author

**Akshaya V**
🔗 [GitHub](https://github.com/AkshayaS23)

---

## 📄 License

MIT License © Akshaya V

