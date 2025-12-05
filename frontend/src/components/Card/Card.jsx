import "./Card.css";

function Card() {
  return (
    <div className="card">
      <h1>TO DO LIST</h1>

      {/* 입력 영역 */}
      <div className="todo-input-wrap">
        <input
          type="text"
          placeholder="할 일을 입력해주세요"
          className="todo-input"
        />
        <button className="add-btn">추가</button>
      </div>

      {/* 리스트 형태 UI (아직 기능 없음) */}
      <ul className="todo-items">
        <li className="todo-item"></li>
        <li className="todo-item"></li>
        <li className="todo-item"></li>
        <li className="todo-item"></li>
        <li className="todo-item"></li>
        <li className="todo-item"></li>
      </ul>
    </div>
  );
}

export default Card;
