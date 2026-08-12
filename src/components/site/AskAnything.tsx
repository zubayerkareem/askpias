import { ArrowRight, HelpCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function AskAnything() {
  const [question, setQuestion] = useState("");

  return (
    <section className="mx-auto max-w-6xl px-5 pb-24">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!question.trim()) return;
          toast.success("Question sent — you'll hear back from me soon.");
          setQuestion("");
        }}
        className="panel flex flex-col gap-6 p-7 sm:p-8 lg:flex-row lg:items-center lg:justify-between"
      >
        <div className="flex items-center gap-4">
          <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/20 text-accent">
            <HelpCircle className="size-6" />
          </span>
          <div>
            <h2 className="text-xl">Ask me anything</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Got a question about marketing or growth?
            </p>
          </div>
        </div>

        <div className="flex w-full max-w-md items-center gap-2 rounded-xl border border-border bg-surface-2 p-1.5">
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Type your question..."
            aria-label="Your question"
            className="w-full bg-transparent px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
          <button
            type="submit"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Send
            <ArrowRight className="size-4" />
          </button>
        </div>
      </form>
    </section>
  );
}
