# Simple CRUD API - Instructions

### Installation

1. Clone repository to your computer (add `git clone !https://github.com/Adonisiy/node-crud-api.git`)
2. Go to cloned repository folder (add `cd node-crud-api`)
3. Choose branch "workbranch" (add `git checkout workbranch`)
4. Install additional package (add `npm install`)

### Launch

1. Set PORT value in `.env` file
2. Enter the command `npm run start:dev` to enter development mode
  or
   command `npm run start:prod` to enter in production mode
3. After running the file, the message `server started at address http://localhost:{PORT}` will appear in the terminal. You can send requests

### Usage

1. `index.ts` file is located in the `src` folder and is launched in development mode
2. `index.js` file is created and launched in the `build` folder in production mode
3. After starting the server, you can send requests from the client (for example Postman) to it
4. Data input in the client must be in JSON format
5. Data output in the client is also in JSON format
6. Terminate the process via ctrl+C
