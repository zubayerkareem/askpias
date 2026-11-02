import { ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSubmitMessage } from "@/hooks/use-messages";
import { analytics } from "@/lib/analytics";

const messageSchema = z.object({
  phone: z
    .string()
    .trim()
    .regex(/^(?:\+?880|0)1[3-9]\d{8}$/, "Enter a valid Bangladeshi mobile number."),
  email: z.string().trim().email("Enter a valid email address."),
  question: z.string().trim().min(1, "Please enter your question."),
});

type MessageForm = z.infer<typeof messageSchema>;

const fieldClass =
  "h-11 rounded-lg border-line bg-page px-3 text-sm shadow-none placeholder:text-muted-foreground/70";

export function AskAnything() {
  const form = useForm<MessageForm>({
    resolver: zodResolver(messageSchema),
    defaultValues: { phone: "", email: "", question: "" },
  });
  const submitMessage = useSubmitMessage();

  const onSubmit = (values: MessageForm) => {
    submitMessage.mutate(values, {
      onSuccess: () => {
        analytics.lead("ask_me_anything");
        toast.success("Question sent — you'll hear back from me soon.");
        form.reset();
      },
      onError: () => {
        toast.error("Something went wrong — please try again.");
      },
    });
  };

  return (
    <section className="px-6 py-10 sm:px-10 lg:px-16 lg:py-14 xl:px-20">
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12">
        <div>
          <h2 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
            Ask me anything
          </h2>
          <p className="mt-3 max-w-[36ch] text-sm leading-relaxed text-muted-foreground">
            A question about marketing or growth? Leave your details and I&apos;ll reply personally.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid w-full gap-5 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">Phone number</FormLabel>
                  <FormControl>
                    <Input placeholder="01XXXXXXXXX" className={fieldClass} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      className={fieldClass}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel className="text-sm font-semibold">Your question</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="What's on your mind?"
                      rows={4}
                      className="min-h-[112px] rounded-lg border-line bg-page px-3 py-2.5 text-sm shadow-none placeholder:text-muted-foreground/70"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <button
              type="submit"
              disabled={submitMessage.isPending}
              className="group inline-flex items-center justify-center gap-1.5 rounded-lg bg-brand px-5 py-3 text-sm font-bold text-brand-foreground transition-colors hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-50 sm:col-span-2 sm:justify-self-end"
            >
              {submitMessage.isPending ? "Sending…" : "Send question"}
              <ArrowRight
                className="size-4 transition-transform group-hover:translate-x-1"
                aria-hidden
              />
            </button>
          </form>
        </Form>
      </div>
    </section>
  );
}
