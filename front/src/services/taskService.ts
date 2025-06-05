import {
  ref,
  set,
  push,
  get,
  update,
  serverTimestamp,
  onValue,
  off,
  Unsubscribe
} from "firebase/database";
import { db } from "./firebase";
import { fetchContacts } from "./fetchContacts";
import { getAuth, User as AuthUser } from "firebase/auth";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: boolean;
  createdAt: Date;
  targetDate: Date;
  completedAt: Date | null;
  creatorUid: string;
  assignedUsers: { [uid: string]: true };
}

interface FirebaseStoredTask {
  id?: string;
  title: string;
  description: string;
  status: boolean;
  createdAt: number | object;
  targetDate: number;
  completedAt: number | object | null;
  creatorUid: string;
  assignedUsers: { [uid: string]: true };
}

function mapFirebaseTaskToTask(firebaseTask: FirebaseStoredTask, id: string): Task {
  return {
    ...firebaseTask,
    id,
    createdAt: new Date(firebaseTask.createdAt as number),
    targetDate: new Date(firebaseTask.targetDate as number),
    completedAt: firebaseTask.completedAt ? new Date(firebaseTask.completedAt as number) : null,
  };
}

export async function createTask(
  taskDetails: { title: string, description: string, targetDate: Date },
  creator: AuthUser | null
): Promise<string> {
  if (!creator || !creator.uid) throw new Error("Usuário criador não autenticado.");
  if (!taskDetails.title || taskDetails.title.trim() === "") throw new Error("O título da tarefa é obrigatório.");
  if (!taskDetails.targetDate) throw new Error("A data alvo da tarefa é obrigatória.");

  const tasksNodeRef = ref(db, 'tasks');
  const newTaskRef = push(tasksNodeRef);
  const taskId = newTaskRef.key;

  if (!taskId) throw new Error("Não foi possível gerar ID para a nova tarefa.");

  let contacts: Array<{ uid: string; [key: string]: any }> = [];
  try {
    contacts = await fetchContacts();
  } catch (error) {
    console.error("Erro ao buscar contatos para designar tarefa:", error);
  }

  const assignedUsers: { [uid: string]: true } = {};
  assignedUsers[creator.uid] = true;
  contacts.forEach(contact => {
    if (contact.uid) {
      assignedUsers[contact.uid] = true;
    }
  });

  const newTaskPayload: FirebaseStoredTask = {
    title: taskDetails.title.trim(),
    description: taskDetails.description.trim(),
    status: false,
    createdAt: serverTimestamp(),
    targetDate: taskDetails.targetDate.getTime(),
    completedAt: null,
    creatorUid: creator.uid,
    assignedUsers: assignedUsers,
  };

  const updates: { [key: string]: any } = {};
  updates[`/tasks/${taskId}`] = newTaskPayload;

  Object.keys(assignedUsers).forEach(uid => {
    updates[`/userTasks/${uid}/${taskId}`] = true;
  });

  try {
    await update(ref(db), updates);
    return taskId;
  } catch (error) {
    console.error("Erro ao criar tarefa no Firebase:", error);
    throw error;
  }
}

