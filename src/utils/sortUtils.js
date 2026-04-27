export function sortTasks(tasks, sortBy, sortOrder = 'asc') {
  const sortedTasks = [...tasks]
  const direction = sortOrder === 'asc' ? 1 : -1

  sortedTasks.sort((a, b) => {
    const first = new Date(a[sortBy]).getTime()
    const second = new Date(b[sortBy]).getTime()

    return (first - second) * direction
  })

  return sortedTasks
}
