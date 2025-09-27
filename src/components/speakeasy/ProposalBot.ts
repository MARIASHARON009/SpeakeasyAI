export type ProposalFeedback = {
  score: number; // 0-100
  strengths: string[];
  suggestions: string[];
};

export function getProposalFeedback(title: string, abstract: string, track: string): ProposalFeedback {
  const strengths: string[] = [];
  const suggestions: string[] = [];
  let score = 50;

  // Title checks
  if (title.length >= 20 && title.length <= 70) {
    strengths.push("Title length is clear and concise.");
    score += 10;
  } else if (title.length < 10) {
    suggestions.push("Make the title more descriptive (aim for 20-70 characters).");
    score -= 10;
  }
  if (/\b(how|build|learn|guide|intro|advanced)\b/i.test(title)) {
    strengths.push("Action-oriented title.");
    score += 5;
  } else {
    suggestions.push("Consider an action word like 'How', 'Build', or 'Learn'.");
  }

  // Abstract checks
  const words = abstract.trim().split(/\s+/).length;
  if (words >= 60 && words <= 250) {
    strengths.push("Abstract explains value within a good length.");
    score += 15;
  } else if (words < 40) {
    suggestions.push("Expand the abstract with problem, approach, and outcomes (60-200 words).");
    score -= 10;
  } else if (words > 280) {
    suggestions.push("Shorten the abstract to focus on key takeaways.");
    score -= 5;
  }

  // Track relevance
  if (track) {
    strengths.push(`Track selected: ${track}`);
    score += 5;
  } else {
    suggestions.push("Select a track to help reviewers.");
  }

  // Keywords
  const hasTakeaways = /takeaway|learn|you will|attendees will/i.test(abstract);
  if (!hasTakeaways) {
    suggestions.push("Add 3-4 clear takeaways in the abstract.");
  } else {
    strengths.push("Includes clear expected outcomes.");
    score += 5;
  }

  // Clamp score
  score = Math.max(0, Math.min(100, score));

  return { score, strengths, suggestions };
}