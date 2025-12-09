import { useState, useEffect } from "react";
import axios from "axios";

import Card from "../components/Card/Card";
import Calendar from "../components/Calendar/Calendar";
import Search from "../components/Search/Search";
import SearchResultBox from "../components/Search/SearchResultBox";

import "./Home.css";

function Home() {
  const [isSearching, setIsSearching] = useState(false);
  const [keyword, setKeyword] = useState("");

  const [selectedDate, setSelectedDate] = useState(null);

  const [doneDates, setDoneDates] = useState([]);

  const [userId, setUserId] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // 사용자 ID 초기 설정
  useEffect(() => {
    let uid = localStorage.getItem("anon_user_id");
    if (!uid) {
      uid = "anon_" + Math.random().toString(36).substring(2, 14);
      localStorage.setItem("anon_user_id", uid);
    }
    setUserId(uid);
  }, []);

  // 첫 화면 로드시 오늘 날짜 설정
  useEffect(() => {
    if (selectedDate === null) {
      const today = new Date();
      setSelectedDate(formatDate(today));
    }
  }, [selectedDate]);

  // DB에서 도장 날짜 불러오기
  useEffect(() => {
    if (!userId) return;

    axios
      .get(`/api/todo/done/${userId}`)
      .then((res) => setDoneDates(res.data))
      .catch((err) => console.error("도장 날짜 불러오기 오류:", err));
  }, [userId]);

  // Card에서 도장 업데이트 이벤트 받기
  const handleTodoStatusChange = (date, isDelete = false) => {
    setDoneDates((prev) => {
      if (isDelete) return prev.filter((d) => d !== date);

      if (!prev.includes(date)) return [...prev, date];

      return prev;
    });
  };

  // 검색 실행
  const handleSearch = (value) => {
    setKeyword(value);

    if (!userId || !value.trim()) {
      setSearchResults([]);
      setIsSearching(true);
      return;
    }

    axios
      .get(`/api/todo/search/${userId}/${value}`)
      .then((res) => {
        setSearchResults(res.data);
        setIsSearching(true);
      })
      .catch((err) => console.error("검색 오류:", err));
  };

  return (
    <div className="home-container">
      <div className="layout-wrapper">

        <Card
          selectedDate={selectedDate}
          onTodoStatusChange={handleTodoStatusChange}
        />

        <div className="right-block">
          <Search onSearch={handleSearch} />

          {isSearching ? (
            <SearchResultBox
              keyword={keyword}
              results={searchResults}
              onBack={() => setIsSearching(false)}
              onSelectDate={(date) => {
                setSelectedDate(date);  // 🔥 해당 날짜 Card 로딩
                setIsSearching(false);  // 🔙 검색창 닫기
              }}
            />
          ) : (
            <Calendar
              selectedDate={selectedDate}
              doneDates={doneDates}
              onDateClick={(date) => setSelectedDate(date)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
