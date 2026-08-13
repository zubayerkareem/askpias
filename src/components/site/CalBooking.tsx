import { useEffect, useRef } from "react";

// Verbatim Cal.com inline embed snippet (namespace "askpias", calLink
// "pias-ahmed-2wfutv/askpias"). Injected as a real <script> element on mount
// so it executes (React's dangerouslySetInnerHTML would not run a <script> tag).
const CAL_EMBED_SCRIPT = `
(function (C, A, L) {
  let p = function (a, ar) { a.q.push(ar); };
  let d = C.document;
  C.Cal = C.Cal || function () {
    let cal = C.Cal;
    let ar = arguments;
    if (!cal.loaded) {
      cal.ns = {};
      cal.q = cal.q || [];
      d.head.appendChild(d.createElement("script")).src = A;
      cal.loaded = true;
    }
    if (ar[0] === L) {
      const api = function () { p(api, arguments); };
      const namespace = ar[1];
      api.q = api.q || [];
      if (typeof namespace === "string") {
        cal.ns[namespace] = cal.ns[namespace] || api;
        p(cal.ns[namespace], ar);
        p(cal, ["initNamespace", namespace]);
      } else p(cal, ar);
      return;
    }
    p(cal, ar);
  };
})(window, "https://app.cal.com/embed/embed.js", "init");
Cal("init", "askpias", { origin: "https://app.cal.com" });
Cal.config = Cal.config || {};
Cal.config.forwardQueryParams = true;
Cal.ns.askpias("inline", {
  elementOrSelector: "#my-cal-inline-askpias",
  config: { layout: "month_view", useSlotsViewOnSmallScreen: "true" },
  calLink: "pias-ahmed-2wfutv/askpias",
});
Cal.ns.askpias("ui", {
  cssVarsPerTheme: {
    light: { "cal-brand": "#7543DD" },
    dark: { "cal-brand": "#7543DD" },
  },
  hideEventTypeDetails: false,
  layout: "month_view",
});
`;

/** Real Cal.com scheduling widget, replacing the previous mock calendar. */
export function CalBooking() {
  const injected = useRef(false);

  useEffect(() => {
    if (injected.current) return;
    injected.current = true;
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.text = CAL_EMBED_SCRIPT;
    document.body.appendChild(script);
  }, []);

  return (
    <div
      id="my-cal-inline-askpias"
      style={{ width: "100%", height: "100%", overflow: "scroll" }}
    />
  );
}
