import { useState } from "react";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;
    setMessages([...messages, { text: input, sender: "user" }]);
    setInput("");
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
