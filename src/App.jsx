import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';

const API_KEY = import.meta.env.VITE_API_KEY;
const ENDPOINT = "https://askyhub2496887985.services.ai.azure.com/models/chat/completions";

function App() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    try {
      const response = await axios.post(
        ENDPOINT,
        {
          model: "DeepSeek-V3",
          messages: [
            { role: "system", content: "You are a helpful assistant." },
            ...newMessages
          ],
          temperature: 0.7,
          max_tokens: 100
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`,
          },
        }
      );

      const reply = response.data.choices[0].message.content;
      setMessages([...newMessages, { role: 'assistant', content: reply }]);
    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong.");
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="app">
      <h2>🤖 Asky</h2>

      <div className="messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.role}`}>
            <b>{msg.role === 'user' ? 'You' : 'Asky'}:</b> {msg.content}
          </div>
        ))}
        {isTyping && (
          <div className="message assistant typing">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
        )}
        <div ref={bottomRef}></div>
      </div>

      <div className="input-area">
        <input
          type="text"
          value={input}
          placeholder="Ask something..."
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSend();
            }
          }}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}

export default App;
