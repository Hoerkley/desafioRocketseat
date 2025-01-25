// criando o server para vir as requisições
import http from "node:http"
import { routes } from "./routes.js"
import { json } from "./middlewares/json.js"
import { extracQueryParams } from "./utils/extracQueryParams.js"

const server = http.createServer(async(request, response)=>{
    const {url, method} = request

    await json(request, response)
 
    const route = routes.find((route =>{
        return route.method === method && route.path.test(url)
    })) 
    if(route){
        const routesParams = request.url.match(route.path)
        const {query, ...params} = routesParams.groups
        request.params = params
        request.query = query ? extracQueryParams(query) : {}
        return route.handler(request, response)
    }
     
    return response.writeHead(404).end();

})
server.listen(3000) 