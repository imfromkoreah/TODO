package com.example.TODO.service;

import java.util.HashMap;
import java.util.List;

public interface TodoService {

    List<HashMap<String, Object>> getTodoList(String userId);

    int addTodo(HashMap<String, Object> todo);

    int updateTodo(HashMap<String, Object> todo);

    int deleteTodo(Long id);

    List<HashMap<String, Object>> getTodoListByDate(String userId, String date);

    // 할 일 완료시 도장 추가
    int insertDoneDate(String userId, String doneDate);

    int deleteDoneDate(String userId, String doneDate);

    List<String> getDoneDates(String userId);

    // 했던 일 검색하기
    List<HashMap<String, Object>> searchTodo(String userId, String keyword);

}
