import { Compass, Flag, MapPin, Skull, Sparkles } from "lucide-react";

type RoundTwoProps = {
  crewName: string;
  elapsedTime: number;
  onComplete: () => void;
  onBack: () => void;
  onGiveUp: () => void;
};

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds
  ).padStart(2, "0")}`;
}

function RoundTwo({
  crewName,
  elapsedTime,
  onComplete,
  onBack,
  onGiveUp,
}: RoundTwoProps) {
  const handleGiveUp = () => {
    const confirmed = window.confirm(
      "Are you sure you want to give up the Grand Line Treasure Hunt?"
    );

    if (confirmed) {
      onGiveUp();
    }
  };

  return (
    <main className="round-page">
      {/* TOP NAVIGATION */}
      <div className="round-topbar">
        <button className="back-button" onClick={onBack}>
          ← BACK TO HOME
        </button>

        <div className="round-brand">
          <span>TECHNITUDE</span>
          <span className="brand-divider">×</span>
          <span>GRAND LINE</span>
        </div>

        <div className="round-timer">
          <span className="timer-label">VOYAGE TIME</span>
          <strong>{formatTime(elapsedTime)}</strong>
        </div>
      </div>

      {/* ROUND HEADER */}
      <section className="round-header">
        <div className="round-eyebrow">
          <Compass size={16} />
          <span>ROUND 02</span>
          <span className="eyebrow-divider">•</span>
          <span>THE TREASURE HUNT</span>
        </div>

        <h1>
          FOLLOW THE
          <span> GRAND LINE</span>
        </h1>

        <p>
          The sea has scattered the pieces of the One Piece across the island.
          Solve the clue, find the location, and collect every fragment.
        </p>
      </section>

      {/* CREW + PROGRESS */}
      <section className="round-stats">
        <div className="stat-card">
          <span className="stat-label">CREW</span>
          <strong>{crewName}</strong>
        </div>

        <div className="stat-card">
          <span className="stat-label">TREASURE PIECES</span>
          <strong>09</strong>
        </div>

        <div className="stat-card">
          <span className="stat-label">CURRENT STAGE</span>
          <strong>01 / 09</strong>
        </div>

        <div className="stat-card">
          <span className="stat-label">TIME</span>
          <strong>{formatTime(elapsedTime)}</strong>
        </div>
      </section>

      {/* MAIN CLUE */}
      <section className="wanted-card treasure-clue-card">
        <div className="wanted-card-top">
          <div className="wanted-stamp">
            <Sparkles size={16} />
            <span>GRAND LINE INTEL</span>
          </div>

          <span className="clue-number">CLUE #01</span>
        </div>

        <div className="clue-icon">
          <MapPin size={34} />
        </div>

        <div className="clue-content">
          <span className="clue-kicker">YOUR JOURNEY BEGINS HERE</span>

          <h2>
            Where knowledge sleeps,
            <br />
            the first treasure waits.
          </h2>

          <p>
            I hold thousands of stories,
            <br />
            but I never speak.
            <br />
            Pages keep secrets within my walls.
            <br />
            Find me to begin your hunt.
          </p>
        </div>

        <div className="clue-footer">
          <div className="clue-warning">
            <Flag size={17} />
            <span>
              Solve the clue and travel to the location.
            </span>
          </div>

          <div className="clue-rule" />
          
          <p className="clue-instruction">
            At the location, your crew will discover the next physical clue
            and one QR fragment.
          </p>
        </div>
      </section>

      {/* TREASURE HUNT INSTRUCTIONS */}
      <section className="hunt-instructions">
        <div className="instruction-heading">
          <Skull size={19} />
          <span>RULES OF THE HUNT</span>
        </div>

        <div className="instruction-grid">
          <div className="instruction-item">
            <span className="instruction-number">01</span>
            <div>
              <strong>SOLVE</strong>
              <p>Decode the clue shown above.</p>
            </div>
          </div>

          <div className="instruction-item">
            <span className="instruction-number">02</span>
            <div>
              <strong>SEARCH</strong>
              <p>Go physically to the location.</p>
            </div>
          </div>

          <div className="instruction-item">
            <span className="instruction-number">03</span>
            <div>
              <strong>COLLECT</strong>
              <p>Find the QR fragment and next chit.</p>
            </div>
          </div>

          <div className="instruction-item">
            <span className="instruction-number">04</span>
            <div>
              <strong>REPEAT</strong>
              <p>Continue until all 9 pieces are found.</p>
            </div>
          </div>
        </div>
      </section>

      {/* IMPORTANT NOTE */}
      <div className="round-note">
        <Sparkles size={16} />
        <span>
          <strong>IMPORTANT:</strong> The remaining clues will be found
          physically. The website will not reveal them.
        </span>
      </div>

      {/* ACTIONS */}
      <div className="round-actions">
        <button
          className="give-up-button"
          type="button"
          onClick={handleGiveUp}
        >
          <Skull size={17} />
          GIVE UP
        </button>

        {/* Temporary development button.
            Remove this before sending the website to the event lead. */}
        <button
          className="primary-action-button"
          type="button"
          onClick={onComplete}
        >
          CONTINUE TO ROUND 03 →
        </button>
      </div>

      {/* FOOTER */}
      <footer className="round-footer">
        <span>TECHNITUDE</span>
        <span>•</span>
        <span>SHAIDS COMMITTEE</span>
        <span>•</span>
        <span>ONE PIECE</span>
      </footer>
    </main>
  );
}

export default RoundTwo;