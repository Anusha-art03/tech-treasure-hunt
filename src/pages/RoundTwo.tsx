import { useState } from "react";
import {
  MapPin,
  QrCode,
  Lightbulb,
  Code2,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Compass,
} from "lucide-react";

type RoundTwoProps = {
  crewName: string;
  elapsedTime: number;
  onComplete: () => void;
  onBack: () => void;
};

type Stage = "clue" | "piece" | "challenge";

type HuntStage = {
  clue: string;
  location: string;
  pieceCode: string;
  challenge: string;
  challengeAnswers: string[];
  nextClue: string;
};

const huntStages: HuntStage[] = [
  {
    clue: "Where knowledge sleeps and countless worlds wait silently on shelves.",
    location: "LIBRARY",
    pieceCode: "GL-01-A7",
    challenge: "What does HTML stand for?",
    challengeAnswers: ["html", "hypertext markup language"],
    nextClue:
      "Find the place where machines connect, screens glow, and code comes alive.",
  },

  {
    clue:
      "Find the place where machines connect, screens glow, and code comes alive.",
    location: "COMPUTER LAB",
    pieceCode: "GL-02-B4",
    challenge: "Which language is primarily used to style web pages?",
    challengeAnswers: ["css", "cascading style sheets"],
    nextClue:
      "Seek the place where many eyes face one stage and ideas are presented.",
  },

  {
    clue:
      "Seek the place where many eyes face one stage and ideas are presented.",
    location: "AUDITORIUM",
    pieceCode: "GL-03-C9",
    challenge: "What does CPU stand for?",
    challengeAnswers: ["cpu", "central processing unit"],
    nextClue:
      "Where students gather to learn, solve problems, and fill their notebooks.",
  },

  {
    clue:
      "Where students gather to learn, solve problems, and fill their notebooks.",
    location: "CLASSROOM",
    pieceCode: "GL-04-D2",
    challenge: "Which data structure follows FIFO?",
    challengeAnswers: ["queue"],
    nextClue:
      "Every voyage begins somewhere. Find the place through which most journeys begin.",
  },

  {
    clue:
      "Every voyage begins somewhere. Find the place through which most journeys begin.",
    location: "MAIN ENTRANCE",
    pieceCode: "GL-05-E8",
    challenge: "Which protocol is commonly used to transfer web pages?",
    challengeAnswers: ["http", "https"],
    nextClue:
      "Find the place where builders, makers, and technical ideas come together.",
  },

  {
    clue:
      "Find the place where builders, makers, and technical ideas come together.",
    location: "WORKSHOP",
    pieceCode: "GL-06-F3",
    challenge: "What does RAM stand for?",
    challengeAnswers: ["ram", "random access memory"],
    nextClue:
      "Seek the place where knowledge is shared, questions are asked, and voices fill the room.",
  },

  {
    clue:
      "Seek the place where knowledge is shared, questions are asked, and voices fill the room.",
    location: "SEMINAR HALL",
    pieceCode: "GL-07-G6",
    challenge: "Which symbol is used for a single-line comment in JavaScript?",
    challengeAnswers: ["//"],
    nextClue:
      "Find the place where people wait, move, and prepare before heading to their destination.",
  },

  {
    clue:
      "Find the place where people wait, move, and prepare before heading to their destination.",
    location: "CANTEEN / COMMON AREA",
    pieceCode: "GL-08-H1",
    challenge: "What is the output of: console.log(5 + '5')?",
    challengeAnswers: ["55", "'55'", '"55"'],
    nextClue:
      "The final fragment awaits where the crew gathers before the treasure hunt begins.",
  },

  {
    clue:
      "The final fragment awaits where the crew gathers before the treasure hunt begins.",
    location: "EVENT AREA",
    pieceCode: "GL-09-J5",
    challenge: "Which version-control system uses commands like commit and push?",
    challengeAnswers: ["git"],
    nextClue: "",
  },
];

