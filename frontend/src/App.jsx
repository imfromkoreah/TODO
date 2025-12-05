import { useEffect } from "react";
import "./App.css";

function App() {
  useEffect(() => {
    const wrapper = document.querySelector(".snow-wrapper");
    if (!wrapper) return;

    let count = 0;
    const maxSnowCount = 500;

    const addSnow = () => {
      const snow = document.createElement("span");
      snow.classList.add("snow");

      const size = Math.random() * 3 + 1;
      snow.style.width = `${size}px`;
      snow.style.height = `${size}px`;

      snow.style.left = `${Math.random() * window.innerWidth}px`;

      snow.style.animationDuration = `${Math.random() * (20 - 5) + 5}s`;
      snow.style.animationDelay = `${Math.random() * 10}s`;

      // 여기만 수정됨 → 0.1 ~ 0.4로 더 연하게
      snow.style.opacity = `${Math.random() * 0.3 + 0.1}`;

      wrapper.appendChild(snow);

      if (count < maxSnowCount) {
        window.requestAnimationFrame(addSnow);
        count++;
      }
    };

    addSnow();
  }, []);

  return (
    <div>
      <div className="snow-wrapper"></div>

      <div className="content">
        <h1>🎄  </h1>
      </div>
    </div>
  );
}

export default App;
