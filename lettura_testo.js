(() => {
  "use strict";

  if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) {
    return;
  }

  const content = document.querySelector("main") || document.body;
  const synth = window.speechSynthesis;
  let selectedText = "";
  let speechRun = 0;
  let selectionTimer;

  const panel = document.createElement("div");
  panel.className = "selection-reader";
  panel.hidden = true;
  panel.setAttribute("role", "region");
  panel.setAttribute("aria-label", "Lettura del testo selezionato");
  panel.innerHTML = [
    '<button type="button" class="selection-reader__listen" title="Legge in italiano il testo selezionato">Ascolta selezione</button>',
    '<button type="button" class="selection-reader__stop" hidden>Ferma</button>',
    '<span class="selection-reader__status" aria-live="polite"></span>'
  ].join("");

  const style = document.createElement("style");
  style.textContent = `
    .selection-reader {
      position: fixed;
      z-index: 10000;
      left: 50%;
      bottom: max(16px, env(safe-area-inset-bottom));
      transform: translateX(-50%);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      width: min(460px, calc(100% - 24px));
      padding: 10px;
      border: 1px solid color-mix(in srgb, var(--accent, #2f6c5f) 45%, #80909b);
      border-radius: 8px;
      background: #ffffff;
      color: #17231f;
      box-shadow: 0 8px 24px rgba(20, 40, 34, .18);
      font: 700 clamp(16px, 1.25vw, 19px)/1.2 Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }
    .selection-reader[hidden],
    .selection-reader__stop[hidden] { display: none !important; }
    .selection-reader button {
      min-height: 44px;
      padding: 9px 14px;
      border: 1px solid #9aabb3;
      border-radius: 6px;
      background: #ffffff;
      color: inherit;
      font: inherit;
      cursor: pointer;
    }
    .selection-reader__listen {
      border-color: var(--accent, #2f6c5f) !important;
      background: color-mix(in srgb, var(--accent, #2f6c5f) 10%, #ffffff) !important;
    }
    .selection-reader button:hover { filter: brightness(.97); }
    .selection-reader button:focus-visible {
      outline: 3px solid color-mix(in srgb, var(--accent, #2f6c5f) 55%, #ffffff);
      outline-offset: 2px;
    }
    .selection-reader__status {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }
    @media print { .selection-reader { display: none !important; } }
  `;

  document.head.appendChild(style);
  document.body.appendChild(panel);

  const listenButton = panel.querySelector(".selection-reader__listen");
  const stopButton = panel.querySelector(".selection-reader__stop");
  const status = panel.querySelector(".selection-reader__status");

  function isInsideContent(selection) {
    if (!selection || selection.rangeCount === 0) return false;
    const node = selection.anchorNode;
    return Boolean(node && content.contains(node) && !panel.contains(node));
  }

  function updateSelection() {
    const selection = window.getSelection();
    const text = isInsideContent(selection)
      ? selection.toString().replace(/\s+/g, " ").trim()
      : "";

    if (text.length >= 2) {
      selectedText = text;
      panel.hidden = false;
      listenButton.hidden = false;
      status.textContent = "Testo pronto per la lettura.";
    } else if (!synth.speaking) {
      selectedText = "";
      panel.hidden = true;
      status.textContent = "";
    }
  }

  function splitForSpeech(text, maxLength = 320) {
    const sentences = text.match(/[^.!?;:]+[.!?;:]?/g) || [text];
    const chunks = [];
    let current = "";

    sentences.forEach(sentence => {
      const part = sentence.trim();
      if (!part) return;
      if (current && current.length + part.length + 1 > maxLength) {
        chunks.push(current);
        current = part;
      } else {
        current = current ? `${current} ${part}` : part;
      }
    });

    if (current) chunks.push(current);
    return chunks;
  }

  function italianVoice() {
    const qualityNames = /premium|enhanced|migliorat|natural|neural|siri|alice|elsa|federica|luca/i;
    return synth.getVoices()
      .filter(voice => voice.lang && voice.lang.toLowerCase().startsWith("it"))
      .sort((a, b) => {
        const score = voice =>
          (voice.lang.toLowerCase() === "it-it" ? 8 : 0) +
          (voice.localService ? 4 : 0) +
          (qualityNames.test(voice.name) ? 3 : 0) +
          (voice.default ? 1 : 0);
        return score(b) - score(a);
      })[0];
  }

  function resetControls(message = "") {
    listenButton.hidden = false;
    stopButton.hidden = true;
    status.textContent = message;
  }

  function speakChunks(chunks, index, run) {
    if (run !== speechRun || index >= chunks.length) {
      resetControls("Lettura terminata.");
      return;
    }

    const utterance = new SpeechSynthesisUtterance(chunks[index]);
    utterance.lang = "it-IT";
    utterance.rate = 0.94;
    utterance.pitch = 1;

    const voice = italianVoice();
    if (voice) utterance.voice = voice;

    utterance.onend = () => speakChunks(chunks, index + 1, run);
    utterance.onerror = event => {
      if (run === speechRun && event.error !== "canceled" && event.error !== "interrupted") {
        resetControls("La lettura non è disponibile in questo browser.");
      }
    };
    synth.speak(utterance);
  }

  listenButton.addEventListener("click", () => {
    if (!selectedText) return;

    synth.cancel();
    speechRun += 1;
    listenButton.hidden = true;
    stopButton.hidden = false;
    status.textContent = "Lettura in corso.";
    speakChunks(splitForSpeech(selectedText), 0, speechRun);
  });

  stopButton.addEventListener("click", () => {
    speechRun += 1;
    synth.cancel();
    resetControls("Lettura interrotta.");
  });

  document.addEventListener("selectionchange", () => {
    window.clearTimeout(selectionTimer);
    selectionTimer = window.setTimeout(updateSelection, 180);
  });

  window.addEventListener("pagehide", () => synth.cancel());
})();
