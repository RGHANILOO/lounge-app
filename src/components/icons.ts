import { html } from "lit";

export function renderIceIcon(ice: string) {
  const isCrushed = ice.toLowerCase().includes("crushed");
  const isNone = ice.toLowerCase().includes("none");

  if (isNone) {
    return html`
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <circle cx="12" cy="12" r="9"></circle>
        <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
      </svg>
    `;
  }
  if (isCrushed) {
    return html`
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <path d="M4 14l4-4 4 4 4-4 4 4"></path>
        <path d="M4 18l4-4 4 4 4-4 4 4"></path>
        <rect x="3" y="6" width="18" height="14" rx="2"></rect>
      </svg>
    `;
  }
  // Cubed Default
  return html`
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
    >
      <rect x="3" y="3" width="18" height="18" rx="2"></rect>
      <path d="M3 9h18"></path>
      <path d="M9 3v18"></path>
    </svg>
  `;
}

export function renderMethodIcon(method: string) {
  const isBuild = method.toLowerCase().includes("build");
  if (isBuild) {
    return html`
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <path d="M7 2h10l-1.5 18h-7z"></path>
        <path d="M9 10h6"></path>
      </svg>
    `;
  }
  // Shake & Strain
  return html`
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
    >
      <path d="M6 2h12l-2 8H8L6 2z"></path>
      <path d="M8 10l-3 12h14l-3-12"></path>
      <circle cx="12" cy="16" r="1"></circle>
    </svg>
  `;
}
