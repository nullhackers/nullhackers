export default function Pagination({ currentPage, totalPages, onPageChange }) {
  return (
    <div className="pagination" role="navigation" aria-label="Projects pagination">
      <button
        className="pagination__btn glass"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
        Previous
      </button>

      <div className="pagination__info mono">
        <span className="pagination__current">{currentPage}</span>
        <span className="pagination__sep">/</span>
        <span className="pagination__total">{totalPages}</span>
      </div>

      <button
        className="pagination__btn glass"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        Next
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </button>
    </div>
  );
}
