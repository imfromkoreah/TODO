import { useState, useEffect } from "react";
import axios from "axios";
import "./Card.css";

function Card({ userId, selectedDate, handleTodoCompletion }) {
  const today = new Date().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  // 상태 정의하기
  const [todos, setTodos] = useState([]);
  
  // 서버에서 {유저별} 특정 날짜에 해당하는 할 일 목록 조회
  const fetchTodos = () => {
    if (!userId) return;

    if (selectedDate) {
      axios
        .get(`/api/todo/${userId}/date/${selectedDate}`)
        .then((res) => {
          setTodos(res.data);
          setCurrentPage(1);
        })
        .catch((err) => console.error("날짜별 조회 오류:", err));
      return;
    }

    axios
      .get(`/api/todo/${userId}`)
      .then((res) => {
        setTodos(res.data);
        setCurrentPage(1);
      })
      .catch((err) => console.error("전체 조회 오류:", err));
  };

  useEffect(() => {
    fetchTodos();
  }, [userId, selectedDate]);

  // 할 일 목록 체크해서 서버에 요청 (부모에서 관리 안 함)
  const toggleCheck = (id) => {
    const target = todos.find((t) => t.id === id);
    if (!target) return;

    const newChecked = target.checked ? 0 : 1;

    axios
      .post("/api/todo/update", {
        id,
        text: target.text,
        checked: newChecked,
        user_id: userId,
      })
      .then(() => {
        const updatedTodos = todos.map((todo) =>
          todo.id === id ? { ...todo, checked: newChecked } : todo
        );
        setTodos(updatedTodos);

        const completed = updatedTodos.filter((t) => t.checked).length;
        const total = updatedTodos.length;

        /* {complatedCount} == {totalCount} 일 때만 완료 도장*/
        if (completed === total && total > 0) {
          saveStamp(selectedDate);
        }

        /* 하나라도 체크 해제되면 도장 삭제 */
        if (newChecked === 0) {
          deleteStamp(selectedDate);
        }
      })
      .catch((err) => console.error("체크 업데이트 오류:", err));
  };

  // 할 일 완료시 도장 찍기
  // {complatedCount} == {totalCount} 일 때만 완료 도장
  // (상태 반영은 부모에서!!!)
  const saveStamp = (date) => {
    axios
      .post("/api/todo/done/add", {
        user_id: userId,
        done_date: date,
      })
      .then(() => {
        if (typeof handleTodoCompletion === "function") {
          handleTodoCompletion(date); // 달력에 도장 표시
        }
      })
      .catch((err) => console.error("도장 저장 오류:", err));
  };

  const deleteStamp = (date) => {
    axios
      .post("/api/todo/done/delete", {
        user_id: userId,
        done_date: date,
      })
      .then(() => {
        if (typeof handleTodoCompletion === "function") {
          handleTodoCompletion(date, true); // 달력에서 도장 제거
        }
      })
      .catch((err) => console.error("도장 삭제 오류:", err));
  };

  /* ------------------------------------------------------------- */

  const [openMenuId, setOpenMenuId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const totalPages = Math.max(1, Math.ceil(todos.length / itemsPerPage));

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

  const toggleMenu = (e, id) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const startEdit = (todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
    setOpenMenuId(null);
  };

  const finishEdit = () => {
    const original = todos.find((t) => t.id === editingId);

    const updated = {
      id: editingId,
      text: editText,
      checked: original.checked ? 1 : 0,
      user_id: userId,
    };

    axios.post("/api/todo/update", updated).then(() => {
      setTodos(
        todos.map((todo) =>
          todo.id === editingId ? { ...todo, text: editText } : todo
        )
      );
      setEditingId(null);
    });
  };

  const askDelete = (id) => {
    setConfirmDeleteId(id);
    setOpenMenuId(null);
  };

  const confirmDelete = () => {
    if (confirmDeleteId !== null) {
      axios.post(`/api/todo/delete/${confirmDeleteId}`).then(() => {
        setTodos(todos.filter((todo) => todo.id !== confirmDeleteId));

        const newTotalPages = Math.max(
          1,
          Math.ceil((todos.length - 1) / itemsPerPage)
        );

        if (currentPage > newTotalPages) {
          setCurrentPage(newTotalPages);
        }

        setConfirmDeleteId(null);
      });
    }
  };

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

      <div className="date-text">
        {selectedDate
          ? new Date(selectedDate).toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "long",
              day: "numeric",
              weekday: "long",
            })
          : today}
      </div>

      <div className="todo-input-wrap">
        <input
          type="text"
          placeholder="할 일을 입력해주세요"
          className="todo-input"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTodo()}
        />
        <button className="add-btn" onClick={addTodo}>
          추가
        </button>
      </div>

      <div className="todo-status">
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
                ✔
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
                  ✏️
                </button>

                <button
                  className="circle-btn delete-btn"
                  onClick={() => askDelete(todo.id)}
                >
                  🗑
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>

      {totalCount === 0 && (
        <div className="empty-message">저장된 기록이 없네요 🤔</div>
      )}

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
              <button className="cancel-btn" onClick={() => setConfirmDeleteId(null)}>
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
