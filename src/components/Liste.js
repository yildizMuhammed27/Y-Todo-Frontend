import React from "react";
import { TextFeldundButtonContext } from "../context/TextFeldundButtonContext";
import { todoApiService } from "../services/todoApiService";
import {
  Box,
  Stack,
  ListItem,
  IconButton,
  List,
  Typography,
} from "@mui/material";
import { Close, Delete, Edit, ListAlt } from "@mui/icons-material";
import { ListeContext } from "../context/ListeContext";
import UdateTodoModal from "./UpdateTodoModal";
import { UpdateTodoModalContext } from "../context/UpdateTodoModalContext";
import { TabsContext } from "../context/TabsContext";

export default function Liste({ displayedDate }) {
  const { tasks, setTasks } = React.useContext(TextFeldundButtonContext);
  const { open, setOpen } = React.useContext(UpdateTodoModalContext);
  const {
    updatedTodo,
    setUpdatedTodo,
    updatedInputValue,
    setUpdatedInputValue,
  } = React.useContext(ListeContext);
  const { currentTab } = React.useContext(TabsContext);

  const TodoApiService = new todoApiService();

  function deleteFromServer(id) {
    TodoApiService.deleteFromServerService(id);
  }

  //Todo lösch Funktion
  function deleteTodo(id) {
    const updatedTodo = [...tasks].filter((todo) => todo.id !== id);
    setTasks(updatedTodo);
  }

  function editIt(id, date) {
    const updatedTodo = [...tasks].map((todo) => {
      if (todo.id === id) {
        todo.content = updatedInputValue;
        todo.date = displayedDate;
      }
      return todo;
    });
    setTasks(updatedTodo);
    createUpdatePost(id);
    setUpdatedTodo([]);
    setUpdatedInputValue("");
    setOpen(false);
  }

  let updatedTodoRequest = {
    content: updatedInputValue,
    date: displayedDate,
  };

  function createUpdatePost(id) {
    TodoApiService.createUpdatePostService(id, updatedTodoRequest);
  }
  return (
    <Box>
      <Stack alignItems="center">
        <List
          sx={{
            bgcolor: "primary.main",
            marginTop: 2,
            marginRight: 12,
            borderRadius: 1,
            width: "80%",
            maxWidth: 580,
          }}
        >
          {tasks.map((todo) => {
            {
              if (todo.tab === currentTab) {
                return (
                  <ListItem
                    sx={{
                      color: "white",
                      height: {xl: 70, lg: 70, md: 60, sm: 55, xs: 45},
                    }}
                    key={todo.id}
                    secondaryAction={
                      <Box>
                        <IconButton
                          sx={{ color: "white" }}
                          onClick={() => {
                            deleteTodo(todo.id);
                            deleteFromServer(todo.id);
                          }}
                        >
                          <Delete />
                        </IconButton>
                        <IconButton
                          sx={{ color: "white" }}
                          onClick={() => {
                            setUpdatedTodo(todo.id);
                            setOpen(true);
                            setUpdatedInputValue(todo.content);
                          }}
                        >
                          <Edit />
                        </IconButton>
                        {updatedTodo === todo.id && (
                          <UdateTodoModal todo={todo} editIt={editIt} />
                        )}
                      </Box>
                    }
                  >
                    <Stack>
                      <Typography sx={{ display: "flex" }}>
                        <ListAlt sx={{ marginRight: 0.5 }} />
                        {todo.content}
                      </Typography>
                      <Typography variant="caption">{todo.date}</Typography>
                    </Stack>
                  </ListItem>
                );
              }
            }
          })}
        </List>
      </Stack>
    </Box>
  );
}