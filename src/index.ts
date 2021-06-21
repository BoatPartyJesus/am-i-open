import * as Koa from "koa";
import * as Router from "koa-router"
import { } from "date-fns";
import {I18n} from "i18n";
import {join as pathJoin} from "path";
import isOpen from "./openingTimes"

const app: Koa = new Koa();
const router: Router = new Router();
const i18n = new I18n();
i18n.configure({
  locales: ["en"],
  directory: pathJoin(__dirname, "/locales")
});

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