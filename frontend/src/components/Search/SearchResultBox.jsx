import "./SearchResultBox.css";

function SearchResultBox({ keyword, onBack }) {
  return (
    <div className="search-result-wrapper">
      {/* 🔙 왼쪽 상단 뒤로가기 버튼 */}
      <button className="back-btn" onClick={onBack}>
        <svg
          viewBox="0 0 24 24"
          className="back-icon"
          aria-hidden="true"
        >
          <path
            d="M15 6l-6 6 6 6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div className="search-result-content">
        <p className="keyword-text">
          🔍 "<strong>{keyword}</strong>" 검색 결과입니다.
        </p>

        <p className="no-result">아직 검색 기능은 연결되지 않았어요!</p>
      </div>
    </div>
  );
}

export default SearchResultBox;
