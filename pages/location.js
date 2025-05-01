import { useState, useEffect } from "react";
import { useRouter } from "next/router";

const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

export default function LocationPage() {
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!window.google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&libraries=places`;
      script.async = true;
      script.onload = initAutocomplete;
      document.body.appendChild(script);
    } else {
      initAutocomplete();
    }
  }, []);

  const initAutocomplete = () => {
    const input = document.getElementById("location-input");
    if (!input) return;

    const autocomplete = new window.google.maps.places.Autocomplete(input, {
      types: ["geocode"],
    });

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        setLocation(place.formatted_address);
        setError("");
      }
    });
  };

  const handleNext = () => {
    if (!location.trim()) {
      setError("📍 Please enter a valid location.");
      return;
    }
    router.push(`/app?location=${encodeURIComponent(location)}`);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 text-white">
      <div className="w-full max-w-md text-center space-y-8">
        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-extralight tracking-tight leading-tight text-white whitespace-nowrap">
          Where are you?
        </h1>

        {/* Input + Button vertically stacked */}
        <div className="flex flex-col items-center space-y-4">
          <input
            id="location-input"
            type="text"
            placeholder="Enter your location..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-[240px] px-3 py-1.5 rounded-md bg-white text-black text-center text-sm placeholder:text-sm outline-none border border-gray-300 focus:border-black focus:ring-2 focus:ring-white transition"
/>
          <button
            onClick={handleNext}
             className="px-4 py-1.5 text-xs text-black bg-white rounded-md hover:opacity-90 transition"
>
            Next
          </button>
        </div>

        {/* Error */}
        {error && (
          <p className="text-red-400 text-sm">{error}</p>
        )}
      </div>
    </div>
  );
}
