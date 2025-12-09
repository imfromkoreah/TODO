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

    @Override
    public List<HashMap<String, Object>> getTodoListByDate(String userId, String date) {
        HashMap<String, Object> params = new HashMap<>();
        params.put("user_id", userId);
        params.put("date", date);

        return todoMapper.selectTodoListByDate(params);
    }

    // 할 일 완료시 도장 구현체 추가함
    @Override
    public int insertDoneDate(String userId, String doneDate) {
        HashMap<String, Object> param = new HashMap<>();
        param.put("user_id", userId);
        param.put("done_date", doneDate);
        return todoMapper.insertDoneDate(param);
    }

    @Override
    public int deleteDoneDate(String userId, String doneDate) {
        HashMap<String, Object> param = new HashMap<>();
        param.put("user_id", userId);
        param.put("done_date", doneDate);
        return todoMapper.deleteDoneDate(param);
    }

    @Override
    public List<String> getDoneDates(String userId) {
        HashMap<String, Object> param = new HashMap<>();
        param.put("user_id", userId);
        return todoMapper.selectDoneDates(param);
    }

    // 했던 일 검색하기
    @Override
    public List<HashMap<String, Object>> searchTodo(String userId, String keyword) {
        HashMap<String, Object> param = new HashMap<>();
        param.put("user_id", userId);
        param.put("keyword", keyword);
        return todoMapper.searchTodo(param);
    }


}
