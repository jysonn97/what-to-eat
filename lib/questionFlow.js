export const questionFlow = [
  {
    key: "mealType",
    question: "What meal are you looking for?",
    options: ["Breakfast", "Brunch", "Lunch", "Dinner", "Snack / Dessert"],
  },
  {
    key: "occasion",
    question: "What's the occasion?",
    options: [
      "Regular meal",
      "Date / Romantic",
      "Business meeting",
      "Special event",
      "Exploring a new place",
    ],
  },
  {
    key: "whoWith",
    question: "Who are you eating with?",
    options: ["Alone", "Partner / Date", "Friends", "Family", "Client / Coworkers"],
  },
  {
    key: "partySize",
    question: "How many people are you eating with?",
    options: ["2", "3–4", "5–6", "More than 6"],
  },
  {
    key: "vibe",
    question: "What kind of vibe are you looking for?",
    options: [
      "Cozy & quiet",
      "Trendy & lively",
      "Romantic",
      "Fancy & upscale",
      "Casual & fun",
      "Doesn't matter",
    ],
  },
  {
    key: "budget",
    question: "What's your budget?",
    options: ["$", "$$", "$$$", "$$$$"],
  },
  {
    key: "distance",
    question: "How far are you willing to go?",
    options: [
      "Walking distance (0–10 min)",
      "10–30 min by walk or car",
      "More than 30 min",
      "Doesn't matter",
    ],
  },
  {
    key: "cuisine",
    question: "Any cuisine preferences?",
    options: [
      "Korean", "Japanese", "Chinese", "Thai",
      "Italian", "Mexican", "American", "Indian",
      "Middle Eastern", "French", "Open to anything"
    ],
  },
  {
    key: "specialFeatures",
    question: "Any must-have features?",
    multi: true,
    options: [
      "Outdoor seating",
      "Vegetarian / Vegan options",
      "Pet-friendly",
      "Late-night open",
      "Good for groups",
      "Wheelchair accessible",
      "Accepts reservations",
      "Delivery available",
      "None"
    ],
  },
  {
    key: "reviewImportance",
    question: "How much do you care about reviews?",
    options: ["4.5+ preferred", "At least 4.0", "Anything's fine"],
  },
];
