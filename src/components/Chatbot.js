import React, { useState, useRef, useEffect } from 'react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hello! I am Learnix Assistant. Ask me anything about courses, payment, enrollment, etc!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    
    const savedChat = localStorage.getItem('learnix_chat');
    if (savedChat) {
      try {
        setMessages(JSON.parse(savedChat));
      } catch (e) {
        console.log('No saved chat');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('learnix_chat', JSON.stringify(messages));
  }, [messages]);

  const getAnswer = (question) => {
    const q = question.toLowerCase();
    
    if (q.includes('course') || q.includes('what') || q.includes('available') || q.includes('list') || q.includes('offer')) {
      return 'We have courses in Programming, Design, Business, Marketing, Data Science, and more!\n\nCheck our Courses page for full list!';
    }
    
    if (q.includes('price') || q.includes('cost') || q.includes('fee') || q.includes('rupee') || q.includes('rupees') || q.includes('paisa')) {
      return 'Our course prices vary:\n\nPython - $49.99\nReact - $59.99\nGraphic Design - $39.99\nDigital Marketing - $44.99\nBusiness - $54.99\nData Science - $79.99\n\nAll prices in USD!';
    }
    
    if (q.includes('enroll') || q.includes('join') || q.includes('buy') || q.includes('purchase') || q.includes('kaise') || q.includes(' kese')) {
      return 'How to Enroll:\n\n1. Go to Courses\n2. Click any course\n3. Click Enroll Now\n4. Enter card details\n5. Pay & Start learning!';
    }
    
    if (q.includes('payment') || q.includes('pay') || q.includes('card') || q.includes('stripe') || q.includes('credit') || q.includes('debit')) {
      return 'Payment Methods:\n\nWe accept all cards:\n- Visa\n- Mastercard\n- American Express\n\nTEST CARD:\nNumber: 4242 4242 4242 4242\nExpiry: 12/28\nCVC: 123\n\n100% Secure!';
    }
    
    if (q.includes('video') || q.includes('lesson') || q.includes('content') || q.includes('learn') || q.includes('video lectures')) {
      return 'Yes! Every course has video lessons with definitions, examples, and code snippets.\n\nYou get lifetime access!';
    }
    
    if (q.includes('certificate') || q.includes('certification') || q.includes('completion') || q.includes('diploma')) {
      return 'Yes! Get Certificate!\n\n- Download as PDF\n- Add to LinkedIn\n- Share on resume\n\nComplete all lessons!';
    }
    
    if (q.includes('support') || q.includes('help') || q.includes('contact') || q.includes('email') || q.includes('phone')) {
      return 'Contact Support:\n\nEmail: m.adnan22708@gmail.com\nPhone: +92 300 1234567\n\nAvailable 24/7!';
    }
    
    if (q.includes('login') || q.includes('sign in') || q.includes('register') || q.includes('signup') || q.includes('account') || q.includes('password') || q.includes('forgot')) {
      return 'Account Help:\n\nRegister: Click Login > Register\nForgot Password: Use Forgot Password link';
    }
    
    if (q.includes('refund') || q.includes('money back') || q.includes('return')) {
      return 'Refund Policy:\n\n30-day money-back guarantee!\n\nNot satisfied? Contact us within 30 days for full refund!';
    }
    
    if (q.includes('lifetime') || q.includes('access') || q.includes('unlimited') || q.includes('forever')) {
      return 'Lifetime Access:\n\n- Unlimited access\n- Free updates\n- Learn on any device\n- Learn at your pace\n\nOne payment = Forever!';
    }
    
    if (q.includes('about') || q.includes('what is') || q.includes('learnix') || q.includes('who are')) {
      return 'About Learnix:\n\nOnline learning platform with:\n- Expert courses\n- Video lessons\n- Certificates\n- 24/7 support\n- Secure payment\n\nStart learning today!';
    }
    
    if (q.includes('hello') || q.includes('hi') || q.includes('hey') || q.includes('salam') || q.includes('asalam') || q.includes('namaste')) {
      return 'Hello! Welcome to Learnix! 🎓\n\nI can help with:\n- Course info\n- Enrollment\n- Payment\n- Account help\n\nWhat would you like to know?';
    }
    
    if (q.includes('thank') || q.includes('thx') || q.includes('thanks')) {
      return 'You are welcome! 😊\n\nAnything else I can help with?';
    }
    
    if (q.includes('bye') || q.includes('goodbye') || q.includes('see you') || q.includes('alvida')) {
      return 'Goodbye! 👋\n\nThank you for chatting! Hope to see you soon. Start learning today! 🎓';
    }
    
    return 'I want to help! Ask me about:\n\n- Courses & prices\n- How to enroll\n- Payment methods\n- Certificates\n- Support contact\n\nWhat would you like to know?';
  };

  const handleSend = () => {
    if (!input.trim() || loading) return;
    
    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setLoading(true);
    
    setTimeout(() => {
      const botResponse = getAnswer(userMessage);
      setMessages(prev => [...prev, { role: 'bot', text: botResponse }]);
      setLoading(false);
    }, 500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([{ role: 'bot', text: 'Hello! I am Learnix Assistant. Ask me anything about courses, payment, enrollment, etc!' }]);
    localStorage.removeItem('learnix_chat');
  };

  return (
    <div>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #22d3ee 0%, #06b6d4 100%)',
          border: 'none',
          boxShadow: '0 4px 20px rgba(34, 211, 238, 0.4)',
          cursor: 'pointer',
          zIndex: 9998,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        ) : (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
          </svg>
        )}
      </button>

      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '90px',
          right: '20px',
          width: '380px',
          height: '520px',
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)',
            padding: '16px',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderRadius: '16px 16px 0 0'
          }}>
            <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
              <div style={{width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #22d3ee 0%, #06b6d4 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="#0f172a">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
                </svg>
              </div>
              <div>
                <div style={{fontWeight: 'bold'}}>Learnix Assistant</div>
                <div style={{fontSize: 11, opacity: 0.8}}>Ask me anything!</div>
              </div>
            </div>
            <button onClick={clearChat} style={{background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', padding: '5px 10px', borderRadius: 4, cursor: 'pointer', fontSize: 12}}>Clear</button>
          </div>
          
          <div style={{flex: 1, overflow: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', background: '#f8fafc'}}>
            {messages.map((msg, i) => (
              <div key={i} style={{display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'}}>
                <div style={{maxWidth: '85%', padding: '12px 16px', borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px', background: msg.role === 'user' ? 'linear-gradient(135deg, #22d3ee 0%, #06b6d4 100%)' : 'white', color: msg.role === 'user' ? '#0f172a' : '#334155', fontSize: 14, whiteSpace: 'pre-wrap', lineHeight: 1.5, boxShadow: '0 2px 8px rgba(0,0,0,0.08)'}}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && <div style={{padding: '10px 14px', borderRadius: 16, background: '#f1f5f9', color: '#64748b', fontSize: 14}}>Typing...</div>}
            <div ref={messagesEndRef} />
          </div>

          <div style={{padding: '12px 16px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '8px', background: 'white'}}>
            <input 
              type="text" 
              value={input} 
              onChange={e => setInput(e.target.value)} 
              onKeyPress={handleKeyPress} 
              placeholder="Ask about courses..." 
              disabled={loading}
              style={{flex: 1, padding: '12px 16px', borderRadius: 24, border: '1px solid #e2e8f0', outline: 'none', fontSize: 14, background: '#f8fafc'}}
            />
            <button 
              onClick={handleSend} 
              disabled={!input.trim() || loading} 
              style={{width: 44, height: 44, borderRadius: '50%', border: 'none', background: input.trim() && !loading ? 'linear-gradient(135deg, #22d3ee 0%, #06b6d4 100%)' : '#cbd5e1', cursor: input.trim() && !loading ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center'}}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
