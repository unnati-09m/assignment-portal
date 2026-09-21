const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME
});

const getData = async () => {
    try {
        const result = await pool.query(
            "SELECT * FROM assignments"
        );

        console.log(result.rows);
    } catch (error) {
        console.log(error);
    }
};

getData();

module.exports = pool;