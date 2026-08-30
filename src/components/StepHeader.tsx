import type { ReactNode, RefObject } from "react";

interface StepHeaderProps {
  readonly eyebrow: string;
  readonly title: ReactNode;
  readonly headingRef: RefObject<HTMLHeadingElement>;
  readonly onBack?: () => void;
}

export function StepHeader({ eyebrow, title, headingRef, onBack }: StepHeaderProps) {
  return (
    <div className="step-header">
      <div className="step-heading-copy">
        <p className="step-eyebrow">{eyebrow}</p>
        <h1 id="step-heading" ref={headingRef} tabIndex={-1} className="step-title">
          {title}
        </h1>
      </div>
      {onBack ? (
        <button type="button" className="back-button" onClick={onBack}>
          <svg aria-hidden="true" viewBox="0 0 20 20" width="20" height="20">
            <path d="M12.5 4.5 7 10l5.5 5.5M7.5 10h8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          이전 단계
        </button>
      ) : null}
    </div>
  );
}
