// lib/fetchPlaceDetails.js

export async function fetchPlaceDetails(placeId) {
  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,price_level,user_ratings_total,reviews,formatted_address,types,url&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`
    );
    const data = await res.json();

    if (data.status !== "OK") {
      console.error("❌ Google Place Details Error:", data.status);
      return null;
    }

    return {
      name: data.result.name,
      address: data.result.formatted_address,
      rating: data.result.rating,
      priceLevel: data.result.price_level,
      reviewCount: data.result.user_ratings_total,
      reviews: data.result.reviews || [],
      types: data.result.types || [],
      mapsUrl: data.result.url,
    };
  } catch (err) {
    console.error("❌ Failed to fetch place details:", err);
    return null;
  }
}
