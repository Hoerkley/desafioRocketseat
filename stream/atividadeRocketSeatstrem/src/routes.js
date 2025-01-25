import { randomUUID } from "crypto";
import fs from "node:fs";
import { DataBase } from "./database.js";
import { buildRoutePath } from "./utils/build-route-path.js";
import csvParser from "csv-parser";
import { Transform, Writable } from "node:stream";

//let data = new Date();
const database = new DataBase()

export const routes = [
    { 
        // metodo para pegar todos as tasks
        method: "GET",
        path:buildRoutePath("/tasks"),
        handler: (request, response) => {
            const {search} = request.query

            const tasks = database.select("tasks", search ? {
                title: search,
                description: search
            }: null)
            return response.end(JSON.stringify(tasks));
        }
    }, 
    {
        // metodo para criar uma nova task
        method: "POST",
        path: buildRoutePath("/tasks"),
        handler: (request, response) => {
            //const {title , description } = request.body;
            //const csvPath = new URL('./tasks.csv', import.meta.url).pathname;
            const readableTasks = fs.createReadStream('file.csv')
            const transform = csvParser({separator: ','})
            const transformToString = new Transform({
                objectMode:true,
                transform(chunk, encoding, callback) {
                    callback(null, JSON.stringify(chunk))         
                },
            })
            const writableTasks = new Writable({
                write(chunk, encoding, callback){
                    const id = randomUUID()
                    const result2 = JSON.parse(chunk.toString())
                    const title = result2.title 
                    const description = result2.description
                    callback()
                    const juncao = {id, title, description, completed_at:null , created_at: Date(),updated_at:null} 
                    console.log("Tasks:",juncao)
                    return database.insert('tasks', juncao)      
                }  
            })
            const result = readableTasks.pipe(transform).pipe(transformToString).pipe(writableTasks)
            return response.writeHead(201).end();    
        } 
    },  
    {   
        // metodo para deletar uma task
        method: "DELETE",    
        path: buildRoutePath("/tasks/:id"),
        handler: (request, response) => { 
            const id = request.params.id
            database.delete("tasks", id) 
            return response.writeHead(204).end()
        } 
    },
    {
        // metodo para atualizar uma task
        method: "PUT",
        path: buildRoutePath("/tasks/:id"),
        handler: (request, response) => {
            const {id} = request.params
            const {title , description} = request.body;

            const tarefaAtual = database.select("tasks", id);
            const task = {
                ...tarefaAtual,
                ...(title && {title}),
                ...(description && {description}),
                updated_at: Date()
            }
            database.update("tasks", id, task)
            return response.writeHead(200).end() 
        }     
    },
    {
        // metodo para marcar uma task como concluida
        method: "PATCH",
        path: buildRoutePath("/tasks/:id/complete"),
        handler: (request, response) => {
            const id = request.params.id
            const {completed_at} = request.body
            const task = database.select("tasks", id)
            const taskAtualizada = {
                ...task, 
                completed_at,
                updated_at: Date()
            }
            database.update("tasks", id, taskAtualizada)
            return response.writeHead(200).end()
        }
    } 
]   