'use client'

import { Modal } from 'antd'
import TodoList from './TodoList'

const TodoModal = ({
  open,
  onOk,
  onClose,
}: {
  open: boolean
  onOk: () => void
  onClose: () => void
}) => {
  return (
    <Modal
      className="todo-list-modal"
      title="Todo List"
      centered
      open={open}
      onOk={onOk}
      onCancel={onClose}
      maskClosable
      width={{
        xs: '90%',
        sm: '80%',
        md: '80%',
        lg: '40%',
        xl: '40%',
        xxl: '40%',
      }}
      footer={false}
    >
      <TodoList />
    </Modal>
  )
}

export default TodoModal
