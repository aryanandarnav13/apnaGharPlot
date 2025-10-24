# ApnaGhar Plots LLP - Full Stack Real Estate Platform

A complete full-stack web application for land-selling business built with React, Node.js, Express, and PostgreSQL.

## 🌟 Features

### User Features
- **Browse Projects & Plots**: View all available residential plots with detailed information
- **Advanced Filtering**: Filter plots by project, status, price range, and size
- **Plot Booking**: Secure booking system with multiple payment options
- **User Dashboard**: Track bookings and manage profile
- **House Design Gallery**: Pre-designed house concepts with estimated costs
- **Google Maps Integration**: View project locations on interactive maps
- **Responsive Design**: Fully responsive across desktop, tablet, and mobile

### Admin Features
- **Dashboard Analytics**: Comprehensive statistics on plots, bookings, and revenue
- **Project Management**: Full CRUD operations for projects
- **Plot Management**: Add, edit, delete plots with status tracking
- **House Design Management**: Manage pre-designed house concepts
- **Booking Management**: View and update booking statuses
- **User Management**: View all registered users and their bookings

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI Library
- **Vite** - Build tool
- **React Router v6** - Routing
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Icons** - Icons
- **React Toastify** - Notifications

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **Sequelize** - ORM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

## 📋 Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd apnaGharPlot
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create PostgreSQL database
createdb apnaghar_plots

# Or using psql
psql -U postgres
CREATE DATABASE apnaghar_plots;
\q

# Configure environment variables
# Create .env file in backend directory with the following:
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=apnaghar_plots
DB_USER=postgres
DB_PASSWORD=your_password

JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

FRONTEND_URL=http://localhost:3000

# Seed the database with sample data
npm run seed

# Start the backend server
npm run dev
```

The backend server will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the frontend development server
npm run dev
```

The frontend will run on `http://localhost:3000`

## 🔑 Demo Credentials

### Admin Account
- **Email**: admin@example.com
- **Password**: password123

## 📁 Project Structure

```
apnaGharPlot/
├── backend/
│   ├── config/
│   │   ├── db.js                 # Database configuration
│   │   └── seed.js               # Database seeder
│   ├── middleware/
│   │   ├── auth.js               # JWT authentication
│   │   └── errorHandler.js      # Error handling
│   ├── models/
│   │   ├── User.js
│   │   ├── Project.js
│   │   ├── Plot.js
│   │   ├── HouseDesign.js
│   │   ├── Booking.js
│   │   └── index.js              # Model associations
│   ├── routes/
│   │   ├── auth.js               # Authentication routes
│   │   ├── projects.js           # Project CRUD
│   │   ├── plots.js              # Plot CRUD
│   │   ├── houseDesigns.js       # House Design CRUD
│   │   └── bookings.js           # Booking CRUD
│   ├── .gitignore
│   ├── package.json
│   └── server.js                 # Main server file
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── PlotCard.jsx
│   │   │   ├── HouseDesignCard.jsx
│   │   │   ├── ProjectCard.jsx
│   │   │   ├── PrivateRoute.jsx
│   │   │   └── AdminRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Authentication context
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Projects.jsx
│   │   │   ├── PlotDetail.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── UserBookings.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   └── admin/
│   │   │       ├── AdminProjects.jsx
│   │   │       ├── AdminPlots.jsx
│   │   │       ├── AdminHouseDesigns.jsx
│   │   │       └── AdminBookings.jsx
│   │   ├── services/
│   │   │   └── api.js            # API service layer
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .gitignore
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── README.md
└── Dockerfile
```

## 🎨 Branding

- **Colors**:
  - Primary (Green): #4CAF50
  - Secondary (Sky Blue): #87CEEB
  - White: #FFFFFF
- **Fonts**:
  - Headers: Montserrat Bold
  - Body: Lato

## 📊 Database Schema

### Users Table
- id, name, email, password, phone, role (user/admin), created_at, updated_at

### Projects Table
- id, name, location, description, total_area, num_plots, map_lat, map_lng, map_url, layout_image, status, created_at, updated_at

### Plots Table
- id, project_id (FK), plot_number, size, price, status (available/booked/sold), image, description, features, created_at, updated_at

### House Designs Table
- id, project_id (FK), name, description, size, bedrooms, bathrooms, estimated_cost, image, features, created_at, updated_at

### Bookings Table
- id, user_id (FK), plot_id (FK), project_id (FK), status (pending/confirmed/cancelled/completed), payment_method, amount, notes, created_at, updated_at

## 🔒 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Create project (Admin)
- `PUT /api/projects/:id` - Update project (Admin)
- `DELETE /api/projects/:id` - Delete project (Admin)

### Plots
- `GET /api/plots` - Get all plots with filters
- `GET /api/plots/:id` - Get single plot
- `POST /api/plots` - Create plot (Admin)
- `PUT /api/plots/:id` - Update plot (Admin)
- `DELETE /api/plots/:id` - Delete plot (Admin)

### House Designs
- `GET /api/house-designs` - Get all house designs
- `GET /api/house-designs/:id` - Get single house design
- `POST /api/house-designs` - Create house design (Admin)
- `PUT /api/house-designs/:id` - Update house design (Admin)
- `DELETE /api/house-designs/:id` - Delete house design (Admin)

### Bookings
- `GET /api/bookings` - Get bookings (user's own or all for admin)
- `GET /api/bookings/:id` - Get single booking
- `POST /api/bookings` - Create booking (Protected)
- `PUT /api/bookings/:id` - Update booking (Admin)
- `DELETE /api/bookings/:id` - Delete booking (Protected)
- `GET /api/bookings/stats/dashboard` - Get dashboard stats (Admin)

## 🐳 Docker Deployment (Optional)

### Using Docker Compose

```bash
# Build and run containers
docker-compose up -d

# Stop containers
docker-compose down
```

### Manual Docker Setup

```bash
# Build the image
docker build -t apnaghar-plots .

# Run the container
docker run -p 3000:3000 -p 5000:5000 apnaghar-plots
```

## 📝 Environment Variables

### Backend (.env)
```
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=apnaghar_plots
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

## 🧪 Testing

The application includes:
- Form validation on both frontend and backend
- JWT authentication for secure routes
- Error handling middleware
- Input sanitization

## 🚀 Production Deployment

### Backend Deployment
1. Set `NODE_ENV=production` in environment variables
2. Use a production PostgreSQL database
3. Enable SSL for database connections
4. Set secure JWT_SECRET
5. Configure CORS for your production domain
6. Use process manager like PM2

### Frontend Deployment
1. Build the frontend: `npm run build`
2. Serve the `dist` folder using a web server (Nginx, Apache)
3. Configure environment variables for production API URL

## 🤝 Contributing

This is a complete project ready for deployment. Feel free to customize it according to your needs.

## 📄 License

MIT License - feel free to use this project for your business.

## 👨‍💻 Author

ApnaGhar Plots LLP Development Team

## 📞 Support

For support, email info@apnagharplots.com or call +91 98765 43210

---

**Note**: This is a complete, production-ready application. Make sure to change all default passwords, JWT secrets, and other sensitive information before deploying to production.

