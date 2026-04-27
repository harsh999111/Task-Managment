function Pagination({ currentPage, totalPages, totalItems, onPageChange, disabled }) {
  if (totalPages <= 1) {
    return null
  }

  const pages = []
  const start = Math.max(1, currentPage - 2)
  const end = Math.min(totalPages, currentPage + 2)

  for (let page = start; page <= end; page += 1) {
    pages.push(page)
  }

  return (
    <div className="pagination">
      <p className="page-info">
        Page {currentPage} of {totalPages} ({totalItems} results)
      </p>

      <button
        type="button"
        disabled={disabled || currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Previous
      </button>

      {start > 1 && <span>...</span>}

      {pages.map((page) => (
        <button
          key={page}
          type="button"
          disabled={disabled}
          className={page === currentPage ? 'active' : ''}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}

      {end < totalPages && <span>...</span>}

      <button
        type="button"
        disabled={disabled || currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </button>
    </div>
  )
}

export default Pagination
