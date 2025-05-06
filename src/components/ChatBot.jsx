import React, { useState, useRef, useEffect } from 'react';
import { getGeminiResponse } from '../utils/geminiService'; // Ensure this path is correct

function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! I'm your systems thinking assistant. How can I help you understand the obesity epidemic in India?", sender: 'bot' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null); // Ref for the input field

  // Scroll to bottom of messages when new ones arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!inputText.trim() || isLoading) return; // Prevent sending empty or while loading

    // Add user message
    const userMessage = { text: inputText, sender: 'user' };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Get response from Gemini API
      const geminiResponse = await getGeminiResponse(
        inputText,
        // Send the last 6 messages for context (if there are that many)
        messages.slice(-6)
      );

      // Add bot response
      setMessages(prevMessages => [
        ...prevMessages,
        { text: geminiResponse, sender: 'bot' }
      ]);
    } catch (error) {
      console.error("Error getting response:", error);
      // Add error message
      setMessages(prevMessages => [
        ...prevMessages,
        { text: "Sorry, I encountered an error. Please try again later.", sender: 'bot' }
      ]);
    } finally {
      setIsLoading(false);
      // Refocus input after response (or error)
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  return (
    <div className={`chatbot-container ${isOpen ? 'open' : ''}`}>
      <button
        className="chatbot-toggle"
        onClick={toggleChat}
        aria-label={isOpen ? "Close chat assistant" : "Open chat assistant"}
      >
        <div className="bot-icon">
          <img
            src="/images/bot.png" // Ensure this path is correct
            alt="Systems Thinking Bot"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://placehold.co/40x40/ffffff/3A86FF?text=Bot'; // Improved fallback
            }}
          />
        </div>
        {!isOpen && <span>Ask Me!</span>}
      </button>

      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <h3>Systems Thinking Assistant</h3>
            <button
              className="close-chat"
              onClick={toggleChat}
              aria-label="Close chat"
            >
              &times;
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}`}>
                {/* Basic Markdown support (bold and italics) */}
                <span dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>') }} />
              </div>
            ))}
            {isLoading && (
              <div className="message bot loading">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form className="chatbot-input" onSubmit={handleSubmit}>
            <input
              ref={inputRef} // Assign ref to input
              type="text"
              placeholder="Ask about systems..."
              value={inputText}
              onChange={handleInputChange}
              disabled={isLoading}
              aria-label="Chat input"
            />
            <button
              type="submit"
              aria-label="Send message"
              disabled={isLoading || !inputText.trim()} // Disable if loading or input is empty
              className={(isLoading || !inputText.trim()) ? 'disabled' : ''}
            >
              {/* Send Icon */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default ChatBot;
