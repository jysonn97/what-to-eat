import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function LocationPage() {
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  // Function to get user's location using the browser's Geolocation API
  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation(`${latitude}, ${longitude}`);
        },
        (err) => {
          setError("Failed to get location. Please enter manually.");
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
    }
  };

  // Handle user input change
  const handleInputChange = (e) => {
    setLocation(e.target.value);
  };

  // Navigate to the next page with the location data
  const handleNext = () => {
    if (location.trim()) {
      router.push(`/place-type?location=${encodeURIComponent(location)}`);
    } else {
      setError("Please enter your location.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Where are you?</h1>
      <p className="text-gray-600 mb-4">Enter your location or allow GPS access.</p>

      <input
        type="text"
        placeholder="Enter city, zip code, or address"
        value={location}
        onChange={handleInputChange}
        className="px-4 py-2 border rounded w-80"
      />

      <button
        onClick={handleUseCurrentLocation}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Use My Current Location
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      <button
        onClick={handleNext}
        className="mt-4 px-6 py-2 bg-green-500 text-white rounded"
      >
        Next
      </button>
    </div>
  );
}
