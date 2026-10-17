import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("drink-card")
export class DrinkCard extends LitElement {
  @property({ type: Object }) drink: any = null;

  private handleAdd = () => {
    this.dispatchEvent(
      new CustomEvent("add-to-queue", {
        detail: this.drink,
        bubbles: true,
        composed: true,
      }),
    );
  };

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-lg);
      padding: var(--space-lg);
      box-sizing: border-box;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2);
      overflow: hidden; /* Prevents outer card overflow */
      font-family: var(--font-sans); /* Explicit declaration inside Shadow DOM */
    }

    /* --- 1. Fixed Header --- */
    .card-header {
      display: flex;
      flex-direction: column;
      gap: var(--space-2xs);
      flex-shrink: 0; /* Never shrinks or moves */
    }

    .category-tag {
      align-self: flex-start;
      background: var(--tag-bg);
      color: var(--primary);
      padding: 0.2rem var(--space-xs);
      border-radius: var(--radius-sm);
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    h2 {
      margin: 0;
      font-family: var(--font-display);
      font-size: 1.8rem;
      font-weight: 800;
      color: var(--text-main);
      line-height: 1.1;
      letter-spacing: -0.01em;
    }

    /* --- 2. Scrollable Middle Body --- */
    .card-body {
      flex: 1; /* Takes up all available middle space */
      overflow-y: auto; /* Internal scrolling for long lists */
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
      margin-top: var(--space-md);
      margin-bottom: var(--space-md);
      padding-right: var(--space-2xs);
      scrollbar-width: thin;
    }

    .meta-badges {
      display: flex;
      gap: var(--space-xs);
      flex-wrap: wrap;
    }

    .badge {
      background: var(--tag-bg);
      border: 1px solid var(--border-subtle);
      padding: var(--space-xs) var(--space-sm);
      border-radius: var(--radius-md);
      font-size: 0.9rem;
      color: var(--text-main);
    }

    .ingredients-section h3 {
      font-size: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-muted);
      margin-bottom: var(--space-xs);
    }

    ul {
      margin: 0;
      padding-left: 1.2rem;
      color: var(--text-main);
      font-size: 1.1rem;
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }

    .garnish {
      font-size: 0.95rem;
      color: var(--text-muted);
      font-style: italic;
    }

    /* --- 3. Statically Pinned Footer --- */
    .card-footer {
      flex-shrink: 0; /* Forces footer to stay locked at the bottom */
      border-top: 1px solid var(--border-subtle);
      padding-top: var(--space-md);
      display: flex;
      align-items: center;
      background: var(--bg-surface); /* Prevents scroll content from bleeding underneath */
    }

    .btn-action {
      width: 100%;
      background: var(--primary);
      color: var(--primary-contrast);
      border: none;
      padding: var(--space-xs);
      border-radius: var(--radius-md);
      font-weight: 700;
      font-size: 0.95rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-xs);
      transition:
        background 0.2s ease,
        transform 0.1s ease;
      -webkit-tap-highlight-color: transparent;
    }

    .btn-action:active {
      transform: scale(0.98);
    }
  `;

  render() {
    if (!this.drink) return html``;

    return html`
      <!-- HEADER -->
      <div class="card-header">
        <span class="category-tag">${this.drink.category || "Cocktail"}</span>
        <h2>${this.drink.name}</h2>
      </div>

      <!-- SCROLLABLE BODY -->
      <div class="card-body">
        <div class="meta-badges">
          <span class="badge">🧊 ${this.drink.ice || "Cubed"}</span>
          <span class="badge">🍸 ${this.drink.method || "Standard"}</span>
        </div>

        <div class="ingredients-section">
          <h3>Ingredients</h3>
          <ul>
            ${this.drink.ingredients.map((ing: string) => html`<li>${ing}</li>`)}
          </ul>
        </div>

        ${this.drink.garnish ? html`<div class="garnish">Garnish: ${this.drink.garnish}</div>` : ""}
      </div>

      <!-- PINNED FOOTER -->
      <div class="card-footer">
        <button class="btn-action" @click=${this.handleAdd}>+ Add to Prep Queue</button>
      </div>
    `;
  }
}
