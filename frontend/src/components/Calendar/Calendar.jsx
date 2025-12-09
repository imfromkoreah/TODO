import React, { useState } from "react";
import "./Calendar.css";
import snowStamp from "../../assets/snow.png";   // 🔥 import한 이미지 사용!

const Calendar = ({ renderDateCell, onDateClick, selectedDate, doneDates = [] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const startDay = new Date(firstDayOfMonth);
  startDay.setDate(1 - firstDayOfMonth.getDay());

  const lastDayOfMonth = new Date(year, month + 1, 0);
  const endDay = new Date(lastDayOfMonth);
  endDay.setDate(lastDayOfMonth.getDate() + (6 - lastDayOfMonth.getDay()));

  const groupDatesByWeek = (start, end) => {
    const weeks = [];
    let currentWeek = [];
    let date = new Date(start);

    while (date <= end) {
      currentWeek.push(new Date(date));
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
      date.setDate(date.getDate() + 1);
    }

    if (currentWeek.length > 0) weeks.push(currentWeek);
    return weeks;
  };

  const weeks = groupDatesByWeek(startDay, endDay);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const isSameMonth = (date) => date.getMonth() === currentDate.getMonth();

  const today = new Date();
  const isToday = (date) =>
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate();

  // 🔥 선택 날짜 체크
  const isSelectedDate = (date) => {
    if (!selectedDate) return false;

    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    const formatted = `${y}-${m}-${d}`;

    return formatted === selectedDate;
  };

  // 🔥 완료된 날짜 체크
  const isDoneDate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    const formatted = `${y}-${m}-${d}`;

    return doneDates.includes(formatted);
  };

  return (
    <div className="calendar-wrapper">
      <div className="calendar-header">
        <span className="calendar-date-display">
          {year}년 {month + 1}월
        </span>

        <div className="calendar-nav-buttons">
          <button onClick={handlePrevMonth}>❮</button>
          <button onClick={handleNextMonth}>❯</button>
        </div>
      </div>

      <div className="calendar-weekdays">
        {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      <div className="calendar-dates-grid">
        {weeks.map((week, i) => (
          <div className="calendar-week-row" key={i}>
            {week.map((date, j) => {
              const currentMonth = isSameMonth(date);
              const todayClass = isToday(date) ? "today" : "";
              const selectedClass =
                isSelectedDate(date) && !isToday(date) ? "selected-date" : "";

              const done = isDoneDate(date);

              return (
                <div
                  key={j}
                  className={`calendar-date-cell 
                    ${!currentMonth ? "dimmed" : ""} 
                    ${todayClass}
                    ${selectedClass}`}
                  onClick={() => {
                    if (!onDateClick) return;

                    const y = date.getFullYear();
                    const m = String(date.getMonth() + 1).padStart(2, "0");
                    const d = String(date.getDate()).padStart(2, "0");
                    const formatted = `${y}-${m}-${d}`;

                    onDateClick(formatted);
                  }}
                >
                  {/* 날짜 숫자 */}
                  <span>{date.getDate()}</span>

                  {/* 🔥 완료 날짜면 도장 표시 */}
                  {done && (
                    <img
                      src={snowStamp}
                      alt="done"
                      className="done-stamp"
                    />
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
