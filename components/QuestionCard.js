import { Sparkles } from "lucide-react";

export default function QuestionCard({ question }) {
  return (
    <div className="flex items-center gap-3">
      <Sparkles className="w-6 h-6 text-purple-500" />
      <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
        {question}
      </h1>
    </div>
  );
}
