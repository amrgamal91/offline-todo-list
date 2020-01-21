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

//google Analytics
import ReactGA from "react-ga";

// function initializeReactGA() {
ReactGA.initialize("UA-156602041-1");

ReactGA.pageview("/");




const LOCAL_STORAGE_KEY_TODOS = "todoApp.todos";
const LOCAL_STORAGE_KEY_COMPLETED_TODOS = "todoApp.todos.completed";

function App() {
  const [todos, settodos] = useState([]);
  const [completedTodos, setcompletedTodos] = useState([]);
  const todoNameRef = useRef();

  /**
   * set/get todo items in local storage 
   */
  useEffect(() => {
    const storedTodos = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_KEY_TODOS)
    );
    if (storedTodos) settodos(storedTodos);
  }, []);

  /**
   * updating the todo items in local storage when changes
   */
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_TODOS, JSON.stringify(todos));
    // console.log("here is the todo item : "+JSON.stringify(todos));
  }, [todos]);

  /**
   * set/get completed todo items in local stroage
   */
  useEffect(() => {
    const storedCompletedTodos = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_KEY_COMPLETED_TODOS)
    );
    if (storedCompletedTodos) setcompletedTodos(storedCompletedTodos);
  }, []);

  /**
   * upadate completed todo items in local storage when changed
   */
  useEffect(() => {
    localStorage.setItem(
      LOCAL_STORAGE_KEY_COMPLETED_TODOS,
      JSON.stringify(completedTodos)
    );
  }, [completedTodos]);


  /**
   * handle + button click :
   * update current todos by adding the new one to all todolist then , 
   * clear the input
   */
  function handleAddTodo(e) {
    const taskName = todoNameRef.current.value;
    if (taskName === "") return;
    settodos(prevTodos => {
      return [{ id: uuidv4(), name: taskName, complete: false }, ...prevTodos];
    });
    todoNameRef.current.value = null;
  }

  /**
   * there are 2 cases to handle toggle : 
   * 1- if check (mark item to be completed):
   *    set the complete flag then add it to completed list
   * 2- if check (remark item to be not completed):
   *    change the complete flag then add it to normal list
   * @param {todo object to be handled} todoObject 
   */
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

  /**
   * clear all completed tasks
   */
  function deleteCompletedTasks() {
    setcompletedTodos([]);
  }

  /**
   * delete one task from list
   * @param {id of task to be deleted} id 
   */
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
                <Col md={6} lg={6} className="done-col">
                  <h2 className="done-title">Done</h2>
                </Col>
                <Col md={6} lg={6} className="deleteAll-col">
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
