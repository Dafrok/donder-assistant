const PERFECT_WINDOW = 25;
const GOOD_WINDOW = 75;
export const BAD_WINDOW = 108;

export function getHitResult(absDeltaMs) {
  if (absDeltaMs <= PERFECT_WINDOW) return 'perfect';
  if (absDeltaMs <= GOOD_WINDOW) return 'good';
  if (absDeltaMs <= BAD_WINDOW) return 'bad';
  return null;
}

export function summarizeResults(notes) {
  const summary = { perfect: 0, good: 0, bad: 0, miss: 0 };
  for (const note of notes) {
    if (!note.judged || !note.result) continue;
    if (summary[note.result] !== undefined) {
      summary[note.result] += 1;
    }
  }
  return summary;
}

export function findBestCandidate(notes, nowMs, inputType, minTimeMs = -Infinity) {
  let bestIndex = -1;
  let bestDelta = Infinity;

  for (let i = 0; i < notes.length; i += 1) {
    const note = notes[i];
    if (note.judged || note.type !== inputType) continue;
    if (note.timeMs < minTimeMs) continue;
    const delta = nowMs - note.timeMs;
    const absDelta = Math.abs(delta);
    if (absDelta > BAD_WINDOW) continue;
    if (absDelta < bestDelta) {
      bestDelta = absDelta;
      bestIndex = i;
    }
  }

  return bestIndex;
}

export function markExpiredMisses(notes, nowMs, ignoreBeforeMs = -Infinity) {
  let changed = false;
  let missedCount = 0;
  const next = notes.map((note) => {
    if (note.judged) return note;
    if (note.timeMs < ignoreBeforeMs) return note;
    if (nowMs - note.timeMs > BAD_WINDOW) {
      changed = true;
      missedCount += 1;
      return {
        ...note,
        judged: true,
        result: 'miss',
        delta: nowMs - note.timeMs
      };
    }
    return note;
  });
  return { changed, next, missedCount };
}
