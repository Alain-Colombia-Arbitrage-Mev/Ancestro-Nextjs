'use client';
import { useState, useEffect } from 'react';
import { t } from '@/i18n/translations';

interface AskBoxProps { lang: string; }

export default function AskBox({ lang }: AskBoxProps) {
  const questions = [
    t(lang, 'ask.q1'),
    t(lang, 'ask.q2'),
    t(lang, 'ask.q3'),
    t(lang, 'ask.q4'),
    t(lang, 'ask.q5'),
  ];
  const askLabel = t(lang, 'ask.label');
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % questions.length);
        setVisible(true);
      }, 800);
    }, 6000);
    return () => clearInterval(timer);
  }, [questions.length]);

  function handleClick() {
    window.dispatchEvent(new CustomEvent('open-chat', { detail: { question: questions[index] } }));
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleClick();
  }

  return (
    <>
      <div className="ask-box" onClick={handleClick} onKeyDown={handleKeyDown} role="button" tabIndex={0} aria-label={askLabel}>
        <div className="ask-box-inner">
          <div className="ask-row desktop-row">
            <div className="ask-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M21 11.5C21.0034 12.8199 20.6951 14.1219 20.1 15.3C19.3944 16.7118 18.3098 17.8992 16.9674 18.7293C15.6251 19.5594 14.0782 19.9994 12.5 20C11.1801 20.0035 9.87812 19.6951 8.7 19.1L3 21L4.9 15.3C4.30493 14.1219 3.99656 12.8199 4 11.5C4.00061 9.92179 4.44061 8.37488 5.27072 7.03258C6.10083 5.69028 7.28825 4.6056 8.7 3.90003C9.87812 3.30496 11.1801 2.99659 12.5 3.00003H13C15.0843 3.11502 17.053 3.99479 18.5291 5.47089C20.0052 6.94699 20.885 8.91568 21 11V11.5Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <span className="ask-label">{askLabel}</span>
            <span className={`question-display ${visible ? 'visible' : ''}`}>&quot;{questions[index]}&quot;</span>
            <div className="ask-icon-right">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="3" stroke="white" strokeWidth="2"/><path d="M8 12L12 8L16 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 8V16" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
            </div>
          </div>
          <div className="ask-row mobile-row">
            <div className="mobile-top">
              <div className="ask-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M21 11.5C21.0034 12.8199 20.6951 14.1219 20.1 15.3C19.3944 16.7118 18.3098 17.8992 16.9674 18.7293C15.6251 19.5594 14.0782 19.9994 12.5 20C11.1801 20.0035 9.87812 19.6951 8.7 19.1L3 21L4.9 15.3C4.30493 14.1219 3.99656 12.8199 4 11.5C4.00061 9.92179 4.44061 8.37488 5.27072 7.03258C6.10083 5.69028 7.28825 4.6056 8.7 3.90003C9.87812 3.30496 11.1801 2.99659 12.5 3.00003H13C15.0843 3.11502 17.053 3.99479 18.5291 5.47089C20.0052 6.94699 20.885 8.91568 21 11V11.5Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <span className="ask-label">{askLabel}</span>
              <div className="ask-icon-right">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="3" stroke="white" strokeWidth="2"/><path d="M8 12L12 8L16 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 8V16" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
              </div>
            </div>
            <div className="mobile-question-container">
              <span className={`question-display-mobile ${visible ? 'visible' : ''}`}>&quot;{questions[index]}&quot;</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .ask-box{position:absolute;bottom:0;left:0;right:0;z-index:100;cursor:pointer}
        .ask-box:hover .ask-box-inner{background-color:rgba(0,0,0,0.95);border-top-color:rgba(248,176,59,0.3)}
        .ask-box:focus-visible{outline:2px solid var(--color-primary);outline-offset:-2px;border-radius:0}
        .ask-box-inner{background-color:rgba(0,0,0,0.9);border-top:1px solid rgba(255,255,255,0.1);transition:all 0.3s ease}
        .ask-row{display:flex;align-items:center;justify-content:center;gap:10px;padding:12px 20px}
        .desktop-row{display:flex}
        .mobile-row{display:none}
        .ask-icon{display:flex;align-items:center;justify-content:center;opacity:0.7;flex-shrink:0}
        .ask-label{font-size:16px;font-weight:500;color:var(--color-white);white-space:nowrap;flex-shrink:0}
        .question-display{font-size:16px;font-weight:400;color:rgba(255,255,255,0.5);white-space:nowrap;display:inline-block;overflow:hidden;text-overflow:ellipsis;max-width:400px;transition:opacity 0.8s ease-out,transform 0.8s ease-out;opacity:0;transform:translateY(6px)}
        .question-display.visible{opacity:1;transform:translateY(0)}
        .ask-icon-right{display:flex;align-items:center;justify-content:center;opacity:0.5;flex-shrink:0}
        .mobile-top{display:flex;align-items:center;justify-content:center;gap:8px}
        .mobile-question-container{margin-top:8px;text-align:center;min-height:20px;overflow:hidden}
        .question-display-mobile{font-size:13px;font-weight:400;color:rgba(255,255,255,0.5);display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%;transition:opacity 0.8s ease-out,transform 0.8s ease-out;opacity:0;transform:translateY(6px)}
        .question-display-mobile.visible{opacity:1;transform:translateY(0)}
        @media(max-width:768px){.ask-row{padding:10px 16px}.ask-label{font-size:14px}.question-display{font-size:14px;max-width:280px}}
        @media(max-width:520px){.desktop-row{display:none}.mobile-row{display:flex;flex-direction:column;padding:12px 16px}.ask-label{font-size:14px}}
      `}</style>
    </>
  );
}
