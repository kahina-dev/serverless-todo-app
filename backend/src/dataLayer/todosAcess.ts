import * as AWS from 'aws-sdk'
//import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';

const AWSXRay = require('aws-xray-sdk');
const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('TodosAccess')

// TODO: Implement the dataLayer logic
export class TodosAccess{

    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
    private readonly todosTable = process.env.TODOS_TABLE) { }

    async getAllTodos(userId: string): Promise<TodoItem[]> {
        console.log(`Getting all todos for user ${userId}`)
    
        const result = await this.docClient.query({
          TableName: this.todosTable,
          KeyConditionExpression: 'userId = :userId',
          ExpressionAttributeValues: {
          ':userId': userId
           },
          ScanIndexForward: false
        }).promise()
    
        const items = result.Items
        return items as TodoItem[]
      }

      async getTodo(userId: string, todoId: string):Promise<TodoItem> {
        console.log(`Getting todo item with ID #${todoId}`)
        const result = await this.docClient.get({
            TableName: this.todosTable,
            Key: {
              userId,
              todoId
            }
          }).promise()
        const item = result.Item

        return item as TodoItem
      }

      async createTodo(todoItem: TodoItem):Promise<TodoItem>{
        console.log(`Creating a new todo item`)
        const result = await this.docClient.put({
            TableName: this.todosTable,
            Item: todoItem
          }).promise()
      
          const item = result.Item
          return item as TodoItem
        }

        async updateTodo(userId: string, todoId: string, todoUpdate: TodoUpdate):Promise<TodoItem>{
            console.log(`Updating todo item having ID #${todoId} for user #${userId}`)
            const result = await this.docClient.update({
                TableName: this.todosTable,
                Key: {
                  userId,
                  todoId
                },
                UpdateExpression: "set name = :name, dueDate=:dueDate, done=:done",
                ExpressionAttributeValues:{
                    ":name":todoUpdate.name,
                    ":dueDate":todoUpdate.dueDate,
                    ":done":todoUpdate.done
                }
            }).promise()
            const item = result.Item
            return item as TodoItem
            }
      
            async deleteTodo(userId: string, todoId: string){
            console.log(`Deleting todo item having ID #${todoId} for user #${userId}`)
              await this.docClient.delete({
                  TableName: this.todosTable,
                  Key: {
                    userId,
                    todoId
                  }
                }).promise()  
            }
 }

      
        