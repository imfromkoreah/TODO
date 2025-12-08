package com.example.TODO.mapper;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.HashMap;

@Mapper
public interface TodoMapper {

  List<HashMap<String, Object>> selectTodoList(HashMap<String, Object> param);

  int insertTodo(HashMap<String, Object> param);

  int updateTodo(HashMap<String, Object> param);

  int deleteTodo(HashMap<String, Object> param);

}
