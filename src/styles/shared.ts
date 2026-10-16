// src/styles/shared.ts
import { css } from "lit";

export const sharedStyles = css`
  /* Standard Mobile Touch Button */
  .btn {
    background: var(--tag-bg);
    border: 1px solid var(--border-subtle);
    color: var(--text-main);
    padding: var(--space-sm) var(--space-md);
    border-radius: var(--radius-md);
    font-weight: 700;
    font-size: 1rem;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-xs);
    transition:
      background 0.2s ease,
      transform 0.1s ease;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
  }

  .btn:active {
    transform: scale(0.97);
  }

  .btn-primary {
    background: var(--primary);
    color: var(--primary-contrast);
    border-color: transparent;
  }

  .btn-primary:hover {
    background: var(--primary-hover);
  }
`;
