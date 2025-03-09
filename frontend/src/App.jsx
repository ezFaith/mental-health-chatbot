import { useState, useEffect, useRef } from "react";
import { marked } from "marked"; // Markdown support
import "./styles.css";

export default function App() {
  const [input, setInput] = useState("");
  const [chat, setChat] = useState([
    { sender: "bot", text: "Hello! How can I support you today? 😊" }
  ]);
  const [theme, setTheme] = useState("dark");

  const chatBoxRef = useRef(null); // To auto-scroll

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
  );
}
