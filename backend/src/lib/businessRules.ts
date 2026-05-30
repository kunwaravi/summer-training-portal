export const businessRules = {
  // The passing score percentage threshold required to clear a quiz week
  passingScoreThreshold: 60,

  // The progress percentage increment awarded per week cleared (e.g. 25% * 4 weeks = 100%)
  weeklyProgressIncrement: 25,

  // The maximum number of weeks in any standard academic training track
  maxWeeks: 4,

  // Fallback score used when calculating grades for zero-score scenarios (GDPR / academic integrity)
  zeroScoreFallback: 0
};
