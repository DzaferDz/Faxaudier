import { Flashcard, FlashcardDifficulty } from '../types';

/**
 * SuperMemo SM-2 inspired Spaced Repetition Algorithm
 * Adapts intervals based on user rating:
 * 'again' - resets repetition count, schedules for tomorrow (or immediate)
 * 'hard'  - slight increment, reduces ease factor
 * 'good'  - standard multiplier interval
 * 'easy'  - bonus multiplier interval, increases ease factor
 */
export function calculateNextReview(
  card: Flashcard,
  difficulty: FlashcardDifficulty
): { nextReviewDate: number; intervalDays: number; repetitions: number; easeFactor: number } {
  let { repetitions, intervalDays, easeFactor } = card;

  // Initial ease factor fallback
  if (!easeFactor || easeFactor < 1.3) easeFactor = 2.5;

  let quality = 3; // 0 to 5 SM-2 scale
  switch (difficulty) {
    case 'again':
      quality = 1;
      break;
    case 'hard':
      quality = 2;
      break;
    case 'good':
      quality = 4;
      break;
    case 'easy':
      quality = 5;
      break;
  }

  if (quality < 3) {
    repetitions = 0;
    intervalDays = 1;
  } else {
    if (repetitions === 0) {
      intervalDays = 1;
    } else if (repetitions === 1) {
      intervalDays = difficulty === 'easy' ? 4 : (difficulty === 'hard' ? 2 : 3);
    } else {
      let multiplier = easeFactor;
      if (difficulty === 'hard') multiplier = 1.2;
      if (difficulty === 'easy') multiplier = easeFactor * 1.3;
      intervalDays = Math.round(intervalDays * multiplier);
    }
    repetitions += 1;
  }

  // Calculate new ease factor: EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (easeFactor < 1.3) easeFactor = 1.3;

  const oneDayMs = 24 * 60 * 60 * 1000;
  const nextReviewDate = Date.now() + intervalDays * oneDayMs;

  return {
    nextReviewDate,
    intervalDays,
    repetitions,
    easeFactor: Number(easeFactor.toFixed(2))
  };
}
