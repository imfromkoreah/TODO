import { useState, useEffect } from "react";

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

  /* 🔥 날짜 포맷 (한국 시간) */
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  /* 🔥 앱 로드 시 자동으로 오늘 날짜로 설정 */
  useEffect(() => {
    if (selectedDate === null) {
      const today = new Date();
      setSelectedDate(formatDate(today));  
    }
  }, [selectedDate]);


  return (
    <div className="home-container">
      <div className="layout-wrapper">

        {/* 왼쪽 Card - 선택된 날짜 전달 */}
        <Card selectedDate={selectedDate} />

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
              onDateClick={(selected) => {
                setSelectedDate(selected);
                console.log("📌 Calendar 선택 날짜:", selected);
              }}
            />
          )}

        </div>
      </div>
    </div>
  );
}

export default Home;
