import { memo } from 'react'

function formatDate(dateValue) {
  return new Date(dateValue).toLocaleDateString()
}

function toTitleCase(value) {
  return value.replace('_', ' ').replace(/\b\w/g, (char) => char.toUpperCase())
}

function TaskTable({ tasks, onEdit, onDelete, onStatusChange, disabled }) {
  if (!tasks.length) {
    return <p className="empty">No tasks found.</p>
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Created</th>
            <th>Due</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td>
                <strong>{task.title}</strong>
                <div className="desc">{task.description || '-'}</div>
              </td>
              <td>
                <select
                  value={task.status}
                  disabled={disabled}
                  onChange={(event) => onStatusChange(task.id, event.target.value)}
                >
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </td>
              <td>
                <span className={`pill pill-${task.priority}`}>
                  {toTitleCase(task.priority)}
                </span>
              </td>
              <td>{formatDate(task.createdAt)}</td>
              <td>{formatDate(task.dueDate)}</td>
              <td className="action-buttons">
                <button type="button" disabled={disabled} onClick={() => onEdit(task)}>
                  Edit
                </button>
                <button
                  type="button"
                  className="danger"
                  disabled={disabled}
                  onClick={() => onDelete(task.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default memo(TaskTable)
