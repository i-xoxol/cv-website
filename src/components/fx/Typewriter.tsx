"use client";

import { useEffect, useState } from "react";

/** Types and deletes each phrase in turn, like a terminal. Static with reduced motion. */
export default function Typewriter({ words, label }: { words: string[]; label: string }) {
  const [text, setText] = useState(words[0] ?? "");

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || words.length < 2) return;
    let word = 0;
    let len = words[0].length;
    let deleting = true;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      const current = words[word];
      if (deleting) {
        len--;
        if (len <= 0) {
          deleting = false;
          word = (word + 1) % words.length;
        }
      } else {
        len++;
        if (len >= words[word].length) {
          deleting = true;
          setText(words[word]);
          timer = setTimeout(tick, 2200);
          return;
        }
      }
      setText((deleting ? current : words[word]).slice(0, Math.max(0, len)));
      timer = setTimeout(tick, deleting ? 28 : 55);
    };
    timer = setTimeout(tick, 2600);
    return () => clearTimeout(timer);
  }, [words]);

  return (
    <span className="typewriter">
      <span className="visually-hidden">{`${label}: ${words.join(", ")}`}</span>
      <span aria-hidden="true">{text}</span>
      <span className="caret" aria-hidden="true" />
    </span>
  );
}
