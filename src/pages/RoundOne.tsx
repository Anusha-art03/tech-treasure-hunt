import { useMemo, useState } from "react";
import type { ComponentType, KeyboardEvent } from "react";

import {
  
  SiDocker,
  SiFirebase,
  SiGithub,
  SiGit,
  SiJavascript,
  SiKubernetes,
  SiLinux,
  SiMongodb,
  SiMysql,
  SiNodedotjs,
  SiPython,
  SiReact,
  SiTypescript,
} from "react-icons/si";

type RoundOneProps = {
  crewName: string;
  elapsedTime: number;
  onComplete: () => void;
  onBack: () => void;
};

type Question = {
  name: string;
  aliases: string[];
  Icon: ComponentType<{ size?: number }>;
};

const logoPool: Question[] = [
  {
    name: "Docker",
    aliases: ["docker"],
    Icon: SiDocker,
  },
  {
    name: "Kubernetes",
    aliases: ["kubernetes", "k8s"],
    Icon: SiKubernetes,
  },
  {
    name: "GitHub",
    aliases: ["github", "git hub"],
    Icon: SiGithub,
  },
  {
    name: "React",
    aliases: ["react", "reactjs", "react.js"],
    Icon: SiReact,
  },
  {
    name: "Python",
    aliases: ["python"],
    Icon: SiPython,
  },
  
  {
    name: "JavaScript",
    aliases: ["javascript", "js"],
    Icon: SiJavascript,
  },
  {
    name: "MongoDB",
    aliases: ["mongodb", "mongo db", "mongo"],
    Icon: SiMongodb,
  },
  {
    name: "MySQL",
    aliases: ["mysql", "my sql"],
    Icon: SiMysql,
  },
  {
    name: "Firebase",
    aliases: ["firebase"],
    Icon: SiFirebase,
  },
  {
    name: "Node.js",
    aliases: ["node", "nodejs", "node.js"],
    Icon: SiNodedotjs,
  },
  {
    name: "Linux",
    aliases: ["linux"],
    Icon: SiLinux,
  },
  {
    name: "Git",
    aliases: ["git"],
    Icon: SiGit,
  },
  {
    name: "TypeScript",
    aliases: ["typescript", "ts"],
    Icon: SiTypescript,
  },
];

const hints: Record<string, [string, string]> = {
  Docker: [
    "This technology is widely used for containers.",
    "Its famous logo is a whale carrying containers.",
  ],

  Kubernetes: [
    "It is used to manage containerized applications.",
    "Its logo is a ship wheel.",
  ],

  GitHub: [
    "Developers use this platform to host and collaborate on code.",
    "Its famous logo resembles a cat.",
  ],

  React: [
    "It is a JavaScript library used to build user interfaces.",
    "Its logo looks like an atom.",
  ],

  Python: [
    "It is a programming language.",
    "Its logo contains two snakes.",
  ],

  AWS: [
    "It is a major cloud computing platform.",
    "Its name starts with Amazon.",
  ],

  JavaScript: [
    "It is one of the most popular languages used on the web.",
    "Its logo is a yellow square containing JS.",
  ],

  MongoDB: [
    "It is a NoSQL database.",
    "Its logo is a green leaf.",
  ],

  MySQL: [
    "It is a relational database.",
    "Its logo contains a dolphin.",
  ],

  Firebase: [
    "It is a Google-backed platform for app development.",
    "Its logo is an orange/yellow flame.",
  ],

  "Node.js": [
    "It allows JavaScript to run outside the browser.",
    "Its logo is a green hexagon.",
  ],

  Linux: [
    "It is an open-source operating system/kernel.",
    "Its mascot is a penguin named Tux.",
  ],

  Git: [
    "It is a distributed version control system.",
    "Its logo is an orange diamond-like shape.",
  ],

  TypeScript: [
    "It is a typed superset of JavaScript.",
    "Its logo is a blue square containing TS.",
  ],
};

function shuffle<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5);
}

