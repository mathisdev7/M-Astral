import keyword_extractor from "keyword-extractor";
import business from "./business.json";
import cars from "./cars.json";
import food from "./food.json";
import gadgets from "./gadgets.json";
import gaming from "./gaming.json";
import health from "./health.json";
import lifestyle from "./lifestyle.json";
import music from "./music.json";
import sports from "./sports.json";
import technology from "./technology.json";

function jaroWinkler(s1: string, s2: string): number {
  const m = [...s1].filter(
    (c, i) =>
      s2.includes(c) &&
      [...s2].some(
        (ch, j) =>
          c === ch &&
          Math.abs(i - j) <= Math.floor(Math.max(s1.length, s2.length) / 2)
      )
  ).length;
  if (m === 0) return 0;
  const t =
    [...s1].filter((c, i) => s2.includes(c) && [...s2][i] !== c).length / 2;
  const j = (m / s1.length + m / s2.length + (m - t) / m) / 3;
  const p = 0.1;
  const l = Math.min(s1.length, s2.length, 4);
  return j + l * p * (1 - j);
}

const categoryMap: Record<string, string[]> = {
  LIFESTYLE: lifestyle,
  FOOD: food,
  BUSINESS: business,
  SPORTS: sports,
  TECHNOLOGY: technology,
  CARS: cars,
  GADGETS: gadgets,
  MUSIC: music,
  GAMING: gaming,
  HEALTH: health,
};

export async function categorizeKeywords(sentence: string): Promise<string[]> {
  const result = keyword_extractor.extract(sentence, {
    language: "english",
    remove_digits: true,
    return_changed_case: true,
    remove_duplicates: false,
  });
  const wordsGenerated = result;

  const words = Array.from(new Set(wordsGenerated));

  const categories = Object.keys(categoryMap);
  const categoryScore: Record<string, number> = categories.reduce(
    (acc, category) => {
      acc[category] = 0;
      return acc;
    },
    {} as Record<string, number>
  );

  words.forEach((keyword) => {
    categories.forEach((category) => {
      const maxScore = categoryMap[category].reduce((max, catKeyword) => {
        const score = jaroWinkler(keyword, catKeyword);
        return score > max ? score : max;
      }, 0);
      categoryScore[category] += maxScore;
    });
  });

  const sortedCategories = Object.keys(categoryScore).sort(
    (a, b) => categoryScore[b] - categoryScore[a]
  );
  const bestTwoCategories = sortedCategories.slice(0, 2);

  return [sortedCategories[0]];
}

// (async () => {
//   const sentences = [
//     "Lewis Hamilton is one of the best Formula 1 drivers of all time.",
//     "The new iPhone 13 is coming out soon.",
//     "My favorite food is pizza.",
//     "I love to play basketball.",
//     "The new Tesla Model S is amazing.",
//     "I love to listen to music.",
//     "I am a fan of the Marvel Cinematic Universe.",
//     "I love to watch movies.",
//     "I am a fan of the Harry Potter series.",
//     "I love to play video games.",
//     "I love to travel.",
//     "I love to read books.",
//     "I love to cook.",
//     "I love to go hiking.",
//     "I love to go camping.",
//     "I love to go fishing.",
//     "I love to go skiing.",
//     "I love to go snowboarding.",
//     "I love to go surfing.",
//   ];
//   for (const sentence of sentences) {
//     await categorizeKeywords(sentence);
//   }
// })();
