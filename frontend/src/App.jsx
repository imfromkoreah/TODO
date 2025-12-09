import { useEffect } from "react";
import "./App.css";
import Home from "./pages/Home";

function App() {
  // [] -> 마운트될 때 1번만 실행하도록 설정. 이후에 재실행 안됨
  useEffect(() => {
    const wrapper = document.querySelector(".snow-wrapper");
    if (!wrapper) return;

    let count = 0;
    const maxSnowCount = 200;

    const addSnow = () => {
      const snow = document.createElement("span");
      snow.classList.add("snow");

      const size = Math.random() * 3 + 1;
      snow.style.width = `${size}px`;
      snow.style.height = `${size}px`;
      snow.style.left = `${Math.random() * window.innerWidth}px`;

      snow.style.animationDuration = `${Math.random() * (35 - 15) + 15}s`;
      snow.style.animationDelay = `${Math.random() * 10}s`;

      snow.style.opacity = `${Math.random() * 0.3 + 0.1}`;

      // 애니메이션 끝나면 삭제
      snow.addEventListener("animationend", () => snow.remove());

      wrapper.appendChild(snow);

      if (count < maxSnowCount) {
        window.requestAnimationFrame(addSnow);
        count++;
      }
    };

    addSnow();
  }, []);

  return (
    <>
      {/* 눈 배경은 항상 최상단*/}
      <div className="snow-wrapper"></div>

      {/* 콘텐츠 전체를 감싸줌 */}
      <div className="content">
        <Home />
      </div>
    </>
  );
}

export default App;
