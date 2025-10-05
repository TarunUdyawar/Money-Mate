import {neon} from '@neondatabase/serverless'
import dotenv from 'dotenv'
dotenv.config()

export const sql = neon(process.env.NEONDB_URL)

export const connectDB = async()=>{
    try {
        await sql `CREATE TABLE IF NOT EXISTS transactions(
            id SERIAL PRIMARY KEY,
            user_ID VARCHAR(255) NOT NULL,
            title VARCHAR(255) NOT NULL,
            amount DECIMAL(10,2) NOT NULL,
            category VARCHAR(255) NOT NULL,
            createdAt DATE NOT NULL DEFAULT CURRENT_DATE
            )`
            console.log("DB CONNECTED")
    } catch (error) {
        console.log("DB ERROR")
    }
}