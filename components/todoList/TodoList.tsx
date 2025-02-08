import React, { useState } from 'react'
import './TodoList.css'
import { Button } from 'antd'
import { CloseOutlined } from '@ant-design/icons'

function TodoList() {
  const [task, setTask] = useState('')
  const [todos, setTodos] = useState<any>([])

  const handleChange = (event: any) => {
    setTask(event.target.value)
  }

  const handleAddTask = () => {
    if (task.trim()) {
      setTodos([...todos, task])
      setTask('')
    }
  }

  const handleRemoveTask = (index: number) => {
    const newTodos = todos.filter((_: any, i: number) => i !== index) // eslint-disable-line
    setTodos(newTodos)
  }

  return (
    <div className="todos-container">
      <div className="add-task-container">
        <input
          type="text"
          value={task}
          onChange={handleChange}
          placeholder="Adauga un task nou"
        />
        <Button onClick={handleAddTask} type="primary">
          Adauga
        </Button>
      </div>

      <ul className="todos">
        {todos.map((todo: any, index: number) => (
          <li className="todo" key={index} data-position={'○'}>
            {todo}
            <Button
              type="text"
              onClick={() => handleRemoveTask(index)}
              icon={<CloseOutlined />}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default TodoList
