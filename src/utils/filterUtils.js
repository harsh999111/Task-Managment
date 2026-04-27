export function filterTasks(tasks, filters) {
  const { search, status, priority } = filters

  const normalizedSearch = search.trim().toLowerCase()

  return tasks.filter((task) => {
    const matchesSearch =
      !normalizedSearch || task.title.toLowerCase().includes(normalizedSearch)
    const matchesStatus = status === 'all' || task.status === status
    const matchesPriority = priority === 'all' || task.priority === priority

    return matchesSearch && matchesStatus && matchesPriority
  })
}
