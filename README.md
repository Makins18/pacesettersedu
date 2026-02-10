# Pacesetters Phonics and Diction Institute (PPDI) Platform

A comprehensive educational platform including course management, book sales, event ticketing, and digital literacy training.

## 🚀 Features

### Frontend (Next.js)
- **Modern UI**: Built with Tailwind CSS and Framer Motion.
- **Admin Dashboard**: Analytics, Sidebar navigation, and Management tools.
- **E-commerce**: Book store with cart functionality.
- **Events**: Event registration and ticketing system.
- **Payments**: Monnify integration for secure transactions.

### Backend (Node.js + Express)
- **Secure API**: JWT Authentication, Role-based access control (RBAC).
- **Performance**: Redis caching for high-speed data retrieval.
- **Background Jobs**: BullMQ & Redis for handling payments and generating invoices asynchronously.
- **Security**: Rate limiting, Helmet security headers, and Audit logging.
- **PDF Generation**: Automatic invoice and ticket generation.

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18+)
- MongoDB
- Redis (for caching and queues)

### 1. Clone and Install
```bash
# Install root dependencies (if any)
npm install

# Install Frontend
cd frontend
npm install

# Install Backend
cd ../backend
npm install
```

### 2. Environment Configuration
Create `.env` files in `frontend` and `backend` directories.

**Backend (.env)**
```ini
PORT=5000
MONGO_URI=mongodb://localhost:27017/ppdi
REDIS_URL=redis://localhost:6379/0
JWT_SECRET=your_jwt_secret
MONNIFY_API_KEY=your_monnify_api_key
MONNIFY_SECRET_KEY=your_monnify_secret_key
MONNIFY_CONTRACT_CODE=your_monnify_contract_code
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_KEY=your_key
CLOUDINARY_SECRET=your_secret
```

**Frontend (.env.local)**
```ini
NEXT_PUBLIC_MONNIFY_API_KEY=your_monnify_public_key
NEXT_PUBLIC_MONNIFY_CONTRACT_CODE=your_monnify_contract_code
```

### 3. Run Locally
```bash
# Start Backend (Terminal 1)
cd backend
npm run dev

# Start Frontend (Terminal 2)
cd frontend
npm run dev
```

## 📂 Project Structure
- **/frontend**: Next.js client application.
- **/backend**: Express server, API, and background workers.
- **/.github**: CI/CD workflows.

## 🤝 Contributing
1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
