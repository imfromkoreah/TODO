import { useState, useEffect } from "react";
import axios from "axios";
import "./Card.css";

function Card({
  userId,
  selectedDate,
  handleTodoCompletion,
  handleFutureTodo,
  removeFutureDate,
}) {
  // 1) 날짜 표시
  const today = new Date().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  // 2) TODO 목록
  // {userId}별 할 일 목록 조회 (전체 / 특정 날짜-달력이랑 상태 관리)
  const [todos, setTodos] = useState([]);

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

  // 3) TODO 추가 (Create)
  const [inputValue, setInputValue] = useState("");

  const addTodo = () => {
    if (inputValue.trim() === "") return;

    // 이미 완료 상태였는지 체크
    const wasAllCompleted =
      todos.length > 0 && todos.every((t) => t.checked);

    const newTodo = {
      user_id: userId,
      text: inputValue,
      checked: 0,
      created_date: selectedDate,
    };

    axios.post("/api/todo/add", newTodo).then((res) => {
      setTodos([res.data, ...todos]);
      setInputValue("");

       // 🔹 미래 날짜라면 NEW 표시 dots 추가 
      const todayObj = new Date();
      const selectedObj = new Date(selectedDate);

      if (
        selectedObj > todayObj &&
        typeof handleFutureTodo === "function"
      ) {
        handleFutureTodo(selectedDate);
      }

      if (selectedDate && wasAllCompleted) {
        deleteStamp(selectedDate);
      }
    });
  };

  // 4) TODO 수정 (update)
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

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
          todo.id === editingId
            ? { ...todo, text: editText }
            : todo
        )
      );
      setEditingId(null);
    });
  };

  // 5) TODO 삭제 (delete)
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const askDelete = (id) => {
    setConfirmDeleteId(id);
    setOpenMenuId(null);
  };

  const confirmDelete = () => {
    if (confirmDeleteId === null) return;

    axios.post(`/api/todo/delete/${confirmDeleteId}`).then(() => {
      const remainingTodos = todos.filter(
        (todo) => todo.id !== confirmDeleteId
      );

      setTodos(remainingTodos);

      // 🔹 미래 날짜 + TODO 없음 → dot 제거
      const todayISO = new Date().toISOString().split("T")[0];
      if (
        selectedDate > todayISO &&
        remainingTodos.length === 0 &&
        typeof removeFutureDate === "function"
      ) {
        removeFutureDate(selectedDate);
      }

      const newTotalPages = Math.max(
        1,
        Math.ceil(remainingTodos.length / itemsPerPage)
      );

      if (currentPage > newTotalPages) {
        setCurrentPage(newTotalPages);
      }

      const completedCount = remainingTodos.filter(
        (t) => t.checked
      ).length;
      const totalCount = remainingTodos.length;

      if (completedCount === totalCount && totalCount > 0) {
        saveStamp(selectedDate);
      }

      setConfirmDeleteId(null);
    });
  };

  // 6) 체크 토글 -> 완료 상태 변경 + 도장 로직
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
          todo.id === id
            ? { ...todo, checked: newChecked }
            : todo
        );

        setTodos(updatedTodos);

        const completed = updatedTodos.filter(
          (t) => t.checked
        ).length;
        const total = updatedTodos.length;

        // complatedCount} == {totalCount} 일 때만 완료 도장
        if (completed === total && total > 0) {
          saveStamp(selectedDate);
        }
        // 하나라도 체크 해제되면 완료 도장 삭제 
        if (newChecked === 0) {
          deleteStamp(selectedDate);
        }
      })
      .catch((err) => console.error("체크 업데이트 오류:", err));
  };

  // 7) 도장
  // 부모(Home)에게 전달, 부모가 상태 관리
  const saveStamp = (date) => {
    axios
      .post("/api/todo/done/add", {
        user_id: userId,
        done_date: date,
      })
      .then(() => {
        handleTodoCompletion?.(date);
      });
  };

  const deleteStamp = (date) => {
    axios
      .post("/api/todo/done/delete", {
        user_id: userId,
        done_date: date,
      })
      .then(() => {
        handleTodoCompletion?.(date, true);
      });
  };

  // 8) UI 상태, 메뉴, 페이지네이션 등 부가 기능
  const [openMenuId, setOpenMenuId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const toggleMenu = (e, id) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const totalPages = Math.max(
    1,
    Math.ceil(todos.length / itemsPerPage)
  );

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

  // 9) 완료 카운트
  const completedCount = todos.filter((t) => t.checked).length;
  const totalCount = todos.length;

  const todayISO = new Date().toISOString().split("T")[0];
  const isPastDate = selectedDate && selectedDate < todayISO;

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

      <div className={`todo-input-wrap ${isPastDate ? "disabled" : ""}`}>
        <input
          type="text"
          className="todo-input"
          value={inputValue}
          disabled={isPastDate}
          placeholder={
            isPastDate
              ? "지난 날짜에는 추가할 수 없어요"
              : "오늘 할 일을 입력해주세요"
          }
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) =>
            !isPastDate && e.key === "Enter" && addTodo()
          }
        />

        {!isPastDate && (
          <button className="add-btn" onClick={addTodo}>
            추가
          </button>
        )}
      </div>

      <div className="todo-status">
        {completedCount} / {totalCount} 완료됨
      </div>

      <ul className="todo-items">
        {paginatedTodos.map((todo) => (
          <li
            key={todo.id}
            className={`todo-item ${
              todo.checked ? "checked-item" : ""
            }`}
            onClick={() => toggleCheck(todo.id)}
          >
            {editingId === todo.id ? (
              <input
                className="edit-input"
                value={editText}
                autoFocus
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => setEditText(e.target.value)}
                onBlur={finishEdit}
                onKeyDown={(e) =>
                  e.key === "Enter" && finishEdit()
                }
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
              <button
                className="menu-btn"
                onClick={(e) => toggleMenu(e, todo.id)}
              >
                <span />
                <span />
                <span />
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
        <div className="empty-message">
          저장된 기록이 없네요 🤔
        </div>
      )}

      {totalPages > 1 && (
        <div className="pagination">
          <button onClick={() => changePage(currentPage - 1)}>
            ◀
          </button>
          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx}
              className={currentPage === idx + 1 ? "active" : ""}
              onClick={() => changePage(idx + 1)}
            >
              {idx + 1}
            </button>
          ))}
          <button onClick={() => changePage(currentPage + 1)}>
            ▶
          </button>
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
              <button
                className="confirm-btn"
                onClick={confirmDelete}
              >
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
