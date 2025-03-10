import { useState, useEffect, useRef } from "react";
import { marked } from "marked"; // Markdown support
import "./styles.css"; // Import styles at the top

export default function App() {
  // ✅ Move state inside the function component
  const [input, setInput] = useState("");
  const [chat, setChat] = useState([
    { sender: "bot", text: "Hello! How can I support you today? 😊" }
  ]);
  const [theme, setTheme] = useState("dark");
  const [showNotice, setShowNotice] = useState(true); // ✅ Moved inside App function

  const chatBoxRef = useRef(null); // To auto-scroll

  const handleCloseNotice = () => {
    setShowNotice(false);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setChat((prevChat) => [...prevChat, userMessage]);
    setInput(""); // Clear input box after sending

    try {
      const response = await fetch("https://mental-health-chatbot-rs8o.onrender.com/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input })
      });

      const data = await response.json();
      const botMessage = { sender: "bot", text: data.reply };
      setChat((prevChat) => [...prevChat, botMessage]);
    } catch (error) {
      console.error("Error fetching chatbot response:", error);
      setChat((prevChat) => [...prevChat, { sender: "bot", text: "Oops! Something went wrong. Try again later." }]);
    }
  };

  useEffect(() => {
    // Auto-scroll to the bottom when new messages are added
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [chat]);

  return (
    <>
      {/* ✅ Notice Box */}
      {showNotice && (
        <div className="notice-overlay">
          <div className="notice-box">
            <h2>🌿  A Quick Note About Response Time</h2>
            <p>
              Hey there! 😊 <br /> My mental health chatbot is here to support you.
              Please note that after a long period of inactivity, it might take
              <strong> 10 - 30 seconds</strong> to wake up and send its first response.
              But don’t worry, after that replies will be instant!
              <br /> Thank you for your patience and understanding. 💙
            </p>
            <button onClick={handleCloseNotice}>I Understand</button>
          </div>
        </div>
      )}


      {/* ✅ Main Chat Container */}
      <div className="chat-container" data-theme={theme}>
        {/* Light/Dark Mode Toggle - Fixed at Top Right */}
        <button className="toggle-mode" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          {theme === "dark" ? "🌞" : "🌙"}
        </button>

        <header>
          <h1>🧠 Mental Health Chatbot</h1>
        </header>

        <div className="chat-box" ref={chatBoxRef}>
          {chat.map((msg, index) => (
            <div key={index} className={`chat-message ${msg.sender}`}>
              {/* Render Markdown formatted messages */}
              <p dangerouslySetInnerHTML={{ __html: marked(msg.text) }}></p>
            </div>
          ))}
        </div>

        <div className="chat-input">
          <input
            type="text"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button onClick={sendMessage}>
            <i className="fas fa-paper-plane"></i> {/* Updated to ChatGPT-style arrow icon */}
          </button>
        </div>

        {/* ✅ Footer */}
        <footer className="footer">
          Made by <strong>Dipankar Saha</strong> ❤️
          <div className="social-links">
            <a href="https://www.linkedin.com/in/dipankarsaha2001/" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-linkedin"></i>
            </a>
            <a href="https://github.com/ezFaith" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-github"></i>
            </a>
          </div>
        </footer>
      </div>
    </>
  );
}
