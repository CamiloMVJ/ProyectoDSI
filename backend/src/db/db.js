import pg from 'pg'

const { Pool } = pg
export const pool = new Pool({
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    database: process.env.PGDATABASE,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    max: 20,
    maxLifeSeconds: 60,
    connectionTimeoutMillis: 5000,
})

pool.on('error', (error) => {
    console.error('Error en la conexión a la base de datos:', error)
})