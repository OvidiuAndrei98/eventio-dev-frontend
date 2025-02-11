import React, { useState } from 'react'
import './TodoList.css'
import { Button, Checkbox } from 'antd'
import { CloseOutlined } from '@ant-design/icons'

interface Todo {
  id: number
  completed: boolean
  text: string
}

function TodoList() {
  const [task, setTask] = useState('')
  const [todos, setTodos] = useState<Todo[]>([])

  const handleChange = (event: Event) => {
    setTask((event.target as any).value) // eslint-disable-line
  }

  const handleAddTask = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (task.trim()) {
        setTodos([
          ...todos,
          { completed: false, text: task, id: todos.length + 1 },
        ])
        setTask('')
      }
    }
  }

  const handleRemoveTask = (index: number) => {
    const newTodos = todos.filter((_: any, i: number) => i !== index) // eslint-disable-line
    setTodos(newTodos)
  }

  const updateTodoState = (todo: Todo, index: number) => {
    const todosCopy = [...todos]
    const targetedTodo = todo
    targetedTodo.completed = !todo.completed
    setTodos([
      ...todosCopy.slice(0, index),
      targetedTodo,
      ...todosCopy.slice(index + 1),
    ])
  }

  return (
    <div className="todos-container">
      <div className="add-task-container">
        <input
          type="text"
          value={task}
          onKeyDown={(e) => handleAddTask(e.nativeEvent)}
          onChange={(e) => handleChange(e.nativeEvent)}
          placeholder="Adauga un task nou"
        />
      </div>

      <ul className="todos">
        {todos.map((todo: Todo, index: number) => (
          <li
            className="todo"
            style={{
              backgroundColor: todo.completed ? 'rgb(239 239 239)' : 'inherit',
            }}
            key={index}
          >
            <div className="checkbox-container">
              <Checkbox
                onClick={() => updateTodoState(todo, index)}
                checked={todo.completed}
              />
            </div>
            <div
              className="text-container"
              style={{
                textDecoration: todo.completed ? 'line-through' : 'none',
              }}
            >
              {todo.text}
            </div>
            <div className="remove-container">
              <Button
                type="text"
                onClick={() => handleRemoveTask(index)}
                icon={<CloseOutlined />}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default TodoList
