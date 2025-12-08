import { useState } from "react";

import Card from "../components/Card/Card";
import Calendar from "../components/Calendar/Calendar";
import Search from "../components/Search/Search";
import SearchResultBox from "../components/Search/SearchResultBox";

import "./Home.css";

function Home() {
  const [isSearching, setIsSearching] = useState(false);
  const [keyword, setKeyword] = useState("");

  return (
    <div className="home-container">
      <div className="layout-wrapper">
        
        {/* 왼쪽 카드 */}
        <Card />

        {/* 오른쪽 검색 + (달력 or 검색결과) */}
        <div className="right-block">
          <Search
            onSearch={(value) => {
              setKeyword(value);
              setIsSearching(true);   // 검색 시 검색결과로 전환
            }}
          />

          {isSearching ? (
            <SearchResultBox
              keyword={keyword}
              onBack={() => setIsSearching(false)} // 🔥 뒤로가기 누르면 달력 복귀
            />
          ) : (
            <Calendar />
          )}
        </div>

      </div>
    </div>
  );
}

export default Home;
