# ShopEZ — E-Commerce Platform

> ShopEZ is your one-stop destination for effortless online shopping. With a user-friendly interface and a comprehensive product catalog, finding the perfect items has never been easier.

## 🚀 Tech Stack

- **Frontend:** React.js, Bootstrap 5, Chart.js, React Router v6
- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT + bcryptjs
- **Image Storage:** Cloudinary
- **Icons:** React Icons
- **Charts:** Chart.js + react-chartjs-2

## 📁 Project Structure

```
ShopEZ/
├── client/          # React Frontend
├── server/          # Express Backend
├── .gitignore
└── README.md
```

## 🔧 Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- Cloudinary account (for image uploads)

### 1. Clone the repository
```bash
git clone <repo-url>
cd ShopEZ
```

### 2. Setup Backend
```bash
cd server
npm install
```

Create `server/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/shopez
JWT_SECRET=your_jwt_secret_key_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Setup Frontend
```bash
cd client
npm install
```

Create `client/.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 4. Seed the Database
```bash
cd server
npm run seed
```

### 5. Run the Application
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm start
```

## 👥 Roles

| Role | Capabilities |
|------|-------------|
| **User** | Browse products, add to cart, checkout, write reviews, track orders |
| **Seller** | All user capabilities + manage own products, view sales analytics |
| **Admin** | Full platform control — manage users, products, orders, view analytics |

## 📝 Default Admin Credentials (after seeding)
- **Email:** admin@shopez.com
- **Password:** Admin@123

## 🌐 API Endpoints

- `POST /api/auth/register` — Register new user
- `POST /api/auth/login` — Login
- `GET /api/products` — Browse products
- `POST /api/cart/add` — Add to cart
- `POST /api/orders` — Place order
- See full API documentation in `server/routes/`

## 📄 License

This project is for educational purposes.

## 👤 Author

Sudeeksha
