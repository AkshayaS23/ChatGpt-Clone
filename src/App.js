import './App.css';
import gptLogo from './assets/chatgpt.svg';
import addBtn from './assets/add-30.png';
import msgIcon from './assets/message.svg';
import home from './assets/home.svg';
import saved from './assets/bookmark.svg';
import rocket from './assets/rocket.svg';
import sendBtn from './assets/send.svg';
import userIcon from './assets/user-icon.png';
import gptImgLogo from './assets/chatgptLogo.svg';
import { sendMsgToCohere } from './cohereai';
import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { FiCopy, FiDownload, FiCheck } from 'react-icons/fi';

const intervalRef = { current: null };

function App() {
  const msgEnd = useRef(null);

  const [chatList, setChatList] = useState(() => {
    return JSON.parse(localStorage.getItem("chatList") || "[]");
  });

  const [selectedChatId, setSelectedChatId] = useState(() => {
    return localStorage.getItem("selectedChatId") || null;
  });

  const [messages, setMessages] = useState([]);

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [controller, setController] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const [editingChatId, setEditingChatId] = useState(null);
  const [editName, setEditName] = useState("");


  // Load messages when selectedChatId changes
  useEffect(() => {
    if (selectedChatId) {
      const allChats = JSON.parse(localStorage.getItem("allChats") || "{}");
      setMessages(allChats[selectedChatId] || [{
        text: "Hi, I’m ChatGPT — your AI buddy who helps with code, answers questions, and chats anytime you need support!",
        isBot: true
      }]);
    }
  }, [selectedChatId]);

  // Scroll to bottom and save messages to localStorage
  useEffect(() => {
    msgEnd.current?.scrollIntoView({ behavior: 'smooth' });

    if (selectedChatId) {
      const allChats = JSON.parse(localStorage.getItem("allChats") || "{}");
      allChats[selectedChatId] = messages;
      localStorage.setItem("allChats", JSON.stringify(allChats));
    }
  }, [messages, selectedChatId]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;

    setInput('');
    const userMsg = { text, isBot: false };
    setMessages(prev => [...prev, userMsg]);

    setIsTyping(true);
    const abortController = new AbortController();
    setController(abortController);

    try {
     const res = await sendMsgToCohere(text, abortController, [...messages, userMsg]);
      const fullText = res;
      let index = 0;

      setMessages(prev => [...prev, { text: "", isBot: true }]);

      intervalRef.current = setInterval(() => {
        if (abortController.signal.aborted) {
          clearInterval(intervalRef.current);
          return;
        }

        setMessages(prev => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (!last.isBot) return prev;

          updated[updated.length - 1] = {
            ...last,
            text: fullText.slice(0, index + 1),
          };
          return updated;
        });

        index++;
        if (index >= fullText.length) {
          clearInterval(intervalRef.current);
          setIsTyping(false);
        }
      }, 15);
    } catch {
      setMessages(prev => [...prev, { text: "⚠️ Failed to get response", isBot: true }]);
      setIsTyping(false);
    }
  };

  const handleEnter = async (e) => {
    if (e.key === 'Enter') await handleSend();
  };

  const handleQuery = async (e) => {
    setInput(e.target.value);
    await handleSend();
  };

  const cancelGeneration = () => {
    if (controller) {
      controller.abort();
      clearInterval(intervalRef.current);
      setIsTyping(false);
    }
  };

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  const handleDownload = (text) => {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "response.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDeleteChat = (id) => {
  const updatedList = chatList.filter(chat => chat.id !== id);
  const allChats = JSON.parse(localStorage.getItem("allChats") || "{}");

  delete allChats[id];

  setChatList(updatedList);
  localStorage.setItem("chatList", JSON.stringify(updatedList));
  localStorage.setItem("allChats", JSON.stringify(allChats));

  // If the deleted chat was selected, switch to another or reset
  if (id === selectedChatId) {
    if (updatedList.length > 0) {
      const newId = updatedList[0].id;
      setSelectedChatId(newId);
      localStorage.setItem("selectedChatId", newId);
    } else {
      setSelectedChatId(null);
      setMessages([]);
      localStorage.removeItem("selectedChatId");
    }
  }
};


  const startNewChat = () => {
    const newId = Date.now().toString();
    const newChat = {
      id: newId,
      name: `Chat ${chatList.length + 1}`
    };
    const updatedList = [...chatList, newChat];
    setChatList(updatedList);
    setSelectedChatId(newId);
    setMessages([{
      text: "Hi, I’m ChatGPT — your AI buddy who helps with code, answers questions, and chats anytime you need support!",
      isBot: true
    }]);

    localStorage.setItem("chatList", JSON.stringify(updatedList));
    localStorage.setItem("selectedChatId", newId);
  };

  return (
    <div className="App">
      <div className="sidebar">
        <div className="upperSide">
          <div className="upperSideTop">
            <img src={gptLogo} alt="Logo" className="logo" />
            <span className="brand">ChatGPT</span>
          </div>

          <button className="midBtn" onClick={startNewChat}>
            <img src={addBtn} alt="new chat" className="addBtn" />
            New Chat
          </button>

          <div className="upperSideBottom">
            <button className="query" onClick={handleQuery} value="What is Programming ?">
              <img src={msgIcon} alt="Query" />
              What is Programming ?
            </button>
            <button className="query" onClick={handleQuery} value="How to use an API ?">
              <img src={msgIcon} alt="Query" />
              How to use an API ?
            </button>
          </div>

          <div className="chatList">
  {chatList.map((chat) => (
    <div
      key={chat.id}
      className={`chatListItem ${chat.id === selectedChatId ? "active" : ""}`}
    >
      <div
        className="chatName"
        onClick={() => {
          setSelectedChatId(chat.id);
          localStorage.setItem("selectedChatId", chat.id);
        }}
      >
        <img src={msgIcon} alt="chat" />
        {editingChatId === chat.id ? (
      <input
        className="renameInput"
        value={editName}
        autoFocus
        onChange={(e) => setEditName(e.target.value)}
        onBlur={() => {
          const updated = chatList.map((c) =>
            c.id === chat.id ? { ...c, name: editName } : c
          );
          setChatList(updated);
          localStorage.setItem("chatList", JSON.stringify(updated));
          setEditingChatId(null);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") e.target.blur();
        }}
      />
      ) : (
        <span onDoubleClick={() => {
          setEditingChatId(chat.id);
          setEditName(chat.name);
        }}>
          {chat.name}
        </span>
      )}

      </div>
      <button className="deleteBtn" onClick={() => handleDeleteChat(chat.id)}>🗑</button>
    </div>
  ))}
</div>

        </div>

        <div className="lowerSide">
          <div className="listItems"><img src={home} alt="" className="listItemsImg" />Home</div>
          <div className="listItems"><img src={saved} alt="" className="listItemsImg" />Saved</div>
          <div className="listItems"><img src={rocket} alt="" className="listItemsImg" />Upgrade to Pro</div>
        </div>
      </div>

      <div className="main">
        <div className="chats">
          {messages.map((message, i) => (
            <div key={i} className={message.isBot ? "chat bot" : "chat"}>
              <img className='chatImg' src={message.isBot ? gptImgLogo : userIcon} alt="" />
              <div className="txt">
                {message.isBot && message.text && (
                  <div className="action-btns">
                    <button className="copy-btn" onClick={() => handleCopy(message.text, i)}>
                      {copiedIndex === i ? <FiCheck /> : <FiCopy />}
                    </button>
                    <button className="download-btn" onClick={() => handleDownload(message.text)}>
                      <FiDownload />
                    </button>
                    {copiedIndex === i && <span className="copied-label">Copied!</span>}
                  </div>
                )}
                <ReactMarkdown>{message.text}</ReactMarkdown>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="typing-dots">
              <span>.</span><span>.</span><span>.</span>
            </div>
          )}
          <div ref={msgEnd}></div>
        </div>

        <div className="chatFooter">
          <div className="inp">
            <input
              type="text"
              placeholder='Send a message'
              value={input}
              onKeyDown={handleEnter}
              onChange={(e) => setInput(e.target.value)}
            />
            <button className="send" onClick={handleSend}>
              <img src={sendBtn} alt="Send" />
            </button>
            {isTyping && (
              <button className="cancel-btn" onClick={cancelGeneration}>Stop</button>
            )}
          </div>
          <p>ChatGPT may produce inaccurate information about people, places, or facts.</p>
        </div>
      </div>
    </div>
  );
}

export default App;
