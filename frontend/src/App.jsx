import { useState } from "react";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return; // Prevent empty messages
  
    // Add user's message to the chat
    setMessages([...messages, { text: input, sender: "user" }]);
  
    try {
      // Send the message to the backend
      const response = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
  
      const data = await response.json();
  
      // Add bot's response to the chat
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: data.reply, sender: "bot" },
      ]);
    } catch (error) {
      console.error("Error communicating with the backend:", error);
    }
  
    setInput(""); // Clear input field after sending
  };
  

  return (
    <div className="flex flex-col items-center h-screen bg-gray-900 text-white">
      <h1 className="text-2xl font-bold my-4">Mental Health Chatbot</h1>
      <div className="w-full max-w-lg p-4 bg-gray-800 rounded-lg h-96 overflow-y-auto">
        {messages.map((msg, index) => (
          <p key={index} className={`text-${msg.sender === "user" ? "right" : "left"}`}>
            {msg.text}
          </p>
        ))}
      </div>
      <input
        className="mt-4 p-2 w-full max-w-lg border border-gray-500 rounded"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message..."
      />
      <button onClick={sendMessage} className="mt-2 p-2 bg-blue-500 rounded">
        Send
      </button>
    </div>
  );
}

export default App;
