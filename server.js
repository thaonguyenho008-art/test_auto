// server.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'my_secret_key';

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

// // Thêm người dùng vào bảng
// insertUser('john_doe', 'password123', 'john.doe@example.com');
// insertUser('jane_doe', 'password456', 'jane.doe@example.com');
// insertUser('alice_smith', 'password789', 'alice.smith@example.com');




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

        if (!row) return res.status(401).json({ message: 'Invalid credentials' });

    // tạo token
    const token = jwt.sign(
      { id: row.id, username: row.username },
      SECRET_KEY,
      { expiresIn: '1h' }
    );

    res.status(200).json({ message: 'Login successful', token });
  });
});


// API POST /register
// API POST /register
app.post('/register', (req, res) => {
  const { username, password, email } = req.body;

  // Kiểm tra input
  if (!username || !password || !email) {
    return res.status(400).json({ message: 'All fields are required!' });
  }

  const query = `INSERT INTO users (username, password, email) VALUES (?, ?, ?)`;

  db.run(query, [username, password, email], function (err) {
    if (err) {
      console.error('Error inserting user:', err);

      // Nếu email đã tồn tại
      if (err.code === 'SQLITE_CONSTRAINT') {
        return res.status(400).json({ message: 'Email already exists!' });
      }

      // Các lỗi DB khác
      return res.status(500).json({ message: 'Server error' });
    }

    // Trả về user mới tạo
    return res.status(201).json({
      id: this.lastID,  // id vừa insert
      username,
      email,
      message: 'Registration successful!'
    });
  });
});


// API endpoint: GET /status
app.get('/status', (req, res) => {
    res.status(200).json({ status: 'API is up and running' });
});

//  check token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Token required' });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user; // lưu thông tin user từ token
    next();
  });
}

// api delete 
// API DELETE /users/:id
app.delete('/users/:id', authenticateToken,(req, res) => {
  const { id } = req.params;

  const query = `DELETE FROM users WHERE id = ?`;

  db.run(query, [id], function (err) {
    if (err) {
      console.error('Error deleting user:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Chuẩn REST: trả về 204 No Content
    return res.status(204).send();
  });
});


// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

