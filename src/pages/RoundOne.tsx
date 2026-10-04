import { useEffect, useMemo, useState } from "react";
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
  onComplete: (penaltySeconds: number) => void;
  onBack: () => void;
  onGiveUp: () => void;
};

type Difficulty = "Easy" | "Medium" | "Hard";

type Question = {
  name: string;
  aliases: string[];
  Icon: ComponentType<{ size?: number }>;
  difficulty: Difficulty;
  hints: [string, string];
};

const logoPool: Question[] = [
  // EASY
  {
    name: "Docker",
    aliases: ["docker"],
    Icon: SiDocker,
    difficulty: "Easy",
    hints: [
      "This technology is widely used for containers.",
      "Its famous logo is a whale carrying containers.",
    ],
  },
  {
    name: "Python",
    aliases: ["python"],
    Icon: SiPython,
    difficulty: "Easy",
    hints: [
      "It is a popular programming language.",
      "Its logo contains two snakes.",
    ],
  },
  {
    name: "React",
    aliases: ["react", "reactjs", "react.js"],
    Icon: SiReact,
    difficulty: "Easy",
    hints: [
      "It is a JavaScript library used to build user interfaces.",
      "Its logo looks like an atom.",
    ],
  },
  {
    name: "GitHub",
    aliases: ["github", "git hub"],
    Icon: SiGithub,
    difficulty: "Easy",
    hints: [
      "Developers use this platform to host and collaborate on code.",
      "Its famous logo resembles a cat.",
    ],
  },
  {
    name: "JavaScript",
    aliases: ["javascript", "js"],
    Icon: SiJavascript,
    difficulty: "Easy",
    hints: [
      "It is widely used to make websites interactive.",
      "Its logo is a yellow square containing JS.",
    ],
  },
  {
    name: "Linux",
    aliases: ["linux"],
    Icon: SiLinux,
    difficulty: "Easy",
    hints: [
      "It is an open-source operating system/kernel.",
      "Its mascot is a penguin named Tux.",
    ],
  },

  // MEDIUM
  {
    name: "Kubernetes",
    aliases: ["kubernetes", "k8s"],
    Icon: SiKubernetes,
    difficulty: "Medium",
    hints: [
      "It is used to manage containerized applications.",
      "Its logo resembles a ship wheel.",
    ],
  },
  {
    name: "MongoDB",
    aliases: ["mongodb", "mongo db", "mongo"],
    Icon: SiMongodb,
    difficulty: "Medium",
    hints: [
      "It is a NoSQL database.",
      "Its logo is a green leaf.",
    ],
  },
  {
    name: "MySQL",
    aliases: ["mysql", "my sql"],
    Icon: SiMysql,
    difficulty: "Medium",
    hints: [
      "It is a relational database.",
      "Its logo contains a dolphin.",
    ],
  },
  {
    name: "Firebase",
    aliases: ["firebase"],
    Icon: SiFirebase,
    difficulty: "Medium",
    hints: [
      "It is a Google-backed platform for app development.",
      "Its logo is an orange/yellow flame.",
    ],
  },
  {
    name: "Node.js",
    aliases: ["node", "nodejs", "node.js"],
    Icon: SiNodedotjs,
    difficulty: "Medium",
    hints: [
      "It allows JavaScript to run outside the browser.",
      "Its logo is a green hexagon.",
    ],
  },
  {
    name: "Git",
    aliases: ["git"],
    Icon: SiGit,
    difficulty: "Medium",
    hints: [
      "It is a distributed version control system.",
      "Its logo is an orange diamond-like shape.",
    ],
  },

  // HARD
  {
    name: "TypeScript",
    aliases: ["typescript", "ts"],
    Icon: SiTypescript,
    difficulty: "Hard",
    hints: [
      "It is a typed superset of JavaScript.",
      "Its logo is a blue square containing TS.",
    ],
  },
  {
    name: "Kubernetes",
    aliases: ["kubernetes", "k8s"],
    Icon: SiKubernetes,
    difficulty: "Hard",
    hints: [
      "Its name is derived from a Greek word related to steering.",
      "It orchestrates containers at scale.",
    ],
  },
  {
    name: "MongoDB",
    aliases: ["mongodb", "mongo db", "mongo"],
    Icon: SiMongodb,
    difficulty: "Hard",
    hints: [
      "It stores data in document-oriented form.",
      "Its name contains the word 'Mongo'.",
    ],
  },
  {
    name: "Firebase",
    aliases: ["firebase"],
    Icon: SiFirebase,
    difficulty: "Hard",
    hints: [
      "It provides backend services for applications.",
      "Google acquired it in 2014.",
    ],
  },
  {
    name: "Git",
    aliases: ["git"],
    Icon: SiGit,
    difficulty: "Hard",
    hints: [
      "It tracks changes in source code.",
      "It was created by Linus Torvalds.",
    ],
  },
  {
    name: "Node.js",
    aliases: ["node", "nodejs", "node.js"],
    Icon: SiNodedotjs,
    difficulty: "Hard",
    hints: [
      "It is based on Google's V8 JavaScript engine.",
      "It is commonly used for backend JavaScript.",
    ],
  },
];