function normalizeAnswer(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds
  ).padStart(2, "0")}`;
}

function RoundOne({
  crewName,
  elapsedTime,
  onComplete,
  onBack,
}: RoundOneProps) {
  /*
   * Select exactly 6 random logos when Round 1 starts.
   */
  const questions = useMemo(
    () => shuffle(logoPool).slice(0, 6),
    []
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [score, setScore] = useState(0);

  const [feedback, setFeedback] = useState<
    "correct" | "wrong" | null
  >(null);

  // TOTAL hints used in this round
  const [usedHints, setUsedHints] = useState(0);

  // Which hints have been revealed for current question
  const [revealedHints, setRevealedHints] = useState<number[]>([]);

  const currentQuestion = questions[currentIndex];
  const Logo = currentQuestion.Icon;

  const submitAnswer = () => {
    if (!answer.trim() || feedback === "correct") return;

    const normalized = normalizeAnswer(answer);

    const correct = currentQuestion.aliases.some(
      (alias) => normalizeAnswer(alias) === normalized
    );

    if (correct) {
      setScore((previous) => previous + 100);
      setFeedback("correct");
    } else {
      setFeedback("wrong");
    }
  };

  const useHint = () => {
    // Maximum 2 hints for the entire round
    if (usedHints >= 2 || feedback === "correct") {
      return;
    }

    const availableHintIndex = [0, 1].find(
      (index) => !revealedHints.includes(index)
    );

    if (availableHintIndex === undefined) return;

    setUsedHints((previous) => previous + 1);

    setRevealedHints((previous) => [
      ...previous,
      availableHintIndex,
    ]);
  };

  const nextQuestion = () => {
    if (currentIndex === questions.length - 1) {
      onComplete();
      return;
    }

    setCurrentIndex((previous) => previous + 1);

    setAnswer("");
    setFeedback(null);
    setRevealedHints([]);
  };

  const handleKeyDown = (
    event: KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      if (feedback === "correct") {
        nextQuestion();
      } else {
        submitAnswer();
      }
    }
  };

  return (
    <div className="app round-page">
      <header className="navbar">
        <div className="brand">
          <span className="brand-icon">☠</span>
          <span>GRAND LINE</span>
        </div>

        <div className="crew-display">
          CREW: <strong>{crewName}</strong>
        </div>

        <div className="global-timer">
          ⏱ {formatTime(elapsedTime)}
        </div>
      </header>

      <main className="round-container">

        <p className="eyebrow">
          ⚔ ROUND 01 — FASTEST FINGER ⚔
        </p>

        <h1 className="round-title">
          WANTED:
          <span>IDENTIFY THE TECH</span>
        </h1>

        <p className="round-subtitle">
          Six technologies. Two hints. One crew.
        </p>

        {/* STATS */}

        <div className="round-stats">

          <div>
            <small>BOUNTY</small>

            <strong>
              {String(score).padStart(3, "0")}
            </strong>
          </div>

          <div>
            <small>CHALLENGE</small>

            <strong>
              {String(currentIndex + 1).padStart(2, "0")} / 06
            </strong>
          </div>

          <div>
            <small>TIME</small>

            <strong>
              {formatTime(elapsedTime)}
            </strong>
          </div>

          <div>
            <small>HINTS</small>

            <strong>
              {2 - usedHints} / 2
            </strong>
          </div>

        </div>

        {/* WANTED CARD */}

        <div className="wanted-card">

          <div className="wanted-header">
            ☠ WANTED TECHNOLOGY ☠
          </div>

          <div className="logo-area">

            <div className="logo-circle">
              <Logo size={125} />
            </div>

            <p className="logo-question">
              WHICH TECHNOLOGY IS THIS?
            </p>

          </div>

          {/* ANSWER */}

          <div className="answer-area">

            <input
              type="text"
              value={answer}
              onChange={(event) => {
                setAnswer(event.target.value);

                if (feedback === "wrong") {
                  setFeedback(null);
                }
              }}
              onKeyDown={handleKeyDown}
              placeholder="IDENTIFY THIS TECHNOLOGY..."
              autoFocus
              disabled={feedback === "correct"}
            />

            {feedback === "correct" ? (
              <button
                className="submit-button next-button"
                onClick={nextQuestion}
              >
                NEXT →
              </button>
            ) : (
              <button
                className="submit-button"
                onClick={submitAnswer}
              >
                SUBMIT
              </button>
            )}

          </div>

          {/* FEEDBACK */}

          {feedback === "correct" && (
            <div className="answer-feedback correct">
              ✓ CORRECT! +100 BOUNTY
            </div>
          )}

          {feedback === "wrong" && (
            <div className="answer-feedback wrong">
              ✕ WRONG ANSWER — TRY AGAIN
            </div>
          )}

          {/* HINT SYSTEM */}

          <div className="hint-section">

            <div className="hint-title">
              💡 HINTS — {2 - usedHints} REMAINING
            </div>

            <div className="hint-buttons">

              <button
                className="hint-button"
                onClick={useHint}
                disabled={
                  usedHints >= 2 ||
                  revealedHints.includes(0) ||
                  feedback === "correct"
                }
              >
                HINT 1
                <span>−3 SEC</span>
              </button>

              <button
                className="hint-button"
                onClick={useHint}
                disabled={
                  usedHints >= 2 ||
                  revealedHints.includes(1) ||
                  feedback === "correct"
                }
              >
                HINT 2
                <span>−3 SEC</span>
              </button>

            </div>

            {revealedHints.map((hintIndex) => (
              <div
                className="hint-text"
                key={hintIndex}
              >
                💡 {hints[currentQuestion.name][hintIndex]}
              </div>
            ))}

          </div>

        </div>

        <button
          className="back-button round-back"
          onClick={onBack}
        >
          ← RETURN TO CREW
        </button>

      </main>
    </div>
  );
}

export default RoundOne;