import { ArrowRight, HelpCircle } from "lucide-react";
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

const messageSchema = z.object({
  phone: z
    .string()
    .trim()
    .regex(/^(?:\+?880|0)1[3-9]\d{8}$/, "Enter a valid Bangladeshi mobile number."),
  email: z.string().trim().email("Enter a valid email address."),
  question: z.string().trim().min(1, "Please enter your question."),
});

type MessageForm = z.infer<typeof messageSchema>;

export function AskAnything() {
  const form = useForm<MessageForm>({
    resolver: zodResolver(messageSchema),
    defaultValues: { phone: "", email: "", question: "" },
  });
  const submitMessage = useSubmitMessage();

  const onSubmit = (values: MessageForm) => {
    submitMessage.mutate(values, {
      onSuccess: () => {
        toast.success("Question sent — you'll hear back from me soon.");
        form.reset();
      },
      onError: () => {
        toast.error("Something went wrong — please try again.");
      },
    });
  };

  return (
    <section className="mx-auto max-w-6xl px-5 pb-24">
      <div className="panel flex flex-col gap-8 p-7 sm:p-8 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-center gap-4 lg:max-w-xs">
          <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/20 text-accent">
            <HelpCircle className="size-6" />
          </span>
          <div>
            <h2 className="text-xl">Ask me anything</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Got a question about marketing or growth? Leave your contact info and I&apos;ll get
              back to you.
            </p>
          </div>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid w-full gap-4 sm:grid-cols-2 lg:max-w-xl"
          >
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">Phone number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="01XXXXXXXXX"
                      className="rounded-xl border-border bg-surface-2"
                      {...field}
                    />
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
                  <FormLabel className="sr-only">Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      className="rounded-xl border-border bg-surface-2"
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
                  <FormLabel className="sr-only">Your question</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Type your question..."
                      rows={3}
                      className="rounded-xl border-border bg-surface-2"
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
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:col-span-2 sm:justify-self-end"
            >
              {submitMessage.isPending ? "Sending..." : "Send"}
              <ArrowRight className="size-4" />
            </button>
          </form>
        </Form>
      </div>
    </section>
  );
}
