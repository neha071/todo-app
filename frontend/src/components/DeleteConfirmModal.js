export default function DeleteConfirmModal({ onConfirm, onCancel }) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Are you sure?</h3>
        <p>This todo will be permanently deleted!</p>
        <div className="modal-actions">
          <button className="btn btn-danger" onClick={onConfirm}>Yes, Delete</button>
          <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
