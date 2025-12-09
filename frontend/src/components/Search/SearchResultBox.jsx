import { useEffect, useState } from "react";
import axios from "axios";
import "./SearchResultBox.css";

function SearchResultBox({ keyword, onBack, onSelectDate }) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 yyyy-mm-dd 포맷으로 변환 (카드에서 인식 가능)
  const formatFullDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  // 🔥 화면에 표시할 짧은 날짜 (yy-mm-dd)
  const formatShortDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const yy = String(date.getFullYear()).slice(2);
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yy}-${mm}-${dd}`;
  };

  useEffect(() => {
    const userId = localStorage.getItem("anon_user_id");
    if (!userId) return;

    setLoading(true);

    axios
      .get(`/api/todo/search/${userId}/${keyword}`)
      .then((res) => setResults(res.data))
      .catch((err) => console.error("검색 오류:", err))
      .finally(() => setLoading(false));
  }, [keyword]);

  return (
    <div className="search-result-wrapper fade-slide">

      <button className="back-btn" onClick={onBack}>
        <svg viewBox="0 0 24 24" className="back-icon">
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

        {loading && <p>검색 중...</p>}
        {!loading && results.length === 0 && (
          <p className="no-result">검색 결과가 없습니다 🥲</p>
        )}

        {!loading && results.length > 0 && (
          <ul className="search-list">
            {results.map((item) => {
              const fullDate = formatFullDate(item.created_date); // ← 실제 데이터 전달용
              const shortDate = formatShortDate(item.created_date); // ← 화면 출력용

              return (
                <li
                  key={item.id}
                  className="search-item"
                  onClick={() => {
                    console.log("📌 검색 결과 클릭됨! 전달되는 날짜:", fullDate);
                    onSelectDate && onSelectDate(fullDate);
                  }}
                >
                  <span className="search-text">{item.text}</span>
                  <span className="search-date">{shortDate}</span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

export default SearchResultBox;
