const express = require("express");
const  pool  = require("./db");

const app = express();

app.use(express.json());

app.get("/assignments", async (req, res) => {
    try {
        const { submitted } = req.query;

        let result;

        if (submitted === "true") {
            result = await pool.query(
                "SELECT * FROM assignments WHERE submitted = true ORDER BY id DESC"
            );
        } else {
            result = await pool.query(
                "SELECT * FROM assignments ORDER BY id DESC"
            );
        }

        res.json(result.rows);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Something went wrong"
        });
    }
});
app.post("/assignments", async (req, res) => {
    try {
        const { title, deadline } = req.body;

        const result = await pool.query(
            "INSERT INTO assignments (title, deadline) VALUES ($1, $2) RETURNING *",
            [title, deadline]
        );
        res.status(201).json(result.rows[0]);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
});

app.patch("/assignments/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            "UPDATE assignments SET submitted = true WHERE id = $1 RETURNING *",
            [id]
        );

        res.json(result.rows[0]);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
});
app.delete("/assignments/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `DELETE FROM assignments
             WHERE id = ${id}
             RETURNING *`
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Assignment not found"
            });
        }

        res.json({
            message: "Assignment deleted successfully",
            assignment: result.rows[0]
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Something went wrong"
        });
    }
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});