# Contact Information Manager by Yamyamin Group
Members: Reiniel Yammyamin
         Shawn Francis Afulugencia 
         Ferdinand Paul Palma 
         Anthony Eduard Catungal

A full-stack web app for saving and managing contacts. Users fill out a form in the browser; the data is sent through Axios to an Express API, validated, stored in MySQL, and displayed back in a searchable list.

## Tech Stack
- **Frontend:** React, Vite, TypeScript, Axios
- **Backend:** Node.js, Express, cors, dotenv
- **Database:** MySQL (mysql2/promise connection pool)

## Setup
1. **Clone** the repository and open it in VS Code.
2. **Create the database** (run once):
```bash
   mysql -u root -p < server/schema.sql
```
3. **Configure the server:** copy `server/.env.example` to `server/.env` and fill in your MySQL user and password.
4. **Run the server:**
```bash
   cd server
   npm install
   npm run dev
```
5. **Configure the client:** copy `client/.env.example` to `client/.env` and set `VITE_API_URL=http://localhost:3000/api`.
6. **Run the client:**
```bash
   cd client
   npm install
   npm run dev
```
7. Open http://localhost:5173

## API Endpoints
| Method | Path | Purpose | Status Codes |
|--------|------|---------|--------------|
| GET | /api/contacts | List contacts (optional `?search=` and `?category=`) | 200 |
| GET | /api/contacts/:id | Get one contact | 200, 404 |
| POST | /api/contacts | Create a contact | 201, 400 |
| PUT | /api/contacts/:id | Update a contact | 200, 400, 404 |
| DELETE | /api/contacts/:id | Delete a contact | 200, 404 |

## Screenshots
![Contact list](screenshots/list.png)
![Add contact form with validation errors](screenshots/validation.png)
![Edit mode and search](screenshots/edit-search.png)

## Bonus Features Implemented
- Edit/update records (PUT with UPDATE query)
- Search and category filter using query strings on the API
- Meaningful use of useContext (toast notifications)

