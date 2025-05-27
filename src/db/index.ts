import { config } from 'dotenv';
import postgres from 'postgres';
config({ path: '.env' });

console.log(process.env.DATABASE_URL);
