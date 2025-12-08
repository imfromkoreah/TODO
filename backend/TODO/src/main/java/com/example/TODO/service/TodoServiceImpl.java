package com.example.TODO.service;

import com.example.TODO.mapper.TodoMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;

@Service
public class TodoServiceImpl implements TodoService {

    @Autowired
    private TodoMapper todoMapper;

    @Override
    public List<HashMap<String, Object>> getTodoList(String userId) {
        HashMap<String, Object> param = new HashMap<>();
        param.put("user_id", userId);
        return todoMapper.selectTodoList(param);
    }

    @Override
    public int addTodo(HashMap<String, Object> todo) {
        return todoMapper.insertTodo(todo);
    }

    @Override
    public int updateTodo(HashMap<String, Object> todo) {
        return todoMapper.updateTodo(todo);
    }

    @Override
    public int deleteTodo(Long id) {
        HashMap<String, Object> param = new HashMap<>();
        param.put("id", id);
        return todoMapper.deleteTodo(param);
    }
}
