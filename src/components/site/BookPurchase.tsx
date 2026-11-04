import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { CreditCard, Download } from "lucide-react";
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
import { analytics } from "@/lib/analytics";
import { useCheckoutBook } from "@/hooks/use-payments";

const checkoutSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name."),
  phone: z
    .string()
    .trim()
    .regex(/^(?:\+?880|0)1[3-9]\d{8}$/, "Enter a valid Bangladeshi mobile number."),
  email: z.string().trim().email("Enter a valid email address."),
});

type CheckoutValues = z.infer<typeof checkoutSchema>;

export function BookPurchase({
  slug,
  title,
  price,
}: {
  slug: string;
  title: string;
  price: number;
}) {
  const [open, setOpen] = useState(false);
  const checkout = useCheckoutBook();

  const form = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { name: "", phone: "", email: "" },
  });

  const onSubmit = (values: CheckoutValues) => {
    analytics.beginCheckout(price, [
      { item_id: slug, item_name: title, item_category: "ebook", price },
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
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="h-11 w-full gap-2 rounded-lg px-5 lg:w-auto">
          <CreditCard className="size-4" />
          Buy the book — ৳{price}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-accent">
          <Download className="size-5" />
        </span>
        <DialogTitle>Buy &ldquo;{title}&rdquo;</DialogTitle>
        <DialogDescription>
          Enter your details — you&rsquo;ll be taken to a secure UddoktaPay checkout (bKash, Nagad,
          Rocket, bank). The download opens right after payment, and we email the link too.
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
            <Button type="submit" disabled={checkout.isPending} className="w-full">
              {checkout.isPending ? "Redirecting to payment..." : `Pay ৳${price}`}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
