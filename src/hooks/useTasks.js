import { useCallback, useState } from "react";
import {
  createTask as createTaskApi,
  fetchTasks,
  removeTask as removeTaskApi,
  updateTask as updateTaskApi,
} from "../services/taskService";

export default function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");

  const loadTasks = useCallback(async (retryCount = 2) => {
    setLoading(true);
    setError("");

    let lastError = null;

    for (let attempt = 0; attempt <= retryCount; attempt += 1) {
      try {
        const response = await fetchTasks();
        setTasks(response);
        setLoading(false);
        return;
      } catch (err) {
        lastError = err;
      }
    }

    setError(lastError?.message || "Failed to load tasks");
    setLoading(false);
  }, []);

  async function createTask(taskData) {
    setActionError("");
    setActionLoading(true);

    const tempId = `temp-${Date.now()}`;
    const optimisticTask = {
      id: tempId,
      title: taskData.title,
      description: taskData.description || "",
      status: taskData.status,
      priority: taskData.priority,
      dueDate: taskData.dueDate,
      createdAt: new Date().toISOString(),
    };

    setTasks((prev) => [optimisticTask, ...prev]);

    try {
      const savedTask = await createTaskApi(taskData);
      setTasks((prev) =>
        prev.map((task) => (task.id === tempId ? savedTask : task)),
      );
      setActionLoading(false);
      return true;
    } catch (err) {
      setTasks((prev) => prev.filter((task) => task.id !== tempId));
      setActionError(err.message || "Could not create task");
      setActionLoading(false);
      return false;
    }
  }

  async function editTask(taskId, updates) {
    setActionError("");
    setActionLoading(true);

    const previousTask = tasks.find((task) => task.id === taskId);

    if (!previousTask) {
      setActionLoading(false);
      return false;
    }

    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              ...updates,
            }
          : task,
      ),
    );

    try {
      await updateTaskApi(taskId, updates);
      setActionLoading(false);
      return true;
    } catch (err) {
      setTasks((prev) =>
        prev.map((task) => (task.id === taskId ? previousTask : task)),
      );
      setActionError(err.message || "Could not update task");
      setActionLoading(false);
      return false;
    }
  }

  async function changeStatus(taskId, status) {
    return editTask(taskId, { status });
  }

  async function deleteTask(taskId) {
    setActionError("");
    setActionLoading(true);

    const originalIndex = tasks.findIndex((task) => task.id === taskId);
    const originalTask = tasks[originalIndex];

    if (!originalTask) {
      setActionLoading(false);
      return false;
    }

    setTasks((prev) => prev.filter((task) => task.id !== taskId));

    try {
      await removeTaskApi(taskId);
      setActionLoading(false);
      return true;
    } catch (err) {
      setTasks((prev) => {
        const updated = [...prev];
        updated.splice(originalIndex, 0, originalTask);
        return updated;
      });
      setActionError(err.message || "Could not delete task");
      setActionLoading(false);
      return false;
    }
  }

  return {
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
    clearActionError: () => setActionError(""),
  };
}
