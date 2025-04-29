import { useRouter } from "next/router";

export default function HomePage() {
  const router = useRouter();

  const handleStart = () => {
    router.push("/location");
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="text-center space-y-12">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
          🍽️ What to Eat?
        </h1>
        <button
          onClick={handleStart}
          className="border border-white text-white text-lg px-8 py-3 rounded-md hover:bg-white hover:text-black transition duration-300 font-medium shadow-md"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}
