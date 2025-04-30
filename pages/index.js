import { useRouter } from "next/router";

export default function HomePage() {
  const router = useRouter();

  const handleStart = () => {
    router.push("/location");
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="text-center space-y-9">
        <p className="text-sm md:text-base tracking-widest text-gray-400 uppercase font-semibold mt-3">
          Discover
        </p>

        <h1 className="text-4xl md:text-5xl font-extralight tracking-tight leading-tight text-white">
          🍽️ What to Eat?
        </h1>

        <button
          onClick={handleStart}
          className="mt-8 bg-white text-black font-medium text-sm md:text-base px-6 py-2.5 rounded-sm shadow hover:opacity-90 transition"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}
