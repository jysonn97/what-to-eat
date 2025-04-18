export default async function fetchPlaceDetails(placeId) {
  try {
    const fields = [
      "name",
      "rating",
      "price_level",
      "reviews",
      "types",
      "formatted_address",
      "user_ratings_total",
    ];

    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields.join(
      ","
    )}&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`;

    const res = await fetch(detailsUrl);
    const data = await res.json();
    const result = data.result;

    const reviews = result.reviews?.map((r) => r.text)?.filter(Boolean)?.slice(0, 3) || [];

    // Derive vibe from 'types' (like 'romantic', 'casual', etc.)
    const vibe = result.types?.join(", ") || "";

    return {
      name: result.name || "Unknown",
      rating: result.rating || "N/A",
      price_level: result.price_level || "N/A",
      address: result.formatted_address || "N/A",
      reviewCount: result.user_ratings_total || 0,
      vibe,
      reviews,
    };
  } catch (err) {
    console.error("❌ Error fetching place details:", err);
    return {
      name: "Unknown",
      rating: "N/A",
      price_level: "N/A",
      address: "N/A",
      reviewCount: 0,
      vibe: "",
      reviews: [],
    };
  }
}
