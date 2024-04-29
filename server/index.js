const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { Pool } = require("pg");
const cors = require("cors");

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'CS348_stage2',
    password: '1127',
    port: 5432 // Default PostgreSQL port
});

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));

const PORT = process.env.PORT || 5000;

// Get all expenses with category names
app.get("/api/get", (req, res) => {
    const query = `
        SELECT e.expense_id, e.expense_name, e.amount, e.description, c.category_name 
        FROM expenses e
        LEFT JOIN Categories c ON e.category_id = c.category_id
    `;
    pool.query(query, (err, result) => {
        if (err) {
            console.error("Error executing SELECT query:", err);
            return res.status(500).send("Internal Server Error");
        }
        res.json(result.rows);
    });
});

// Add a new expense
app.post("/api/expenses", async (req, res) => {
    const { expense_name, amount, expense_description, category_id } = req.body;
    try {
        await pool.query(
            "INSERT INTO expenses (expense_name, amount, description, category_id) VALUES ($1, $2, $3, $4)",
            [expense_name, amount, expense_description, category_id]
        );
        res.status(201).send("Expense added successfully");
    } catch (error) {
        console.error("Error adding expense:", error);
        res.status(500).send("Failed to add expense");
    }
});

// Delete an expense
app.delete("/api/expenses/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const query = "DELETE FROM expenses WHERE expense_id = $1";
        const result = await pool.query(query, [id]);
        if (result.rowCount === 1) {
            res.status(200).json({ message: "Expense deleted successfully" });
        } else {
            res.status(404).json({ error: "Expense not found" });
        }
    } catch (error) {
        console.error("Error deleting expense:", error);
        res.status(500).json({ error: "Failed to delete expense" });
    }
});

// Update an expense
app.put('/api/put/:id', (req, res) => {
    const { id } = req.params;
    const { expense_name, amount, expense_description, category_id } = req.body;
    const update_query =
      'UPDATE expenses SET expense_name = $1, amount = $2, description = $3, category_id = $4 WHERE  expense_id = $5';
    pool.query(update_query, [expense_name, amount, expense_description, category_id, id], (err, result) => {
      if (err) {
        console.error('Error updating expense:', err);
        res.status(500).send('Failed to update expense');
        return;
      }
      res.json({ message: 'Expense updated successfully' });
    });
});

// Get categories
app.get("/api/categories", async (req, res) => {
    try {
        const query = "SELECT * FROM Categories";
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).json({ error: "Failed to fetch categories" });
    }
});

// Get expenses filtered by category
app.get("/api/expensesByCategory/:category", async (req, res) => {
    const { category } = req.params;
    try {
        const query = `
            SELECT e.expense_id, e.expense_name, e.amount, e.description, c.category_name 
            FROM expenses e
            LEFT JOIN Categories c ON e.category_id = c.category_id
            WHERE c.category_name = $1
        `;
        const result = await pool.query(query, [category]);
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching expenses by category:", error);
        res.status(500).json({ error: "Failed to fetch expenses by category" });
    }
});

// Signup endpoint
app.post("/api/signup", async (req, res) => {
    const { username, password } = req.body;
    try {
        const result = await pool.query(
            "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *",
            [username, password]
        );
        const user = result.rows[0];
        res.status(201).json({ message: "User created successfully", user });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ error: "Failed to create user" });
    }
});

// Login endpoint
app.post("/api/login", async (req, res) => {
    const { username, password } = req.body;
    try {
        const result = await pool.query(
            "SELECT * FROM users WHERE username = $1 AND password = $2",
            [username, password]
        );
        if (result.rows.length === 1) {
            const user = result.rows[0];
            res.status(200).json({ message: "Login successful", user });
        } else {
            res.status(401).json({ error: "Invalid username or password" });
        }
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ error: "Failed to log in" });
    }
});

// const { Sequelize, DataTypes } = require('sequelize');

// const sequelize = new Sequelize('CS348_stage2', 'postgres', '1127', {
//   host: 'localhost',
//   dialect: 'postgres',
// });

// // Define models
// const Expense = sequelize.define('Expense', {
//   expense_name: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   amount: {
//     type: DataTypes.FLOAT,
//     allowNull: false,
//   },
//   description: {
//     type: DataTypes.STRING,
//     allowNull: true,
//   },
// });

// const Category = sequelize.define('Category', {
//   category_name: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
// });

// const User = sequelize.define('User', {
//   username: {
//     type: DataTypes.STRING,
//     allowNull: false,
//     unique: true,
//   },
//   password: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
// });

// // Define associations
// Expense.belongsTo(Category, { foreignKey: 'category_id' });
// Category.hasMany(Expense, { foreignKey: 'category_id' });

// // Sync models with database
// (async () => {
//   await sequelize.sync();
//   console.log('All models were synchronized successfully.');
// })();

// // CRUD operations using Sequelize methods
// app.post("/api/expenses", async (req, res) => {
//     const { expense_name, amount, description, category_id } = req.body;
//     try {
//         const expense = await Expense.create({ expense_name, amount, description, category_id });
//         res.status(201).send("Expense added successfully");
//     } catch (error) {
//         console.error("Error adding expense:", error);
//         res.status(500).send("Failed to add expense");
//     }
// });

app.listen(3002, () => {
    console.log(`Server is running on port ${3002}`);
});

