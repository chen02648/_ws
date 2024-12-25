import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import * as render from './render.js';
import { DB } from "https://deno.land/x/sqlite/mod.ts";

const db = new DB("blog.db");
db.query(`
  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    user TEXT, 
    title TEXT, 
    body TEXT
  )
`);

const router = new Router();

router
  .get('/', userList) 
  .get('/:user/', list) 
  .get('/:user/post/new', add) 
  .get('/:user/post/:id', show) 
  .post('/:user/post', create); 

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());


function query(sql, params = []) {
  const list = [];
  for (const row of db.query(sql, params)) {
    list.push(row);
  }
  return list;
}


async function userList(ctx) {
  const users = query("SELECT DISTINCT user FROM posts").map(row => row[0]);
  ctx.response.body = await render.userList(users);
}

async function list(ctx) {
  const user = ctx.params.user;
  const posts = query("SELECT id, title, body FROM posts WHERE user = ?", [user]);
  ctx.response.body = await render.list(user, posts);
}

async function add(ctx) {
  const user = ctx.params.user;
  ctx.response.body = await render.newPost(user);
}


async function show(ctx) {
  const user = ctx.params.user;
  const id = ctx.params.id;
  const posts = query("SELECT id, title, body FROM posts WHERE user = ? AND id = ?", [user, id]);
  const post = posts[0];
  if (!post) ctx.throw(404, 'invalid post id');
  ctx.response.body = await render.show(user, { id: post[0], title: post[1], body: post[2] });
}


async function create(ctx) {
  const user = ctx.params.user;
  const body = ctx.request.body();
  if (body.type === "form") {
    const pairs = await body.value;
    const post = {};
    for (const [key, value] of pairs) {
      post[key] = value;
    }
    db.query("INSERT INTO posts (user, title, body) VALUES (?, ?, ?)", [user, post.title, post.body]);
    ctx.response.redirect(`/${user}/`);
  }
}
console.log(`Server run at http://127.0.0.1:${port}`);
await app.listen({ port });