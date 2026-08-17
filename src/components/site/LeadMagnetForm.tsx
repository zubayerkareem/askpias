import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Download, Gift } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
  const [open, setOpen] = useState(false);
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
          setOpen(false);
        },
        onError: () => {
          toast.error("Something went wrong — please try again.");
        },
      },
    );
  };

  if (submitted) {
    return (
      <div className="mt-10 rounded-2xl border border-border panel-card p-6 text-center sm:p-8">
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
    );
  }

  return (
    <div className="mt-10">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="lg" className="gap-1.5">
            <Download className="size-4" />
            {label}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-accent">
            <Gift className="size-5" />
          </span>
          <DialogTitle>Get access</DialogTitle>
          <DialogDescription>Enter your details to unlock this download.</DialogDescription>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your name" {...field} />
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
                    <FormLabel>Phone number</FormLabel>
                    <FormControl>
                      <Input placeholder="01XXXXXXXXX" {...field} />
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
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={submitLead.isPending} className="w-full">
                {submitLead.isPending ? "Submitting..." : label}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
