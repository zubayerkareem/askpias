import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { CreditCard, Download, Gift } from "lucide-react";
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
import { api } from "@/lib/api";
import { analytics } from "@/lib/analytics";
import { useCheckoutLead } from "@/hooks/use-payments";

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
  noteId: number;
  slug: string;
  title: string;
  ctaLabel: string | null;
  fileUrl: string;
  paymentRequired?: boolean;
  price?: number | null;
};

export function LeadMagnetForm({
  noteId,
  slug,
  title,
  ctaLabel,
  fileUrl,
  paymentRequired = false,
  price = null,
}: LeadMagnetFormProps) {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const label = ctaLabel || "Download";
  const paid = paymentRequired && typeof price === "number" && price > 0;
  const buttonLabel = paid ? `${label} — ৳${price}` : label;

  const form = useForm<LeadMagnetFormValues>({
    resolver: zodResolver(leadMagnetSchema),
    defaultValues: { name: "", phone: "", email: "" },
  });

  const submitLead = useMutation({
    mutationFn: (values: LeadMagnetFormValues) =>
      api.post<{ download_url: string | null }>("/leads", { ...values, note_id: noteId, slug }),
  });

  const checkout = useCheckoutLead();
  const isPending = submitLead.isPending || checkout.isPending;

  const onSubmit = (values: LeadMagnetFormValues) => {
    if (paid) {
      analytics.beginCheckout(price, [
        { item_id: slug, item_name: title, item_category: "lead_magnet", price },
      ]);

      checkout.mutate(
        { ...values, slug },
        {
          onSuccess: ({ payment_url }) => {
            window.location.href = payment_url;
          },
          onError: () => {
            toast.error("Could not start the payment — please try again.");
          },
        },
      );
      return;
    }

    submitLead.mutate(values, {
      onSuccess: () => {
        analytics.lead("lead_magnet", {
          item: { item_id: slug, item_name: label, item_category: "download" },
        });
        toast.success("You're in — grab your download below.");
        setSubmitted(true);
        setOpen(false);
      },
      onError: () => {
        toast.error("Something went wrong — please try again.");
      },
    });
  };

  if (submitted) {
    return (
      <div className="mt-10 rounded-xl border border-sheet-border p-6 text-center sm:p-8">
        <p className="font-display font-extrabold">Your download is ready.</p>
        <a
          href={fileUrl}
          download
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center justify-center gap-1.5 rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-brand-foreground transition-colors hover:bg-brand/90"
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
            {paid ? <CreditCard className="size-4" /> : <Download className="size-4" />}
            {buttonLabel}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-accent">
            <Gift className="size-5" />
          </span>
          <DialogTitle>{paid ? `Buy for ৳${price}` : "Get access"}</DialogTitle>
          <DialogDescription>
            {paid
              ? "Enter your details — you'll be taken to a secure UddoktaPay checkout (bKash, Nagad, Rocket, bank)."
              : "Enter your details to unlock this download."}
          </DialogDescription>

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
              <Button type="submit" disabled={isPending} className="w-full">
                {isPending
                  ? paid
                    ? "Redirecting to payment..."
                    : "Submitting..."
                  : paid
                    ? `Pay ৳${price}`
                    : label}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
