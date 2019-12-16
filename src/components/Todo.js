import React from "react";
import { Form, Button, InputGroup } from "react-bootstrap";

export default function Todo({ todo, toggleTodo, deleteTodo, completed }) {
  function handleTodoClick() {
    toggleTodo(todo);
  }

  function handleDeleteClick() {
    deleteTodo(todo.id);
  }

  return (
      <Form.Group controlId="formBasicCheckbox">
        
        <InputGroup className="mb-3">
          <InputGroup.Prepend>
            <InputGroup.Checkbox
              type="checkbox"
              label={todo.name}
              checked={todo.complete}
              onChange={handleTodoClick}
            />
          </InputGroup.Prepend>
          {/* <InputGroup.Text readOnly> {todo.name}</InputGroup.Text> */}
          <Form.Control className="single-todo-name" plaintext readOnly value={todo.name} />
          {/* <Form.Label>{todo.name}</Form.Label> */}

          <InputGroup.Append>
            {!completed && (
              <Button onClick={handleDeleteClick} size="sm" variant="danger">
                {" "}
                X{" "}
              </Button>
            )}
          </InputGroup.Append>
        </InputGroup>
      </Form.Group>
    
  );
}



