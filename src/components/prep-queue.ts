import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import "./drink-card";

@customElement("prep-queue")
export class PrepQueue extends LitElement {
  @property({ type: Array }) queue: any[] = [];

  private handleClose = () => {
    this.dispatchEvent(new CustomEvent("close-queue", { bubbles: true, composed: true }));
  };

  private handleRemove = (id: string) => {
    this.dispatchEvent(
      new CustomEvent("remove-from-queue", {
        detail: id,
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
      box-sizing: border-box;
      overflow: hidden;
    }

    .queue-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--space-xs) var(--space-md);
      background: var(--bg-surface);
      border-bottom: 1px solid var(--border-subtle);
      flex-shrink: 0;
    }

    .queue-title {
      font-family: var(--font-display);
      font-size: 1.2rem;
      font-weight: 800;
      color: var(--text-main);
      margin: 0;
    }

    .queue-body {
      flex: 1;
      overflow-y: auto;
      padding: var(--space-md);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-lg);
      box-sizing: border-box;
    }

    .queue-item-wrapper {
      width: 92vw;
      max-width: 480px;
      height: 75dvh;
      max-height: 650px;
      position: relative;
      flex-shrink: 0;
    }

    .complete-btn {
      position: absolute;
      top: var(--space-sm);
      right: var(--space-sm);
      z-index: 10;
      background: #16a34a;
      color: #ffffff;
      border: none;
      padding: 0.4rem 0.8rem;
      border-radius: var(--radius-sm);
      font-weight: 700;
      font-size: 0.85rem;
      cursor: pointer;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
    }

    .empty-queue {
      text-align: center;
      color: var(--text-muted);
      font-size: 1.1rem;
      margin-auto: auto;
      padding: var(--space-xl);
    }
  `;

  render() {
    return html`
      <div class="queue-header">
        <button class="btn" @click=${this.handleClose}>← Back to Menu</button>
        <h2 class="queue-title">Prep Queue (${this.queue.length})</h2>
      </div>

      <div class="queue-body">
        ${
          this.queue.length === 0
            ? html`<div class="empty-queue">
                Your Prep Queue is empty! Add drinks from the menu to build them here.
              </div>`
            : this.queue.map(
                (drink) => html`
                  <div class="queue-item-wrapper">
                    <button class="complete-btn" @click=${() => this.handleRemove(drink.id)}>
                      ✓ Complete
                    </button>
                    <drink-card .drink=${drink}></drink-card>
                  </div>
                `,
              )
        }
      </div>
    `;
  }
}
