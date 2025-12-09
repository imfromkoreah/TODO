import { useState, useEffect } from "react";

import Card from "../components/Card/Card";
import Calendar from "../components/Calendar/Calendar";
import Search from "../components/Search/Search";
import SearchResultBox from "../components/Search/SearchResultBox";

import "./Home.css";
import axios from "axios";

function Home() {
  const [isSearching, setIsSearching] = useState(false);
  const [keyword, setKeyword] = useState("");

  /* 🔥 선택된 날짜 저장 (yyyy-MM-dd) */
  const [selectedDate, setSelectedDate] = useState(null);

  /* 🔥 완료된 날짜들 (도장 찍힌 날짜 리스트) */
  const [doneDates, setDoneDates] = useState([]);

  /* 🔥 오늘 날짜를 yyyy-MM-dd 형태로 변환 */
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  /* 🔥 첫 화면 로드 시 오늘 날짜 선택 */
  useEffect(() => {
    if (selectedDate === null) {
      const today = new Date();
      setSelectedDate(formatDate(today));
    }
  }, [selectedDate]);


  /* --------------------------------------------
      🔥 첫 로드시 DB에서 스탬프 날짜들 로딩
  --------------------------------------------- */
  useEffect(() => {
    console.log("📌 지금 저장된 doneDates:", doneDates);
    const userId = localStorage.getItem("anon_user_id");
    if (!userId) return;

    axios
      .get(`/api/todo/done/${userId}`)
      .then((res) => {
        setDoneDates(res.data); // ["2025-02-08", "2025-02-09", ...]
      })
      .catch((err) => console.error("도장 날짜 불러오기 오류:", err));
  }, []);


  /* --------------------------------------------
      🔥 Card → 스탬프 변화 전달 받기
      addOrRemove = true → 삭제
      addOrRemove = false or undefined → 추가
  --------------------------------------------- */
  const handleTodoStatusChange = (date, isDelete = false) => {
    setDoneDates((prev) => {
      if (isDelete) {
        // ❌ 삭제: 배열에서 해당 날짜 제거
        return prev.filter((d) => d !== date);
      }

      // ✔ 추가: 이미 있으면 그대로 / 없으면 추가
      if (!prev.includes(date)) {
        return [...prev, date];
      }
      return prev;
    });
  };

  return (
    <div className="home-container">
      <div className="layout-wrapper">

        {/* 왼쪽 Card 영역 */}
        <Card 
          selectedDate={selectedDate}
          onTodoStatusChange={handleTodoStatusChange} 
        />

        {/* 오른쪽 UI 영역 */}
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
              selectedDate={selectedDate}
              doneDates={doneDates}  // 🔥 도장 찍힌 날짜들 전달
              onDateClick={(date) => {
                setSelectedDate(date);
                console.log("📌 선택된 날짜:", date);
              }}
            />
          )}

        </div>
      </div>
    </div>
  );
}

export default Home;
