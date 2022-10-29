import { Stack, TextField, Typography } from "@mui/material";
import { OwnButton } from "../styles/ButtonStyle";
import { Add, ConnectingAirportsOutlined } from "@mui/icons-material";
import { todoApiService } from "../services/todoApiService";
import React from "react";
import { TextFeldundButtonContext } from "../Context/TextFeldundButtonContext";
import { SnackbarContext } from "../Context/SnackbarContext";
import { DateTimePickerContext } from "../Context/DateTimePickerContext";
import axios from "axios";
import { UserDataContext } from "../Context/UserDataContext";

export default function TextFeldundButton({ todoItem, displayedDate }) {
  const { todoInputValue, setTodoInputValue, tasks, setTasks } =
    React.useContext(TextFeldundButtonContext);
  const [snackbar, setSnackbar] = React.useContext(SnackbarContext);
  const [dateValue, setDateValue] = React.useContext(DateTimePickerContext);
  const [userEmailStorage] = React.useContext(UserDataContext);
  const [sorted, setSorted] = React.useState();
  const TodoApiService = new todoApiService();

  React.useEffect(() => {
    setDateValue(null);
  }, []);

  let userConfig = {
    isSorted: "true",
  };

  function sortieren() {
    TodoApiService.sortRequest(userConfig, userEmailStorage).then((data) =>
      setSorted(data.data.isSorted)
    );
  }

  React.useEffect(() => {
    TodoApiService.getSortedTodos(userEmailStorage).then((resp) =>
      setSorted(resp.data.data[0].userConfig)
    );
  }, []);

  console.log(sorted);
  // React.useEffect(() => {

  const sortTodos = (date1, date2) => {
    if (sorted === "true") {
      let dateA = new Date(date1.date);
      let dateB = new Date(date2.date);
      console.log("ich gehe durch");
      if (dateA > dateB) {
        return 1;
      } else if (!dateB) {
        return 1;
      } else if (dateA < dateB) {
        return -1;
      } else {
        return 0;
      }
    }
  };
  tasks.sort(sortTodos);
  console.log(tasks);
  // }, [sorted]);

  function snackbarShow(snackbarClassName) {
    setTimeout(() => {
      setSnackbar(snackbarClassName);
      setTimeout(() => {
        setSnackbar("snackbarNotShow");
      }, 1000);
    }, 200);
  }

  function add() {
    if (todoInputValue === "") {
      snackbarShow("snackbarShowEmpty");
    } else {
      createPost();
      setTodoInputValue("");
    }
  }

  React.useEffect(() => {
    TodoApiService.getTodos(userEmailStorage).then((data) => {
      setTasks(data.data);
    });
  }, []);

  React.useEffect(() => {
    const enter = (event) => {
      if (event.key === "Enter") {
        add();
      }
    };
    document.addEventListener("keypress", enter);

    return () => {
      document.removeEventListener("keypress", enter);
    };
  });
  function createPost() {
    TodoApiService.createPostService(todoItem)
      .then((todoItem) => {
        setTasks([...tasks].concat(todoItem.data));
        snackbarShow("snackbarShowSuccess");
      })
      .catch(() => {
        snackbarShow("snackbarShowError");
      });
  }

  return (
    <Stack
      sx={{ marginTop: 20 }}
      direction="row"
      justifyContent="center"
      spacing={1}
    >
      <TextField
        sx={{ maxWidth: 500 }}
        value={todoInputValue}
        onChange={(event) => setTodoInputValue(event.target.value)}
        fullWidth
        label="Write your next Todo..."
      />
      <OwnButton
        endIcon={<Add />}
        variant="contained"
        onClick={() => {
          setDateValue(null);
          add();
        }}
      >
        <Typography variant="button">Add</Typography>
      </OwnButton>
      <OwnButton
        variant="contained"
        onClick={() => {
          sortieren();
        }}
      >
        <Typography variant="button">sort</Typography>
      </OwnButton>
    </Stack>
  );
}
