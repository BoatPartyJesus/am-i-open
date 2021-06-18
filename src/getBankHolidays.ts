import axios from "axios";

export type BankHoliday = {
  title: string,
  date: string,
  notes: string,
  bunting: boolean
}

export default async function getBankHolidays(): Promise<BankHoliday[]> {
    const response = await axios.get("https://gov.uk/bank-holidays.json");
    return response.data["england-and-wales"].events;
}