const decoyPieces = [
  "GL-X1-Z9",
  "GL-Q4-P2",
  "GL-M8-K3",
  "GL-R7-T1",
];

function normalize(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function RoundTwo({
  crewName,
  elapsedTime,
  onComplete,
  onBack,
}: RoundTwoProps) {
  const [stageIndex, setStageIndex] = useState(0);
  const [stage, setStage] = useState<Stage>("clue");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [usedHints, setUsedHints] = useState(0);
  const [foundPieces, setFoundPieces] = useState<string[]>([]);
  const [showAssembly, setShowAssembly] = useState(false);

  const current = huntStages[stageIndex];

  const totalPieces = huntStages.length;

  const handleHint = () => {
    if (usedHints >= 2) return;

    setUsedHints((prev) => prev + 1);
    setFeedback(
      stage === "clue"
        ? "Hint: Think about the type of place described by the clue."
        : stage === "piece"
          ? "Hint: Check the QR fragment carefully. Real pieces follow the GL-XX-XX format."
          : "Hint: The answer is a common technical concept.",
    );
  };

  const checkClue = () => {
    if (normalize(answer) === normalize(current.location)) {
      setFeedback("");
      setAnswer("");
      setStage("piece");
    } else {
      setFeedback("Wrong location. Read the clue carefully and try again.");
    }
  };

  const checkPiece = () => {
    const entered = normalize(answer).toUpperCase();

    if (entered === current.pieceCode) {
      setFoundPieces((prev) => [...prev, current.pieceCode]);
      setFeedback("");
      setAnswer("");
      setStage("challenge");
    } else if (decoyPieces.includes(entered)) {
      setFeedback(
        "⚠️ DECOY FRAGMENT! This is not part of the Grand Line QR.",
      );
    } else {
      setFeedback("That fragment code is not correct. Check the QR piece again.");
    }
  };

  const checkChallenge = () => {
    const normalizedAnswer = normalize(answer);

    const correct = current.challengeAnswers.some(
      (item) => normalize(item) === normalizedAnswer,
    );

    if (!correct) {
      setFeedback("Incorrect technical answer. Try again.");
      return;
    }

    setFeedback("");

    if (stageIndex === huntStages.length - 1) {
      setShowAssembly(true);
      return;
    }

    setAnswer("");
    setStageIndex((prev) => prev + 1);
    setStage("clue");
  };

  const handleSubmit = () => {
    if (!answer.trim()) return;

    if (stage === "clue") {
      checkClue();
    } else if (stage === "piece") {
      checkPiece();
    } else {
      checkChallenge();
    }
  };

  if (showAssembly) {
    return (
      <div className="game-page round-two-page">
        <div className="game-header">
          <div>
            <div className="eyebrow">ROUND 02 COMPLETE</div>
            <h1>THE GRAND LINE</h1>
            <p>All fragments have been recovered.</p>
          </div>

          <div className="timer-box">
            <span>TIME</span>
            <strong>{elapsedTime}s</strong>
          </div>
        </div>

        <div className="assembly-card">
          <Compass size={42} />

          <div className="eyebrow">TREASURE FRAGMENTS</div>

          <h2>9 / 9 PIECES FOUND</h2>

          <p>
            Your crew has collected every genuine fragment of the Grand Line
            QR.
          </p>

          <div className="qr-grid">
            {huntStages.map((piece, index) => (
              <div className="qr-piece found" key={piece.pieceCode}>
                <QrCode size={28} />
                <span>{index + 1}</span>
              </div>
            ))}
          </div>

          <div className="assembly-message">
            <CheckCircle2 size={22} />
            <span>
              Assemble the 9 physical pieces to reveal the final QR code.
            </span>
          </div>

          <div className="final-instruction">
            <strong>FINAL STEP</strong>
            <p>
              Scan the completed QR code. It will reveal the final question.
              Enter the answer on the website to finish the hunt.
            </p>
          </div>

          <button className="primary-game-button" onClick={onComplete}>
            CONTINUE TO FINAL QUESTION
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="game-page round-two-page">
      <div className="game-header">
        <div>
          <div className="eyebrow">ROUND 02</div>
          <h1>GRAND LINE HUNT</h1>
          <p>
            Crew: <strong>{crewName}</strong>
          </p>
        </div>

        <div className="timer-box">
          <span>TIME</span>
          <strong>{elapsedTime}s</strong>
        </div>
      </div>

      <div className="hunt-status">
        <div>
          <span>FRAGMENTS</span>
          <strong>
            {foundPieces.length} / {totalPieces}
          </strong>
        </div>

        <div>
          <span>STAGE</span>
          <strong>
            {stageIndex + 1} / {totalPieces}
          </strong>
        </div>

        <div>
          <span>HINTS</span>
          <strong>{2 - usedHints} LEFT</strong>
        </div>
      </div>

      <div className="hunt-card">
        {stage === "clue" && (
          <>
            <div className="stage-icon">
              <MapPin size={32} />
            </div>

            <div className="eyebrow">CLUE #{stageIndex + 1}</div>

            <h2>FIND THE LOCATION</h2>

            <div className="clue-box">
              <span>☠</span>
              <p>{current.clue}</p>
            </div>

            <p className="instruction">
              Solve the clue. Your answer should identify the physical
              location where the QR fragment is hidden.
            </p>
          </>
        )}

        {stage === "piece" && (
          <>
            <div className="stage-icon">
              <QrCode size={32} />
            </div>

            <div className="eyebrow">LOCATION FOUND</div>

            <h2>GO TO: {current.location}</h2>

            <div className="location-warning">
              <MapPin size={24} />
              <div>
                <strong>PHYSICAL HUNT</strong>
                <p>
                  Go to this location and search for a QR fragment. There may
                  be fake fragments nearby.
                </p>
              </div>
            </div>

            <p className="instruction">
              Enter the code printed on the QR fragment you found.
            </p>
          </>
        )}

        {stage === "challenge" && (
          <>
            <div className="stage-icon">
              <Code2 size={32} />
            </div>

            <div className="eyebrow">TECHNICAL CHALLENGE</div>

            <h2>SOLVE TO CONTINUE</h2>

            <div className="challenge-box">
              <p>{current.challenge}</p>
            </div>

            <p className="instruction">
              Solve the challenge. The answer unlocks your next location clue.
            </p>
          </>
        )}

        <div className="answer-area">
          <input
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSubmit();
              }
            }}
            placeholder={
              stage === "clue"
                ? "Enter location..."
                : stage === "piece"
                  ? "Enter QR piece code..."
                  : "Enter your answer..."
            }
          />

          <button onClick={handleSubmit}>
            SUBMIT
            <ChevronRight size={18} />
          </button>
        </div>

        {feedback && (
          <div
            className={
              feedback.includes("DECOY")
                ? "feedback warning"
                : feedback.includes("Hint")
                  ? "feedback hint-feedback"
                  : "feedback error"
            }
          >
            {feedback.includes("DECOY") ? (
              <XCircle size={20} />
            ) : feedback.includes("Hint") ? (
              <Lightbulb size={20} />
            ) : (
              <XCircle size={20} />
            )}

            <span>{feedback}</span>
          </div>
        )}

        <div className="hint-area">
          <button
            className="hint-button"
            onClick={handleHint}
            disabled={usedHints >= 2}
          >
            <Lightbulb size={17} />

            {usedHints >= 2
              ? "NO HINTS LEFT"
              : `USE HINT (-3 SEC) • ${2 - usedHints} LEFT`}
          </button>
        </div>
      </div>

      <button className="back-button" onClick={onBack}>
        ← ABANDON VOYAGE
      </button>
    </div>
  );
}

export default RoundTwo;