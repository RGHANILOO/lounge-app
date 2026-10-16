import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { renderIceIcon, renderMethodIcon } from "./icons";

@customElement("prep-queue")
export class PrepQueue extends LitElement {
  @property({ type: Array }) accessor queue: any[] = [];

  static styles = css`
    :host {
      display: block;
      padding: 1rem;
      box-sizing: border-box;
      max-width: 600px;
      margin: 0 auto;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }
    h2 {
      margin: 0;
      font-size: 1.5rem;
    }
    .back-btn {
      background: transparent;
      border: 1px solid var(--border-color);
      color: var(--text-main);
      padding: 0.5rem 1rem;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
    }
    .queue-list {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .queue-card {
      background: var(--card-bg);
      border: 2px solid var(--primary);
      border-radius: var(--radius);
      padding: 1.5rem;
      box-shadow: var(--shadow);
    }
    .queue-title {
      font-size: 1.5rem;
      font-weight: 800;
      margin: 0 0 0.75rem 0;
    }
    .specs {
      display: flex;
      gap: 1rem;
      font-size: 0.95rem;
      font-weight: 600;
      margin-bottom: 1rem;
      background: var(--tag-bg);
      padding: 0.5rem;
      border-radius: 8px;
    }
    ul {
      margin: 0 0 1rem 0;
      padding-left: 1.25rem;
    }
    li {
      font-size: 1.15rem;
      font-weight: 600;
      margin-bottom: 0.3rem;
    }
    .complete-btn {
      background: #10b981;
      color: #ffffff;
      border: none;
      width: 100%;
      padding: 1rem;
      border-radius: 12px;
      font-size: 1.1rem;
      font-weight: 700;
      cursor: pointer;
    }
    .complete-btn:hover {
      background: #059669;
    }
    .empty {
      text-align: center;
      color: var(--text-muted);
      font-size: 1.2rem;
      margin-top: 3rem;
    }
  `;

  private _complete = (id: string) => {
    this.dispatchEvent(
      new CustomEvent("remove-from-queue", {
        detail: id,
        bubbles: true,
        composed: true,
      }),
    );
  };

  render() {
    return html`
      <div class="header">
        <h2>Prep & Learning Queue (${this.queue.length})</h2>
        <button
          class="back-btn"
          @click=${() => this.dispatchEvent(new CustomEvent("close-queue", { bubbles: true, composed: true }))}
        >
          ← Back to Menu
        </button>
      </div>

      ${
        this.queue.length === 0
          ? html`
              <div class="empty">
                Your queue is empty. Add recipes from the carousel to use as cards while learning!
              </div>
            `
          : html`
              <div class="queue-list">
                ${this.queue.map(
                  (item) => html`
                    <div class="queue-card">
                      <div class="queue-title">${item.name}</div>
                      <div class="specs">
                        <span>🍹 ${item.glass}</span>
                        <span>${renderMethodIcon(item.method)} ${item.method}</span>
                        <span>${renderIceIcon(item.ice)} ${item.ice}</span>
                      </div>
                      <ul>
                        ${item.ingredients.map((ing: string) => html`<li>${ing}</li>`)}
                      </ul>
                      <div
                        style="margin-bottom: 1rem; font-size: 0.95rem; color: var(--text-muted);"
                      >
                        <strong>Garnish:</strong> ${item.garnish}
                      </div>
                      <button class="complete-btn" @click=${() => this._complete(item.id)}>
                        Complete & Remove
                      </button>
                    </div>
                  `,
                )}
              </div>
            `
      }
    `;
  }
}
