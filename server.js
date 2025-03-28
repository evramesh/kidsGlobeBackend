const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Use an in-memory database if necessary
const db = new sqlite3.Database(process.env.NODE_ENV === "production" ? ":memory:" : "./kids_globe.db", (err) => {
    if (err) {
        console.error("Database connection error:", err.message);
    } else {
        console.log("Connected to the SQLite database.");
    }
});

// Create Table if Not Exists
db.run(`
    CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        category TEXT,
        image TEXT,
        price REAL,
        description TEXT
    )
`);

app.post("/api/products", (req, res) => {
    const products = req.body;

    if (!Array.isArray(products)) {
        return res.status(400).json({ error: "Request body must be an array" });
    }

    const stmt = db.prepare("INSERT INTO products (name, category, image, price, description) VALUES (?, ?, ?, ?, ?)");

    for (const product of products) {
        stmt.run(product.name, product.category, product.image, product.price, product.description);
    }

    stmt.finalize();
    res.status(201).json({ message: `${products.length} products added successfully!` });
});

app.get("/api/products", (req, res) => {
    db.all("SELECT * FROM products", [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

app.delete("/api/products", (req, res) => {
    db.run("DELETE FROM products", (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: "All products deleted successfully!" });
    });
});

app.get("/api", (req, res) => {
    const user = {
        Name: "Ramesh",
        Phone: 8886822301,
        Email: "evramesh88868@gmail.com",
        Password: "ram888"
    };
    res.json({ user });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
