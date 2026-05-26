export default function DeleteConfirmModal({ onConfirm, onCancel }) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Pakka Delete Karna Hai?</h3>
        <p>Ye todo hamesha ke liye delete ho jayega!</p>
        <div className="modal-actions">
          <button className="btn btn-danger" onClick={onConfirm}>Haan, Delete Karo</button>
          <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
