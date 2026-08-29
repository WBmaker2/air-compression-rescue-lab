import { ModalDialog } from "./ModalDialog";
import { UPDATE_HISTORY } from "../update/updateHistory";

interface UpdateHistoryDialogProps {
  readonly open: boolean;
  readonly onClose: () => void;
}

export function UpdateHistoryDialog({ open, onClose }: UpdateHistoryDialogProps) {
  return (
    <ModalDialog open={open} title="업데이트 내역" onClose={onClose}>
      <ul className="update-history-list">
        {UPDATE_HISTORY.map((entry) => (
          <li key={`${entry.date}-${entry.description}`}>
            <strong>{entry.date}</strong> — {entry.description}
          </li>
        ))}
      </ul>
    </ModalDialog>
  );
}
