import { useRef, useState } from "react";
import { UpdateHistoryDialog } from "./UpdateHistoryDialog";

export function UpdateHistoryButton() {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const close = () => {
    setOpen(false);
    buttonRef.current?.focus();
  };

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className="update-history-button"
        onClick={() => setOpen(true)}
      >
        업데이트 내역
      </button>
      <UpdateHistoryDialog open={open} onClose={close} />
    </>
  );
}
