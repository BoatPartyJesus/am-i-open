import * as times from "./times.json"
import {addDays,isBefore, format, isSameDay, isSaturday, isSunday, addHours, addMinutes, startOfDay, isWeekend} from "date-fns";
import getBankHolidays from "./getBankHolidays";
import {I18n} from "i18n";
import {join as pathJoin} from "path";

const i18n = new I18n();
i18n.configure({
  locales: ["en"],
  directory: pathJoin(__dirname, "/locales")
});

const dayType = {WEEKDAY:"weekday", SATURDAY:"saturday", SUNDAY:"sunday", BANKHOLIDAY:"bankHoliday", CLOSED:"closed"}
Object.freeze(dayType)

type dayTypeDetail = {
    name: string,
    type: string,
    open: boolean,
    openingTime: Date,
    closingTime: Date
}

type DateResponse = {
    isOpen: boolean,
    message: string
  }

async function isOpen(date:Date) {

    let response: DateResponse = {
      isOpen: false,
      message: ""
    }
  
    let daysForward = 0;
    let openOnDay = false;
  
    do {
      var testDate = addDays(date, daysForward);
  
      let openToday = await isOpenOn(startOfDay(testDate));
  
      if (openToday.open){
        let nameOfDay = 
          daysForward === 0 ? "today" :
          daysForward === 1 ? "tomorrow" :
          openToday.name;
  
        if(daysForward > 0 || isBefore(testDate, openToday.openingTime)) {
          openOnDay = true;
          response.message = i18n.__("open", format(openToday.openingTime, "h:mmaaa"), format(openToday.closingTime, "h:mmaaa"), nameOfDay)      
          break;
        } else if (isBefore(testDate, openToday.closingTime)){
          openOnDay = true;
          response.isOpen = true;
          response.message = i18n.__("openUntil", format(openToday.closingTime, "h:mmaaa"))
          break;
        }
        else {
          daysForward++
        }
      }
      else {
        daysForward++
      }  
    }
    while (!openOnDay)
  
    return response
  }

async function isOpenOn(date: Date){
    let dateType = await getTypeOfDay(date);

    let response: dayTypeDetail = {
        name: format(date,"eeee"),
        type: dateType,
        open: false,
        openingTime: null,
        closingTime: null
    }

    switch(dateType){
        case dayType.CLOSED:
        case dayType.SUNDAY:
        break
        case dayType.BANKHOLIDAY:
        case dayType.SATURDAY:
        case dayType.WEEKDAY:
            response.open = true;

            let {open, close} = getOpeningTimes(dateType)
            response.openingTime = calcuateTimeOfDay(date, open)
            response.closingTime = calcuateTimeOfDay(date, close)
        default:
            break
    }
    
    return response
}

async function getTypeOfDay(date: Date){
    const bankHolidays = await getBankHolidays();
  
    const isClosed = times.closed.find(closedDate => isSameDay(new Date(closedDate), date));
    if(isClosed) {
      return dayType.CLOSED;
    }
  
    const isBankholiday = bankHolidays.find(holiday => isSameDay(new Date(holiday.date), date));
    if(isBankholiday) {
      return dayType.BANKHOLIDAY;
    }
  
    if (isSunday(date)){
      return dayType.SUNDAY
    }
  
    if (isSaturday(date)){
      return dayType.SATURDAY
    }
  
    if(!isWeekend(date)) {
      return dayType.WEEKDAY
    }
}

function calcuateTimeOfDay(date: Date, dateObject: string) {
    const split = dateObject.split(":");
    const hours = parseInt(split[0])
    const minutes = parseInt(split[1]);
  
    return addHours(addMinutes(startOfDay(date), minutes), hours)
}

function getOpeningTimes(day: string){
    let open:string, close:string

    switch(day){
        case dayType.BANKHOLIDAY:
        open = times.bankHoliday.openingTime
        close = times.bankHoliday.closingTime
        case dayType.SUNDAY:
        open = times.sunday.openingTime
        close = times.sunday.closingTime
        case dayType.SATURDAY:
        open = times.saturday.openingTime
        close = times.saturday.closingTime
        case dayType.WEEKDAY:
        open = times.weekday.openingTime
        close = times.weekday.closingTime
        default:
        break
    }

    return {open: open, close: close}
}

export default isOpen;