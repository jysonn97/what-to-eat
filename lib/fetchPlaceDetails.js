export default async function fetchPlaceDetails(placeId) {
  try {
    const fields = [
      "name",
      "rating",
      "user_ratings_total",
      "price_level",
      "types",
      "formatted_address",
      "reviews",
      "url",
    ];

    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields.join(",")}&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`;

    const res = await fetch(detailsUrl);
    const data = await res.json();

    const result = data.result;

    const cuisine = result.types?.find(
      (type) =>
        type !== "restaurant" &&
        type !== "food" &&
        !type.includes("establishment")
    ) || "Unknown";

    return {
      name: result.name || "Unknown",
      rating: result.rating || null,
      reviewCount: result.user_ratings_total || 0,
      price: result.price_level !== undefined ? "$".repeat(result.price_level) : "N/A",
      address: result.formatted_address || "Address not available",
      cuisine,
      reviews: result.reviews?.map((r) => r.text).filter(Boolean).slice(0, 3) || [],
      mapsUrl: result.url || null,
    };
  } catch (err) {
    console.error("❌ Error fetching place details:", err);
    return {
      name: "Unknown",
      rating: null,
      reviewCount: 0,
      price: "N/A",
      address: "Address not available",
      cuisine: "Unknown",
      reviews: [],
      mapsUrl: null,
    };
  }
}
