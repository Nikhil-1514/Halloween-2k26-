import React, { useState } from 'react';
import { useSound } from '../../hooks/useSound';

const responses = [
  "The spirits say YES. 👻",
  "Absolutely not. 💀",
  "Something is watching you… 👁️",
  "Ask again... if you dare. 🔮",
  "The answer lies beyond the grave.",
  "The spirits are confused. Try later.",
  "YES… but at what cost? 🕯️",
  "The dead say NO. ⚰️",
  "Perhaps. The fog obscures the answer.",
  "The bones rattle: DEFINITELY. 🦴",
];

export default function Magic8Ball({ onDone }) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState(null);
  const [shaking, setShaking] = useState(false);
  const sound = useSound();

  const handleAsk = () => {
    if (shaking) return;
    setShaking(true);
    sound.creepy();
    setTimeout(() => {
      const resp = responses[Math.floor(Math.random() * responses.length)];
      setAnswer(resp);
      setShaking(false);
      sound.success();
    }, 1200);
  };

  return (
    <div className="mini-game" style={{ textAlign: 'center', padding: '2rem' }}>
      <h3 className="screen-title" style={{ fontSize: '1.4rem' }}>🔮 HAUNTED MAGIC 8-BALL</h3>
      <p className="screen-body">Ask a question, then shake the ball.</p>
      <input type="text" value={question} onChange={e => setQuestion(e.target.value)} placeholder="Type your question…"
        style={{ width: '80%', maxWidth: '300px', padding: '0.8rem 1rem', margin: '1rem auto', display: 'block', background: 'rgba(124,58,237,0.12)', border: '2px solid var(--clr-purple)', borderRadius: '8px', color: 'var(--clr-text)', fontFamily: 'var(--font-body)', fontSize: '1rem' }} />
      <button onClick={handleAsk} disabled={shaking}
        style={{ fontSize: '4rem', background: 'none', border: 'none', cursor: 'pointer', margin: '1rem 0', animation: shaking ? 'twitch 0.15s infinite' : 'none', filter: 'drop-shadow(0 0 12px rgba(124,58,237,0.6))' }}>
        🔮
      </button>
      {answer && (
        <div>
          <p className="screen-body glow-text" style={{ fontSize: '1.1rem', margin: '1rem 0' }}>{answer}</p>
          <button className="btn btn--primary" onClick={() => onDone(true)} style={{ marginTop: '1rem' }}>Continue</button>
        </div>
      )}
    </div>
  );
}
