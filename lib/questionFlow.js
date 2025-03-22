// lib/questionFlow.js

export const questionFlow = [
  {
    id: "mealType",
    question: "🍽️ What meal are you looking for?",
    options: ["Breakfast", "Lunch", "Dinner", "Snack / Dessert"],
    alwaysAsk: true,
  },
  {
    id: "occasion",
    question: "🎉 What's the occasion?",
    options: ["Regular meal", "Date / Romantic", "Business meeting", "Special occasion", "Exploring / Traveling"],
    condition: (answers) => {
      const meal = answers.find((a) => a.id === "mealType")?.answer;
      return meal === "Lunch" || meal === "Dinner" || meal === "Snack / Dessert";
    },
  },
  {
    id: "whoWith",
    question: "👥 Who are you eating with?",
    options: ["Alone", "Partner / Date", "Family", "Friends", "Client / Coworkers"],
    condition: (answers) => {
      const occasion = answers.find((a) => a.id === "occasion")?.answer;
      return occasion !== "Business meeting";
    },
  },
  {
    id: "vibe",
    question: "✨ What kind of vibe are you looking for?",
    options: ["Cozy & quiet", "Trendy & lively", "Romantic", "Fancy & upscale", "Casual & chill", "Doesn't matter"],
    alwaysAsk: true,
  },
  {
    id: "hunger",
    question: "🍔 How hungry are you?",
    options: ["Just a light bite", "Medium meal", "Super hungry / feast", "Doesn't matter"],
    condition: (answers) => {
      const occasion = answers.find((a) => a.id === "occasion")?.answer;
      return occasion === "Regular meal";
    },
  },
  {
    id: "budget",
    question: "💵 What's your budget?",
    options: ["$", "$$", "$$$", "$$$$"],
    alwaysAsk: true,
  },
  {
    id: "cuisine",
    question: "🌏 Any cuisine preferences?",
    options: ["Korean", "Japanese", "Italian", "Mexican", "American", "Indian", "Open to anything"],
    alwaysAsk: true,
  },
  {
    id: "distance",
    question: "📍 How far are you willing to go?",
    options: ["Walking distance", "< 10 minutes by car", "More than 10 mins", "Doesn't matter"],
    alwaysAsk: true,
  },
  {
    id: "features",
    question: "🔍 Anything specific you want or need?",
    options: [
      "Outdoor seating",
      "Good for groups",
      "Vegetarian/Vegan",
      "Late-night open",
      "Pet-friendly",
      "Wheelchair accessible",
    ],
    multiSelect: true,
    alwaysAsk: true,
  },
  {
    id: "reviews",
    question: "⭐ Do you care about reviews?",
    options: ["Must be 4.5+ stars", "At least 4.0", "Anything’s fine"],
    alwaysAsk: true,
  },
];
