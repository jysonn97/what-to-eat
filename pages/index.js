import { useRouter } from "next/router";

export default function HomePage() {
  const router = useRouter();

  const handleStart = () => {
    router.push("/location");
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="text-center space-y-10">
        {/* 상단 소제목 */}
        <p className="text-sm md:text-base tracking-widest text-gray-400 uppercase font-semibold">
  Discover
</p>


        {/* 메인 메시지 */}
        <h1 className="text-5xl md:text-7xl font-extralight tracking-tight leading-tight text-white">
          🍽️ What to Eat?
        </h1>

        {/* 버튼 */}
        <button
          onClick={handleStart}
          className="mt-6 bg-white text-black font-semibold text-base md:text-lg px-8 py-4 rounded-sm shadow hover:opacity-90 transition"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}
