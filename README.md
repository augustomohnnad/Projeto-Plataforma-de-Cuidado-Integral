# 🚀 Projeto Plataforma de Cuidado Integral (PCI)
## 📌 Sobre o Projeto

A **Plataforma de Cuidado Integral (PCI)**, foi desenvolvida para gerenciar pacientes e seus agendamentos como:

* Cadastro de Paciente e sua observaçoes.

* Agendamento de horarios para visitas ao paciente.

* Conclusão do serviços prestado ao paciente.

* Pesquisa dos atendimento a  paciente especifico.

Permitindo cadastrar, listar e excluir registros de forma organizada.

## 🛠️Tecnologias utilizadas

* Node.js
* Express
* SQLite
* SQLite3
* Postman
* Nodemon

## 📦Instalação

Com o GitBash aberto execute o comando a baixo, isso fara com que o npm instale o packkage.json com todas as depedencias e configurações necessaria para rodar o projeto em seu computador.

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

O banco de dados e suas tabelas sera criado assim que o Projeto for iniciado.
```
cuidadoIntegral.db
```

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

### 🧾 Estruturas das tabelas
Antes de mais nada precimos entender como o projeto esta organizado, resumidamente o projeto esta seguindo o MVC(Model-View-Controller) é um padrão de arquitetura de software que divide uma aplicação em três camadas lógicas interligadas — Model (dados/lógica), View (interface) e Controller (intermediário). Esta separação melhora a manutenção, escalabilidade e permite o desenvolvimento paralelo, sendo amplamente usado em aplicações web e desktop.

* Model (Modelo): Gerencia regras de dados e a persistência (banco de dados).

* View (Visão): A interface do utilizador que exibe os dados fornecidos pelo Model e envia ações do utilizador para o Controller.

* Controller (Controlador): Processa as entradas do utilizador, interage com o Model e seleciona a View para renderizar.

no decorrer da documentação veremos como esse padrão vai se aplicando no projeto.

---

### Model(modelo): Todo a modelagem  banco se encontra ***src/database/models***

Vamos começar com a tabela Paciente(**model_paciente.js**) segue sua estrutura:

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