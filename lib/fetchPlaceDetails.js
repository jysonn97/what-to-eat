export default async function fetchPlaceDetails(placeId) {
  try {
    const fields = [
      "name",
      "rating",
      "price_level",
      "formatted_address",
      "user_ratings_total",
      "types",
      "review"
    ];

    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields.join(
      ","
    )}&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`;

    const res = await fetch(detailsUrl);
    const data = await res.json();
    const result = data.result;

    const rawReviews =
      result.reviews?.map((r) => r.text).filter(Boolean).slice(0, 10) || [];

    const vibeKeywords = [
      "romantic",
      "quiet",
      "cozy",
      "noisy",
      "loud",
      "crowded",
      "casual",
      "upscale",
      "intimate",
      "good for groups",
      "perfect for couples"
    ];

    let vibeTags = new Set();
    let positives = 0;
    let negatives = 0;
    let highlights = [];

    rawReviews.forEach((text) => {
      const lower = text.toLowerCase();
      if (lower.match(/love|perfect|great|amazing|ideal|awesome/)) positives++;
      if (lower.match(/bad|slow|overpriced|terrible|noisy/)) negatives++;

      vibeKeywords.forEach((tag) => {
        if (lower.includes(tag)) vibeTags.add(tag);
      });

      const match = text.match(/[A-Z][^.?!]{10,}\./);
      if (match) highlights.push(match[0]);
    });

    return {
      name: result.name,
      rating: result.rating,
      price_level: result.price_level,
      reviewCount: result.user_ratings_total,
      address: result.formatted_address,
      reviews: rawReviews,
      sentimentSummary: `${positives} positive / ${negatives} negative`,
      vibeTags: Array.from(vibeTags),
      topHighlights: highlights.slice(0, 3),
      mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(result.name)}`
    };
  } catch (err) {
    console.error("❌ Error fetching place details:", err);
    return {
      name: "Unknown",
      rating: null,
      price_level: null,
      reviewCount: null,
      address: null,
      reviews: [],
      sentimentSummary: "",
      vibeTags: [],
      topHighlights: [],
      mapsUrl: ""
    };
  }
}
