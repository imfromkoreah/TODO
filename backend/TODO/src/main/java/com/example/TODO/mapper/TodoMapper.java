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

  List<HashMap<String, Object>> selectTodoListByDate(HashMap<String, Object> params);

  int insertDoneDate(HashMap<String, Object> param);

  int deleteDoneDate(HashMap<String, Object> param);

  List<String> selectDoneDates(HashMap<String, Object> param);

  List<HashMap<String, Object>> searchTodo(HashMap<String, Object> param);

  List<String> selectFutureTodoDates(HashMap<String, Object> param);

}
