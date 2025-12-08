import { useState } from "react";

import Card from "../components/Card/Card";
import Calendar from "../components/Calendar/Calendar";
import Search from "../components/Search/Search";
import SearchResultBox from "../components/Search/SearchResultBox";

import "./Home.css";

function Home() {
  const [isSearching, setIsSearching] = useState(false);
  const [keyword, setKeyword] = useState("");

  /* 🔥 선택된 날짜 저장 */
  const [selectedDate, setSelectedDate] = useState(null);

  /* 🔥 날짜 포맷 함수 — 한국 시간 유지 */
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="home-container">
      <div className="layout-wrapper">

        {/* 왼쪽 카드 — 날짜 전달 */}
        <Card selectedDate={selectedDate} />

        {/* 오른쪽 */}
        <div className="right-block">

          <Search
            onSearch={(value) => {
              setKeyword(value);
              setIsSearching(true);
            }}
          />

          {isSearching ? (
            <SearchResultBox
              keyword={keyword}
              onBack={() => setIsSearching(false)}
            />
          ) : (
            <Calendar
              onDateClick={(date) => {
                const formatted = formatDate(date); // 🔥 수정된 부분
                setSelectedDate(formatted);
              }}
            />
          )}
        </div>

      </div>
    </div>
  );
}

export default Home;
