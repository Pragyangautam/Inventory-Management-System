function FormModal({ title, children, onSave, onClose, saveText = "Save" }) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>{title}</h2>
        </div>

        <div className="modal-body">{children}</div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>

          <button className="btn btn-primary" onClick={onSave}>
            {saveText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default FormModal;
