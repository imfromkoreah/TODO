package com.example.TODO.service;

import java.util.HashMap;
import java.util.List;

public interface TodoService {

    List<HashMap<String, Object>> getTodoList(String userId);

    int addTodo(HashMap<String, Object> todo);

    int updateTodo(HashMap<String, Object> todo);

    int deleteTodo(Long id);

    List<HashMap<String, Object>> getTodoListByDate(String userId, String date);

}
