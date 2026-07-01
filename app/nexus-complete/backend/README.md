# Nexus Social — Backend API

Express.js + Node.js backend with MongoDB (Mongoose) for the Nexus Social Media App.

---

## Tech Stack

| Technology   | Purpose                            |
|--------------|------------------------------------|
| Node.js      | JavaScript runtime environment     |
| Express.js   | Web framework / server             |
| MongoDB      | NoSQL database                     |
| Mongoose     | MongoDB object modeling (ODM)      |
| JWT          | Secure user authentication tokens  |
| bcryptjs     | Password hashing                   |
| Multer       | Image/file upload handling         |
| dotenv       | Environment variable management    |
| cors         | Cross-Origin Resource Sharing      |

---

## Folder Structure

```
backend/
├── server.js               ← Main entry point
├── package.json            ← Dependencies
├── .env.example            ← Environment variable template
├── .gitignore              ← Files to exclude from GitHub
│
├── config/
│   └── db.js               ← MongoDB connection
│
├── models/                 ← Database schemas (Mongoose)
│   ├── User.js             ← Users table
│   ├── Post.js             ← Posts table
│   ├── Comment.js          ← Comments table
│   └── Follower.js         ← Followers table
│
├── routes/                 ← API route handlers
│   ├── auth.js             ← /api/auth  (register, login)
│   ├── users.js            ← /api/users (profiles)
│   ├── posts.js            ← /api/posts (CRUD + likes)
│   ├── comments.js         ← /api/comments
│   └── follows.js          ← /api/follows
│
└── middleware/
    ├── auth.js             ← JWT protect middleware
    └── upload.js           ← Multer image upload
```

---

## Setup Instructions

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Then edit .env with your MongoDB URI and JWT secret
```

### 3. Run the server
```bash
# Development (auto-restart on changes)
npm run dev

# Production
npm start
```

Server runs on: `http://localhost:5000`

---

## API Endpoints

### Auth — `/api/auth`
| Method | Route              | Description          | Auth Required |
|--------|--------------------|----------------------|---------------|
| POST   | `/api/auth/register` | Register new user  | No            |
| POST   | `/api/auth/login`    | Login user         | No            |

### Users — `/api/users`
| Method | Route                      | Description              | Auth Required |
|--------|----------------------------|--------------------------|---------------|
| GET    | `/api/users`               | Get all users (+ search) | Yes           |
| GET    | `/api/users/:username`     | Get user profile         | Yes           |
| PUT    | `/api/users/profile/update`| Update own profile       | Yes           |

### Posts — `/api/posts`
| Method | Route                  | Description                | Auth Required |
|--------|------------------------|----------------------------|---------------|
| GET    | `/api/posts/feed`      | Get following feed         | Yes           |
| GET    | `/api/posts`           | Get all posts              | Yes           |
| POST   | `/api/posts`           | Create new post            | Yes           |
| DELETE | `/api/posts/:id`       | Delete own post            | Yes           |
| PUT    | `/api/posts/:id/like`  | Like/Unlike a post         | Yes           |

### Comments — `/api/comments`
| Method | Route                    | Description             | Auth Required |
|--------|--------------------------|-------------------------|---------------|
| GET    | `/api/comments/:postId`  | Get comments for a post | Yes           |
| POST   | `/api/comments/:postId`  | Add a comment           | Yes           |
| DELETE | `/api/comments/:id`      | Delete own comment      | Yes           |

### Follows — `/api/follows`
| Method | Route                          | Description            | Auth Required |
|--------|--------------------------------|------------------------|---------------|
| POST   | `/api/follows/:userId`         | Follow/Unfollow toggle | Yes           |
| GET    | `/api/follows/:userId/followers` | Get user's followers | Yes           |
| GET    | `/api/follows/:userId/following` | Get user's following | Yes           |
| GET    | `/api/follows/suggestions/list`  | Get follow suggestions| Yes          |

---

## Authentication

All protected routes require a JWT token in the request header:

```
Authorization: Bearer <your_token_here>
```

The token is returned when you register or login.

---

## Database Models

### Users Table
```
id, name, username, email, password (hashed), bio, avatar, createdAt
```

### Posts Table
```
id, user (ref), text, image, likes[] (ref), createdAt
```

### Comments Table
```
id, post (ref), user (ref), text, createdAt
```

### Followers Table
```
id, follower (ref), following (ref), createdAt
```
