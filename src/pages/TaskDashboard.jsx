import { useEffect, useMemo, useState } from 'react'
import Loader from '../components/Loader'
import Pagination from '../components/Pagination'
import SideModal from '../components/SideModal'
import TaskFilters from '../components/TaskFilters'
import TaskForm from '../components/TaskForm'
import TaskTable from '../components/TaskTable'
import ToastContainer from '../components/ToastContainer'
import useDebounce from '../hooks/useDebounce'
import useTasks from '../hooks/useTasks'
import { filterTasks } from '../utils/filterUtils'
import { sortTasks } from '../utils/sortUtils'

const PAGE_SIZE = 10

function TaskDashboard() {
  const {
    tasks,
    loading,
    actionLoading,
    error,
    actionError,
    loadTasks,
    createTask,
    editTask,
    changeStatus,
    deleteTask,
    clearActionError
  } = useTasks()

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [sortBy, setSortBy] = useState('dueDate')
  const [sortOrder, setSortOrder] = useState('asc')
  const [currentPage, setCurrentPage] = useState(1)
  const [editingTask, setEditingTask] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [toasts, setToasts] = useState([])

  const debouncedSearch = useDebounce(search, 300)

  useEffect(() => {
    loadTasks()
  }, [loadTasks])

  function showToast(message, type = 'info') {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev, { id, message, type }])

    window.setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id))
    }, 3000)
  }

  function removeToast(id) {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  useEffect(() => {
    if (error) {
      showToast(error, 'error')
    }
  }, [error])

  useEffect(() => {
    if (actionError) {
      showToast(actionError, 'error')
    }
  }, [actionError])

  const filteredAndSortedTasks = useMemo(() => {
    const filtered = filterTasks(tasks, {
      search: debouncedSearch,
      status: statusFilter,
      priority: priorityFilter
    })

    return sortTasks(filtered, sortBy, sortOrder)
  }, [tasks, debouncedSearch, statusFilter, priorityFilter, sortBy, sortOrder])

  const totalPages = Math.max(1, Math.ceil(filteredAndSortedTasks.length / PAGE_SIZE))

  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearch, statusFilter, priorityFilter, sortBy, sortOrder])

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  const paginatedTasks = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    const end = start + PAGE_SIZE
    return filteredAndSortedTasks.slice(start, end)
  }, [filteredAndSortedTasks, currentPage])

  async function handleSubmit(formData) {
    if (editingTask) {
      const success = await editTask(editingTask.id, formData)

      if (success) {
        setEditingTask(null)
        setIsFormOpen(false)
        showToast('Task updated', 'success')
      }

      return success
    }

    const success = await createTask(formData)
    if (success) {
      setIsFormOpen(false)
      showToast('Task created', 'success')
    }
    return success
  }

  function handleEdit(task) {
    setEditingTask(task)
    clearActionError()
    setIsFormOpen(true)
  }

  function handleOpenCreate() {
    setEditingTask(null)
    clearActionError()
    setIsFormOpen(true)
  }

  async function handleDelete(taskId) {
    const shouldDelete = window.confirm('Are you sure you want to delete this task?')

    if (!shouldDelete) {
      return
    }

    const success = await deleteTask(taskId)
    if (success) {
      showToast('Task deleted', 'success')
    }
  }

  async function handleStatusChange(taskId, status) {
    const success = await changeStatus(taskId, status)
    if (success) {
      showToast('Status updated', 'success')
    }
  }

  function handleCancelEdit() {
    setEditingTask(null)
    setIsFormOpen(false)
    clearActionError()
  }

  function handleResetFilters() {
    setSearch('')
    setStatusFilter('all')
    setPriorityFilter('all')
    setSortBy('dueDate')
    setSortOrder('asc')
    setCurrentPage(1)
  }

  const startItem = filteredAndSortedTasks.length
    ? (currentPage - 1) * PAGE_SIZE + 1
    : 0
  const endItem = Math.min(currentPage * PAGE_SIZE, filteredAndSortedTasks.length)

  return (
    <div className="dashboard">
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      <header>
        <div className="header-top">
          <div>
            <h1>Task Management Dashboard</h1>
            <p>
              Total tasks: {tasks.length} | Showing {startItem}-{endItem} of{' '}
              {filteredAndSortedTasks.length}
            </p>
          </div>
          <button type="button" disabled={actionLoading} onClick={handleOpenCreate}>
            + Create Task
          </button>
        </div>
      </header>

      <TaskFilters
        search={search}
        status={statusFilter}
        priority={priorityFilter}
        sortBy={sortBy}
        sortOrder={sortOrder}
        disabled={actionLoading}
        onReset={handleResetFilters}
        onSearchChange={setSearch}
        onStatusChange={setStatusFilter}
        onPriorityChange={setPriorityFilter}
        onSortByChange={setSortBy}
        onSortOrderChange={setSortOrder}
      />

      {loading && <Loader text="Loading tasks..." />}

      {actionLoading && <Loader text="Saving changes..." />}

      {!loading && error && (
        <div className="error-box">
          <span>{error}</span>
          <button type="button" onClick={() => loadTasks()}>
            Retry
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
          <TaskTable
            tasks={paginatedTasks}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
            disabled={actionLoading}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredAndSortedTasks.length}
            disabled={actionLoading}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      <SideModal isOpen={isFormOpen} onClose={handleCancelEdit}>
        <TaskForm
          initialValues={editingTask}
          onSubmit={handleSubmit}
          isSubmitting={actionLoading}
          onCancel={handleCancelEdit}
        />
      </SideModal>
    </div>
  )
}

export default TaskDashboard
