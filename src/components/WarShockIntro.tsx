import { useEffect, useState } from "react";

const WORD_MS = 3200;
const FADE_MS = 900;

type Phase = "word" | "hide" | "done";

type Props = {
  onComplete?: () => void;
};

export function WarShockIntro({ onComplete }: Props) {
  const [phase, setPhase] = useState<Phase>("done");

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      setPhase("done");
      onComplete?.();
      return;
    }

    setPhase("word");
    document.body.classList.add("war-intro-lock");

    const hideTimer = window.setTimeout(() => setPhase("hide"), WORD_MS);
    const doneTimer = window.setTimeout(() => {
      setPhase("done");
      document.body.classList.remove("war-intro-lock");
      onComplete?.();
    }, WORD_MS + FADE_MS);

    return () => {
      window.clearTimeout(hideTimer);
      window.clearTimeout(doneTimer);
      document.body.classList.remove("war-intro-lock");
    };
  }, [onComplete]);

  if (phase === "done") return null;

  return (
    <div
      className={`war-shock-intro ${phase === "hide" ? "war-shock-intro--hide" : ""}`}
      aria-hidden="true"
    >
      <div className="war-shock-intro__wrap">
        <p className="font-fanum war-shock-intro__kicker">۱۴۰۴ / یک کلمه بیشتر از هر وقت دیگری تکرار شد</p>
        <p className="font-fanum war-shock-intro__word">خوبی؟</p>
      </div>
    </div>
  );
}
