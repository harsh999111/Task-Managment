function ToastContainer({ toasts, onRemove }) {
  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.type}`}>
          <span>{toast.message}</span>
          <button type="button" onClick={() => onRemove(toast.id)}>
            x
          </button>
        </div>
      ))}
    </div>
  )
}

export default ToastContainer
