# 🔧 SparePartsHub — Multi-Vendor Marketplace for Bike & Car Spare Parts

A scalable, full-stack multi-vendor e-commerce platform built with the MERN stack. Customers can browse and purchase bike and car spare parts from multiple registered wholesalers — similar to Blinkit but tailored for the automotive spare parts industry.

> **University Final-Year Project**

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation & Setup](#-installation--setup)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [User Roles](#-user-roles)
- [Screenshots](#-screenshots)
- [Future Enhancements](#-future-enhancements)

---

## ✨ Features

### 🔐 Authentication & Authorization
- JWT-based authentication (access + refresh tokens)
- Role-based access control (Admin, Wholesaler, Customer)
- Server-side validation with Joi
- Secure password hashing with bcrypt

### 🛒 Customer Features
- Browse products from multiple wholesalers
- Search & filter by vehicle type, category, brand, price range
- Shopping cart with quantity management
- Order placement and checkout
- **Order tracking** (Placed → Confirmed → Shipped → Delivered)
- File complaints against products or wholesalers
- Email notifications for order updates

### 📦 Wholesaler Features
- Product management (CRUD) with image upload
- Inventory & stock management
- View and manage incoming orders
- Update order status (confirm, ship, deliver)
- Respond to customer complaints
- Dashboard with sales overview

### 👑 Admin Features
- Full analytics dashboard (total sales, users, complaints, top products)
- Manage all users (activate, deactivate, role changes)
- Manage all orders across the platform
- Oversee and resolve complaints
- Category management (add, edit, delete product categories)

### 🤖 AI Chatbot
- Integrated chatbot for customer assistance
- Product availability queries
- Order status and tracking info
- General platform help and FAQs
- Falls back to rule-based responses if no AI API key configured

### 📧 Email Notifications
- Order confirmation emails
- Order status update notifications
- Complaint response alerts
- Powered by Nodemailer (SMTP)

---

## 🛠 Tech Stack

| Layer        | Technology                          |
|-------------|-------------------------------------|
| **Frontend** | React 18, React Router v6          |
| **Styling**  | Tailwind CSS                       |
| **Backend**  | Node.js, Express.js                |
| **Database** | MongoDB with Mongoose              |
| **Auth**     | JWT (access + refresh tokens)      |
| **Validation** | Joi                             |
| **Email**    | Nodemailer                         |
| **File Upload** | Multer                          |
| **AI Chat**  | OpenAI API (optional) + rule-based fallback |

---

## 📁 Project Structure

```
sparepartshub/
├── client/                     # React Frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── chat/
│   │   │   │   └── ChatBot.js
│   │   │   └── common/
│   │   │       ├── Footer.js
│   │   │       ├── LoadingSpinner.js
│   │   │       ├── Navbar.js
│   │   │       ├── Pagination.js
│   │   │       ├── ProductCard.js
│   │   │       ├── ProtectedRoute.js
│   │   │       └── StatusBadge.js
│   │   ├── context/
│   │   │   ├── AuthContext.js
│   │   │   └── CartContext.js
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   │   ├── AdminCategories.js
│   │   │   │   ├── AdminComplaints.js
│   │   │   │   ├── AdminDashboard.js
│   │   │   │   ├── AdminOrders.js
│   │   │   │   └── AdminUsers.js
│   │   │   ├── auth/
│   │   │   │   ├── LoginPage.js
│   │   │   │   └── RegisterPage.js
│   │   │   ├── customer/
│   │   │   │   ├── CartPage.js
│   │   │   │   ├── CheckoutPage.js
│   │   │   │   ├── ComplaintDetailPage.js
│   │   │   │   ├── ComplaintsPage.js
│   │   │   │   ├── OrderDetailPage.js
│   │   │   │   └── OrdersPage.js
│   │   │   ├── wholesaler/
│   │   │   │   ├── ProductForm.js
│   │   │   │   ├── WholesalerComplaints.js
│   │   │   │   ├── WholesalerDashboard.js
│   │   │   │   ├── WholesalerOrders.js
│   │   │   │   └── WholesalerProducts.js
│   │   │   ├── HomePage.js
│   │   │   ├── ProductDetailPage.js
│   │   │   └── ProductsPage.js
│   │   ├── services/
│   │   │   ├── admin.service.js
│   │   │   ├── api.js
│   │   │   ├── auth.service.js
│   │   │   ├── category.service.js
│   │   │   ├── chat.service.js
│   │   │   ├── complaint.service.js
│   │   │   ├── order.service.js
│   │   │   └── product.service.js
│   │   ├── App.js
│   │   ├── index.css
│   │   └── index.js
│   ├── package.json
│   ├── postcss.config.js
│   └── tailwind.config.js
├── server/                     # Express Backend
│   ├── config/
│   │   ├── db.js
│   │   └── email.js
│   ├── controllers/
│   │   ├── admin.controller.js
│   │   ├── auth.controller.js
│   │   ├── category.controller.js
│   │   ├── chat.controller.js
│   │   ├── complaint.controller.js
│   │   ├── order.controller.js
│   │   └── product.controller.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── upload.js
│   ├── models/
│   │   ├── Category.js
│   │   ├── Chat.js
│   │   ├── Complaint.js
│   │   ├── Order.js
│   │   ├── Product.js
│   │   └── User.js
│   ├── routes/
│   │   ├── admin.routes.js
│   │   ├── auth.routes.js
│   │   ├── category.routes.js
│   │   ├── chat.routes.js
│   │   ├── complaint.routes.js
│   │   ├── order.routes.js
│   │   └── product.routes.js
│   ├── services/
│   │   ├── chat.service.js
│   │   └── email.service.js
│   ├── utils/
│   │   └── seed.js
│   ├── validators/
│   │   ├── auth.validator.js
│   │   ├── category.validator.js
│   │   ├── complaint.validator.js
│   │   ├── order.validator.js
│   │   └── product.validator.js
│   ├── .env.example
│   ├── index.js
│   └── package.json
└── README.md
```

---

## 🚀 Installation & Setup

### Prerequisites
- **Node.js** v16+ 
- **MongoDB** (local or Atlas cloud)
- **npm** or **yarn**

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/sparepartshub.git
cd sparepartshub
```

### 2. Setup the Backend
```bash
cd server
cp .env.example .env
# Edit .env with your MongoDB URI, JWT secrets, and SMTP credentials
npm install
```

### 3. Setup the Frontend
```bash
cd ../client
npm install
```

### 4. Seed the Database (Optional)
```bash
cd ../server
node utils/seed.js
```
This creates a default admin account and sample categories.

### 5. Run the Application

**Start backend (from /server):**
```bash
npm run dev    # with nodemon (development)
# or
npm start      # production
```

**Start frontend (from /client):**
```bash
npm start
```

The app will be available at:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000

---

## 🔑 Environment Variables

Create a `.env` file in the `server/` directory:

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/sparepartshub` |
| `JWT_ACCESS_SECRET` | Secret for access tokens | `your_strong_secret` |
| `JWT_REFRESH_SECRET` | Secret for refresh tokens | `another_strong_secret` |
| `JWT_ACCESS_EXPIRY` | Access token expiry | `15m` |
| `JWT_REFRESH_EXPIRY` | Refresh token expiry | `7d` |
| `SMTP_HOST` | Email SMTP host | `smtp.gmail.com` |
| `SMTP_PORT` | Email SMTP port | `587` |
| `SMTP_USER` | Email address | `you@gmail.com` |
| `SMTP_PASS` | Email app password | `your_app_password` |
| `CLIENT_URL` | Frontend URL (CORS) | `http://localhost:3000` |
| `OPENAI_API_KEY` | OpenAI key for chatbot (optional) | `sk-...` |

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/refresh` | Refresh access token |
| GET | `/api/auth/profile` | Get current user profile |
| PUT | `/api/auth/profile` | Update profile |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List products (with filters) |
| GET | `/api/products/:id` | Product details |
| POST | `/api/products` | Create product (wholesaler) |
| PUT | `/api/products/:id` | Update product (wholesaler) |
| DELETE | `/api/products/:id` | Delete product (wholesaler) |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders` | Place order (customer) |
| GET | `/api/orders` | List user's orders |
| GET | `/api/orders/:id` | Order details |
| PUT | `/api/orders/:id/status` | Update order status |

### Complaints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/complaints` | File complaint (customer) |
| GET | `/api/complaints` | List complaints |
| GET | `/api/complaints/:id` | Complaint details |
| PUT | `/api/complaints/:id` | Respond to complaint |

### Categories
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories` | List categories |
| POST | `/api/categories` | Create category (admin) |
| PUT | `/api/categories/:id` | Update category (admin) |
| DELETE | `/api/categories/:id` | Delete category (admin) |

### Chat
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/chat` | Send message to AI chatbot |
| GET | `/api/chat/history` | Get chat history |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/dashboard` | Analytics overview |
| GET | `/api/admin/users` | List all users |
| PUT | `/api/admin/users/:id` | Update user (activate/deactivate) |

---

## 👥 User Roles

| Role | Capabilities |
|------|-------------|
| **Customer** | Browse, search, buy products, track orders, file complaints, use chatbot |
| **Wholesaler** | List/manage products, fulfill orders, respond to complaints |
| **Admin** | Full platform control, analytics, user management, category management |

---

## 📸 Screenshots

> _Add screenshots of your running application here_

---

## 🔮 Future Enhancements

- [ ] Payment gateway integration (Razorpay/Stripe)
- [ ] Real-time notifications with WebSockets
- [ ] Mobile app (React Native)
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Advanced analytics and reporting
- [ ] SMS notifications (Twilio)
- [ ] Multi-language support

---

## 📝 License

This project is developed as a university final-year project.

---

**Built with ❤️ using the MERN Stack**
