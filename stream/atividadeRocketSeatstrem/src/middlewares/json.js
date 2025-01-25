export async function json(request, response){
    const tasks = [];

    for await(const chunk of request){
        tasks.push(chunk);
    }
    try{
        request.body = JSON.parse(Buffer.concat(tasks).toLocaleString());
    }
    catch{
        response.body = null
    }
    return response.setHeader("Content-type", "application/json");
}