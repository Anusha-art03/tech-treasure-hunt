import { useState } from "react";
import {
  CheckCircle2,
  Lock,
  QrCode,
  Send,
  Skull,
  Timer,
  XCircle,
} from "lucide-react";

type RoundThreeProps = {
  crewName: string;
  elapsedTime: number;
  onBack: () => void;
  onComplete: () => void;
  onStopTimer: () => void;
};

type Fragment = {
  id: string;
  code: string;
  real: boolean;
};

const fragments: Fragment[] = [
  { id: "01", code: "GL-01-A7", real: true },
  { id: "02", code: "GL-02-B4", real: true },
  { id: "03", code: "GL-03-C9", real: true },
  { id: "04", code: "GL-04-D2", real: true },
  { id: "05", code: "GL-05-E8", real: true },
  { id: "06", code: "GL-06-F3", real: true },
  { id: "07", code: "GL-07-G6", real: true },
  { id: "08", code: "GL-08-H1", real: true },
  { id: "09", code: "GL-09-J5", real: true },

  // Fake fragments
  { id: "X1", code: "GL-X1-Z9", real: false },
  { id: "Q4", code: "GL-Q4-P2", real: false },
  { id: "M8", code: "GL-M8-K3", real: false },
  { id: "R7", code: "GL-R7-T1", real: false },
];

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(
    2,
    "0"
  )}`;
}

export default function RoundThree({
  crewName,
  elapsedTime,
  onBack,
  onComplete,
  onStopTimer,
}: RoundThreeProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [assembled, setAssembled] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState("");

  const toggleFragment = (id: string) => {
    if (assembled) return;

    setFeedback("");

    setSelected((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }

      if (prev.length >= 9) {
        return prev;
      }

      return [...prev, id];
    });
  };

  const assembleTreasure = () => {
    if (selected.length !== 9) {
      setFeedback("You must select exactly 9 fragments.");
      return;
    }

    const selectedFragments = fragments.filter((fragment) =>
      selected.includes(fragment.id)
    );

    const allReal = selectedFragments.every((fragment) => fragment.real);

    if (!allReal) {
      setFeedback(
        "⚠️ Something is wrong. One or more selected fragments are decoys."
      );
      return;
    }

    setAssembled(true);
    setFeedback("☠ The nine fragments have been assembled!");
  };

  const revealQuestion = () => {
    setScanned(true);
    setFeedback("");
  };

  const submitAnswer = () => {
    const normalized = answer.trim().toLowerCase();

    if (!normalized) {
      setFeedback("Enter your answer before submitting.");
      return;
    }

    /*
      Change this answer later to whatever final question
      you decide to use.
    */
    const correctAnswers = ["javascript", "js"];

    if (!correctAnswers.includes(normalized)) {
      setFeedback("❌ Incorrect answer. The treasure remains hidden.");
      return;
    }

    onStopTimer();
    setSubmitted(true);
    setFeedback("☠ TREASURE CLAIMED!");
  };

  if (submitted) {
    return (
      <main className="round-three-page">
        <div className="final-win-card">
          <div className="final-skull">
            <Skull size={52} />
          </div>

          <p className="eyebrow">THE GRAND LINE HAS BEEN CONQUERED</p>

          <h1>TREASURE CLAIMED</h1>

          <p className="win-message">
            Congratulations, <strong>{crewName}</strong>.
            <br />
            You found the One Piece.
          </p>

          <div className="final-time">
            <Timer size={22} />
            <span>FINAL TIME</span>
            <strong>{formatTime(elapsedTime)}</strong>
          </div>

          <div className="win-divider">☠ ✦ ☠</div>

          <p className="win-quote">
            The treasure was never just the destination.
            <br />
            It was the journey across the Grand Line.
          </p>

          <button className="primary-game-button" onClick={onComplete}>
            FINISH VOYAGE
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="round-three-page">
      <header className="game-header">
        <div>
          <p className="eyebrow">ROUND 03</p>
          <h1>FIND THE ONE PIECE</h1>
          <p className="crew-label">
            ☠ Crew: <strong>{crewName}</strong>
          </p>
        </div>

        <div className="timer-box">
          <Timer size={18} />
          <span>{formatTime(elapsedTime)}</span>
        </div>
      </header>

      <section className="final-intro">
        <div className="final-icon">
          <Skull size={32} />
        </div>

        <p className="eyebrow">THE FINAL VOYAGE</p>

        <h2>
          Nine fragments.
          <br />
          One treasure.
        </h2>

        <p>
          Among the fragments you collected, some are decoys.
          Find the <strong>9 genuine pieces</strong>, assemble them,
          and reveal the final question.
        </p>
      </section>

      {!assembled && (
        <section className="fragment-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">TREASURE FRAGMENTS</p>
              <h2>Select the genuine pieces</h2>
            </div>

            <div className="fragment-counter">
              {selected.length}/9
            </div>
          </div>

          <div className="fragment-grid">
            {fragments.map((fragment) => {
              const isSelected = selected.includes(fragment.id);

              return (
                <button
                  key={fragment.id}
                  className={`fragment-card ${
                    isSelected ? "selected" : ""
                  }`}
                  onClick={() => toggleFragment(fragment.id)}
                >
                  <div className="fragment-number">
                    {isSelected ? (
                      <CheckCircle2 size={20} />
                    ) : (
                      <QrCode size={20} />
                    )}
                  </div>

                  <span>FRAGMENT {fragment.id}</span>

                  <strong>{fragment.code}</strong>

                  <small>
                    {isSelected ? "SELECTED" : "EXAMINE"}
                  </small>
                </button>
              );
            })}
          </div>

          <button
            className="primary-game-button"
            onClick={assembleTreasure}
          >
            ASSEMBLE THE TREASURE
          </button>
        </section>
      )}

      {assembled && !scanned && (
        <section className="assembly-final-section">
          <div className="success-icon">
            <CheckCircle2 size={38} />
          </div>

          <p className="eyebrow">TREASURE ASSEMBLED</p>

          <h2>The One Piece is complete.</h2>

          <div className="qr-placeholder">
            <div className="qr-frame">
              <QrCode size={170} strokeWidth={1.3} />
            </div>

            <p>YOUR COMPLETED GRAND LINE QR</p>
          </div>

          <p className="scan-instruction">
            Scan the completed QR code to reveal the final question.
          </p>

          <button
            className="primary-game-button"
            onClick={revealQuestion}
          >
            <QrCode size={19} />
            SCAN COMPLETED QR
          </button>
        </section>
      )}

      {scanned && (
        <section className="final-question-section">
          <div className="question-icon">
            <Lock size={30} />
          </div>

          <p className="eyebrow">THE FINAL QUESTION</p>

          <h2>Which programming language is known for powering the web's interactivity?</h2>

          <p className="question-note">
            Enter the answer exactly as you believe it should be.
          </p>

          <div className="final-answer-area">
            <input
              type="text"
              value={answer}
              onChange={(event) => {
                setAnswer(event.target.value);
                setFeedback("");
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  submitAnswer();
                }
              }}
              placeholder="Enter your final answer..."
            />

            <button
              className="primary-game-button"
              onClick={submitAnswer}
            >
              <Send size={18} />
              SUBMIT ANSWER
            </button>
          </div>

          {feedback && (
            <div
              className={`final-feedback ${
                feedback.startsWith("❌") ? "error" : ""
              }`}
            >
              {feedback.startsWith("❌") ? (
                <XCircle size={20} />
              ) : (
                <CheckCircle2 size={20} />
              )}

              <span>{feedback}</span>
            </div>
          )}
        </section>
      )}

      {!assembled && feedback && (
        <div className="final-feedback error">
          <XCircle size={20} />
          <span>{feedback}</span>
        </div>
      )}

      <button className="back-button" onClick={onBack}>
        ← ABORT VOYAGE
      </button>
    </main>
  );
}