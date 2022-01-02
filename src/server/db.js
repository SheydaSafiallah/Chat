import Database from 'better-sqlite3';
import {getDirName} from "./helper";
const db = new Database(getDirName() + '/chat.db');

export default db;