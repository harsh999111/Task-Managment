import { useEffect } from 'react'

function SideModal({ isOpen, onClose, children }) {
  useEffect(() => {
    if (!isOpen) {
      return undefined
    }

    function onKeyDown(event) {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) {
    return null
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="side-modal" onClick={(event) => event.stopPropagation()}>
        <button type="button" className="close-btn" onClick={onClose}>
          Close
        </button>
        {children}
      </div>
    </div>
  )
}

export default SideModal