function shuffle<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

function normalizeAnswer(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function formatTime(seconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(seconds));

  const minutes = Math.floor(safeSeconds / 60);
  const remainingSeconds = safeSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds
  ).padStart(2, "0")}`;
}

const ROUND_TIME_LIMIT = 10 * 60;

function RoundOne({
  crewName,
  elapsedTime,
  onComplete,
  onBack,
  onGiveUp,
}: RoundOneProps) {
  /*
   * Every team gets:
   * 3 Easy + 4 Medium + 3 Hard = 10 logos.
   * The final order is randomized.
   */
  const questions = useMemo(() => {
    const easy = shuffle(
      logoPool.filter((question) => question.difficulty === "Easy")
    ).slice(0, 3);

    const medium = shuffle(
      logoPool.filter((question) => question.difficulty === "Medium")
    ).slice(0, 4);

    const hard = shuffle(
      logoPool.filter((question) => question.difficulty === "Hard")
    ).slice(0, 3);

    return shuffle([...easy, ...medium, ...hard]);
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);

  const [answer, setAnswer] = useState("");

  /*
   * 0 = no wrong answer yet
   * 1 = first wrong answer already happened
   */
  const [wrongAttempts, setWrongAttempts] = useState(0);

  const [penaltySeconds, setPenaltySeconds] = useState(0);

  const [skipsUsed, setSkipsUsed] = useState(0);

  /*
   * Two hints TOTAL for the entire round.
   */
  const [hintsUsed, setHintsUsed] = useState(0);

  const [revealedHints, setRevealedHints] = useState<number[]>([]);

  const [feedback, setFeedback] = useState<
    "correct" | "wrong" | "skipped" | null
  >(null);

  const [roundFinished, setRoundFinished] = useState(false);

  const currentQuestion = questions[currentIndex];
  const Logo = currentQuestion.Icon;

  /*
   * The actual timer remains the actual elapsed time.
   * Penalties are tracked separately.
   */
  useEffect(() => {
    if (roundFinished) return;

    if (elapsedTime >= ROUND_TIME_LIMIT) {
      setRoundFinished(true);
      onComplete(penaltySeconds);
    }
  }, [
    elapsedTime,
    roundFinished,
    penaltySeconds,
    onComplete,
  ]);

  const finishOrNext = (additionalPenalty: number) => {
    const totalPenalty = penaltySeconds + additionalPenalty;

    if (additionalPenalty > 0) {
      setPenaltySeconds(totalPenalty);
    }

    if (currentIndex === questions.length - 1) {
      setRoundFinished(true);
      onComplete(totalPenalty);
      return;
    }

    setCurrentIndex((previous) => previous + 1);
    setAnswer("");
    setWrongAttempts(0);
    setRevealedHints([]);
    setFeedback(null);
  };

  const submitAnswer = () => {
    if (!answer.trim() || roundFinished) return;

    const normalized = normalizeAnswer(answer);

    const correct = currentQuestion.aliases.some(
      (alias) => normalizeAnswer(alias) === normalized
    );

    if (correct) {
      setFeedback("correct");

      /*
       * Correct = 0 penalty.
       * Automatically move to the next logo.
       */
      window.setTimeout(() => {
        finishOrNext(0);
      }, 450);

      return;
    }

    /*
     * FIRST WRONG:
     * +5 seconds
     * One more attempt.
     */
    if (wrongAttempts === 0) {
      setWrongAttempts(1);
      setPenaltySeconds((previous) => previous + 5);
      setFeedback("wrong");
      setAnswer("");
      return;
    }

    /*
     * SECOND WRONG:
     * +10 seconds
     * Automatically next.
     *
     * Total for this logo = +15 seconds.
     */
    setFeedback("wrong");

    window.setTimeout(() => {
      finishOrNext(10);
    }, 700);
  };

  const useHint = (hintIndex: number) => {
    if (roundFinished) return;

    if (hintsUsed >= 2) return;

    if (revealedHints.includes(hintIndex)) return;

    /*
     * Every hint = +10 seconds.
     */
    setHintsUsed((previous) => previous + 1);
    setPenaltySeconds((previous) => previous + 10);

    setRevealedHints((previous) => [
      ...previous,
      hintIndex,
    ]);
  };

  const skipQuestion = () => {
    if (roundFinished) return;

    if (skipsUsed >= 2) return;

    setSkipsUsed((previous) => previous + 1);

    /*
     * Skip = +20 seconds.
     */
    finishOrNext(20);
  };

  const handleKeyDown = (
    event: KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      submitAnswer();
    }
  };

  const actualTime = Math.min(
    elapsedTime,
    ROUND_TIME_LIMIT
  );

  const adjustedTime = actualTime + penaltySeconds;

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
          ⏱ {formatTime(actualTime)}
        </div>
      </header>

      <main className="round-container">
        <p className="eyebrow">
          ⚔ ROUND 01 — LOGO PEHCHAANO ⚔
        </p>

        <h1 className="round-title">
          FASTEST
          <span>FINGER FIRST</span>
        </h1>

        <p className="round-subtitle">
          Identify all 10 technical logos as fast as possible.
        </p>

        {/* ================= STATS ================= */}

        <div className="round-stats">
          <div>
            <small>LOGOS</small>

            <strong>
              {String(currentIndex + 1).padStart(2, "0")} / 10
            </strong>
          </div>

          <div>
            <small>TIME</small>

            <strong>{formatTime(actualTime)}</strong>
          </div>

          <div>
            <small>PENALTY</small>

            <strong>+{penaltySeconds}s</strong>
          </div>

          <div>
            <small>HINTS</small>

            <strong>{2 - hintsUsed} / 2</strong>
          </div>

          <div>
            <small>SKIPS</small>

            <strong>{2 - skipsUsed} / 2</strong>
          </div>
        </div>

        {/* ================= WANTED CARD ================= */}

        <div className="wanted-card">
          <div className="wanted-header">
            ☠ IDENTIFY THE LOGO ☠
          </div>

          <div className="logo-area">
            <div className="logo-circle">
              <Logo size={125} />
            </div>

            <div className="difficulty-badge">
              {currentQuestion.difficulty.toUpperCase()}
            </div>

            <p className="logo-question">
              WHICH TECHNOLOGY IS THIS?
            </p>
          </div>

          {/* ================= ANSWER ================= */}

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
              disabled={roundFinished}
            />

            <button
              className="submit-button"
              onClick={submitAnswer}
              disabled={
                roundFinished || !answer.trim()
              }
            >
              SUBMIT
            </button>
          </div>

          {/* ================= FEEDBACK ================= */}

          {feedback === "correct" && (
            <div className="answer-feedback correct">
              ✓ CORRECT — NEXT LOGO
            </div>
          )}

          {feedback === "wrong" && wrongAttempts === 1 && (
            <div className="answer-feedback wrong">
              ✕ WRONG — +5 SEC — ONE MORE ATTEMPT
            </div>
          )}

          {/* ================= HINTS ================= */}

          <div className="hint-section">
            <div className="hint-title">
              💡 HINTS — {2 - hintsUsed} REMAINING
            </div>

            <div className="hint-buttons">
              <button
                className="hint-button"
                onClick={() => useHint(0)}
                disabled={
                  roundFinished ||
                  hintsUsed >= 2 ||
                  revealedHints.includes(0)
                }
              >
                HINT 1
                <span>+10 SEC</span>
              </button>

              <button
                className="hint-button"
                onClick={() => useHint(1)}
                disabled={
                  roundFinished ||
                  hintsUsed >= 2 ||
                  revealedHints.includes(1)
                }
              >
                HINT 2
                <span>+10 SEC</span>
              </button>
            </div>

            {revealedHints.map((hintIndex) => (
              <div
                className="hint-text"
                key={hintIndex}
              >
                💡 {currentQuestion.hints[hintIndex]}
              </div>
            ))}
          </div>

          {/* ================= ACTIONS ================= */}

          <div className="round-actions">
            <button
              className="skip-button"
              onClick={skipQuestion}
              disabled={
                roundFinished || skipsUsed >= 2
              }
            >
              SKIP
              <span>+20 SEC</span>
            </button>

            <button
              className="give-up-button"
              onClick={onGiveUp}
              disabled={roundFinished}
            >
              ⚑ GIVE UP
            </button>
          </div>

          {/* ================= PENALTY INFO ================= */}

          <div className="penalty-info">
            <span>1st wrong: +5 sec</span>
            <span>2nd wrong: +10 sec</span>
            <span>Hint: +10 sec</span>
            <span>Skip: +20 sec</span>
          </div>
        </div>

        {/* ================= TIME SUMMARY ================= */}

        <div className="time-summary">
          <div>
            <span>ACTUAL TIME</span>

            <strong>
              {formatTime(actualTime)}
            </strong>
          </div>

          <div className="summary-plus">+</div>

          <div>
            <span>PENALTIES</span>

            <strong>+{penaltySeconds}s</strong>
          </div>

          <div className="summary-equals">=</div>

          <div>
            <span>ADJUSTED TIME</span>

            <strong>
              {formatTime(adjustedTime)}
            </strong>
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