export default async function fetchPlaceDetails(placeId) {
  try {
    const fields = [
      "name",
      "rating",
      "price_level",
      "review",
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

    return {
      name: result.name,
      rating: result.rating,
      price_level: result.price_level,
      address: result.formatted_address,
      reviews: result.reviews?.map((r) => r.text).slice(0, 3) || [],
    };
  } catch (err) {
    console.error("❌ Error fetching place details:", err);
    return {
      name: "Unknown",
      rating: null,
      price_level: null,
      address: null,
      reviews: [],
    };
  }
}
