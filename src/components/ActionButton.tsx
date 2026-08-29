import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  readonly children: ReactNode;
  readonly variant?: "primary" | "secondary" | "danger";
  readonly pulse?: boolean;
}

export const ActionButton = forwardRef<HTMLButtonElement, ActionButtonProps>(
  function ActionButton({ children, variant = "primary", pulse = false, className = "", ...rest }, ref) {
    const classes = ["action-button", `action-button--${variant}`, pulse ? "gi-pulse" : "", className]
      .filter(Boolean)
      .join(" ");
    return (
      <button ref={ref} type="button" className={classes} {...rest}>
        {pulse ? (
          <span className="required-badge" aria-hidden="true">
            필수
          </span>
        ) : null}
        {children}
      </button>
    );
  }
);
