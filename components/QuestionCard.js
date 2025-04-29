import { Sparkles } from "lucide-react";

export default function QuestionCard({ question }) {
  return (
    <div className="flex items-center gap-3">
      <Sparkles className="w-5 h-5 text-neutral-500" />
      <h1 className="text-2xl font-semibold text-neutral-900 leading-snug tracking-tight">
        {question}
      </h1>
    </div>
  );
}
