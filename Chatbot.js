import React, { useState } from 'react';

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!input.trim()) return;
    const userMessage = { from: 'user', text: input };
    setMessages((msgs) => [...msgs, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      const botMessage = { from: 'bot', text: data.reply || 'Sorry, no response.' };
      setMessages((msgs) => [...msgs, botMessage]);
    } catch (error) {
      setMessages((msgs) => [...msgs, { from: 'bot', text: 'Error: Could not connect to server.' }]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyPress(e) {
    if (e.key === 'Enter') {
      sendMessage();
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: 'auto' }}>
      <div
        style={{
          border: '1px solid #ccc',
          padding: '1rem',
          height: '400px',
          overflowY: 'scroll',
          marginBottom: '1rem',
          backgroundColor: '#f9f9f9',
          borderRadius: '8px',
        }}
      >
        {messages.map((msg, i) => (
          <p
            key={i}
            style={{
              textAlign: msg.from === 'user' ? 'right' : 'left',
              backgroundColor: msg.from === 'user' ? '#daf1da' : '#eee',
              padding: '0.5rem 1rem',
              borderRadius: '12px',
              maxWidth: '75%',
              marginLeft: msg.from === 'user' ? 'auto' : '0',
              marginBottom: '0.5rem',
              wordWrap: 'break-word',
            }}
          >
            {msg.text}
          </p>
        ))}
        {loading && <p>Loading...</p>}
      </div>
      <input
        type="text"
        placeholder="Ask me about your studies..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyPress}
        style={{ width: '80%', padding: '0.5rem', fontSize: '1rem' }}
      />
      <button onClick={sendMessage} style={{ padding: '0.5rem 1rem', marginLeft: '0.5rem' }}>
        Send
      </button>
    </div>
  );
}
