'use client';
import { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { t } from '@/i18n/translations';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

function ChatInner({ lang }: { lang: string }) {
  const searchParams = useSearchParams();
  const initialQuestion = searchParams.get('q') || '';
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasInit, setHasInit] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (hasInit) return;
    setHasInit(true);

    const welcome: Message = { role: 'assistant', content: t(lang, 'chat.welcome') };
    setMessages([welcome]);

    if (initialQuestion) {
      setTimeout(() => sendMessage(initialQuestion, [welcome]), 500);
    } else {
      inputRef.current?.focus();
    }
  }, []);

  async function sendMessage(text: string, currentMessages?: Message[]) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMsg: Message = { role: 'user', content: trimmed };
    const msgs = [...(currentMessages || messages), userMsg];
    setMessages(msgs);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: msgs.filter(m => m.role !== 'assistant' || msgs.indexOf(m) > 0), lang }),
      });

      if (!res.ok) throw new Error('API error');

      const data = await res.json();
      setMessages([...msgs, { role: 'assistant', content: data.message }]);
    } catch {
      setMessages([...msgs, { role: 'assistant', content: t(lang, 'chat.error') }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    sendMessage(input);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  const suggestions = [
    t(lang, 'ask.q1'),
    t(lang, 'ask.q2'),
    t(lang, 'ask.q3'),
    t(lang, 'ask.q4'),
    t(lang, 'ask.q5'),
  ];

  return (
    <>
      <section className="chat-section">
        <div className="chat-container">
          <div className="chat-header">
            <div className="chat-header-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M21 11.5C21.0034 12.8199 20.6951 14.1219 20.1 15.3C19.3944 16.7118 18.3098 17.8992 16.9674 18.7293C15.6251 19.5594 14.0782 19.9994 12.5 20C11.1801 20.0035 9.87812 19.6951 8.7 19.1L3 21L4.9 15.3C4.30493 14.1219 3.99656 12.8199 4 11.5C4.00061 9.92179 4.44061 8.37488 5.27072 7.03258C6.10083 5.69028 7.28825 4.6056 8.7 3.90003C9.87812 3.30496 11.1801 2.99659 12.5 3.00003H13C15.0843 3.11502 17.053 3.99479 18.5291 5.47089C20.0052 6.94699 20.885 8.91568 21 11V11.5Z" stroke="#f8b03b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <h1 className="chat-title">{t(lang, 'chat.title')}</h1>
          </div>

          <div className="chat-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-msg ${msg.role}`}>
                <div className="msg-bubble">
                  {msg.content.split('\n').map((line, j) => (
                    <p key={j}>{line}</p>
                  ))}
                </div>
              </div>
            ))}
            {loading && (
              <div className="chat-msg assistant">
                <div className="msg-bubble loading-bubble">
                  <span className="dot-pulse"></span>
                  <span>{t(lang, 'chat.thinking')}</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {messages.length <= 1 && !loading && (
            <div className="suggestions">
              {suggestions.map((q, i) => (
                <button key={i} className="suggestion-chip" onClick={() => sendMessage(q)}>
                  {q}
                </button>
              ))}
            </div>
          )}

          <form className="chat-input-form" onSubmit={handleSubmit}>
            <textarea
              ref={inputRef}
              className="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t(lang, 'chat.placeholder')}
              rows={1}
              disabled={loading}
            />
            <button type="submit" className="chat-send-btn" disabled={loading || !input.trim()}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </form>
        </div>
      </section>

      <style>{`
        .chat-section{min-height:calc(100vh - 80px);padding:100px 20px 60px;display:flex;justify-content:center}
        .chat-container{width:100%;max-width:800px;display:flex;flex-direction:column;gap:0;background:rgba(20,20,20,0.6);border:1px solid rgba(255,255,255,0.1);border-radius:16px;overflow:hidden;height:calc(100vh - 180px);min-height:500px}
        .chat-header{display:flex;align-items:center;gap:12px;padding:20px 24px;border-bottom:1px solid rgba(255,255,255,0.1);background:rgba(0,0,0,0.4);flex-shrink:0}
        .chat-header-icon{display:flex;align-items:center;justify-content:center;width:40px;height:40px;background:rgba(248,176,59,0.15);border-radius:12px;flex-shrink:0}
        .chat-title{font-size:18px;font-weight:600;color:#fff;margin:0}
        .chat-messages{flex:1;overflow-y:auto;padding:24px;display:flex;flex-direction:column;gap:16px;scroll-behavior:smooth}
        .chat-messages::-webkit-scrollbar{width:6px}
        .chat-messages::-webkit-scrollbar-track{background:transparent}
        .chat-messages::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.15);border-radius:3px}
        .chat-msg{display:flex}
        .chat-msg.user{justify-content:flex-end}
        .chat-msg.assistant{justify-content:flex-start}
        .msg-bubble{max-width:80%;padding:14px 18px;border-radius:16px;font-size:15px;line-height:1.6;color:#fff}
        .msg-bubble p{margin:0 0 8px}
        .msg-bubble p:last-child{margin:0}
        .chat-msg.user .msg-bubble{background:rgba(248,176,59,0.2);border:1px solid rgba(248,176,59,0.3);border-bottom-right-radius:4px}
        .chat-msg.assistant .msg-bubble{background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.12);border-bottom-left-radius:4px}
        .loading-bubble{display:flex;align-items:center;gap:10px;color:rgba(255,255,255,0.5)}
        .dot-pulse{width:8px;height:8px;background:#f8b03b;border-radius:50%;animation:pulse 1.2s ease-in-out infinite}
        @keyframes pulse{0%,100%{opacity:0.3;transform:scale(0.8)}50%{opacity:1;transform:scale(1.2)}}
        .suggestions{display:flex;flex-wrap:wrap;gap:8px;padding:0 24px 16px;flex-shrink:0}
        .suggestion-chip{padding:10px 16px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.15);border-radius:20px;color:rgba(255,255,255,0.8);font-size:13px;cursor:pointer;transition:all 0.2s ease;font-family:inherit}
        .suggestion-chip:hover{background:rgba(248,176,59,0.15);border-color:rgba(248,176,59,0.3);color:#f8b03b}
        .chat-input-form{display:flex;align-items:flex-end;gap:12px;padding:16px 24px;border-top:1px solid rgba(255,255,255,0.1);background:rgba(0,0,0,0.3);flex-shrink:0}
        .chat-input{flex:1;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.15);border-radius:12px;padding:12px 16px;color:#fff;font-size:15px;font-family:inherit;resize:none;outline:none;transition:border-color 0.2s ease;min-height:44px;max-height:120px}
        .chat-input:focus{border-color:rgba(248,176,59,0.4)}
        .chat-input::placeholder{color:rgba(255,255,255,0.35)}
        .chat-input:disabled{opacity:0.5}
        .chat-send-btn{width:44px;height:44px;display:flex;align-items:center;justify-content:center;background:#f8b03b;border:none;border-radius:12px;color:#000;cursor:pointer;transition:all 0.2s ease;flex-shrink:0}
        .chat-send-btn:hover:not(:disabled){background:#ffbe4d;transform:translateY(-1px)}
        .chat-send-btn:disabled{opacity:0.4;cursor:not-allowed}
        @media(max-width:768px){.chat-section{padding:80px 12px 40px}.chat-container{height:calc(100vh - 140px);border-radius:12px}.chat-header{padding:16px}.chat-messages{padding:16px}.msg-bubble{max-width:90%;font-size:14px;padding:12px 14px}.suggestions{padding:0 16px 12px}.suggestion-chip{font-size:12px;padding:8px 12px}.chat-input-form{padding:12px 16px}}
      `}</style>
    </>
  );
}

export default function ChatPanel({ lang }: { lang: string }) {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh' }} />}>
      <ChatInner lang={lang} />
    </Suspense>
  );
}
