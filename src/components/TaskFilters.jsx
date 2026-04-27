function TaskFilters({
  search,
  status,
  priority,
  sortBy,
  sortOrder,
  disabled,
  onReset,
  onSearchChange,
  onStatusChange,
  onPriorityChange,
  onSortByChange,
  onSortOrderChange
}) {
  return (
    <div className="filters-wrap">
      <div className="filters">
        <label>
          Search
          <input
            type="text"
            placeholder="Search task title..."
            value={search}
            disabled={disabled}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </label>

        <label>
          Status
          <select
            value={status}
            disabled={disabled}
            onChange={(event) => onStatusChange(event.target.value)}
          >
            <option value="all">All Status</option>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </label>

        <label>
          Priority
          <select
            value={priority}
            disabled={disabled}
            onChange={(event) => onPriorityChange(event.target.value)}
          >
            <option value="all">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>

        <label>
          Sort By
          <select
            value={sortBy}
            disabled={disabled}
            onChange={(event) => onSortByChange(event.target.value)}
          >
            <option value="dueDate">Due Date</option>
            <option value="createdAt">Created Date</option>
          </select>
        </label>

        <label>
          Order
          <select
            value={sortOrder}
            disabled={disabled}
            onChange={(event) => onSortOrderChange(event.target.value)}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </label>
      </div>

      <div className="filters-actions">
        <button type="button" className="ghost" disabled={disabled} onClick={onReset}>
          Reset Filters
        </button>
      </div>
    </div>
  )
}

export default TaskFilters
