import { TodosAccess } from '../dataLayer/todosAcess'
import { AttachmentUtils } from '../fileStogare/attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
import * as createError from 'http-errors'


const todosAccess = new TodosAccess()
const attachmentUtils = new AttachmentUtils()
const logger = createLogger('Todos')

export async function getTodosForUser(userId: string): Promise<TodoItem[]> {
    logger.info(`Getting todos for user ${userId}`)
    return await todosAccess.getAllTodos(userId)
}

export async function getTodo(userId: string, todoId: string): Promise<TodoItem> {
    return await todosAccess.getTodo(userId, todoId)
}

export async function createTodo(createTodoRequest: CreateTodoRequest, userId: string):Promise<TodoItem>{
    const todoId = uuid.v4()
    return await todosAccess.createTodo({
        userId: userId,
        todoId: todoId,
        createdAt: new Date().toISOString(),
        name: createTodoRequest.name,
        dueDate: createTodoRequest.dueDate,
        done: false,
        attachmentUrl: await attachmentUtils.getUrl(todoId)
      })
    }

    export async function updateTodo(updateTodoRequest: UpdateTodoRequest, userId: string, todoId: string):Promise<TodoUpdate>{
      const todoItem= await todosAccess.getTodo(userId, todoId)
      if (!todoItem) throw createError(404, 'This item does not exist!')
        return await todosAccess.updateTodo(
             userId,
             todoId,
            {name: updateTodoRequest.name,
            dueDate: updateTodoRequest.dueDate,
            done: updateTodoRequest.done})
    }

    export async function deleteTodo(userId: string, todoId: string){
        const todoItem= await todosAccess.getTodo(userId, todoId)
         if (!todoItem) throw createError(404, 'This item does not exist!')
         return await todosAccess.deleteTodo(userId, todoId)
    }

    export async function createAttachmentPresignedUrl(todoId: string): Promise<string> {
        return await attachmentUtils.getUploadUrl(todoId)
    }


    



