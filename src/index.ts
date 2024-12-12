import { config } from 'dotenv';

config();

console.log(`${process.env.NAME} (${process.env.VERSION})`);
