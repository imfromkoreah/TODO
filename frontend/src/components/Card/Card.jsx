import { useState, useEffect } from "react";
import axios from "axios";
import "./Card.css";

function Card() {
  const today = new Date().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  /* 🔥 익명 userId 생성 */
  const [userId, setUserId] = useState("");

  useEffect(() => {
    let uid = localStorage.getItem("anon_user_id");
    if (!uid) {
      uid = "anon_" + Math.random().toString(36).substring(2, 14);
      localStorage.setItem("anon_user_id", uid);
    }
    setUserId(uid);
  }, []);

  /* 🔥 서버에서 불러온 todo 저장 */
  const [todos, setTodos] = useState([]);

  /* 🔥 서버 목록 불러오기 */
  useEffect(() => {
    if (!userId) return;

    axios
      .get(`/api/todo/${userId}`)
      .then((res) => setTodos(res.data))
      .catch((err) => console.error("🔥 리스트 조회 오류:", err));
  }, [userId]);

  const [openMenuId, setOpenMenuId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  /* 페이지네이션 */
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

  /* 🔥 체크 → 서버 update */
  const toggleCheck = (id) => {
    const target = todos.find((t) => t.id === id);
    if (!target) return;

    const updated = {
      id: id,
      text: target.text,
      checked: target.checked ? 0 : 1,
    };

    axios.post("/api/todo/update", updated).then(() => {
      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, checked: updated.checked } : todo
        )
      );
    });

    setOpenMenuId(null);
    setEditingId(null);
  };

  /* 메뉴 */
  const toggleMenu = (e, id) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === id ? null : id);
  };

  /* 수정 시작 */
  const startEdit = (todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
    setOpenMenuId(null);
  };

  /* 🔥 수정 완료 → 서버 update */
  const finishEdit = () => {
  const original = todos.find(t => t.id === editingId);

  const updated = {
    id: editingId,
    text: editText,
    checked: original.checked ? 1 : 0,  // 반드시 포함!
    user_id: userId,
  };

  axios.post("/api/todo/update", updated).then(() => {
    setTodos(
      todos.map(todo =>
        todo.id === editingId ? { ...todo, text: editText } : todo
      )
    );
    setEditingId(null);
  });
};


  /* 삭제 버튼 누름 */
  const askDelete = (id) => {
    setConfirmDeleteId(id);
    setOpenMenuId(null);
  };

  /* 🔥 삭제(soft delete) */
  const confirmDelete = () => {
    if (confirmDeleteId !== null) {
      axios.post(`/api/todo/delete/${confirmDeleteId}`).then(() => {
        setTodos(todos.filter((todo) => todo.id !== confirmDeleteId));

        const newTotalPages = Math.ceil((todos.length - 1) / itemsPerPage);
        if (currentPage > newTotalPages) {
          setCurrentPage(newTotalPages);
        }
        setConfirmDeleteId(null);
      });
    }
  };

  /* 🔥 입력 + 서버 저장 */
  const [inputValue, setInputValue] = useState("");

  const addTodo = () => {
    if (inputValue.trim() === "") return;

    const newTodo = {
      user_id: userId,
      text: inputValue,
      checked: 0,
    };

    axios.post("/api/todo/add", newTodo).then((res) => {
      setTodos([res.data, ...todos]);
      setInputValue("");
    });
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

      {/* 완료 상태 표시 */}
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
                <button
                  className="circle-btn edit-btn"
                  onClick={() => startEdit(todo)}
                >
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
