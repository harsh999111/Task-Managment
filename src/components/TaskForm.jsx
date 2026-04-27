import { useEffect, useState } from 'react'

function toInputDate(dateValue) {
  return dateValue ? new Date(dateValue).toISOString().split('T')[0] : ''
}

function TaskForm({ initialValues, onSubmit, onCancel, isSubmitting }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState('todo')
  const [priority, setPriority] = useState('medium')
  const [dueDate, setDueDate] = useState('')
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (initialValues) {
      setTitle(initialValues.title || '')
      setDescription(initialValues.description || '')
      setStatus(initialValues.status || 'todo')
      setPriority(initialValues.priority || 'medium')
      setDueDate(toInputDate(initialValues.dueDate))
      setErrors({})
    } else {
      setTitle('')
      setDescription('')
      setStatus('todo')
      setPriority('medium')
      setDueDate('')
      setErrors({})
    }
  }, [initialValues])

  function validate() {
    const nextErrors = {}

    if (!title.trim()) {
      nextErrors.title = 'Title is required'
    } else if (title.trim().length < 3) {
      nextErrors.title = 'Title must be at least 3 characters'
    }

    if (!dueDate) {
      nextErrors.dueDate = 'Due date is required'
    } else {
      const selectedDate = new Date(`${dueDate}T00:00:00`)
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      if (selectedDate < today) {
        nextErrors.dueDate = 'Due date cannot be in the past'
      }
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!validate()) {
      return
    }

    const success = await onSubmit({
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      dueDate: new Date(`${dueDate}T00:00:00`).toISOString()
    })

    if (!success) {
      return
    }

    if (!initialValues) {
      setTitle('')
      setDescription('')
      setStatus('todo')
      setPriority('medium')
      setDueDate('')
      setErrors({})
    }
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <h2>{initialValues ? 'Edit Task' : 'Create Task'}</h2>

      <label>
        Title
        <input
          type="text"
          value={title}
          disabled={isSubmitting}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Enter task title"
        />
        {errors.title && <span className="error-text">{errors.title}</span>}
      </label>

      <label>
        Description
        <textarea
          value={description}
          disabled={isSubmitting}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Task details"
          rows="3"
        />
      </label>

      <div className="form-row">
        <label>
          Status
          <select
            value={status}
            disabled={isSubmitting}
            onChange={(event) => setStatus(event.target.value)}
          >
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </label>

        <label>
          Priority
          <select
            value={priority}
            disabled={isSubmitting}
            onChange={(event) => setPriority(event.target.value)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>

        <label>
          Due Date
          <input
            type="date"
            value={dueDate}
            disabled={isSubmitting}
            onChange={(event) => setDueDate(event.target.value)}
          />
          {errors.dueDate && <span className="error-text">{errors.dueDate}</span>}
        </label>
      </div>

      <div className="form-actions">
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : initialValues ? 'Update Task' : 'Add Task'}
        </button>
        {onCancel && (
          <button type="button" className="ghost" disabled={isSubmitting} onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}

export default TaskForm
