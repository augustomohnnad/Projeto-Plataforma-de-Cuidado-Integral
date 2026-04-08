# 🚀 Projeto Plataforma de Cuidado Integral (PCI)
## 📌 Sobre o Projeto

A **Plataforma de Cuidado Integral (PCI)**, foi desenvolvida para gerenciar pacientes e seus agendamentos como:

* Cadastro de Paciente e sua observaçoes.

* Agendamento de horarios para visitas ao paciente.

* Conclusão do serviços prestado ao paciente.

* Pesquisa dos atendimento a  paciente especifico.

Permitindo um CRUD de forma organizada.

## 🛠️Tecnologias utilizadas

* Node.js
* Express
* SQLite
* SQLite3
* Postman
* Nodemon

## 📦Instalação

Com o GitBash aberto execute o comando a baixo, isso fará com que o npm instale as dependências e configurações necessárias contidas no package.json.

```bash
npm install
```


## ▶️Como Executar

Em seu terminal do gitbash execute o comando a baixo

```bash
npm run dev
```

`http://localhost:3000`

[Clique Aqui](http://localhost:3000)

---

## 🗄️Banco de Dados

O projeto utiliza o SQLite pela sua portabilidade e eficiência. Abaixo, detalhamos a inicialização do banco, onde ativamos o suporte a chaves estrangeiras via PRAGMA.

**Conexão ```src/database/config/config.js```**
~~~javascript
const sqlite3 = require("sqlite3"); // importamos o dialeto do Sqlite
const { open } = require("sqlite"); // importamos o motor do Sqlite

//Essa função assincrona cria o banco de dados 
openDb = async () => {
  try {
    const db = await open({
    filename: "./src/database/cuidadoIntegral.db",// O caminho de criação do Banco
    driver: sqlite3.Database
    })

    //Ativação da FOREING KEYS para uso, sem isso o Sqlite não entende seu uso
    await db.exec("PRAGMA foreign_keys = ON;");
    return db
    
  } catch (error) {
    console.log(`Não foi possivel cria banco ${error}`)
  };
  
}

module.exports = {openDb}
~~~


---


### 🏥 Modelagem: Tabela Pacientes
**Arquivo: ```src/database/models/model_paciente.js```**

A tabela de pacientes utiliza restrições de unicidade para evitar duplicidade de registros.


| Campo            | Descrição                 |
| ---------------- | ------------------------- |
| id               | Idenficador único         |
| nome_paciente    | Nome do Paciente          |
| cpf              | Documento do paciente     |
| endereço         | Localização               |
| cep              | Codigo Postal             |
| nome_solicitante | Quem registrou            |
|contato_resp      | contacto                  |
| Observação       | Algo incomun com Paciente |
| status_paciente  | Status (Padrão: Ativo)    |

---
```Javascript
class modelPaciente {
    constructor(db) {
        this.db = db
    }

    tabelaPacientes = async () => {
        const sql = (`
        CREATE TABLE IF NOT EXISTS tb_pacientes(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome_paciente TEXT,
            cpf TEXT UNIQUE,
            endereco TEXT,
            cep INT,
            contato_responsavel TEXT,
            observacao TEXT,
            status_paciente TEXT DEFAULT 'ATIVO'
            )
        `)

        await this.db.exec(sql)
    }
```
---

### 🏥 Modelagem: Tabela Agenda
**Arquivo: ```src/database/models/model_agenda.js```**

A tabela Agenda, essa é uma tabela que possui um toque especial que é a **FOREIGN KEY**, segue sua estrutura

| Campo               | Descrição                 |
| ----------------    | ------------------------- |
| id                  | Idenficador único         |
|paciente_vinculado   | FK ta_paciente(id)        |
| cpf                 | Documento do paciente     |
| dia_atendimento     | dia para o atendimento    |
| hora_atendimento    | Horario para o atendimento|
| nome_solicitante    | Quem registrou            |
|resultado_atendimento|resultado do atendimento|
| Observação          | Algo incomun com Paciente |
| atus_agendamento    | Status (Padrão: Agendado) |

```javascript
class modelAgenda {
    constructor(db) {
        this.db = db
    }

    tabelaAgenda = async () => {
        const sql = (`
            CREATE TABLE IF NOT EXISTS tb_agenda(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            paciente_vinculado INTEGER,
            descricao_atendimento TEXT,
            dia_atendimento TEXT,
            hora_atendimento TEXT,
            resultado_atendimento TEXT,
            status_agendamento TEXT DEFAULT 'AGENDADO',

            FOREIGN KEY (paciente_vinculado) REFERENCES tb_pacientes(id)
        )

            
        `)

        return await this.db.exec(sql)
        
    }
```
Como visto acima temos uma **FOREIGN KEY (paciente_vinculado) REFERENCES tb_pacientes(id)**, isso faz com que eu crie um relacimento da tabela Agenda com a tabela Paciente, nessa linha de codigo eu digo, pegue minha coluna **paciente_vinculado** ela ira receber da minha tabela Paciente o seus dados da coluna **ID**.

---

## 🧾 Estrutura das Camadas (MVC)

O projeto está organizado sob o padrão MVC (Model-View-Controller) para garantir escalabilidade:

Model (**Camada de Dados**): Gerencia a persistência e o SQL puro. Localizada em ```src/database/models```.

Controller (**Regra de Negócio**): Onde reside a lógica, validações (como de CPF e existência de ID) e as respostas HTTP (Status Codes), localizada em ```src/controllers```.

Modules (**Coração da Injeção ou refatoração de codigo**) é onde a magica acontecece, onde tudo se conecta, onde eu estancio as classes do projeto e faz as injeções de depedênciaz, localizada em ```src/modules```

Routes: Define os endpoints da API Localizada em ```src/router```.

## ⚙️ Inicialização e Injeção (Modules & Server)
Para que o padrão MVC funcione sem erros de dependência, utilizamos uma camada de Modules. Ela é responsável por instanciar os Models e injetá-los nos Controllers.

**Arquivo: ```src/modules/modules_paciente.js```**
Aqui é onde tudo se conecta irei explicar o codigo a seguir:

```javascript
// IMPORTANTE: retorna o objeto de conexão que será injetado nos nossos Models.
const {openDb} = require("../database/config/configDatabase")
// Retorna no modelPaciente a classe de Model_paciente.js
const modelPaciente = require("../database/models/model_pacientes")
// Retorna no controllerPaciente a istancia de controllerPaciente.js
const controllerPacientes = require("../controllers/controllerPacientes")
//retorna para routerPaciente as rotas com seu methodos de rotas_pacientes
const routerPacientes = require("../router/rotas_pacientes")

//Função de injeção de dependecia(tudo se conectara aqui)
const modulesPaciente = async (app) => {
 // db espera a conexão do banco de dados(conexão do banco de dados)
  const db = await openDb()
 // passa a conxão aberta para o modelPaciente
  const pacienteModel = new modelPaciente(db)
 // Aqui pacienteModel executa meu metodo para criação de tabela
  await pacienteModel.tabelaPacientes()

 //O Controller recebe a instância de pacienteModel, ganhando a capacidade de realizar operações no banco de dados através dos métodos definidos na classe Model.
  const controller = new controllerPacientes(pacienteModel)
 //Acopla as rotas ao servidor Express, passando o controller pronto para uso
  app.use("/api/pacientes", routerPacientes(controller))
}

module.exports = modulesPaciente
```

o Objetivo desse **Modules_paciente** é centralizar a injecção de de depedencia, deixando o server.js mais limpo r organizado, isso foi pensado pois estava me confundindo na hora de de organizar todos os arquivos.

**O modules_agenda.js segue o mesmo raciocinio**

---
### ⚙️ Inicialização(Server)
O arquivo ```server.js``` é o Ponto de entrada da aplicação. Sua função principal é configurar o ambiente de execução e levantar o servidor HTTP para ouvir as requisições.

```javascript
//importamos o dialeto do express para configuração
const express = require("express");
// Cors funciona como um agente de seguração permitindo isolando api te terceiros que não esteja configurado a requisitar dados
const cors = require('cors')
// importamos nossa logica de refatoração da pasta modules
const modulesPaciente = require("./modules/module_pacientes");
const modulesAgenda = require("./modules/modules_agenda");

// app recebe o express para instancia da aplicação permitindo configura rotas(GET, POST e etc)
const app = express();
// Falamos que o app recebera um segurança para vigiar sua api
app.use(cors())
// "Middleware responsável por realizar o parse do corpo das requisições (body) de JSON para objetos JavaScript, permitindo o acesso via req.body
app.use(express.json());

// Função para ligar motor do sistema
async function start() {
  // Aguarda toda a ingeção de depedencia o calback(app) faz com que ele receba o express para gerenciar a configuração das suas rotas
  await modulesPaciente(app)
  await modulesAgenda(app)

  // a porta na qual o sistema ira ficar
  const PORT = 3000;
  // para ouvir a porta
  app.listen(PORT, () => {
      console.log(`Servidor rodando: http://127.0.0.1:${PORT}`)
  })
}
// Aqui roda a chave dando partida no motor depois de tudo verificado
start()
```

Com a injeções de depedencia(**Pasta Modules**) emvolve abertura de banco de dados , o uso do async/await no start() garante que o servidor so abra para o publico(**app.listen**) apos a conexão do banco de dados  estabelecida com sucesso.

Isso também faz com que o sistema não receba nenhuma requisição sem antes o banco e as tabelas estejam prontas.

## 🎮 Controladores (Controllers)
Localização: ```src/controllers/```

O Controller é o cérebro da rota, ele que recebe suas requisições e resposta nele encantramos a logica para:

* Validar: Verificar se o usuario enviou todos os dados necessarios.

* Processar: Converter string em numero, datas e etc.

* Responder: Decidir qual o ```Status code```(200, 201, 400, 404, 500) devolver para o Front-End

Exemplo: ```src/controller/controllerPacientes.js```

```javascript
// classe com seus metodos
class Paciente {
    //contructor recebendo a variavel constructora que retornara p corpo da requisição para o metodo metodo selecionado do Model_paciente
    constructor(pacienteModel) {
        this.pacienteModel = pacienteModel
    }
    // Metodo de cadastro Insert
    cadastroPaciente = async (req, res) => {
      //exeção
      try {
        //Destruturação do banco de dados enviado no corpo da requisição
        const {nome_paciente, cpf, endereco, cep, contato_responsavel, observacao} = req.body
        // Validação para verificar se no corpo o CPF esta preenchido ou é maior que 11 digitos
        if(!req.body.cpf || req.body.cpf.length !== 11) {
            //Interrompe mapeando o erro do codigo e lança um exeção personalizada
            throw  new Error(`${nome_paciente} com CPF vazio ou menor que 11 digitos.`);

        } else {
            // Se tudo deu certo ele acrecenta isso na variavel contructor e chama o metodo do model paciente com o corpo da requisição devidamente preenchida na ordem
            await this.pacienteModel.insertPaciente(nome_paciente, cpf, endereco, cep, contato_responsavel, observacao)
            //Envia a resposta http com seu devido status
            res.status(201).send(`${nome_paciente}, cadastrado com sucesso`)
        }
      // se passou pelo Try o catch atuara como um else armazenando o erro no calback (e)
      } catch (e) {
          //Verifica o que o throw mandou no retorno da mensagem no caso aqui ele verifica se a mensagem é relacionada a banco de dados
          if(e.message.includes("UNIQUE constraint failed: tb_pacientes.cpf")) {   // Apresenta no console o erro
              console.error(`[ERRO NO CADASTRO]: ${e.message}`)
              // Retorna a resposta http com seu devido status
              return res.status(400).json({
                  erro: true, 
                  mensagem: e.message
              })
          } 
          //Caso não seja nenhum dos erros acima ele retorna um erro generico restrito ao desenvolvedor e para o cliente apenas dis que houve um problema
          console.error(`[ERRO NO SERVIDOR]: ${e.message}`)
          return res.status(500).json({
              erro: true, 
              mensagem: e.message
          })
          
      }
        
    };

```
O Controller atua como o intermediário entre a Requisição do Usuário e a Persistência de Dados. Abaixo, as principais técnicas aplicadas:

* **Injeção de Dependência**
O Controller não cria o seu próprio Model. Ele o recebe via constructor. Isso permite que o Controller seja testado e mantido de forma isolada do driver de banco de dados.

* **Falha Rápida**
Implementamos uma validação proativa no campo CPF. Antes mesmo de consultar o banco, o sistema verifica se o dado é válido (11 dígitos). Isso economiza recursos do servidor e previne erros de integridade.

* **Tratamento de Exceções (Try/Catch/Throw)**
Utilizamos um sistema de captura de erros em camadas:

Throw Manual: Lançamos um erro personalizado quando a regra de negócio (CPF) é violada.

Catch Reativo: Capturamos erros provenientes do SQLite, como o UNIQUE constraint failed, transformando um erro técnico do banco em uma mensagem amigável para o Front-end.

## 🛤️ Rotas (Router)
Localização: ```src/router/rotas_paciente.js```

As rotas são a porta de entrada da  API. Elas definem o Método HTTP (POST, GET, PUT, DELETE) 

```javascript
//Importação do express
const express = require("express")

// O roteador exporta uma função que recebe o controller por injeção.
// Isso garante o desacoplamento: a rota não precisa saber como o controller foi criado.
module.exports = (controller) => {
    // Instancia o roteador do Express para gerenciar endpoints específicos
    const router = express.Router()
    // Rota de acesso POST para cadastro
    router.post("/", (req, res) =>controller.cadastroPaciente(req, res))
    // Rota de acesso GET para para listar todos os pacientes
    router.get("/", (req, res) => controller.listarPacientes(req, res))
    //Rota de acesso GET para para listar paciente por ID(Indentificado unico)
    router.get("/:id", (req, res) => controller.getIdPaciente(req, res))
    //Rota de acesso PUT para para Atualiza um paciente por ID(Indentificado unico)
    router.put("/:id", (req, res) => controller.editarPaciente(req, res))
    //Rota de acesso Delete para para deletar um paciente por ID(Indentificado unico)
    router.delete("/:id", (req, res) => controller.deletPaciente(req, res))

    return router
}
```

## 🔗 Endpoints da API (Interface de Comunicação)
Esta seção descreve como interagir com a PCI. Cada endpoint espera um formato específico de dados e retorna um código de status HTTP que indica o sucesso ou falha da operação.

```javascript
router.post("/", (req, res) => controller.cadastroPaciente(req, res))
```
* **POST Cadastrar-Pacientes:** ```[POST](http://127.0.0.1:3000/api/pacientes)```

A rota espera a o envio do objeto no corpo da requisição:

```json
{
    "nome_paciente": "Elias de Souza", 
    "cpf": "12345678911", 
    "endereco": "Rua das americas", 
    "cep": "25890-98", 
    "contato_responsavel": "12345-9895", 
    "observacao": "Paciente toma remedios para preção de 3h em 3h"
}

```

o controller verifica no seu metodo cadastroPaciente:
```javascript
class Paciente {
    constructor(pacienteModel) {
        this.pacienteModel = pacienteModel
    }

    cadastroPaciente = async (req, res) => {
        try {
             const {nome_paciente, cpf, endereco, cep, contato_responsavel, observacao} = req.body

            if(!req.body.cpf || req.body.cpf.length !== 11) {
                throw  new Error(`${nome_paciente} com CPF vazio ou menor que 11 digitos.`);

            } else {
                await this.pacienteModel.insertPaciente(nome_paciente, cpf, endereco, cep, contato_responsavel, observacao)

                res.status(201).send(`${nome_paciente}, cadastrado com sucesso`)
            }

        } catch (e) {
            if(e.message.includes("UNIQUE constraint failed: tb_pacientes.cpf")) {
                console.error(`[ERRO NO CADASTRO]: ${e.message}`)
                return res.status(400).json({
                    erro: true, 
                    mensagem: e.message
                })
            } 

            console.error(`[ERRO NO SERVIDOR]: ${e.message}`)
            return res.status(500).json({
                erro: true, 
                mensagem: e.message
            })
            
        }
        
    };
```
Se tudo der certo a Variavel contrutora enviara os dados o model_paciente.js:

```Javascript
insertPaciente = async (nome_paciente, cpf, endereco, cep, contato_responsavel, observacao) => {
        const sql = (`
            INSERT INTO tb_pacientes(
            nome_paciente, 
            cpf, 
            endereco, 
            cep, 
            contato_responsavel, 
            observacao) VALUES (?, ?, ?, ?, ?, ?)               
        `)

        return await this.db.run(sql, [nome_paciente, cpf, endereco, cep, contato_responsavel, observacao])
    }
```
Controller diz para  a rota retornar o ```Status(201)``` Elias de Souza, Paciente cadastrado com sucesso

---


```javascript
router.get("/", (req, res) => controller.listarPacientes(req, res))
```
* **POST Listar-Pacientes:** ```[GET](http://127.0.0.1:3000/api/pacientes)```

A rota retornara todos os Paciente que existem na tb_pacientes:

O controller verifica  requisição

```Javascript
listarPacientes = async (req, res) => {
        try {
            const listaPacientes = await this.pacienteModel.selectPacientes()
            if(!(listaPacientes)) {
                throw new Error(`Lista de pacientes vazia!!!`)
               
            }

            return res.status(200).json(listaPacientes)

        } catch (e) {
            console.error(`[ERRO NO SERVIDOR]: ${e.message}`)
            return res.status(500).json({
                erro: true, 
                mensagem: e.message
            })
        }
        
        
    }   
```

o model verifica e retorna para o controller:
```JavaScript
 selectPacientes = async () => {
        return await this.db.all(`SELECT *FROM tb_pacientes`)
    }

```
O controller retorna para a rota retornar **Status(200)** OK com a lista de objetos com os dados

```json
{
    "id": 1,
    "nome_paciente": "Elias de Souza", 
    "cpf": "12345678911", 
    "endereco": "Rua das americas", 
    "cep": "25890-98", 
    "contato_responsavel": "12345-9895", 
    "observacao": "Paciente toma remedios para preção de 3h em 3h"
},

{
    "id": 2,
    "nome_paciente": "Amanda Santos", 
    "cpf": "45678912336", 
    "endereco": "Jardin das Flores", 
    "cep": "76820-394", 
    "contato_responsavel": "54545-1000", 
    "observacao": "Paciente com dificuldade para andar"
}

````
---

```javascript
router.get("/:id", (req, res) => controller.getIdPaciente(req, res))
```
* **GET Cadastrar-Pacientes:** ```[POST](http://127.0.0.1:3000/api/pacientes/1)```

A rota espera a o envio do (id) no corpo da requisição, o controller verifica:

```javascript
getIdPaciente = async (req, res) => {
        try  {
            const { id } = req.params
            const idPaciente = await this.pacienteModel.selectIdPaciente(Number(id))

            if(!idPaciente || idPaciente.length === 0) {
                throw new Error(`Paciente não encontrado ou "ID" invalido`)
            }

            return res.status(200).json(idPaciente)
        
        } catch (e) {
            if(e.message.includes("ID")){
                console.error(`[ERRO AO BUSCAR ID]: ${e.message}`)
                return res.status(404).json({
                    Error: true, 
                    menssagem: e.message
                })
            
            } 
            
            console.error(`[ERRO INTERNO]: ${e.messagem}`)
            return res.status(500).json({
                erro: true, 
                menssagem: e.message
            })
        }

        
        
    } 
```
O model verifica e retorna para o controller:
```javaScript
selectIdPaciente = async (id) => {
        return await this.db.all(`SELECT *FROM tb_pacientes
            WHERE id = ?`, [id]
        )
    }
```

O controller retorna para a rota retornar **Status(200)** OK com apenas o array de objeto com os dados:

```json
{
    "id": 1,
    "nome_paciente": "Elias de Souza", 
    "cpf": "12345678911", 
    "endereco": "Rua das americas", 
    "cep": "25890-98", 
    "contato_responsavel": "12345-9895", 
    "observacao": "Paciente toma remedios para preção de 3h em 3h"
}
```

---

```javascript
router.put("/:id", (req, res) => controller.editarPaciente(req, res))
```
* **PUT Atualizar-Pacientes:** ```[POST](http://127.0.0.1:3000/api/pacientes/1)```

A rota espera o envio do (id) no corpo da requisição, com os objetos especifico apos isso o controller verifica no metodo updatePaciente:

```json
{
    "id": 1,
    "nome_paciente": "Elias de Souza", 
    "cpf": "12345678911", 
    "endereco": "Avenida Brasil", 
    "cep": "25890-98", 
    "contato_responsavel": "12345-9895", 
    "observacao": "Paciente com problema de pressão"
}
```

```javascript
editarPaciente = async (req, res) => {
        try {
            const { id } = req.params
            const {nome_paciente, cpf, endereco, cep, contato_responsavel, observacao} = req.body

            if(!req.body.cpf || req.body.cpf.length !== 11) {
                throw  new Error(`${nome_paciente} com CPF vazio ou menor que 11 digitos.`);
            }

            await this.pacienteModel.updatePaciente(nome_paciente, cpf, endereco, cep, contato_responsavel, observacao, id)

            return res.status(200).json(`dados Paciente ${nome_paciente}, atualizado com sucesso!`)

        } catch (e) {
            if(e.message.includes("CPF")) {
                console.error(`[ERRO NA EDIÇÃO DO PACIENTE]: ${e.message}`)
                return res.status(400).json({
                    erro: true, 
                    mensagem: e.message
                })
            } 

            console.error(`[ERRO NO SERVIDOR]: ${e.message}`)
            return res.status(500).json({
                erro: true, 
                mensagem: e.message
            })
            
        }
       
        
    } 
```
O model pega os dados, verifica, lança no banco de dados e retorna para o controller:
```javaScript
updatePaciente = async (nome_paciente, cpf, endereco, cep, contato_responsavel, observacao, id) => {
        const sql = (`
            UPDATE tb_pacientes
            SET nome_paciente = ?, 
            cpf = ?, 
            endereco = ?, 
            cep = ?, 
            contato_responsavel = ?, 
            observacao = ? 
            WHERE id = ?
        `)
        return await this.db.run(sql, [nome_paciente, cpf, endereco, cep, contato_responsavel, observacao, id])
    }
```

O controller retorna para a rota retornar **Status(201)** Dados Paciente Elias de souza, atualizado com sucesso! atualiza:

```javascript
router.delete("/:id", (req, res) => controller.deletPaciente(req, res))
```
* **DELETE Deletar-Pacientes:** ```[POST](http://127.0.0.1:3000/api/pacientes/1)```

A rota espera a o envio do (id) no corpo da requisição, o controller verifica:

```javascript
deletPaciente = async (req, res) => {
        try {
            const { id } = req.params
            const pacienteExiste = await this.pacienteModel.selectIdPaciente(Number(id))
            if(!pacienteExiste || pacienteExiste.length === 0) {
                throw new Error(`Paciente não encontrado para Deletar`)
            }
            await this.pacienteModel.deletePaciente(Number(id))
            return res.status(200).json(`Paciente deletado com sucesso`)
        
        } catch (e) {
            if(e.message.includes("ID")){
                console.error(`[ERRO AO BUSCAR ID PARA DELETAR]: ${e.message}`)
                return res.status(404).json({
                    Error: true, 
                    menssagem: e.message
                })
            
            } 
            
            console.error(`[ERRO INTERNO]: ${e.message}`)
            return res.status(500).json({
                erro: true, 
                menssagem: e.message
            })
        } 
        

    }
```
O model verifica e retorna para o controller:
```javaScript
   deletePaciente = async (id) => {
        return await this.db.run(`
            DELETE FROM tb_pacientes
            WHERE id = ?
            `, [id]
        )
    }
```

O controller retorna para a rota retornar **Status(200)** OK apagando o paciente (id) 1 do banco de dados


**Em breve explicação da tabela agenda**









