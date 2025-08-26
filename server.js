const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('.'));

// Initialize SQLite database
const db = new sqlite3.Database('./registration.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database.');
        
        // Create users table if it doesn't exist
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            gender TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            country TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
            if (err) {
                console.error('Error creating table:', err.message);
            } else {
                console.log('Users table ready.');
            }
        });
    }
});

// Routes

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Registration endpoint
app.post('/register', (req, res) => {
    const { name, gender, email, country } = req.body;
    
    // Validate required fields
    if (!name || !gender || !email || !country) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required.'
        });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            message: 'Please enter a valid email address.'
        });
    }
    
    // Insert user into database
    const stmt = db.prepare(`INSERT INTO users (name, gender, email, country) VALUES (?, ?, ?, ?)`);
    
    stmt.run([name, gender, email, country], function(err) {
        if (err) {
            console.error('Database error:', err.message);
            
            // Check if error is due to duplicate email
            if (err.message.includes('UNIQUE constraint failed')) {
                return res.status(400).json({
                    success: false,
                    message: 'This email address is already registered.'
                });
            }
            
            return res.status(500).json({
                success: false,
                message: 'Database error occurred. Please try again.'
            });
        } else {
            console.log(`User registered with ID: ${this.lastID}`);
            res.json({
                success: true,
                message: 'Registration successful!',
                userId: this.lastID
            });
        }
    });
    
    stmt.finalize();
});

// Get all users endpoint (for testing purposes)
app.get('/users', (req, res) => {
    db.all(`SELECT id, name, gender, email, country, created_at FROM users ORDER BY created_at DESC`, [], (err, rows) => {
        if (err) {
            console.error('Database error:', err.message);
            return res.status(500).json({
                success: false,
                message: 'Error retrieving users.'
            });
        }
        
        res.json({
            success: true,
            users: rows
        });
    });
});

// Get user by ID endpoint
app.get('/users/:id', (req, res) => {
    const userId = req.params.id;
    
    db.get(`SELECT id, name, gender, email, country, created_at FROM users WHERE id = ?`, [userId], (err, row) => {
        if (err) {
            console.error('Database error:', err.message);
            return res.status(500).json({
                success: false,
                message: 'Error retrieving user.'
            });
        }
        
        if (!row) {
            return res.status(404).json({
                success: false,
                message: 'User not found.'
            });
        }
        
        res.json({
            success: true,
            user: row
        });
    });
});

// Delete user endpoint (for testing purposes)
app.delete('/users/:id', (req, res) => {
    const userId = req.params.id;
    
    db.run(`DELETE FROM users WHERE id = ?`, [userId], function(err) {
        if (err) {
            console.error('Database error:', err.message);
            return res.status(500).json({
                success: false,
                message: 'Error deleting user.'
            });
        }
        
        if (this.changes === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found.'
            });
        }
        
        res.json({
            success: true,
            message: 'User deleted successfully.'
        });
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found.'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log('Registration form available at: http://localhost:' + PORT);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\nClosing database connection...');
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err.message);
        } else {
            console.log('Database connection closed.');
        }
        process.exit(0);
    });
});