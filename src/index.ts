import * as Koa from "koa";
import * as Router from "koa-router"
import { } from "date-fns";

import isOpen from "./openingTimes"

const app: Koa = new Koa();
const router: Router = new Router();


router.get("/open", async (ctx: Koa.Context) => {
  let dateInQuestion = ctx.query.date ?? Date.now()
  const queryDate = dateInQuestion as string;
  const date = new Date(queryDate);

  let response = await isOpen(date);

  ctx.body = JSON.stringify(response);
  return
});

app.use(router.routes());
app.on('error', console.error);
app.listen(3000);