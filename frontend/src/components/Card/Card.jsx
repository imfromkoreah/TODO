import { useState } from "react";
import "./Card.css";

function Card() {
  const today = new Date().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  const [todos, setTodos] = useState([
    { id: 1, text: "할 일 할 일", checked: false },
    { id: 2, text: "두 번째 할 일", checked: false },
    { id: 3, text: "세 번째 할 일", checked: false },
    { id: 4, text: "네 번째 할 일", checked: false },
    { id: 5, text: "다섯 번째 할 일", checked: false },
  ]);

  const [openMenuId, setOpenMenuId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  /* 🔥 페이지네이션 관련 상태 */
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const totalPages = Math.ceil(todos.length / itemsPerPage);

  const paginatedTodos = todos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const changePage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    setOpenMenuId(null);
    setEditingId(null);
  };

  /* 체크 */
  const toggleCheck = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, checked: !todo.checked } : todo
      )
    );
    setOpenMenuId(null);
    setEditingId(null);
  };

  /* 메뉴 */
  const toggleMenu = (e, id) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === id ? null : id);
  };

  /* 수정 */
  const startEdit = (todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
    setOpenMenuId(null);
  };

  const finishEdit = () => {
    setTodos(
      todos.map((todo) =>
        todo.id === editingId ? { ...todo, text: editText } : todo
      )
    );
    setEditingId(null);
  };

  /* 삭제 */
  const askDelete = (id) => {
    setConfirmDeleteId(id);
    setOpenMenuId(null);
  };

  const confirmDelete = () => {
    if (confirmDeleteId !== null) {
      setTodos(todos.filter((todo) => todo.id !== confirmDeleteId));

      const newTotalPages = Math.ceil((todos.length - 1) / itemsPerPage);
      if (currentPage > newTotalPages) {
        setCurrentPage(newTotalPages);
      }
    }
    setConfirmDeleteId(null);
  };

  /* 🔥 새로 추가된 부분: 입력 상태 + 할 일 추가 기능 */
  const [inputValue, setInputValue] = useState("");

  const addTodo = () => {
    if (inputValue.trim() === "") return;

    const newTodo = {
      id: Date.now(),
      text: inputValue,
      checked: false,
    };

    setTodos([newTodo, ...todos]);
    setInputValue("");
  };

  const completedCount = todos.filter((todo) => todo.checked).length;
  const totalCount = todos.length;

  return (
    <div className="card">
      <h1>TO DO LIST</h1>

      <div className="date-text">{today}</div>

      <div className="todo-input-wrap">
        <input
          type="text"
          placeholder="할 일을 입력해주세요"
          className="todo-input"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTodo()}
        />
        <button className="add-btn" onClick={addTodo}>추가</button>
      </div>

      {/* 🔥 상태 표시줄 — 오른쪽 정렬 + 전체 완료 시 색 변경 */}
      <div
        className="todo-status"
        style={{
          textAlign: "right",
          marginBottom: "0.5rem",
          color:
            completedCount === totalCount && totalCount > 0
              ? "#e46f01"
              : "rgba(255,255,255,0.75)",
        }}
      >
        {completedCount} / {totalCount} 완료됨
      </div>

      <ul className="todo-items">
        {paginatedTodos.map((todo) => (
          <li
            key={todo.id}
            className={`todo-item ${todo.checked ? "checked-item" : ""}`}
            onClick={() => toggleCheck(todo.id)}
          >
            {editingId === todo.id ? (
              <input
                className="edit-input"
                value={editText}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => setEditText(e.target.value)}
                autoFocus
                onBlur={finishEdit}
                onKeyDown={(e) => e.key === "Enter" && finishEdit()}
              />
            ) : (
              <>
                <input
                  type="checkbox"
                  className="todo-check"
                  checked={todo.checked}
                  readOnly
                />
                <span className="todo-text">{todo.text}</span>
              </>
            )}

            {editingId === todo.id ? (
              <button
                className="done-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  finishEdit();
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <polyline
                    points="20 6 9 17 4 12"
                    fill="none"
                    stroke="#4CAF50"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            ) : (
              <button className="menu-btn" onClick={(e) => toggleMenu(e, todo.id)}>
                <span></span>
                <span></span>
                <span></span>
              </button>
            )}

            {openMenuId === todo.id && (
              <div
                className="circular-menu open"
                onClick={(e) => e.stopPropagation()}
              >
                <button className="circle-btn edit-btn" onClick={() => startEdit(todo)}>
                  <svg width="18" height="18" viewBox="0 0 24 24" stroke="#333" strokeWidth="2">
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                  </svg>
                </button>

                <button
                  className="circle-btn delete-btn"
                  onClick={() => askDelete(todo.id)}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#d33"
                    strokeWidth="2.5"
                  >
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14H6L5 6" />
                    <path d="M10 11v6" />
                    <path d="M14 11v6" />
                    <path d="M9 6V4h6v2" />
                  </svg>
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>

      {totalPages > 1 && (
        <div className="pagination">
          <button onClick={() => changePage(currentPage - 1)}>◀</button>

          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx}
              className={currentPage === idx + 1 ? "active" : ""}
              onClick={() => changePage(idx + 1)}
            >
              {idx + 1}
            </button>
          ))}

          <button onClick={() => changePage(currentPage + 1)}>▶</button>
        </div>
      )}

      {confirmDeleteId !== null && (
        <div className="delete-modal-bg">
          <div className="delete-modal">
            <p>삭제하시겠습니까?</p>
            <div className="delete-modal-btns">
              <button
                className="cancel-btn"
                onClick={() => setConfirmDeleteId(null)}
              >
                취소
              </button>
              <button className="confirm-btn" onClick={confirmDelete}>
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Card;
