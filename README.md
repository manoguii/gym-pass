# Gym Pass

O Gym Pass é uma API HTTP Rest do Node.js construída com Typescript, Fastify, Prisma, PostgreSQL, JWT e outras tecnologias. Ele permite o gerenciamento do sistema de academias, incluindo cadastro e autenticação do usuário, permissões, criação e pesquisa de academias e criação de check-in, histórico, métricas e validação.

O aplicativo é totalmente testado com testes unitários e de ponta a ponta usando Vitest e Supertest e segue os princípios SOLID.

## Requisitos funcionais

- Deve ser possível registar-se
- Deve ser possível autenticar
- Deve ser possível obter o perfil de um usuário logado
- Deve ser possível obter o número de check-ins realizados pelo usuário logado
- Deve ser possível ao utilizador obter o seu histórico de check-in
- Deverá ser possível ao usuário pesquisar academias próximas (até 10km)
- Deverá ser possível ao utilizador pesquisar os ginásios pelo nome
- Deverá ser possível ao utente fazer check-in num ginásio
- Deve ser possível validar o check-in de um utilizador
- Deverá ser possível inscrever um ginásio

## Regras de negócio

- Os usuários não devem conseguir se registrar com um e-mail duplicado
- Os usuários não podem fazer 2 check-ins no mesmo dia
- Os utentes não podem fazer o check-in se não estiverem perto (100m) do ginásio
- Check-ins só podem ser validados até 20 minutos após a sua criação
- Os check-ins só podem ser validados pelos administradores
- Academias só podem ser cadastradas por administradores

## Requisitos não Funcionais

- A senha do usuário precisa ser criptografada
- Os dados do aplicativo precisam ser mantidos em um banco de dados PostgreSQL
- Todas as listas de dados precisam ser paginadas com 20 itens por página
- Os usuários devem ser identificados por um JSON Web Token (JWT)

## Rotas

|HTTP Method|Route|Description|Request body|Requires authentication token?|Requires admin permission?|
|:----|:----|:----|:----|:----|:----|
|POST|/users|Creates a new user|name            email            password            role (ADMIN or MEMBER)| | |
|POST|/sessions|Authenticates a user|email            password| | |
|GET|/me|Returns the current logged in user|N/A|✔️| |
|POST|/gyms|Creates a new gym|title            description            phone            latitude            longitude|✔️|✔️|
|GET|/gyms/search?q=:searchText&page=:pageNumber|Returns a list of gyms with the given query and page|N/A|✔️| |
|GET|/gyms/nearby?latitude=:number&longitude=:number|Returns a list of gyms near the given location|N/A|✔️| |
|POST|/gyms/:gymId/check-ins|Creates a new check-in|latitude            longitude|✔️| |
|PATCH|/check-ins/checkInId/validate|Marks the given check-in as validated|N/A|✔️|✔️|
|GET|/check-ins/history|Returns a list of the user's check-ins|N/A|✔️| |
|GET|/check-ins/metrics|Returns the user's check-ins metrics|N/A|✔️| |

## Tecnologias

Algumas tecnologias utilizadas para construção da aplicação.

- Node.js
- Typescript
- Fastify
- Prisma
- PostgreSQL
- JWT (JSON Web Token)
- Zod
- TSup
- Vitest
- Supertest

## Rodar o servidor

```sh title="Clone o repositório"
  git clone https://github.com/manoguii/gym-pass.git
```

- Para rodar o servidor localmente
  1. Crie um arquivo ```.env``` na raiz do projeto e preencha as variáveis ambiente, o exemplo de como deve ficar esta em ```.env.example```.
  2. Instale as dependências ```npm install```
  3. Crie um container do Postgresql ```docker-compose up -d```
  4. Rodar as migrations ```npx prisma migrate dev```
  5. Iniciar servidor ```npm run start:dev```

## Rodar testes unitários

```zsh
npm run test
```

## Rodar testes E2E

```zsh
npm run test:e2e
```

<center>Made with 💙 by Guilherme David</center>
