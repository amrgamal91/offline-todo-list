import React, { useState, useRef, useEffect } from "react";
import "./App.css";
import uuidv4 from "uuid/v4";
import TodoList from "./components/TodoList";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";

import {
  Container,
  Row,
  Col,
  Form,
  InputGroup,
  FormControl
} from "react-bootstrap";

const LOCAL_STORAGE_KEY_TODOS = "todoApp.todos";
const LOCAL_STORAGE_KEY_COMPLETED_TODOS = "todoApp.todos.completed";

function App() {
  const [todos, settodos] = useState([]);
  const [completedTodos, setcompletedTodos] = useState([]);
  const todoNameRef = useRef();

  useEffect(() => {
    const storedTodos = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_KEY_TODOS)
    );
    if (storedTodos) settodos(storedTodos);
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_TODOS, JSON.stringify(todos));
    // console.log("here is the todo item : "+JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    const storedCompletedTodos = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_KEY_COMPLETED_TODOS)
    );
    if (storedCompletedTodos) setcompletedTodos(storedCompletedTodos);
  }, []);

  useEffect(() => {
    localStorage.setItem(
      LOCAL_STORAGE_KEY_COMPLETED_TODOS,
      JSON.stringify(completedTodos)
    );
  }, [completedTodos]);

  function handleAddTodo(e) {
    const taskName = todoNameRef.current.value;
    if (taskName === "") return;
    settodos(prevTodos => {
      return [{ id: uuidv4(), name: taskName, complete: false }, ...prevTodos];
    });
    todoNameRef.current.value = null;
  }

  function handleToggle(todoObject) {
    // console.log("todo obj : "+ JSON.stringify(todoObject));
    if (!todoObject.complete) {
      // console.log("here in if");
      let newTodos = [...todos];
      const todo = newTodos.find(todo => todo.id === todoObject.id);
      if (todo) {
        todo.complete = true;
        newTodos = newTodos.filter(todo => todo.id !== todoObject.id);
        settodos(newTodos);
        const newCompletedTodos = [...completedTodos, todo];
        setcompletedTodos(newCompletedTodos);
      }
    } else {
      // console.log("here in else");
      let newCompletedTodos = [...completedTodos];
      const completedTodo = newCompletedTodos.find(
        todo => todo.id === todoObject.id
      );
      completedTodo.complete = false;
      newCompletedTodos = newCompletedTodos.filter(
        todo => todo.id !== todoObject.id
      );
      setcompletedTodos(newCompletedTodos);

      const newTodos = [...todos, completedTodo];
      settodos(newTodos);
    }
  }

  function deleteCompletedTasks() {
    setcompletedTodos([]);
  }

  function deleteSingleTask(id) {
    let newTodos = [...todos];
    newTodos = newTodos.filter(item => item.id !== id);
    settodos(newTodos);
  }

  return (
    <div className="App">
      <h1>Offline-TodoList</h1>
      <Container>
        <Row>
          <Col md={{ span: 6, offset: 3 }}>
            <Row>
              <Col md={12} lg={12}>
                <Form className="task-form">
                  <Form.Group controlId="header">
                    <InputGroup className="mb-3">
                      <FormControl
                        ref={todoNameRef}
                        aria-label="todoName"
                        aria-describedby="add todo task here "
                        placeholder="Add task here ...."
                      />
                      <InputGroup.Append>
                        <Button
                          onClick={handleAddTodo}
                          size="default"
                          variant="info"
                          type="submit"
                        >
                          +
                        </Button>
                      </InputGroup.Append>
                    </InputGroup>
                  </Form.Group>
                  <TodoList
                    todos={todos}
                    toggleTodo={handleToggle}
                    deleteTodo={deleteSingleTask}
                  ></TodoList>
                </Form>
              </Col>
            </Row>

            <Row>
              <div className="seprator">
                <Col md={6} lg={6}>
                  <h2 className="done-title">Done</h2>
                </Col>
                <Col md={6} lg={6}>
                  <Button
                    onClick={deleteCompletedTasks}
                    size="sm"
                    variant="danger"
                    className="btn-delete-all"
                  >
                    Delete Completed
                  </Button>
                </Col>
              </div>
            </Row>

            <Row>
              <Col md={12} lg={12}>
                <Form className="task-form-completed">
                  <Row>
                    <Col md={12} lg={12}>
                      <TodoList
                        todos={completedTodos}
                        toggleTodo={handleToggle}
                      ></TodoList>
                    </Col>
                  </Row>
                </Form>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
