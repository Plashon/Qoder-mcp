# Registration Form with SQLite Database

A simple web-based registration form that collects user information and stores it in a SQLite database.

## Features

- **User Registration Form** with the following fields:
  - Full Name (required)
  - Gender (dropdown: Male, Female, Other)
  - Email Address (required, validated)
  - Country (dropdown with multiple options)

- **SQLite Database Integration**
  - Automatic table creation
  - Data validation
  - Duplicate email prevention
  - User management endpoints

- **Modern UI/UX**
  - Responsive design
  - Beautiful gradient styling
  - Form validation with user feedback
  - Loading states and error handling

## Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **Database**: SQLite3
- **Additional**: CORS support, Body Parser

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Plashon/Qoder-mcp.git
   cd Qoder-mcp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   npm start
   ```
   
   For development with auto-restart:
   ```bash
   npm run dev
   ```

4. **Access the application**
   Open your browser and go to: `http://localhost:3001`

## API Endpoints

### POST /register
Register a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "gender": "male",
  "email": "john@example.com",
  "country": "thailand"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration successful!",
  "userId": 1
}
```

### GET /users
Get all registered users.

**Response:**
```json
{
  "success": true,
  "users": [
    {
      "id": 1,
      "name": "John Doe",
      "gender": "male",
      "email": "john@example.com",
      "country": "thailand",
      "created_at": "2024-01-01 12:00:00"
    }
  ]
}
```

### GET /users/:id
Get a specific user by ID.

### DELETE /users/:id
Delete a user by ID.

## Database Schema

The SQLite database contains a `users` table with the following structure:

```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    gender TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    country TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## File Structure

```
├── index.html          # Main registration form
├── styles.css          # CSS styling
├── script.js           # Client-side JavaScript
├── server.js           # Node.js/Express server
├── package.json        # Project dependencies
├── README.md          # This file
└── registration.db    # SQLite database (created automatically)
```

## Features in Detail

### Form Validation
- Client-side validation for all fields
- Email format validation
- Real-time feedback
- Server-side validation for data integrity

### Error Handling
- Duplicate email detection
- Network error handling
- User-friendly error messages
- Loading states during submission

### Responsive Design
- Mobile-friendly interface
- Modern gradient design
- Accessible form controls
- Keyboard navigation support

## Development

### Adding New Countries
Edit the country dropdown in `index.html`:

```html
<option value="new_country">New Country</option>
```

### Database Management
The SQLite database file (`registration.db`) is created automatically when you first run the server. You can use SQLite browser tools to view and manage the data.

### Testing
You can test the API endpoints using:
- Browser developer console: `getAllUsers()`
- Postman or similar API testing tools
- curl commands

## Security Considerations

- Input validation on both client and server
- SQL injection prevention using prepared statements
- Email uniqueness constraint
- CORS configuration for cross-origin requests

## License

MIT License

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request