const FAILURE_RATE = 0.2
const NETWORK_DELAY = 500

const STATUSES = ['todo', 'in_progress', 'done']
const PRIORITIES = ['low', 'medium', 'high']

let tasksDb = generateMockTasks(1200)

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomDate(fromDays, toDays) {
  const now = new Date()
  const daysToAdd = randomInt(fromDays, toDays)
  const result = new Date(now)
  result.setDate(now.getDate() + daysToAdd)
  return result.toISOString()
}

function generateMockTasks(count) {
  return Array.from({ length: count }, (_, index) => {
    const createdAt = randomDate(-45, -1)
    const dueDate = randomDate(-5, 25)

    return {
      id: String(index + 1),
      title: `Task ${index + 1}`,
      description: `This is task number ${index + 1}.`,
      status: STATUSES[randomInt(0, STATUSES.length - 1)],
      priority: PRIORITIES[randomInt(0, PRIORITIES.length - 1)],
      createdAt,
      dueDate
    }
  })
}

function simulateRequest(data) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < FAILURE_RATE) {
        reject(new Error('Request failed. Please try again.'))
        return
      }

      resolve(data)
    }, NETWORK_DELAY)
  })
}

export function fetchTasks() {
  return simulateRequest([...tasksDb])
}

export function createTask(taskData) {
  const newTask = {
    id: String(Date.now()),
    title: taskData.title,
    description: taskData.description || '',
    status: taskData.status || 'todo',
    priority: taskData.priority || 'medium',
    createdAt: new Date().toISOString(),
    dueDate: taskData.dueDate
  }

  return simulateRequest(newTask).then(() => {
    tasksDb = [newTask, ...tasksDb]
    return newTask
  })
}

export function updateTask(taskId, updates) {
  const taskIndex = tasksDb.findIndex((task) => task.id === taskId)

  if (taskIndex === -1) {
    return Promise.reject(new Error('Task not found'))
  }

  const updatedTask = {
    ...tasksDb[taskIndex],
    ...updates
  }

  return simulateRequest(updatedTask).then(() => {
    tasksDb[taskIndex] = updatedTask
    return updatedTask
  })
}

export function removeTask(taskId) {
  const taskIndex = tasksDb.findIndex((task) => task.id === taskId)

  if (taskIndex === -1) {
    return Promise.reject(new Error('Task not found'))
  }

  const deletedTask = tasksDb[taskIndex]

  return simulateRequest(deletedTask).then(() => {
    tasksDb = tasksDb.filter((task) => task.id !== taskId)
    return deletedTask
  })
}
