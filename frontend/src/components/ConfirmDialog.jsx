import { useState } from 'react';
import Modal from './Modal.jsx';

export default function ConfirmDialog({ title, message, confirmLabel = 'Delete', onConfirm, onCancel }) {
  const [busy, setBusy] = useState(false);

  const handleConfirm = async () => {
    setBusy(true);
    await onConfirm();
    setBusy(false);
  };

  return (
    <Modal title={title} onClose={onCancel}>
      <p className="muted">{message}</p>
      <div className="modal-actions">
        <button className="btn btn-ghost" onClick={onCancel} disabled={busy}>Cancel</button>
        <button className="btn btn-danger" onClick={handleConfirm} disabled={busy}>
          {busy ? 'Deleting...' : confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
