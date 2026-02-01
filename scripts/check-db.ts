
import { config } from 'dotenv';
import { neon } from '@neondatabase/serverless';

config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL!);

async function main() {
    console.log('Connecting to database...');
    try {
        // Query to list all tables in the public schema
        const result = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public';
    `;

        console.log('Tables found:', result);

        if (result.length === 0) {
            console.log('No tables found in public schema.');
        } else {
            console.log('Database verification successful.');
        }
    } catch (error) {
        console.error('Error connecting to database:', error);
    }
}

main();
