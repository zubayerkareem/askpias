import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Download } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DEFAULT_LEAD_MAGNET_CTA_LABEL, useSubmitLeadMagnetLead } from "@/hooks/use-lead-magnets";

const leadMagnetSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name."),
  phone: z
    .string()
    .trim()
    .regex(/^(?:\+?880|0)1[3-9]\d{8}$/, "Enter a valid Bangladeshi mobile number."),
  email: z.string().trim().email("Enter a valid email address."),
});

type LeadMagnetFormValues = z.infer<typeof leadMagnetSchema>;

type LeadMagnetFormProps = {
  noteId: string;
  ctaLabel: string | null;
  fileUrl: string;
};

export function LeadMagnetForm({ noteId, ctaLabel, fileUrl }: LeadMagnetFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const form = useForm<LeadMagnetFormValues>({
    resolver: zodResolver(leadMagnetSchema),
    defaultValues: { name: "", phone: "", email: "" },
  });
  const submitLead = useSubmitLeadMagnetLead();
  const label = ctaLabel || DEFAULT_LEAD_MAGNET_CTA_LABEL;

  const onSubmit = (values: LeadMagnetFormValues) => {
    submitLead.mutate(
      { note_id: noteId, ...values },
      {
        onSuccess: () => {
          toast.success("You're in — grab your download below.");
          setSubmitted(true);
        },
        onError: () => {
          toast.error("Something went wrong — please try again.");
        },
      },
    );
  };

  return (
    <div className="mt-10 rounded-2xl border border-border panel-card p-6 sm:p-8">
      {submitted ? (
        <div className="text-center">
          <p className="font-medium">Your download is ready.</p>
          <a
            href={fileUrl}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Download className="size-4" />
            {label}
          </a>
        </div>
      ) : (
        <>
          <p className="font-medium">Get access</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Enter your details to unlock this download.
          </p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel className="sr-only">Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Your name"
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
              <button
                type="submit"
                disabled={submitLead.isPending}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:col-span-2 sm:justify-self-end"
              >
                {submitLead.isPending ? "Submitting..." : label}
              </button>
            </form>
          </Form>
        </>
      )}
    </div>
  );
}
