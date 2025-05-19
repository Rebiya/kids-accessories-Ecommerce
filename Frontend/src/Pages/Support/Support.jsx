import React, { useState } from 'react';
import styles from './Support.module.css';
import { FaHeadset, FaEnvelope, FaPhone, FaInfoCircle, FaRobot } from 'react-icons/fa';
import { RiSendPlaneFill } from 'react-icons/ri';
import { askAI } from '../../Services/MistralAi';  // Import the service

const Support = () => {
  const [activeTab, setActiveTab] = useState('ai');
  const [aiMessage, setAiMessage] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Hello! I\'m your shopping assistant. How can I help you today?' }
  ]);
  const [email, setEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAiSubmit = async (e) => {
    e.preventDefault();
    if (!aiMessage.trim()) return;

    // Add user message
    setMessages([...messages, { sender: 'user', text: aiMessage }]);
    setLoading(true);

    // Call AI API service
    const reply = await askAI(aiMessage);

    // Add AI response
    setMessages(prev => [...prev, { sender: 'ai', text: reply }]);
    setLoading(false);
    setAiMessage('');
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    alert(`Thank you for your message! We'll contact you at ${email} soon.`);
    setEmail('');
    setContactMessage('');
  };

  return (
    <div className={styles.supportContainer}>
      <div className={styles.header}>
        <h1><FaHeadset className={styles.headerIcon} /> Customer Support</h1>
        <p>We're here to help you 24/7</p>
      </div>

      <div className={styles.tabs}>
        <button 
          className={`${styles.tabButton} ${activeTab === 'ai' ? styles.active : ''}`}
          onClick={() => setActiveTab('ai')}
        >
          <FaRobot /> Ask AI Assistant
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'contact' ? styles.active : ''}`}
          onClick={() => setActiveTab('contact')}
        >
          <FaEnvelope /> Contact Us
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'info' ? styles.active : ''}`}
          onClick={() => setActiveTab('info')}
        >
          <FaInfoCircle /> Website Info
        </button>
      </div>

      <div className={styles.content}>
        {activeTab === 'ai' && (
          <div className={styles.aiContainer}>
            <div className={styles.chatWindow}>
              {messages.map((msg, index) => (
                <div 
                  key={index} 
                  className={`${styles.message} ${msg.sender === 'ai' ? styles.aiMessage : styles.userMessage}`}
                >
                  {msg.text}
                </div>
              ))}
            </div>
            <form onSubmit={handleAiSubmit} className={styles.aiForm}>
              <input
                type="text"
                value={aiMessage}
                onChange={(e) => setAiMessage(e.target.value)}
                placeholder="Ask me anything about our products..."
                className={styles.aiInput}
                disabled={loading}
              />
              <button type="submit" className={styles.aiSubmit} disabled={loading}>
                <RiSendPlaneFill />
              </button>
            </form>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className={styles.contactContainer}>
            <div className={styles.contactInfo}>
              <h2><FaPhone /> Direct Contact</h2>
              <p>Phone: <a href="tel:+2510993044432">+251 099 304 4432</a></p>
              <p>Email: <a href="mailto:rebum.19@gmail.com">rebum.19@gmail.com</a></p>
              <p>Available 9:00 AM - 8:00 PM EAT, Monday to Saturday</p>
            </div>

            <form onSubmit={handleContactSubmit} className={styles.contactForm}>
              <h2>Send Us a Message</h2>
              <div className={styles.formGroup}>
                <label htmlFor="email">Your Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={styles.formInput}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="message">Your Message</label>
                <textarea
                  id="message"
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  required
                  className={styles.formTextarea}
                  rows="5"
                ></textarea>
              </div>
              <button type="submit" className={styles.submitButton}>
                Send Message
              </button>
            </form>
          </div>
        )}

        {activeTab === 'info' && (
          <div className={styles.infoContainer}>
            <h2>About Our E-Commerce Website</h2>
            <div className={styles.infoCard}>
              <h3>How to Shop</h3>
              <ol>
                <li>Browse products by category or search for specific items</li>
                <li>Add items to your cart</li>
                <li>Proceed to checkout when ready</li>
                <li>Enter shipping and payment information</li>
                <li>Review and place your order</li>
              </ol>
            </div>

            <div className={styles.infoCard}>
              <h3>Payment Options</h3>
              <ul>
                <li>Credit/Debit Cards</li>
                <li>Mobile Money</li>
                <li>Bank Transfer</li>
                <li>Cash on Delivery (Selected Areas)</li>
              </ul>
            </div>

            <div className={styles.infoCard}>
              <h3>Shipping Information</h3>
              <ul>
                <li>Standard Delivery: 3-5 business days</li>
                <li>Express Delivery: 1-2 business days</li>
                <li>Free shipping on orders over $50</li>
                <li>Track your order in real-time</li>
              </ul>
            </div>

            <div className={styles.infoCard}>
              <h3>Returns & Refunds</h3>
              <ul>
                <li>30-day return policy</li>
                <li>Items must be unused with original packaging</li>
                <li>Refunds processed within 5 business days</li>
                <li>Contact us for return authorization</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Support;
