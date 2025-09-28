// server.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

app.use(express.json());

// Kết nối đến cơ sở dữ liệu SQLite
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error('Error opening database', err);
    } else {
        console.log('Connected to the SQLite database');
    }
});
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            password TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE
        );
    `);
});
// Hàm insert dữ liệu vào bảng `users`
const insertUser = (username, password, email) => {
    const query = `INSERT INTO users (username, password, email) VALUES (?, ?, ?)`;

    db.run(query, [username, password, email], function(err) {
        if (err) {
            console.error('Error inserting data:', err);
        } else {
            console.log(`User ${username} inserted successfully.`);
        }
    });
};

// Thêm người dùng vào bảng
insertUser('john_doe', 'password123', 'john.doe@example.com');
insertUser('jane_doe', 'password456', 'jane.doe@example.com');
insertUser('alice_smith', 'password789', 'alice.smith@example.com');




// Middleware to parse JSON body
app.use(express.json());

// API endpoint: POST /login
app.post('/login', (req, res) => {
    const { username, password } = req.body;  // Lấy thông tin người dùng từ req.body

    const query = `SELECT * FROM users WHERE username = ? AND password = ?`;
    db.get(query, [username, password], (err, row) => {
        if (err) {
            console.error('Error querying the database:', err);
            return res.status(500).json({ message: 'Server error' });
        }

        if (row) {
            // Nếu tìm thấy người dùng trong cơ sở dữ liệu
            return res.status(200).json({ message: 'Login successful' });
        } else {
            // Nếu không tìm thấy người dùng hoặc sai mật khẩu
            return res.status(401).json({ message: 'Invalid credentials' });
        }
    });
});


// API POST / register
app.post('/register', (req, res) =>{
    // Kiểm tra các trường đầu vào
    const { username, password,email} = req.body;
    if (!username || !password || !email) {
        return res.status(400).json({ message: 'All fields are required!' });
    }

    console.log('New user registered:', { username, password, email });

    // Trả về phản hồi thành công
    return res.status(201).json({ message: 'Registration successful!' });
});

// API endpoint: GET /status
app.get('/status', (req, res) => {
    res.status(200).json({ status: 'API is up and running' });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
