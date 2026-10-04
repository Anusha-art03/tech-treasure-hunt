import { useEffect, useState } from "react";
import "./App.css";
import { supabase } from "./lib/supabase";

import RoundOne from "./pages/RoundOne";
import RoundTwo from "./pages/RoundTwo";
import RoundThree from "./pages/RoundThree";
import FinalQuestion from "./pages/FinalQuestion";
import TeamDetails from "./pages/TeamDetails";

type GameScreen =
  | "home"
  | "teamDetails"
  | "round1"
  | "round2"
  | "round3"
  | "final";

type Team = {
  id: number;
  teamNumber: number;
  teamName: string;
  members: string[];
};

type GameSession = {
  team: Team;
  startedAt: number;
  penaltySeconds: number;
  stopped: boolean;
  finalTime: number | null;
};

const SESSION_KEY = "technitude_game_session";

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

  // ================================
  // TEAM DETAILS
  // ================================

  const [team, setTeam] =
    useState<Team | null>(null);

  // ================================
  // RESTORE SAVED SESSION
  // ================================

  useEffect(() => {
    const savedSession =
      localStorage.getItem(SESSION_KEY);

    if (!savedSession) {
      return;
    }

    try {
      const session: GameSession =
        JSON.parse(savedSession);

      if (!session.team?.id) {
        localStorage.removeItem(SESSION_KEY);
        return;
      }

      setTeam(session.team);

      setTotalPenaltySeconds(
        session.penaltySeconds || 0
      );

      // =================================
      // FINAL ALREADY SUBMITTED
      // =================================

      if (session.stopped) {
        const savedFinalTime =
          session.finalTime ?? 0;

        setElapsedTime(
          Math.max(
            0,
            savedFinalTime -
              (session.penaltySeconds || 0)
          )
        );

        setFinalTime(savedFinalTime);
        setGameStarted(false);

        return;
      }

      // =================================
      // CALCULATE CURRENT ELAPSED TIME
      // =================================

      const currentElapsed = Math.floor(
        (Date.now() - session.startedAt) /
          1000
      );

      setElapsedTime(
        Math.max(0, currentElapsed)
      );

      // =================================
      // QR → /final
      // =================================

      if (
        window.location.pathname === "/final"
      ) {
        setGameStarted(true);
      }
    } catch (error) {
      console.error(
        "Could not restore game session:",
        error
      );

      localStorage.removeItem(SESSION_KEY);
    }
  }, []);

  // ================================
  // GLOBAL TIMER
  // ================================

  useEffect(() => {
    if (!gameStarted) return;

    const timer = setInterval(() => {
      const savedSession =
        localStorage.getItem(SESSION_KEY);

      if (!savedSession) return;

      try {
        const session: GameSession =
          JSON.parse(savedSession);

        if (session.stopped) {
          return;
        }

        const currentElapsed = Math.floor(
          (Date.now() - session.startedAt) /
            1000
        );

        setElapsedTime(
          Math.max(0, currentElapsed)
        );
      } catch (error) {
        console.error(
          "Timer error:",
          error
        );
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted]);

  // ================================
  // HOME → TEAM DETAILS
  // ================================

  const startGame = () => {
    setElapsedTime(0);
    setTotalPenaltySeconds(0);
    setFinalTime(null);
    setGameStarted(false);
    setTeam(null);

    localStorage.removeItem(SESSION_KEY);

    setScreen("teamDetails");
  };

  // ================================
  // TEAM DETAILS → ROUND 1
  // ================================

  const handleTeamStart = (
    teamDetails: Team
  ) => {
    const startedAt = Date.now();

    const session: GameSession = {
      team: teamDetails,
      startedAt,
      penaltySeconds: 0,
      stopped: false,
      finalTime: null,
    };

    localStorage.setItem(
      SESSION_KEY,
      JSON.stringify(session)
    );

    setTeam(teamDetails);

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
    setTeam(null);

    localStorage.removeItem(SESSION_KEY);

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
    setElapsedTime(0);
    setFinalTime(null);
    setTotalPenaltySeconds(0);
    setTeam(null);

    localStorage.removeItem(SESSION_KEY);

    setScreen("home");
  };

  // ================================
  // ROUND 1 COMPLETE
  // ================================

  const handleRoundOneComplete = async (
    penaltySeconds: number
  ) => {
    setTotalPenaltySeconds(
      penaltySeconds
    );

    // Save penalty locally
    const savedSession =
      localStorage.getItem(SESSION_KEY);

    if (savedSession) {
      try {
        const session: GameSession =
          JSON.parse(savedSession);

        session.penaltySeconds =
          penaltySeconds;

        localStorage.setItem(
          SESSION_KEY,
          JSON.stringify(session)
        );
      } catch (error) {
        console.error(
          "Could not save penalty:",
          error
        );
      }
    }

    if (team?.id) {
      const { error } = await supabase
        .from("teams")
        .update({
          round_1_completed_at:
            new Date().toISOString(),

          round_1_penalty_seconds:
            penaltySeconds,

          status: "round_2",
        })
        .eq("id", team.id);

      if (error) {
        console.error(
          "Round 1 update error:",
          error
        );

        alert(
          "Round 1 could not be saved. Please try again."
        );

        return;
      }
    }

    setScreen("round2");
  };

  // ================================
  // ROUND 2 COMPLETE
  // ================================

  const handleRoundTwoComplete =
    async () => {
      if (team?.id) {
        const { error } =
          await supabase
            .from("teams")
            .update({
              round_2_completed_at:
                new Date().toISOString(),

              status: "round_3",
            })
            .eq("id", team.id);

        if (error) {
          console.error(
            "Round 2 update error:",
            error
          );

          alert(
            "Round 2 could not be saved. Please try again."
          );

          return;
        }
      }

      setScreen("round3");
    };

  // ================================
  // STOP TIMER
  // ================================

  const handleStopTimer = () => {
    const savedSession =
      localStorage.getItem(SESSION_KEY);

    if (savedSession) {
      try {
        const session: GameSession =
          JSON.parse(savedSession);

        // Exact time since START VOYAGE
        const currentElapsed =
          Math.floor(
            (Date.now() -
              session.startedAt) /
              1000
          );

        // Add Round 1 penalties
        const adjustedFinalTime =
          currentElapsed +
          (session.penaltySeconds || 0);

        // Freeze React timer
        setElapsedTime(
          currentElapsed
        );

        setFinalTime(
          adjustedFinalTime
        );

        setGameStarted(false);

        // Permanently mark session stopped
        session.stopped = true;
        session.finalTime =
          adjustedFinalTime;

        localStorage.setItem(
          SESSION_KEY,
          JSON.stringify(session)
        );

        console.log(
          "FINAL TIMER STOPPED:",
          adjustedFinalTime,
          "seconds"
        );

        return;
      } catch (error) {
        console.error(
          "Could not stop timer:",
          error
        );
      }
    }

    // Fallback
    const adjustedFinalTime =
      elapsedTime +
      totalPenaltySeconds;

    setFinalTime(
      adjustedFinalTime
    );

    setGameStarted(false);
  };

  // ================================
  // FINAL COMPLETE
  // ================================

  const handleFinalComplete =
    async () => {
      if (team?.id) {
        const { error } =
          await supabase
            .from("teams")
            .update({
              round_3_completed_at:
                new Date().toISOString(),

              status: "final",
            })
            .eq("id", team.id);

        if (error) {
          console.error(
            "Round 3 update error:",
            error
          );

          alert(
            "Round 3 could not be saved. Please try again."
          );

          return;
        }
      }

      setScreen("final");
    };

  // ================================
  // FINAL QUESTION ROUTE
  // ================================

  if (
    window.location.pathname === "/final"
  ) {
    return (
      <FinalQuestion
        crewName={
          team?.teamName ??
          "Tech Pirates"
        }
        teamId={team?.id ?? null}
        elapsedTime={elapsedTime}
        onStopTimer={
          handleStopTimer
        }
      />
    );
  }

  // ================================
  // TEAM DETAILS
  // ================================

  if (screen === "teamDetails") {
    return (
      <TeamDetails
        onStart={handleTeamStart}
      />
    );
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
            <span className="brand-icon">
              ☠
            </span>

            <span>
              TECHNITUDE × GRAND LINE
            </span>
          </div>

          <div className="nav-status">
            <span className="status-dot" />
            SHAIDS COMMITTEE
          </div>
        </header>

        <main className="hero">
          <div className="compass">
            ✦
          </div>

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

          <h2>HACK THE HUNT</h2>

          <p className="description">
            Gather your crew. Follow the clues.
            Solve the challenges.
            <br />
            Find the <strong>ONE PIECE</strong>{" "}
            hidden at the end of the Grand Line.
          </p>

          <button
            className="sail-button"
            onClick={startGame}
          >
            <span>SET SAIL</span>

            <span className="arrow">
              →
            </span>
          </button>

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
        crewName={
          team?.teamName ??
          "Tech Pirates"
        }
        elapsedTime={elapsedTime}
        onComplete={
          handleRoundOneComplete
        }
        onBack={() =>
          setScreen("teamDetails")
        }
        onGiveUp={
          handleGiveUp
        }
      />
    );
  }

  // ================================
  // ROUND 2
  // ================================

  if (screen === "round2") {
    return (
      <RoundTwo
        crewName={
          team?.teamName ??
          "Tech Pirates"
        }
        elapsedTime={elapsedTime}
        onComplete={
          handleRoundTwoComplete
        }
        onBack={() =>
          setScreen("round1")
        }
        onGiveUp={
          handleGiveUp
        }
      />
    );
  }

  // ================================
  // ROUND 3
  // ================================

  if (screen === "round3") {
    return (
      <RoundThree
        crewName={
          team?.teamName ??
          "Tech Pirates"
        }
        elapsedTime={elapsedTime}
        onBack={() =>
          setScreen("round2")
        }
        onComplete={
          handleFinalComplete
        }
        onStopTimer={
          handleStopTimer
        }
      />
    );
  }

  // ================================
  // FINAL SCREEN
  // ================================

  if (screen === "final") {
    const displayedFinalTime =
      finalTime ??
      elapsedTime +
        totalPenaltySeconds;

    return (
      <div className="app round-page">
        <div className="ocean-glow" />

        <header className="navbar">
          <div className="brand">
            <span className="brand-icon">
              ☠
            </span>

            <span>GRAND LINE</span>
          </div>

          <div className="global-timer">
            ⏱{" "}
            {formatTime(
              displayedFinalTime
            )}
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
            Congratulations,{" "}
            {team?.teamName ??
              "Tech Pirates"}
            .
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
                {formatTime(
                  displayedFinalTime
                )}
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
            <span>
              RETURN TO MAP
            </span>

            <span className="arrow">
              →
            </span>
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