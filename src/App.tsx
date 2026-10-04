import { useEffect, useState } from "react";
import "./App.css";

import RoundOne from "./pages/RoundOne";
import RoundTwo from "./pages/RoundTwo";
import RoundThree from "./pages/RoundThree";
import FinalQuestion from "./pages/FinalQuestion";


type GameScreen =
  | "home"
  | "round1"
  | "round2"
  | "round3"
  | "final";

function formatTime(seconds: number) {
  const safeSeconds = Math.max(0, Math.floor(seconds));

  const minutes = Math.floor(safeSeconds / 60);
  const remainingSeconds = safeSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds
  ).padStart(2, "0")}`;
}

function App() {
  const [screen, setScreen] =
    useState<GameScreen>("home");

  // ================================
  // GLOBAL GAME TIMER
  // ================================

  const [elapsedTime, setElapsedTime] = useState(0);

  const [gameStarted, setGameStarted] =
    useState(false);

  // ================================
  // TOTAL PENALTIES
  // ================================

  const [totalPenaltySeconds, setTotalPenaltySeconds] =
    useState(0);

  // ================================
  // FINAL TIME
  // ================================

  const [finalTime, setFinalTime] =
    useState<number | null>(null);

  // Temporary crew name
  const crewName = "Tech Pirates";

  // ================================
  // GLOBAL TIMER
  // ================================

  useEffect(() => {
    if (!gameStarted) return;

    const timer = setInterval(() => {
      setElapsedTime((previous) => previous + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted]);

  // ================================
  // START GAME
  // ================================

  const startGame = () => {
    setElapsedTime(0);
    setTotalPenaltySeconds(0);
    setFinalTime(null);

    setGameStarted(true);
    setScreen("round1");
  };

  // ================================
  // RETURN HOME
  // ================================

  const goHome = () => {
    setGameStarted(false);
    setElapsedTime(0);
    setTotalPenaltySeconds(0);
    setFinalTime(null);

    setScreen("home");
  };

  // ================================
  // GIVE UP
  // ================================

  const handleGiveUp = () => {
    const confirmed = window.confirm(
      "Are you sure you want to give up?\n\nYour crew will leave the current voyage."
    );

    if (!confirmed) return;

    setGameStarted(false);
    setFinalTime(null);
    setElapsedTime(0);
    setTotalPenaltySeconds(0);
    setScreen("home");
  };

  // ================================
  // ROUND 1 COMPLETE
  // ================================

  const handleRoundOneComplete = (
    penaltySeconds: number
  ) => {
    setTotalPenaltySeconds(penaltySeconds);
    setScreen("round2");
  };

  // ================================
  // ROUND 2 COMPLETE
  // ================================

  const handleRoundTwoComplete = () => {
    setScreen("round3");
  };

  // ================================
  // STOP TIMER
  // ================================

  const handleStopTimer = () => {
    setGameStarted(false);

    const adjustedFinalTime =
      elapsedTime + totalPenaltySeconds;

    setFinalTime(adjustedFinalTime);
  };

  // ================================
  // FINAL COMPLETE
  // ================================

  const handleFinalComplete = () => {
    setScreen("final");
  };

    if (window.location.pathname === "/final") {
    return <FinalQuestion crewName={crewName} />;
  }

  // ================================
  // HOME
  // ================================

  if (screen === "home") {
    return (
      <div className="app">
        <div className="ocean-glow" />

        <header className="navbar">
          <div className="brand">
            <span className="brand-icon">☠</span>
            <span>TECHNITUDE × GRAND LINE</span>
          </div>

          <div className="nav-status">
            <span className="status-dot" />
            SHAIDS COMMITTEE
          </div>
        </header>

        <main className="hero">
          <div className="compass">✦</div>

          <p className="eyebrow">
            ⚓ TECHNITUDE PRESENTS ⚓
          </p>

          <h1>
            THE GRAND
            <span>LINE</span>
          </h1>

          <div className="divider">
            <span>☠</span>
          </div>

          <h2>TECH TREASURE HUNT</h2>

          <p className="description">
            Gather your crew. Follow the clues. Solve
            the challenges.
            <br />
            Find the <strong>ONE PIECE</strong> hidden at
            the end of the Grand Line.
          </p>

          <button
            className="sail-button"
            onClick={startGame}
          >
            <span>SET SAIL</span>
            <span className="arrow">→</span>
          </button>

          {/* TEMPORARY DEVELOPMENT BUTTONS */}

          <div className="dev-buttons">
            <button
              onClick={() => {
                setElapsedTime(0);
                setTotalPenaltySeconds(0);
                setFinalTime(null);
                setGameStarted(true);
                setScreen("round1");
              }}
            >
              TEST ROUND 1
            </button>

            <button
              onClick={() => {
                setElapsedTime(0);
                setTotalPenaltySeconds(0);
                setFinalTime(null);
                setGameStarted(true);
                setScreen("round2");
              }}
            >
              TEST ROUND 2
            </button>

            <button
              onClick={() => {
                setElapsedTime(0);
                setTotalPenaltySeconds(0);
                setFinalTime(null);
                setGameStarted(true);
                setScreen("round3");
              }}
            >
              TEST ROUND 3
            </button>
          </div>

          <div className="legend">
            <div>
              <span>01</span>
              FASTEST FINGER
            </div>

            <div>
              <span>02</span>
              GRAND LINE HUNT
            </div>

            <div>
              <span>03</span>
              FIND THE ONE PIECE
            </div>
          </div>
        </main>

        <footer>
          <span>☠</span>
          TECHNITUDE • SHAIDS COMMITTEE • ONE PIECE
          <span>☠</span>
        </footer>
      </div>
    );
  }

  // ================================
  // ROUND 1
  // ================================

  if (screen === "round1") {
    return (
      <RoundOne
        crewName={crewName}
        elapsedTime={elapsedTime}
        onComplete={handleRoundOneComplete}
        onBack={goHome}
        onGiveUp={handleGiveUp}
      />
    );
  }

  // ================================
  // ROUND 2
  // ================================

  if (screen === "round2") {
    return (
      <RoundTwo
        crewName={crewName}
        elapsedTime={elapsedTime}
        onComplete={handleRoundTwoComplete}
        onBack={goHome}
        onGiveUp={handleGiveUp}
      />
    );
  }

  // ================================
  // ROUND 3
  // ================================

  if (screen === "round3") {
    return (
      <RoundThree
        crewName={crewName}
        elapsedTime={elapsedTime}
        onBack={goHome}
        onComplete={handleFinalComplete}
        onStopTimer={handleStopTimer}
      />
    );
  }

  // ================================
  // FINAL SCREEN
  // ================================

  if (screen === "final") {
    const displayedFinalTime =
      finalTime ?? elapsedTime + totalPenaltySeconds;

    return (
      <div className="app round-page">
        <div className="ocean-glow" />

        <header className="navbar">
          <div className="brand">
            <span className="brand-icon">☠</span>
            <span>GRAND LINE</span>
          </div>

          <div className="global-timer">
            ⏱ {formatTime(displayedFinalTime)}
          </div>
        </header>

        <main className="round-container">
          <p className="eyebrow">
            ☠ VOYAGE COMPLETE ☠
          </p>

          <h1 className="round-title">
            TREASURE
            <span>CLAIMED</span>
          </h1>

          <p className="round-subtitle">
            Congratulations, {crewName}.
            <br />
            You have conquered the Grand Line.
          </p>

          <div className="wanted-card">
            <div className="wanted-header">
              ☠ FINAL TIME ☠
            </div>

            <div className="logo-area">
              <div className="treasure-icon">
                ☠
              </div>

              <p className="logo-question">
                {formatTime(displayedFinalTime)}
              </p>

              <p className="description">
                The treasure has been found.
                <br />
                Your voyage is complete.
              </p>
            </div>
          </div>

          <button
            className="sail-button"
            onClick={goHome}
          >
            <span>RETURN TO MAP</span>
            <span className="arrow">→</span>
          </button>
        </main>

        <footer>
          <span>☠</span>
          TECHNITUDE • SHAIDS COMMITTEE • ONE PIECE
          <span>☠</span>
        </footer>
      </div>
    );
  }

  return null;
}

export default App;