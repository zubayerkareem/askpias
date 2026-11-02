/**
 * Google Tag Manager dataLayer helpers.
 *
 * Every event is pushed onto `window.dataLayer`, so any GTM tag (Meta Pixel,
 * Conversions API, GA4, Google Ads…) can fire from it. The container ID is set
 * in the admin (Site settings → Analytics) or via VITE_GTM_ID.
 */

type DataLayerPayload = Record<string, unknown>;

declare global {
  interface Window {
    dataLayer?: DataLayerPayload[];
  }
}

export function dataLayerPush(payload: DataLayerPayload): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
}

export function pushEvent(event: string, params: DataLayerPayload = {}): void {
  dataLayerPush({ event, ...params });
}

export type AnalyticsItem = {
  item_id: string;
  item_name: string;
  item_category?: string;
  price?: number;
  quantity?: number;
};

export const CURRENCY = "BDT";

function ecommerce(event: string, value: number, items: AnalyticsItem[], extra: DataLayerPayload = {}) {
  pushEvent(event, {
    ...extra,
    ecommerce: {
      currency: CURRENCY,
      value,
      items: items.map((item) => ({ quantity: 1, ...item })),
    },
  });
}

export const analytics = {
  /** SPA route change. */
  pageView(path: string, title?: string) {
    pushEvent("page_view", {
      page_path: path,
      page_location: typeof window === "undefined" ? undefined : window.location.href,
      page_title: title ?? (typeof document === "undefined" ? undefined : document.title),
    });
  },

  /** A visitor opened an item (note, case study, ebook). */
  viewItem(item: AnalyticsItem, listName?: string) {
    ecommerce("view_item", item.price ?? 0, [item], listName ? { item_list_name: listName } : {});
  },

  /** A visitor clicked an item in a list. */
  selectItem(item: AnalyticsItem, listName: string) {
    ecommerce("select_item", item.price ?? 0, [item], { item_list_name: listName });
  },

  /** Started a checkout / purchase intent. */
  beginCheckout(value: number, items: AnalyticsItem[]) {
    ecommerce("begin_checkout", value, items);
  },

  /** Completed purchase (wire up when a payment gateway is re-enabled). */
  purchase(transactionId: string, value: number, items: AnalyticsItem[]) {
    ecommerce("purchase", value, items, { transaction_id: transactionId });
  },

  /** A form produced a lead — the main conversion of this site. */
  lead(formName: string, extra: { value?: number; item?: AnalyticsItem } = {}) {
    pushEvent("generate_lead", {
      form_name: formName,
      currency: CURRENCY,
      value: extra.value ?? 0,
      ...(extra.item ? { item_id: extra.item.item_id, item_name: extra.item.item_name } : {}),
    });
  },

  /** Generic CTA click. */
  cta(label: string, location: string) {
    pushEvent("cta_click", { cta_label: label, cta_location: location });
  },
};
