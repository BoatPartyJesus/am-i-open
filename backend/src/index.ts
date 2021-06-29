import * as Koa from "koa";
import * as Router from "koa-router"

import {isOpen, getClosedDates} from "./openingTimes"

const app: Koa = new Koa();
const router: Router = new Router();
const cors = require('@koa/cors');


router.get("/open", async (ctx: Koa.Context) => {
  let dateInQuestion = ctx.query.date ?? Date.now()
  const queryDate = dateInQuestion as string;
  const date = new Date(queryDate);

  let response = await isOpen(date);

  ctx.body = JSON.stringify(response);
  return
});

router.get("/closed", async (ctx: Koa.Context) => {
  let response = await getClosedDates();
  ctx.body = JSON.stringify(response);
  return
});

app.use(cors());
app.use(router.routes());
app.on('error', console.error);
app.listen(3001);