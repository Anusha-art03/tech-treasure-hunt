import { useState } from "react";
import { CheckCircle2, Flag, Skull, Sparkles, XCircle } from "lucide-react";
import { supabase } from "../lib/supabase";

type FinalQuestionProps = {
  crewName: string;
  teamId: number | null;
  onStopTimer: () => void;
};

type SubmissionResult = {
  success?: boolean;
  correct?: boolean;
  error?: string;
};

function FinalQuestion({
  crewName,
  teamId,
  onStopTimer,

}: FinalQuestionProps) {
  const [answer, setAnswer] = useState("");
  const [result, setResult] =
    useState<SubmissionResult | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const trimmedAnswer = answer.trim();

    if (!trimmedAnswer || submitting) return;

    setSubmitting(true);
    setResult(null);

    try {
      const functionUrl =
        import.meta.env.VITE_FINAL_SUBMISSION_FUNCTION_URL;

      console.log("FUNCTION URL =", functionUrl);
      console.log("TEAM ID =", teamId);

      if (!functionUrl) {
        throw new Error(
          "Final submission function is not configured."
        );
      }

      const response = await fetch(functionUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          crewName,
          answer: trimmedAnswer,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Could not submit your answer."
        );
      }

      /*
       * Update the same team record in Supabase.
       */
      if (teamId) {
        const { error: teamUpdateError } = await supabase
          .from("teams")
          .update({
            final_answer: trimmedAnswer,
            final_correct: data.correct === true,
            final_submitted_at:
              new Date().toISOString(),
            status:
              data.correct === true
                ? "completed"
                : "final_wrong",
          })
          .eq("id", teamId);

        if (teamUpdateError) {
          console.error(
            "Final team update error:",
            teamUpdateError
          );

          throw new Error(
            "Answer was submitted, but team details could not be updated."
          );
        }
      }
       onStopTimer();
      setResult(data);
    } catch (error) {
      console.error(error);

      setResult({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Something went wrong.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  /*
   * CORRECT ANSWER SCREEN
   */
  if (result?.correct) {
    return (
      <main className="round-page">
        <div className="ocean-glow" />

        <header className="navbar">
          <div className="brand">
            <span className="brand-icon">☠</span>
            <span>
              TECHNITUDE × HACK THE HUNT
            </span>
          </div>

          <div className="nav-status">
            <span className="status-dot" />
            FINAL SUBMISSION
          </div>
        </header>

        <main className="round-container final-answer-submitted">
          <div className="compass">✦</div>

          <p className="eyebrow">
            <CheckCircle2 size={16} />
            TREASURE CLAIMED
          </p>

          <h1 className="round-title">
            YOU FOUND
            <span>THE ANSWER</span>
          </h1>

          <p className="round-subtitle">
            Congratulations, {crewName}.
            <br />
            Your final answer has been recorded.
          </p>

          <section className="wanted-card">
            <div className="wanted-header">
              ☠ FINAL ANSWER SUBMITTED ☠
            </div>

            <div className="logo-area">
              <div className="treasure-icon">
                <CheckCircle2 size={54} />
              </div>

              <p className="logo-question">
                CORRECT!
              </p>

              <p className="description">
                Your submission has been successfully
                recorded.
                <br />
                Please wait for the event organizers
                to announce the result.
              </p>
            </div>
          </section>
        </main>

        <footer>
          <span>☠</span>
          TECHNITUDE • SHAIDS COMMITTEE • HACK THE HUNT
          <span>☠</span>
        </footer>
      </main>
    );
  }

  /*
   * WRONG ANSWER SCREEN
   */
  if (result && !result.correct && !result.error) {
    return (
      <main className="round-page">
        <div className="ocean-glow" />

        <header className="navbar">
          <div className="brand">
            <span className="brand-icon">☠</span>
            <span>
              TECHNITUDE × HACK THE HUNT
            </span>
          </div>

          <div className="nav-status">
            <span className="status-dot" />
            FINAL CHALLENGE
          </div>
        </header>

        <main className="round-container">
          <div className="compass">✦</div>

          <p className="eyebrow">
            <XCircle size={16} />
            WRONG ANSWER
          </p>

          <h1 className="round-title">
            NOT THIS
            <span>TIME</span>
          </h1>

          <p className="round-subtitle">
            The answer submitted was incorrect.
            <br />
            Follow the event rules before trying again.
          </p>

          <section className="wanted-card">
            <div className="wanted-header">
              ☠ FINAL CHALLENGE ☠
            </div>

            <div className="logo-area">
              <div className="treasure-icon">
                <XCircle size={54} />
              </div>

              <p className="logo-question">
                WRONG ANSWER
              </p>

              <p className="description">
                Your submission has been recorded.
                <br />
                Contact the event organizers if another
                attempt is permitted.
              </p>
            </div>
          </section>
        </main>

        <footer>
          <span>☠</span>
          TECHNITUDE • SHAIDS COMMITTEE • HACK THE HUNT
          <span>☠</span>
        </footer>
      </main>
    );
  }

  /*
   * FINAL QUESTION FORM
   */
  return (
    <main className="round-page">
      <div className="ocean-glow" />

      <header className="navbar">
        <div className="brand">
          <span className="brand-icon">☠</span>
          <span>
            TECHNITUDE × HACK THE HUNT
          </span>
        </div>

        <div className="nav-status">
          <span className="status-dot" />
          FINAL CHALLENGE
        </div>
      </header>

      <main className="round-container">
        <div className="compass">✦</div>

        <p className="eyebrow">
          <Flag size={15} />
          THE FINAL TREASURE
        </p>

        <h1 className="round-title">
          ONE LAST
          <span>QUESTION</span>
        </h1>

        <p className="round-subtitle">
          You have reached the end of the Grand Line.
          <br />
          Only one answer stands between your crew
          and victory.
        </p>

        <section className="wanted-card final-question-card">
          <div className="wanted-header">
            ☠ FINAL QUESTION ☠
          </div>

          <div className="final-question-content">
            <div className="final-question-icon">
              <Sparkles size={32} />
            </div>

            <span className="clue-kicker">
              FINAL CHALLENGE
            </span>

            <h2>
              In JavaScript, what is the output of{" "}
              <code>typeof null</code>?
            </h2>

            <p>
              Enter your crew&apos;s final answer below.
            </p>

            <form onSubmit={handleSubmit}>
              <label htmlFor="final-answer">
                YOUR ANSWER
              </label>

              <input
                id="final-answer"
                type="text"
                value={answer}
                onChange={(event) =>
                  setAnswer(event.target.value)
                }
                placeholder="Enter your answer..."
                autoComplete="off"
                autoFocus
                disabled={submitting}
              />

              <button
                type="submit"
                className="sail-button final-submit-button"
                disabled={
                  !answer.trim() || submitting
                }
              >
                <span>
                  {submitting
                    ? "SUBMITTING..."
                    : "SUBMIT FINAL ANSWER"}
                </span>

                <span className="arrow">
                  →
                </span>
              </button>
            </form>
          </div>
        </section>

        {result?.error && (
          <div className="round-note">
            <Skull size={16} />

            <span>
              <strong>ERROR:</strong>{" "}
              {result.error}
            </span>
          </div>
        )}

        <div className="round-note">
          <Skull size={16} />

          <span>
            <strong>WARNING:</strong> Once submitted,
            your answer is recorded with the official
            server time.
          </span>
        </div>
      </main>

      <footer>
        <span>☠</span>
        TECHNITUDE • SHAIDS COMMITTEE • HACK THE HUNT
        <span>☠</span>
      </footer>
    </main>
  );
}

export default FinalQuestion;