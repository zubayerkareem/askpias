import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { ArrowRight, CheckCircle2 } from "lucide-react";
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

const contactSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name."),
  email: z.string().trim().email("Enter a valid email address."),
  phone: z
    .string()
    .trim()
    .regex(/^(?:\+?880|0)1[3-9]\d{8}$/, "Enter a valid Bangladeshi mobile number."),
  question: z.string().trim().min(5, "Tell me a little more about it."),
});

type ContactValues = z.infer<typeof contactSchema>;

const fieldClass =
  "h-11 rounded-lg border-line bg-page px-3 text-sm shadow-none placeholder:text-muted-foreground/70";

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const form = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", phone: "", question: "" },
  });
  const submitMessage = useSubmitMessage();

  const onSubmit = (values: ContactValues) => {
    submitMessage.mutate(values, {
      onSuccess: () => {
        analytics.lead("contact_form");
        setSent(true);
        form.reset();
      },
      onError: () => {
        toast.error("Something went wrong — please try again.");
      },
    });
  };

  if (sent) {
    return (
      <div className="flex flex-col items-start">
        <CheckCircle2 className="size-8 text-brand" />
        <h2 className="mt-4 font-display text-xl font-extrabold">Message received</h2>
        <p className="mt-2 max-w-[46ch] text-sm leading-relaxed text-muted-foreground">
          Thanks for reaching out — I&apos;ve got your message and I&apos;ll get back to you soon.
          You&apos;ll also get a confirmation in your inbox.
        </p>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="mt-5 inline-flex items-center rounded-lg border border-line px-5 py-2.5 text-sm font-bold transition-colors hover:bg-surface"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-5 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold">Name</FormLabel>
              <FormControl>
                <Input placeholder="Your name" className={fieldClass} {...field} />
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
                <Input type="email" placeholder="you@example.com" className={fieldClass} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold">Phone</FormLabel>
              <FormControl>
                <Input placeholder="01XXXXXXXXX" className={fieldClass} {...field} />
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
              <FormLabel className="text-sm font-semibold">How can I help?</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell me about your business and what you're trying to fix."
                  rows={5}
                  className="min-h-[130px] rounded-lg border-line bg-page px-3 py-2.5 text-sm shadow-none placeholder:text-muted-foreground/70"
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
          className="group inline-flex items-center justify-center gap-1.5 rounded-lg bg-brand px-5 py-3 text-sm font-bold text-brand-foreground transition-colors hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-50 sm:col-span-2 sm:justify-self-start"
        >
          {submitMessage.isPending ? "Sending…" : "Send message"}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
        </button>
      </form>
    </Form>
  );
}
