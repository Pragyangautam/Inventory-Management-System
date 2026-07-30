import { addData, getData } from "../storage/storageService";

const KEY = "journal";

export const getJournal = () => getData(KEY);

export const addJournalEntry = (entry) => {
  addData(KEY, entry);
};
