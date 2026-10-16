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
        font-family: var(--font-sans);
        box-sizing: border-box;
        overflow: hidden;
        padding-top: var(--safe-top);
        padding-bottom: var(--safe-bottom);
      }

      /* Slimmer, more compact top bar */
      header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.4rem 0.75rem;
        background: var(--bg-surface);
        border-bottom: 1px solid var(--border-subtle);
        gap: 0.4rem;
        flex-shrink: 0;
      }

      .search-input {
        flex: 1;
        padding: 0.45rem 0.85rem;
        border-radius: var(--radius-full);
        border: 1px solid var(--border-subtle);
        background: var(--tag-bg);
        color: var(--text-main);
        font-size: 0.9rem;
        outline: none;
      }

      .header-actions {
        display: flex;
        gap: 0.4rem;
      }

      /* Compact header buttons */
      header .btn {
        padding: 0.45rem 0.75rem;
        font-size: 0.85rem;
      }

      main {
        flex: 1;
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        align-items: center;
        justify-content: center;
        padding: 0.5rem;
        overflow-y: auto;
      }

      /* Maximized card view space */
      .carousel-container {
        width: 92vw;
        height: 88dvh;
        max-width: 480px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        touch-action: pan-y;
        box-sizing: border-box;
      }
      .carousel-pagination {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        width: 100%;
        padding: 4px 0;
        flex-shrink: 0;
        overflow-x: auto;
        scrollbar-width: none; /* Hide scrollbar for clean look */
      }
      carousel-pagination::-webkit-scrollbar {
        display: none;
      }

      .dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: var(--border-subtle);
        border: none;
        padding: 0;
        cursor: pointer;
        transition:
          transform 0.2s ease,
          background 0.2s ease;
      }

      .dot.active {
        background: var(--primary);
        transform: scale(1.4);
      }

      /* Streamlined minimal carousel controls */
      .carousel-controls {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        margin-top: 0.4rem;
        padding: 0 0.25rem;
        box-sizing: border-box;
      }

      .nav-btn {
        background: var(--bg-surface);
        border: 1px solid var(--border-subtle);
        color: var(--text-main);
        padding: 0.35rem 0.85rem;
        border-radius: var(--radius-sm);
        font-weight: 600;
        font-size: 0.85rem;
        cursor: pointer;
      }

      .counter {
        font-weight: 600;
        color: var(--text-muted);
        font-size: 0.95rem;
      }

      .no-results {
        text-align: center;
        color: var(--text-muted);
        font-size: 1rem;
        padding: var(--space-xl);
      }
    `,
  ];

  // Replace the render carousel block with this clean, compact pagination layout
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

                          <!-- Minimalist Pagination Dots Footer -->
                          <div class="carousel-pagination">
                            ${list.map(
                              (_, idx) => html`
                                <button
                                  class="dot ${idx === this.currentIndex % list.length ? "active" : ""}"
                                  @click=${() => (this.currentIndex = idx)}
                                  title="Go to slide ${idx + 1}"
                                ></button>
                              `,
                            )}
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
