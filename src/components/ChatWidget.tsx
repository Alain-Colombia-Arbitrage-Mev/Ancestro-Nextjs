'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { t } from '@/i18n/translations';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatWidget({ lang }: { lang: string }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (open && !hasGreeted) {
      setHasGreeted(true);
      setMessages([{ role: 'assistant', content: t(lang, 'chat.welcome') }]);
    }
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  const sendMessage = useCallback(async (text: string, currentMessages?: Message[]) => {
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
        body: JSON.stringify({ messages: msgs, lang }),
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
  }, [messages, loading, lang]);

  // Listen for open-chat events from AskBox
  useEffect(() => {
    function handleOpenChat(e: Event) {
      const question = (e as CustomEvent).detail?.question;
      setOpen(true);
      if (question) {
        setTimeout(() => {
          const welcome: Message = { role: 'assistant', content: t(lang, 'chat.welcome') };
          if (!hasGreeted) {
            setHasGreeted(true);
            setMessages([welcome]);
            setTimeout(() => sendMessage(question, [welcome]), 300);
          } else {
            sendMessage(question);
          }
        }, 350);
      }
    }
    window.addEventListener('open-chat', handleOpenChat);
    return () => window.removeEventListener('open-chat', handleOpenChat);
  }, [hasGreeted, sendMessage, lang]);

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
  ];

  return (
    <>
      {/* Floating button */}
      <button
        className={`chat-fab ${open ? 'chat-fab-hidden' : ''}`}
        onClick={() => setOpen(true)}
        aria-label={t(lang, 'ask.label')}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M21 11.5C21.0034 12.8199 20.6951 14.1219 20.1 15.3C19.3944 16.7118 18.3098 17.8992 16.9674 18.7293C15.6251 19.5594 14.0782 19.9994 12.5 20C11.1801 20.0035 9.87812 19.6951 8.7 19.1L3 21L4.9 15.3C4.30493 14.1219 3.99656 12.8199 4 11.5C4.00061 9.92179 4.44061 8.37488 5.27072 7.03258C6.10083 5.69028 7.28825 4.6056 8.7 3.90003C9.87812 3.30496 11.1801 2.99659 12.5 3.00003H13C15.0843 3.11502 17.053 3.99479 18.5291 5.47089C20.0052 6.94699 20.885 8.91568 21 11V11.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Backdrop */}
      {open && <div className="chat-backdrop" onClick={() => setOpen(false)} />}

      {/* Panel */}
      <div className={`chat-widget ${open ? 'chat-widget-open' : ''}`}>
        {/* Header */}
        <div className="cw-header">
          <div className="cw-header-left">
            <div className="cw-avatar">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M21 11.5C21.0034 12.8199 20.6951 14.1219 20.1 15.3C19.3944 16.7118 18.3098 17.8992 16.9674 18.7293C15.6251 19.5594 14.0782 19.9994 12.5 20C11.1801 20.0035 9.87812 19.6951 8.7 19.1L3 21L4.9 15.3C4.30493 14.1219 3.99656 12.8199 4 11.5C4.00061 9.92179 4.44061 8.37488 5.27072 7.03258C6.10083 5.69028 7.28825 4.6056 8.7 3.90003C9.87812 3.30496 11.1801 2.99659 12.5 3.00003H13C15.0843 3.11502 17.053 3.99479 18.5291 5.47089C20.0052 6.94699 20.885 8.91568 21 11V11.5Z" stroke="#f8b03b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="cw-header-info">
              <span className="cw-header-title">{t(lang, 'chat.title')}</span>
              <span className="cw-header-status">Online</span>
            </div>
          </div>
          <button className="cw-close" onClick={() => setOpen(false)} aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="cw-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`cw-msg ${msg.role}`}>
              {msg.role === 'assistant' && (
                <div className="cw-msg-avatar">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M21 11.5C21 12.82 20.7 14.12 20.1 15.3C19.39 16.71 18.31 17.9 16.97 18.73C15.63 19.56 14.08 20 12.5 20C11.18 20 9.88 19.7 8.7 19.1L3 21L4.9 15.3C4.3 14.12 4 12.82 4 11.5C4 9.92 4.44 8.37 5.27 7.03C6.1 5.69 7.29 4.61 8.7 3.9C9.88 3.3 11.18 3 12.5 3H13C15.08 3.12 17.05 3.99 18.53 5.47C20.01 6.95 20.89 8.92 21 11V11.5Z" stroke="#f8b03b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
              <div className="cw-bubble">
                {msg.content.split('\n').map((line, j) => (
                  <p key={j}>{line}</p>
                ))}
              </div>
            </div>
          ))}
          {loading && (
            <div className="cw-msg assistant">
              <div className="cw-msg-avatar">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M21 11.5C21 12.82 20.7 14.12 20.1 15.3C19.39 16.71 18.31 17.9 16.97 18.73C15.63 19.56 14.08 20 12.5 20C11.18 20 9.88 19.7 8.7 19.1L3 21L4.9 15.3C4.3 14.12 4 12.82 4 11.5C4 9.92 4.44 8.37 5.27 7.03C6.1 5.69 7.29 4.61 8.7 3.9C9.88 3.3 11.18 3 12.5 3H13C15.08 3.12 17.05 3.99 18.53 5.47C20.01 6.95 20.89 8.92 21 11V11.5Z" stroke="#f8b03b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="cw-bubble cw-loading">
                <div className="cw-dots"><span/><span/><span/></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions */}
        {messages.length <= 1 && !loading && (
          <div className="cw-suggestions">
            {suggestions.map((q, i) => (
              <button key={i} className="cw-chip" onClick={() => sendMessage(q)}>
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <form className="cw-input-area" onSubmit={handleSubmit}>
          <textarea
            ref={inputRef}
            className="cw-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t(lang, 'chat.placeholder')}
            rows={1}
            disabled={loading}
          />
          <button type="submit" className="cw-send" disabled={loading || !input.trim()}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </form>
      </div>

      <style>{`
        .chat-fab{position:fixed;bottom:24px;right:24px;z-index:9998;width:56px;height:56px;border-radius:50%;background:#f8b03b;color:#000;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 20px rgba(248,176,59,0.4),0 2px 8px rgba(0,0,0,0.3);transition:all 0.3s cubic-bezier(0.34,1.56,0.64,1);animation:fabPulse 3s ease-in-out infinite}
        .chat-fab:hover{transform:scale(1.1);box-shadow:0 6px 28px rgba(248,176,59,0.5),0 4px 12px rgba(0,0,0,0.3)}
        .chat-fab-hidden{opacity:0;transform:scale(0.5);pointer-events:none}
        @keyframes fabPulse{0%,100%{box-shadow:0 4px 20px rgba(248,176,59,0.4),0 2px 8px rgba(0,0,0,0.3)}50%{box-shadow:0 4px 30px rgba(248,176,59,0.6),0 2px 8px rgba(0,0,0,0.3)}}

        .chat-backdrop{position:fixed;inset:0;z-index:9998;background:rgba(0,0,0,0.4);backdrop-filter:blur(2px);-webkit-backdrop-filter:blur(2px);animation:fadeIn 0.2s ease}

        .chat-widget{position:fixed;top:0;right:-420px;z-index:9999;width:400px;height:100dvh;display:flex;flex-direction:column;background:rgba(14,14,14,0.97);border-left:1px solid rgba(255,255,255,0.1);box-shadow:-8px 0 40px rgba(0,0,0,0.5);transition:right 0.35s cubic-bezier(0.16,1,0.3,1)}
        .chat-widget-open{right:0}

        .cw-header{display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid rgba(255,255,255,0.08);background:rgba(0,0,0,0.4);flex-shrink:0}
        .cw-header-left{display:flex;align-items:center;gap:12px}
        .cw-avatar{width:36px;height:36px;border-radius:10px;background:rgba(248,176,59,0.15);display:flex;align-items:center;justify-content:center;flex-shrink:0}
        .cw-header-info{display:flex;flex-direction:column;gap:2px}
        .cw-header-title{font-size:15px;font-weight:600;color:#fff}
        .cw-header-status{font-size:11px;color:#4ade80;font-weight:500;display:flex;align-items:center;gap:4px}
        .cw-header-status::before{content:'';width:6px;height:6px;border-radius:50%;background:#4ade80;display:inline-block}
        .cw-close{background:none;border:none;color:rgba(255,255,255,0.5);cursor:pointer;padding:6px;border-radius:8px;display:flex;align-items:center;justify-content:center;transition:all 0.2s ease}
        .cw-close:hover{color:#fff;background:rgba(255,255,255,0.1)}

        .cw-messages{flex:1;overflow-y:auto;padding:20px;display:flex;flex-direction:column;gap:12px;scroll-behavior:smooth}
        .cw-messages::-webkit-scrollbar{width:4px}
        .cw-messages::-webkit-scrollbar-track{background:transparent}
        .cw-messages::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1);border-radius:2px}
        .cw-msg{display:flex;gap:8px;max-width:100%}
        .cw-msg.user{justify-content:flex-end}
        .cw-msg.assistant{justify-content:flex-start;align-items:flex-start}
        .cw-msg-avatar{width:28px;height:28px;border-radius:8px;background:rgba(248,176,59,0.1);display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:2px}
        .cw-bubble{max-width:82%;padding:12px 16px;border-radius:14px;font-size:14px;line-height:1.55;color:rgba(255,255,255,0.92);animation:msgIn 0.25s ease-out}
        .cw-bubble p{margin:0 0 6px}
        .cw-bubble p:last-child{margin:0}
        .cw-msg.user .cw-bubble{background:rgba(248,176,59,0.18);border:1px solid rgba(248,176,59,0.25);border-bottom-right-radius:4px;color:#fff}
        .cw-msg.assistant .cw-bubble{background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.08);border-bottom-left-radius:4px}
        @keyframes msgIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}

        .cw-loading{padding:14px 20px}
        .cw-dots{display:flex;gap:5px}
        .cw-dots span{width:7px;height:7px;border-radius:50%;background:rgba(248,176,59,0.6);animation:dotBounce 1.4s ease-in-out infinite}
        .cw-dots span:nth-child(2){animation-delay:0.16s}
        .cw-dots span:nth-child(3){animation-delay:0.32s}
        @keyframes dotBounce{0%,80%,100%{transform:translateY(0);opacity:0.4}40%{transform:translateY(-6px);opacity:1}}

        .cw-suggestions{display:flex;flex-wrap:wrap;gap:6px;padding:0 20px 12px;flex-shrink:0}
        .cw-chip{padding:8px 14px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.12);border-radius:18px;color:rgba(255,255,255,0.7);font-size:12px;cursor:pointer;transition:all 0.2s ease;font-family:inherit;text-align:left;line-height:1.3}
        .cw-chip:hover{background:rgba(248,176,59,0.12);border-color:rgba(248,176,59,0.25);color:#f8b03b}

        .cw-input-area{display:flex;align-items:flex-end;gap:10px;padding:14px 20px;border-top:1px solid rgba(255,255,255,0.08);background:rgba(0,0,0,0.3);flex-shrink:0}
        .cw-input{flex:1;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);border-radius:12px;padding:11px 14px;color:#fff;font-size:14px;font-family:inherit;resize:none;outline:none;transition:border-color 0.2s ease;min-height:42px;max-height:100px}
        .cw-input:focus{border-color:rgba(248,176,59,0.35)}
        .cw-input::placeholder{color:rgba(255,255,255,0.3)}
        .cw-input:disabled{opacity:0.5}
        .cw-send{width:42px;height:42px;display:flex;align-items:center;justify-content:center;background:#f8b03b;border:none;border-radius:10px;color:#000;cursor:pointer;transition:all 0.2s ease;flex-shrink:0}
        .cw-send:hover:not(:disabled){background:#ffbe4d;transform:translateY(-1px)}
        .cw-send:disabled{opacity:0.35;cursor:not-allowed}

        @keyframes fadeIn{from{opacity:0}to{opacity:1}}

        @media(max-width:480px){
          .chat-widget{width:100%;right:-100%}
          .chat-fab{bottom:16px;right:16px;width:50px;height:50px}
          .cw-bubble{max-width:88%;font-size:13px}
        }
      `}</style>
    </>
  );
}
