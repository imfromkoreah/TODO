package com.example.TODO.controller;

import com.example.TODO.service.TodoService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("/api/todo")
@RequiredArgsConstructor
public class TodoController {

    private final TodoService todoService;

    @GetMapping("/{userId}")
    public List<HashMap<String, Object>> getList(@PathVariable String userId) {
        return todoService.getTodoList(userId);
    }

    @PostMapping("/add")
    public HashMap<String, Object> add(@RequestBody HashMap<String, Object> todo) {
        todoService.addTodo(todo);
        return todo;
    }

    @PostMapping("/update")
    public int update(@RequestBody HashMap<String, Object> todo) {
        return todoService.updateTodo(todo);
    }

    @PostMapping("/delete/{id}")
    public int delete(@PathVariable Long id) {
        return todoService.deleteTodo(id);
    }

    @GetMapping("/{userId}/date/{date}")
    public List<HashMap<String, Object>> getListByDate(
            @PathVariable String userId,
            @PathVariable String date
    ) {
        return todoService.getTodoListByDate(userId, date);
    }
}
