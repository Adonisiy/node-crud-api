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
    if (req.url == '/api/users') {
      switch (req.method) {
        case 'POST':
          postUser(req, res);
          break;
        case 'GET':
          getList(res);
          break;
        default:
          res.statusCode = 404;
          res.end(message('Non-existing endpoints'));
      }
    } else {
      if (
        /\/api\/users\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          String(req.url)
        )
      ) {
        switch (req.method) {
          case 'GET':
            getUser(req, res);
            break;
          case 'PUT':
            putUser(req, res);
            break;
          case 'DELETE':
            deleteUser(req, res);
            break;
          default:
            res.statusCode = 404;
            res.end(message('Non-existing endpoints'));
        }
      } else {
        if (/\/api\/users\/[^\/\s]+$/.test(String(req.url))) {
          res.statusCode = 400;
          res.end('Invalid uuid format');
        } else {
          res.statusCode = 404;
          res.end(message('Non-existing endpoints'));
        }
      }
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

function postUser(req: any, res: any): void {
  let data = '';
  req.on('data', (chunk: any) => {
    try {
      data += chunk;
    } catch (e) {
      res.statusCode = 500;
      res.end(message('Error on the server side'));
    }
  });
  req.on('end', () => {
    try {
      const varUser = JSON.parse(data);
      if (testInputUser(varUser)) {
        let newUser: TPerson = {
          id: randomUUID(),
          username: String(varUser.username),
          age: Number(varUser.age),
          hobbies: varUser.hobbies,
        };
        newUser.hobbies = newUser.hobbies.map((s: any) => s + '');
        users.push(newUser);
        res.statusCode = 201;
        res.end(JSON.stringify(newUser));
      } else {
        res.statusCode = 400;
        res.end(message('Invalid user data in request'));
      }
    } catch (e) {
      res.statusCode = 500;
      res.end(message('Error on the server side'));
    }
  });
}

function getList(res: any): void {
  res.statusCode = 200;
  res.end(JSON.stringify(users));
}

function getUser(req: any, res: any): void {
  const id: string = String(req.url).replace('/api/users/', '');
  const user: TPerson | undefined = users.find((s: any) => s.id == id);
  if (user) {
    res.statusCode = 200;
    res.end(JSON.stringify(user));
  } else {
    res.statusCode = 404;
    res.end(message('Profile is not found'));
  }
}

function putUser(req: any, res: any): void {
  const id: string = String(req.url).replace('/api/users/', '');
  const userIndex: number = users.findIndex((s: any) => s.id == id);
  let data = '';
  req.on('data', (chunk: any) => {
    try {
      data += chunk;
    } catch (e) {
      res.statusCode = 500;
      res.end(message('Error on the server side'));
    }
  });
  req.on('end', () => {
    try {
      const varUser = JSON.parse(data);
      if (testInputUser(varUser)) {
        users[userIndex].username = varUser.username;
        users[userIndex].age = Number(varUser.age);
        users[userIndex].hobbies = varUser.hobbies.map((s: any) => s + '');
        res.statusCode = 200;
        res.end(JSON.stringify(users[userIndex]));
      } else {
        res.statusCode = 400;
        res.end(message('Invalid user data in request'));
      }
    } catch (e) {
      res.statusCode = 500;
      res.end(message('Error on the server side'));
    }
  });
}

function deleteUser(req: any, res: any): void {
  const id: string = String(req.url).replace('/api/users/', '');
  const userIndex: number = users.findIndex((s: any) => s.id == id);
  if (userIndex > -1) {
    users.splice(userIndex, 1);
    res.statusCode = 204;
    res.end(message('Profile deleted'));
  } else {
    res.statusCode = 404;
    res.end(message('Profile is not found'));
  }
}
