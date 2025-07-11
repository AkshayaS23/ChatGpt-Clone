const COHERE_API_KEY = process.env.REACT_APP_COHERE_API_KEY;

// Accept external abort controller to support Stop button
export async function sendMsgToCohere(userMessage, abortController, fullHistory = []) {
  const chatHistory = fullHistory
    .filter((msg) => msg.text && msg.text.trim())
    .map((msg) => ({
      role: msg.isBot ? "CHATBOT" : "USER",
      message: msg.text,
    }));

  const res = await fetch("https://api.cohere.ai/v1/chat", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${COHERE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "command-r", // or command-r-plus if you have access
      message: userMessage,
      chat_history: chatHistory,
    }),
    signal: abortController.signal,
  });

  if (!res.ok) {
    throw new Error("❌ Failed to fetch from Cohere API");
  }

  const data = await res.json();
  return data.text || "Sorry, I couldn't understand that.";
}

