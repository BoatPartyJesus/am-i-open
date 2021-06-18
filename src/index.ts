import * as Koa from "koa";
import * as Router from "koa-router"
import { isSameDay, isSaturday, isSunday, addDays, isAfter, isBefore, format, addHours, addMinutes, startOfDay } from "date-fns";
import {I18n} from "i18n";
import {join as pathJoin} from "path";
import getBankHolidays from "./getBankHolidays";
import * as times from "./times.json"

const app: Koa = new Koa();
const router: Router = new Router();
const i18n = new I18n();
i18n.configure({
  locales: ["en"],
  directory: pathJoin(__dirname, "/locales")
});

type DateResponse = {
  isOpen: boolean,
  message: string
}

router.get("/open", async (ctx: Koa.Context) => {
  const bankHolidays = await getBankHolidays();
  const queryDate = ctx.query.date as string;
  const date = new Date(queryDate);
  const tomorrow = addDays(date, 1);

  const isClosed = times.closed.find(closedDate => isSameDay(new Date(closedDate), date));
  if(isClosed) {
    ctx.body = "CLOSED";
    return;
  }

  const isBankholiday = bankHolidays.find(holiday => isSameDay(new Date(holiday.date), date));
  if(isBankholiday) {
    ctx.body = JSON.stringify(times.bankHoliday);
    return;
  }

  if(isSaturday(date)) {
    ctx.body = JSON.stringify(times.weekend);
    return;
  }

  if(isSunday(date)) {
    ctx.body = "CLOSED"
    return;
  }

  const openingDateTime = calcuateTimeOfDay(date, times.weekday.openingTime);
  const closingDateTime = calcuateTimeOfDay(date, times.weekday.closingTime);

  if(isBefore(date, openingDateTime)) {
    const response: DateResponse = {
      isOpen: false,
      message: i18n.__("open", format(openingDateTime, "h:mmaaa"), format(closingDateTime, "h:mmaaa"), "today")
    }
    ctx.body = JSON.stringify(response);
    return;
  }

  if(isAfter(date, closingDateTime)) {
    const openingDateTime = calcuateTimeOfDay(tomorrow, times.weekday.openingTime);
    const closingDateTime = calcuateTimeOfDay(tomorrow, times.weekday.closingTime);
    const response: DateResponse = {
      isOpen: false,
      message: i18n.__("open", format(openingDateTime, "h:mmaaa"), format(closingDateTime, "h:mmaaa"), "tomorrow")
    }
    ctx.body = JSON.stringify(response);
    return;
  }
  
  ctx.body = i18n.__("openUntil", times.weekday.closingTime)
});

function calcuateTimeOfDay(date: Date, dateObject: string) {
  const split = dateObject.split(":");
  const hours = parseInt(split[0])
  const minutes = parseInt(split[1]);

  return addHours(addMinutes(startOfDay(date), minutes), hours)
}

router.get("/", async (ctx: Koa.Context) => {
  ctx.body = "Samuel L Jackson is Chuck Norris' padawan"
});


app.use(router.routes());
app.on('error', console.error);
app.listen(3000);