import { useState } from "react";
import { halloweenConfig } from "../config/halloweenConfig";

export default function TreatScreen({ onReturn, onFinal }) {
  const [phase, setPhase] = useState("form"); // form | sealed
  const { hostName } = halloweenConfig;

  // Form state
  const [friendName, setFriendName] = useState("");
  const [chocolate, setChocolate] = useState("");
  const [quantity, setQuantity] = useState("");
  const [signature, setSignature] = useState("");
  const [agreed, setAgreed] = useState(false);

  const canSeal = friendName.trim() && chocolate.trim() && quantity.trim() && signature.trim() && agreed;

  const handleSeal = () => {
    if (!canSeal) return;
    setPhase("sealed");
  };

  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });

  return (
    <div className="treat-screen screen" role="main">
      {phase === "form" && (
        <div className="treat-screen__content fade-in-up" style={{ maxWidth: "480px", margin: "0 auto" }}>
          <p className="screen-tag">THE CHOCOLATE CONTRACT</p>
          <h2 className="screen-title" style={{ fontSize: "1.6rem" }}>
            🍫 CHOCOLATE PROMISE LETTER
          </h2>
          <p className="screen-body muted">You have entered the Treat Zone.</p>

          <div className="promise-form" style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1.5rem" }}>
            <label style={{ color: "var(--clr-orange-lt)", fontWeight: 600, fontSize: "0.9rem" }}>
              Your Name:
              <input type="text" value={friendName} onChange={e => setFriendName(e.target.value)} placeholder="Enter your name"
                style={inputStyle} />
            </label>

            <label style={{ color: "var(--clr-orange-lt)", fontWeight: 600, fontSize: "0.9rem" }}>
              I promise to give {hostName}:
              <input type="text" value={chocolate} onChange={e => setChocolate(e.target.value)} placeholder="e.g. Dairy Milk, KitKat, Ferrero Rocher…"
                style={inputStyle} />
            </label>

            <label style={{ color: "var(--clr-orange-lt)", fontWeight: 600, fontSize: "0.9rem" }}>
              Quantity:
              <input type="text" value={quantity} onChange={e => setQuantity(e.target.value)} placeholder="e.g. 5 bars, a whole box…"
                style={inputStyle} />
            </label>

            <label style={{ display: "flex", alignItems: "center", gap: "0.6rem", cursor: "pointer", color: "var(--clr-text)", fontSize: "0.9rem", marginTop: "0.5rem" }}>
              <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)}
                style={{ width: "18px", height: "18px", accentColor: "var(--clr-orange)" }} />
              I agree to fulfill this chocolate promise.
            </label>

            <div style={{ borderTop: "1px solid rgba(124,58,237,0.3)", paddingTop: "1rem", marginTop: "0.5rem" }}>
              <p style={{ color: "var(--clr-muted)", fontSize: "0.85rem", marginBottom: "0.5rem" }}>✍️ E-SIGNATURE — Type your name as your signature</p>
              <input type="text" value={signature} onChange={e => setSignature(e.target.value)} placeholder="Your signature"
                style={{ ...inputStyle, fontFamily: "'Cinzel', Georgia, serif", fontStyle: "italic", fontSize: "1.1rem" }} />
            </div>

            <button className="btn btn--primary" onClick={handleSeal} disabled={!canSeal}
              style={{ marginTop: "1rem", opacity: canSeal ? 1 : 0.4 }}>
              🍫 SEAL THE PROMISE
            </button>
          </div>
        </div>
      )}

      {phase === "sealed" && (
        <div className="treat-screen__content fade-in-up" style={{ maxWidth: "480px", margin: "0 auto" }}>
          {/* Wax seal effect */}
          <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            <div style={{ display: "inline-block", width: "80px", height: "80px", borderRadius: "50%", background: "radial-gradient(circle at 35% 35%, #c0392b, #7b241c)", boxShadow: "0 0 20px rgba(192,57,43,0.6), inset 0 0 15px rgba(0,0,0,0.4)", lineHeight: "80px", fontSize: "2rem", textAlign: "center" }}>
              🕯️
            </div>
          </div>

          <h2 className="screen-title glow-text" style={{ fontSize: "1.5rem" }}>🕯️ PROMISE SEALED 🕯️</h2>

          <div style={{
            background: "rgba(18,4,22,0.85)", border: "2px solid var(--clr-orange)", borderRadius: "16px",
            padding: "1.5rem", margin: "1.5rem 0", textAlign: "left",
            boxShadow: "0 0 30px rgba(255,107,0,0.15), inset 0 0 20px rgba(0,0,0,0.3)",
          }}>
            <div style={sealedRow}><span style={sealedLabel}>Promised by:</span> <span>{friendName}</span></div>
            <div style={sealedRow}><span style={sealedLabel}>Chocolate:</span> <span>{chocolate}</span></div>
            <div style={sealedRow}><span style={sealedLabel}>Quantity:</span> <span>{quantity}</span></div>
            <div style={{ ...sealedRow, fontFamily: "'Cinzel', Georgia, serif", fontStyle: "italic" }}>
              <span style={sealedLabel}>Signed:</span> <span>{signature}</span>
            </div>
            <div style={sealedRow}><span style={sealedLabel}>For:</span> <span className="highlight">{hostName}</span></div>
            <div style={sealedRow}><span style={sealedLabel}>Date:</span> <span>{today}</span></div>
            {/* Disclaimer */}
            <p style={{ color: "var(--clr-muted)", fontSize: "0.85rem", textAlign: "center", marginTop: "1rem" }}>
              ⚠️ This chocolate promise is purely for fun and not a legal contract.
            </p>
          </div>

          <div className="btn-group" style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <button className="btn btn--ghost" onClick={onReturn}>RETURN TO HOUSE</button>
            <button className="btn btn--primary" onClick={onFinal}>FINAL FAREWELL</button>
          </div>
        </div>
      )}
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "0.7rem 1rem",
  marginTop: "0.4rem",
  background: "rgba(124,58,237,0.1)",
  border: "2px solid rgba(124,58,237,0.35)",
  borderRadius: "8px",
  color: "var(--clr-text)",
  fontFamily: "var(--font-body)",
  fontSize: "1rem",
  display: "block",
};

const sealedRow = {
  padding: "0.5rem 0",
  borderBottom: "1px solid rgba(124,58,237,0.15)",
  display: "flex",
  justifyContent: "space-between",
  fontSize: "0.95rem",
};

const sealedLabel = {
  color: "var(--clr-orange-lt)",
  fontWeight: 600,
};
