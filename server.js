const http = require("http");
const Koa = require("koa");
const Router = require("koa-router");
const cors = require("@koa/cors");
const koaBody = require("koa-body");
const { v4: uuidv4 } = require("uuid");

const app = new Koa();

app.use(cors());
app.use(koaBody({ json: true }));

let posts = [
  { id: uuidv4(), content: "Первый пост о чем то" },
  { id: uuidv4(), content: "Второй пост о чем то ла ла ла" },
];

const router = new Router();

router.get("/posts", async (ctx, next) => {
  ctx.response.body = posts;
});

router.post("/posts", async (ctx, next) => {
  const { id, content } = JSON.parse(ctx.request.body);

  if (id !== 0) {
    posts = posts.map((o) => (o.id !== id ? o : { ...o, content: content }));
    ctx.response.status = 204;
    return;
  }

  posts.push({ id: uuidv4(), content: content, created: Date.now() });
  ctx.response.status = 204;
});

router.delete("/posts/:id", async (ctx, next) => {
  const postId = ctx.params.id;
  const index = posts.findIndex((o) => {
    if (o.id === postId) {
      return true;
    }
  });
  if (index !== -1) {
    posts.splice(index, 1);
  }
  ctx.response.status = 204;
});

app.use(router.routes()).use(router.allowedMethods());

const port = process.env.PORT || 7777;
const server = http.createServer(app.callback());
server.listen(port, () => console.log("server started"));
