import { LitElement, html, css } from "lit";
import { customElement, state } from "lit/decorators.js";
import { sharedStyles } from "../styles/shared";
import rawCocktailsData from "../data/cocktails.json";
import "./drink-card";
import "./prep-queue";

const cocktailsData = (rawCocktailsData as any).default || rawCocktailsData;

@customElement("bartender-app")
export class BartenderApp extends LitElement {
  @state() recipes: any[] = cocktailsData;
  @state() searchQuery: string = "";
  @state() queue: any[] = [];
  @state() viewMode: "carousel" | "queue" = "carousel";
  @state() currentTheme: "light" | "dark" = "light";
  @state() currentIndex: number = 0;
  @state() touchStartX: number = 0;

  connectedCallback() {
    super.connectedCallback();
    const savedTheme = (localStorage.getItem("bartender_theme") as "light" | "dark") || "light";
    this.setTheme(savedTheme);
    // Listen for global keyboard arrows when on the carousel view
    window.addEventListener("keydown", this.handleKeyDown);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("keydown", this.handleKeyDown);
  }

  private setTheme = (theme: "light" | "dark") => {
    this.currentTheme = theme;
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("bartender_theme", theme);
  };

  private toggleTheme = () => {
    this.setTheme(this.currentTheme === "light" ? "dark" : "light");
  };

  private get filteredRecipes() {
    if (!this.searchQuery.trim()) return this.recipes;
    const q = this.searchQuery.toLowerCase();
    return this.recipes.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.ingredients.some((i: string) => i.toLowerCase().includes(q)),
    );
  }

  private nextCard() {
    const list = this.filteredRecipes;
    if (list.length === 0) return;
    this.currentIndex = (this.currentIndex + 1) % list.length;
  }

  private prevCard() {
    const list = this.filteredRecipes;
    if (list.length === 0) return;
    this.currentIndex = (this.currentIndex - 1 + list.length) % list.length;
  }

  private handleTouchStart(e: TouchEvent) {
    this.touchStartX = e.touches[0].clientX;
  }

  private handleTouchEnd(e: TouchEvent) {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = this.touchStartX - touchEndX;
    if (diff > 50) this.nextCard();
    else if (diff < -50) this.prevCard();
  }
  private handleKeyDown = (e: KeyboardEvent) => {
    // Only trigger if we are actively viewing the carousel
    if (this.viewMode !== "carousel") return;

    if (e.key === "ArrowRight") {
      this.nextCard();
    } else if (e.key === "ArrowLeft") {
      this.prevCard();
    }
  };

  // --- Senior Architectural Stylesheet Integration ---
  static styles = [
    sharedStyles,
    css`
      :host {
        display: flex;
        flex-direction: column;
        width: 100vw;
        height: 100vh;
        height: 100dvh;
        background-color: var(--bg-canvas);
        color: var(--text-main);
        box-sizing: border-box;
        overflow: hidden;
        padding-top: var(--safe-top);
        padding-bottom: var(--safe-bottom);
        font-family: var(--font-sans); /* Explicit declaration inside Shadow DOM */
      }

      header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: var(--space-sm) var(--space-md);
        background: var(--bg-surface);
        border-bottom: 1px solid var(--border-subtle);
        gap: var(--space-xs);
        flex-shrink: 0;
      }

      .search-input {
        flex: 1;
        padding: var(--space-sm) var(--space-md);
        border-radius: var(--radius-full);
        border: 1px solid var(--border-subtle);
        background: var(--tag-bg);
        color: var(--text-main);
        font-size: 1rem;
        outline: none;
      }

      .search-input:focus {
        border-color: var(--primary);
      }

      .header-actions {
        display: flex;
        gap: var(--space-xs);
      }

      main {
        flex: 1;
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        align-items: center;
        justify-content: center;
        padding: var(--space-md);
        overflow-y: auto;
      }

      .carousel-container {
        width: 90vw;
        height: 78dvh;
        max-width: 480px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        touch-action: pan-y;
        box-sizing: border-box;
      }
      /* Force the custom element to fill the 90% viewport container */
      drink-card {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
      }

      .carousel-controls {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        margin-top: var(--space-md);
        padding: 0 var(--space-xs);
        box-sizing: border-box;
      }

      .counter {
        font-weight: 700;
        color: var(--text-muted);
        font-size: 1.1rem;
      }

      .no-results {
        text-align: center;
        color: var(--text-muted);
        font-size: 1.1rem;
        padding: var(--space-xl);
      }
    `,
  ];

  render() {
    const list = this.filteredRecipes;
    const activeCard = list.length > 0 ? list[this.currentIndex % list.length] : null;

    return html`
      <header>
        <input
          class="search-input"
          type="text"
          placeholder="Search cocktail or ingredient..."
          .value=${this.searchQuery}
          @input=${(e: any) => {
            this.searchQuery = e.target.value;
            this.currentIndex = 0;
          }}
        />
        <div class="header-actions">
          <button class="btn btn-primary" @click=${() => (this.viewMode = "queue")}>
            Queue (${this.queue.length})
          </button>
          <button class="btn" @click=${this.toggleTheme} title="Toggle Theme">
            ${this.currentTheme === "light" ? "🌙" : "☀️"}
          </button>
        </div>
      </header>

      <main>
        ${
          this.viewMode === "queue"
            ? html`
                <prep-queue
                  .queue=${this.queue}
                  @close-queue=${() => (this.viewMode = "carousel")}
                  @remove-from-queue=${(e: CustomEvent) => {
                    this.queue = this.queue.filter((item) => item.id !== e.detail);
                  }}
                ></prep-queue>
              `
            : html`
                <div
                  class="carousel-container"
                  @touchstart=${(e: TouchEvent) => this.handleTouchStart(e)}
                  @touchend=${(e: TouchEvent) => this.handleTouchEnd(e)}
                >
                  ${
                    list.length === 0
                      ? html`
                          <div class="no-results">
                            No matching cocktails found. Try another ingredient!
                          </div>
                        `
                      : html`
                          <drink-card
                            .drink=${activeCard}
                            @add-to-queue=${(e: CustomEvent) => {
                              if (!this.queue.some((item) => item.id === e.detail.id)) {
                                this.queue = [...this.queue, e.detail];
                              }
                            }}
                          ></drink-card>

                          <div class="carousel-controls">
                            <button class="btn" @click=${() => this.prevCard()}>← Prev</button>
                            <span class="counter">
                              ${(this.currentIndex % list.length) + 1} / ${list.length}
                            </span>
                            <button class="btn" @click=${() => this.nextCard()}>Next →</button>
                          </div>
                        `
                  }
                </div>
              `
        }
      </main>
    `;
  }
}
