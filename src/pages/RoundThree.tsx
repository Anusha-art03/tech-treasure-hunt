import { Flag, QrCode, Skull, Sparkles } from "lucide-react";

type RoundThreeProps = {
  crewName: string;
  elapsedTime: number;
  onBack: () => void;
  onComplete: () => void;
  onStopTimer: () => void;
};

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds
  ).padStart(2, "0")}`;
}

function RoundThree({
  crewName,
  elapsedTime,
  onBack,
  onComplete,
  onStopTimer,
}: RoundThreeProps) {
  const handleGiveUp = () => {
    const confirmed = window.confirm(
      "Are you sure you want to give up the Grand Line treasure?"
    );

    if (confirmed) {
      onStopTimer();
    }
  };

  return (
    <main className="round-page">
      {/* TOP BAR */}
      <div className="round-topbar">
        <button className="back-button" onClick={onBack}>
          ← BACK
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

      {/* HEADER */}
      <section className="round-header">
        <div className="round-eyebrow">
          <Sparkles size={16} />
          <span>ROUND 03</span>
          <span className="eyebrow-divider">•</span>
          <span>THE FINAL TREASURE</span>
        </div>

        <h1>
          ASSEMBLE THE
          <span> ONE PIECE</span>
        </h1>

        <p>
          Nine fragments. One final treasure. Arrange the pieces correctly and
          reveal what lies at the end of the Grand Line.
        </p>
      </section>

      {/* CREW STATS */}
      <section className="round-stats">
        <div className="stat-card">
          <span className="stat-label">CREW</span>
          <strong>{crewName}</strong>
        </div>

        <div className="stat-card">
          <span className="stat-label">QR PIECES</span>
          <strong>09 / 09</strong>
        </div>

        <div className="stat-card">
          <span className="stat-label">FINAL STAGE</span>
          <strong>03 / 03</strong>
        </div>

        <div className="stat-card">
          <span className="stat-label">TIME</span>
          <strong>{formatTime(elapsedTime)}</strong>
        </div>
      </section>

      {/* MAIN FINAL CARD */}
      <section className="wanted-card final-treasure-card">
        <div className="wanted-card-top">
          <div className="wanted-stamp">
            <QrCode size={16} />
            <span>FINAL TREASURE</span>
          </div>

          <span className="clue-number">09 FRAGMENTS</span>
        </div>

        {/* VISUAL REPRESENTATION ONLY */}
        <div className="qr-assembly-display">
          <div className="qr-fragment fragment-1" />
          <div className="qr-fragment fragment-2" />
          <div className="qr-fragment fragment-3" />
          <div className="qr-fragment fragment-4" />
          <div className="qr-fragment fragment-5" />
          <div className="qr-fragment fragment-6" />
          <div className="qr-fragment fragment-7" />
          <div className="qr-fragment fragment-8" />
          <div className="qr-fragment fragment-9" />
        </div>

        <div className="final-treasure-content">
          <span className="clue-kicker">THE FINAL PIECES ARE IN YOUR HANDS</span>

          <h2>Build. Scan. Conquer.</h2>

          <p>
            Take all <strong>9 QR fragments</strong> collected during the
            treasure hunt and physically arrange them in the correct order.
          </p>
        </div>

        {/* STEPS */}
        <div className="final-steps">
          <div className="final-step">
            <div className="step-icon">
              <span>01</span>
            </div>

            <div>
              <strong>ARRANGE</strong>
              <p>
                Place all 9 QR pieces together in the correct order.
              </p>
            </div>
          </div>

          <div className="final-step">
            <div className="step-icon">
              <span>02</span>
            </div>

            <div>
              <strong>CHECK</strong>
              <p>
                Make sure the complete QR pattern is properly aligned.
              </p>
            </div>
          </div>

          <div className="final-step">
            <div className="step-icon">
              <QrCode size={20} />
            </div>

            <div>
              <strong>SCAN</strong>
              <p>
                Use your own phone to scan the completed QR code.
              </p>
            </div>
          </div>

          <div className="final-step">
            <div className="step-icon">
              <Flag size={20} />
            </div>

            <div>
              <strong>ANSWER</strong>
              <p>
                The QR will open the final question. Submit your answer to
                claim the treasure.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* IMPORTANT NOTE */}
      <div className="round-note">
        <Sparkles size={16} />

        <span>
          <strong>IMPORTANT:</strong> The QR code is physical. This website
          does not assemble or validate the pieces for you.
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

        {/* TEMPORARY TEST BUTTON */}
        <button
          className="primary-action-button"
          type="button"
          onClick={onComplete}
        >
          OPEN FINAL QUESTION →
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

export default RoundThree;