export function listenToUserTasks(
  userId: string,
  selectedDate: Date | null,
  callback: (tasks: Task[]) => void,
  onError: (error: Error) => void,
  onLoading: (loading: boolean) => void
): Unsubscribe {
  onLoading(true);
  const userTasksPath = `userTasks/${userId}`;
  const userTasksRef = ref(db, userTasksPath);

  let activeTaskListeners: { [taskId: string]: Unsubscribe } = {};
  let initialLoadDone = false;
  let currentTasksMap = new Map<string, Task>();

  const mainUserTasksListener = onValue(userTasksRef, async (snapshot) => {
    Object.values(activeTaskListeners).forEach(unsubscribe => unsubscribe());
    activeTaskListeners = {};
    currentTasksMap = new Map<string, Task>();

    if (!snapshot.exists() || !snapshot.hasChildren()) {
      callback([]);
      if (!initialLoadDone) {
        onLoading(false);
        initialLoadDone = true;
      }
      return;
    }

    const taskIdsFromUser = Object.keys(snapshot.val());
    if (taskIdsFromUser.length === 0) {
      callback([]);
      if (!initialLoadDone) {
        onLoading(false);
        initialLoadDone = true;
      }
      return;
    }

    let tasksProcessedCounter = 0;

    const updateAndFilterList = () => {
      let taskList = Array.from(currentTasksMap.values());
      if (selectedDate) {
        const targetDayStart = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 0, 0, 0, 0).getTime();
        const targetDayEnd = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 23, 59, 59, 999).getTime();
        taskList = taskList.filter(task => {
          if (task.targetDate) {
             const taskTargetTime = task.targetDate.getTime();
             return taskTargetTime >= targetDayStart && taskTargetTime <= targetDayEnd;
          }
          return false;
        });
      }
      taskList.sort((a, b) => {
        const dateDiff = (a.targetDate?.getTime() || 0) - (b.targetDate?.getTime() || 0);
        if (dateDiff !== 0) return dateDiff;
        return (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0);
      });
      callback(taskList);
      if (!initialLoadDone && tasksProcessedCounter === taskIdsFromUser.length) {
        onLoading(false);
        initialLoadDone = true;
      }
    };
    if (taskIdsFromUser.length === 0) {
        if(!initialLoadDone) {
            onLoading(false);
            initialLoadDone = true;
        }
        updateAndFilterList();
        return;
    }
    tasksProcessedCounter = 0;
    taskIdsFromUser.forEach(taskId => {
      const taskPath = `tasks/${taskId}`;
      const taskNodeRef = ref(db, taskPath);
      activeTaskListeners[taskId] = onValue(taskNodeRef, (taskSnapshot) => {
        if (taskSnapshot.exists()) {
          const firebaseTask = taskSnapshot.val() as FirebaseStoredTask;
          if (firebaseTask.targetDate) {
            currentTasksMap.set(taskId, mapFirebaseTaskToTask(firebaseTask, taskId));
          } else {
            console.warn(`Tarefa ${taskId} não possui targetDate e não será exibida corretamente.`);
            currentTasksMap.delete(taskId);
          }
        } else {
          currentTasksMap.delete(taskId);
        }
        if (initialLoadDone) {
            updateAndFilterList();
        } else {
            tasksProcessedCounter++;
            if (tasksProcessedCounter === taskIdsFromUser.length) {
                updateAndFilterList();
                if(!initialLoadDone){
                    onLoading(false);
                    initialLoadDone = true;
                }
            }
        }
      }, (err) => {
        console.error(`Erro ao ouvir tarefa ${taskId}:`, err);
        currentTasksMap.delete(taskId);
        tasksProcessedCounter++;
        if (initialLoadDone || tasksProcessedCounter === taskIdsFromUser.length) {
            updateAndFilterList();
             if(!initialLoadDone && tasksProcessedCounter === taskIdsFromUser.length){
                onLoading(false);
                initialLoadDone = true;
            }
        }
      });
    });
  }, (error) => {
    console.error(`Erro ao ouvir ${userTasksPath}:`, error);
    Object.values(activeTaskListeners).forEach(unsubscribe => unsubscribe());
    activeTaskListeners = {};
    currentTasksMap.clear();
    onError(error);
    onLoading(false);
    initialLoadDone = true;
    callback([]);
  });
  return () => {
    mainUserTasksListener();
    Object.values(activeTaskListeners).forEach(unsubscribe => unsubscribe());
  };
}

export async function updateTask(
  taskId: string,
  updates: Partial<Pick<Task, 'title' | 'description' | 'status' | 'targetDate'>>
): Promise<void> {
  if (!taskId) throw new Error("ID da tarefa é obrigatório para atualização.");
  const taskRef = ref(db, `tasks/${taskId}`);
  const updatePayload: Partial<FirebaseStoredTask> = {};
  if (updates.title !== undefined) updatePayload.title = updates.title;
  if (updates.description !== undefined) updatePayload.description = updates.description;
  if (updates.status !== undefined) updatePayload.status = updates.status;
  if (updates.targetDate !== undefined) updatePayload.targetDate = updates.targetDate.getTime();
  if (typeof updates.status === 'boolean' && updates.status) {
    updatePayload.completedAt = serverTimestamp();
  } else if (typeof updates.status === 'boolean' && !updates.status) {
    updatePayload.completedAt = null;
  }
  await update(taskRef, updatePayload);
}

export async function deleteTask(taskId: string): Promise<void> {
  if (!taskId) throw new Error("ID da tarefa é obrigatório para deleção.");
  const auth = getAuth();
  const currentUserUid = auth.currentUser?.uid;
  if (!currentUserUid) throw new Error("Usuário não autenticado.");
  const taskRef = ref(db, `tasks/${taskId}`);
  const taskSnapshot = await get(taskRef);
  if (!taskSnapshot.exists()) {
    console.warn("Tentativa de deletar tarefa inexistente:", taskId);
    return;
  }
  const taskData = taskSnapshot.val() as FirebaseStoredTask;
  const updates: { [key: string]: null } = {};
  updates[`/tasks/${taskId}`] = null;
  if (taskData.assignedUsers) {
    Object.keys(taskData.assignedUsers).forEach(uid => {
      updates[`/userTasks/${uid}/${taskId}`] = null;
    });
  }
  await update(ref(db), updates);
}

export async function getTask(taskId: string): Promise<Task | null> {
  if (!taskId) return null;
  const taskRef = ref(db, `tasks/${taskId}`);
  const snapshot = await get(taskRef);
  if (snapshot.exists()) {
    const firebaseTask = snapshot.val() as FirebaseStoredTask;
    if (firebaseTask.targetDate) {
        return mapFirebaseTaskToTask(firebaseTask, taskId);
    }
    console.warn(`Tarefa ${taskId} não possui targetDate ao ser buscada individualmente.`);
    return null;
  }
  return null;
}