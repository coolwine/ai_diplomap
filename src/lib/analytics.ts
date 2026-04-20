const GA_SCRIPT_BASE_URL = "https://www.googletagmanager.com/gtag/js";
const GA_MEASUREMENT_ID = "G-L9F99BDHNZ";

export function initializeGoogleAnalytics(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function gtag(...args: unknown[]) {
      window.dataLayer?.push(args);
    };

  window.gtag("js", new Date());
  window.gtag("config", GA_MEASUREMENT_ID);

  const scriptSrc = `${GA_SCRIPT_BASE_URL}?id=${GA_MEASUREMENT_ID}`;
  const existingScript = document.querySelector(`script[src="${scriptSrc}"]`);
  if (existingScript) {
    return;
  }

  const script = document.createElement("script");
  script.async = true;
  script.src = scriptSrc;
  document.head.appendChild(script);
}
