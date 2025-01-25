// criando o banco de dados em memoria para salvar os dados assim não perdendo sempre que o server parar
import fs from 'node:fs/promises'

const databasePath =  new URL('db.json', import.meta.url)

export class DataBase{
    //inicializando com nenhum valor e tornando a variavel privada
    #database = {};
    constructor(){
        //criando um objeto para armazenar os dados
        fs.readFile(databasePath, 'utf8').then(data => { 
            this.#database = JSON.parse(data)
        })
        .catch(() => {
            this.#persist()
        })
    }
 
    #persist(){
        //persistindo os dados no arquivo
        fs.writeFile(databasePath, JSON.stringify(this.#database))
    }
    select(table, search) {
        //criando o select para retornar os dados da tabela
        let data = this.#database[table] ?? [];

        if(search){
            data = data.filter(row => {
                return Object.entries(search).some(([key, value]) => {
                    if(row[key] && row[key].toString().toLowerCase().includes(value.toLowerCase())){
                        return row[key].includes(value)
                    }
                })
            })
        }
        return data
    }
    insert(table, data) {
        //criando o insert para adicionar dados na tabela
        if(Array.isArray(this.#database[table])){
            this.#database[table].push(data)
        }
        else{
            this.#database[table] = [data]
        }
        this.#persist();
        return data;
    }
    update(table, id, data ) {
        //criando o update para atualizar os dados da tabela
        const rowIndex = this.#database[table].findIndex(row => row.id === id);
        if(rowIndex > -1) {
            const linhaAtual = this.#database[table][rowIndex];

            const atualizarLinha = { 
                ...linhaAtual, ...data
            };
            this.#database[table][rowIndex] = atualizarLinha;
            this.#persist();
        }
    } 
    delete(table, id) {
        //criando o delete para deletar os dados da tabela
        const rowIndex = this.#database[table].findIndex(row => row.id === id);
        if(rowIndex > -1){
            this.#database[table].splice(rowIndex, 1)
            this.#persist(); 
        }
    } 
}