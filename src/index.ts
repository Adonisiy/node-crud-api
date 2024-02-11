import { createServer } from 'node:http';
import 'dotenv/config';
import { randomUUID } from 'node:crypto';

const port: number = Number(process.env.PORT) || 3000;

type TPerson = {
  id: string;
  username: string;
  age: number;
  hobbies: string[] | [];
};

let users: TPerson[] = [];

const server = createServer(function (req, res) {
  try {
    switch (req.method) {
      case 'POST':
        post(req, res);
        break;
    }
  } catch (e) {
    console.log(e);
    res.statusCode = 500;
    res.end(message('Error on the server side'));
  }
}).listen(port, () =>
  console.log(`server started at address http://localhost:${port}`)
);

function testInputUser(newUser: TPerson): boolean {
  return (
    newUser.username != undefined &&
    Number.isFinite(newUser.age) &&
    Array.isArray(newUser.hobbies)
  );
}
function message(text: string): string {
  return JSON.stringify({ message: text });
}

function post(req: any, res: any): void {
  if (req.url == '/api/users') {
    let data = '';
    req.on('data', (chunk: any) => (data += chunk));
    req.on('end', () => {
      const varUser = JSON.parse(data);
      if (testInputUser(varUser)) {
        let newUser: TPerson = {
          id: randomUUID(),
          username: varUser.username,
          age: varUser.age,
          hobbies: varUser.hobbies,
        };
        users.push(newUser);
        res.statusCode = 201;
        res.end(JSON.stringify(newUser));
      } else {
        res.statusCode = 400;
        res.end(message('Invalid data in request'));
      }
    });
  } else {
    res.statusCode = 404;
    res.end(message('Non-existing endpoints'));
  }
}
