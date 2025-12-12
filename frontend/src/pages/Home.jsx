import { useState, useEffect } from "react";
import axios from "axios";

import Card from "../components/Card/Card";
import Calendar from "../components/Calendar/Calendar";
import Search from "../components/Search/Search";
import SearchResultBox from "../components/Search/SearchResultBox";

import "./Home.css";

function Home() {

  // 상태 정의하기
  const [userId, setUserId] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [doneDates, setDoneDates] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [futureDates, setFutureDates] = useState([]);

  
  // 날짜를 yyyy-mm-dd 형태로 바꾸기 위해서 사용
  // Card 요소랑 Calendar 요소 모두 이 포맷을 기반으로 동작하게 구성함
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // JS 내장 함수 new Date() 사용 -> 오늘 날짜 초기화 (null 값 안되게 설정)
  useEffect(() => {
    if (selectedDate === null) {
      const today = new Date();
      setSelectedDate(formatDate(today));
    }
  }, [selectedDate]);

  // 사용자 ID 초기 설정
  useEffect(() => {
    let uid = localStorage.getItem("anon_user_id");
    if (!uid) {
      uid = "anon_" + Math.random().toString(36).substring(2, 14);
      localStorage.setItem("anon_user_id", uid);
    }
    setUserId(uid);
  }, []);

  // DB에서 tb_todo_done_day 도장 불러오기
  // userId 바뀔 때마다 실행됨 (유저에 따른 도장 불러오기!)
  useEffect(() => {
    if (!userId) return;
    
    axios
      .get(`/api/todo/done/${userId}`)
      .then((res) => setDoneDates(res.data))
      .catch((err) => console.error("도장 날짜 불러오기 오류:", err));
  }, [userId]);


  // DB에서 미래 날짜 목록 불러오기
  useEffect(() => {
    if (!userId) return;

    axios
      .get(`/api/todo/${userId}/future`)
      .then((res) => setFutureDates(res.data))
      .catch((err) => console.error("미래 날짜 불러오기 오류:", err));
  }, [userId]);


  // Card에서 할 일 완료/미완료 시 도장 목록을 업데이트
  // date랑 isDelete를 매개변수로 지정
  const handleTodoCompletion = (date, isDelete = false) => {
    setDoneDates((prev) => {
      if (isDelete) return prev.filter((d) => d !== date);

      if (!prev.includes(date)) return [...prev, date];

      return prev; //이미 존재하면 아무 것도 안 함
    });
  };

  // 🔹 미래 TODO 추가 시 상태 업데이트
  const handleFutureTodo = (date) => {
    setFutureDates((prev) => {
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
          userId={userId}
          selectedDate={selectedDate}
          handleTodoCompletion={handleTodoCompletion}
          handleFutureTodo={handleFutureTodo}
        />

        <div className="right-block">
          <Search onSearch={handleSearch} />

          {isSearching ? (
            <SearchResultBox
              keyword={keyword}
              results={searchResults}
              onBack={() => setIsSearching(false)}
              onSelectDate={(date) => {
                setSelectedDate(date);  // 해당 날짜 Card 로딩
                setIsSearching(false);  // 검색창 닫기
              }}
            />
          ) : (
            <Calendar
              key={selectedDate + doneDates.join(",") + futureDates.join(",")}
              selectedDate={selectedDate}
              doneDates={doneDates}
              futureDates={futureDates}
              onDateClick={(date) => setSelectedDate(date)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
