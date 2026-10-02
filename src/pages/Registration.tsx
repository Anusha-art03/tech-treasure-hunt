import { FormEvent, useState } from "react";

type RegistrationProps = {
  onBack: () => void;
  onStart: (crewName: string) => void;
};

function Registration({ onBack, onStart }: RegistrationProps) {
  const [crewName, setCrewName] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = crewName.trim();

    if (!trimmedName) return;

    onStart(trimmedName);
  };

  return (
    <div className="app registration-page">
      <div className="ocean-glow" />

      <header className="navbar">
        <div className="brand">
          <span className="brand-icon">☠</span>
          <span>GRAND LINE</span>
        </div>

        <button className="back-button" onClick={onBack}>
          ← BACK
        </button>
      </header>

      <main className="registration-container">
        <p className="eyebrow">⚓ WELCOME ABOARD ⚓</p>

        <h1 className="registration-title">
          ASSEMBLE
          <span>YOUR CREW</span>
        </h1>

        <div className="divider">
          <span>☠</span>
        </div>

        <p className="registration-text">
          Every great voyage begins with a crew.
          <br />
          Enter your crew name to begin the hunt.
        </p>

        <form className="crew-form" onSubmit={handleSubmit}>
          <label htmlFor="crewName">CREW NAME</label>

          <input
            id="crewName"
            type="text"
            value={crewName}
            onChange={(event) => setCrewName(event.target.value)}
            placeholder="Enter your crew name..."
            maxLength={30}
            autoComplete="off"
          />

          <button className="sail-button" type="submit">
            <span>BEGIN VOYAGE</span>
            <span className="arrow">→</span>
          </button>
        </form>
      </main>
    </div>
  );
}

export default Registration;