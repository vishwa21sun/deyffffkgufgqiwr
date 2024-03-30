// server.js

const express = require('express');
const bodyParser = require('body-parser');
const db = require('./database');

const app = express();
app.use(bodyParser.json());

// API to register a customer
app.post('/register', (req, res) => {
    const { name, address, email, dateOfBirth, gender, age, cardHolderName, cardNumber, expiryDate, cvv, timestamp } = req.body;

    // Basic validation
    if (!email || !cardNumber) {
        return res.status(400).json({ error: "Email and Card Number are required." });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Invalid email address." });
    }

    // Credit card number validation (12 digits)
    const cardNumberRegex = /^\d{12}$/;
    if (!cardNumberRegex.test(cardNumber)) {
        return res.status(400).json({ error: "Invalid credit card number." });
    }

    // Insert into the database
    const stmt = db.prepare(`INSERT INTO customer (name, address, email, dateOfBirth, gender, age, cardHolderName, cardNumber, expiryDate, cvv, timestamp) 
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
    stmt.run(name, address, email, dateOfBirth, gender, age, cardHolderName, cardNumber, expiryDate, cvv, timestamp, (err) => {
        if (err) {
            return res.status(400).json({ error: "Failed to register customer." });
        }
        res.status(201).json({ message: `Customer ${name} has been registered.`, customerId: this.lastID });
    });
    stmt.finalize();
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
