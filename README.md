# Smart Adhat - Digital Mandi Management System

A comprehensive digital platform to help Adhat (commission agents) manage their inventory, pricing, and transactions digitally - replacing traditional "bahi-khata" (ledger books).

## 🚀 AWS Deployment

All deployment scripts are organized in the `deployment` folder. See [deployment/README.md](deployment/README.md) for detailed instructions.

### Quick Deploy
```powershell
cd deployment

# First time setup
.\1-setup-s3.ps1
.\2-setup-cloudfront.ps1
.\3-setup-backend.ps1
.\4-setup-api-gateway.ps1
.\5-build-deploy.ps1

# Update application
.\5-build-deploy.ps1
```

**Cost**: ~$8-12/month | **Security**: Private S3 + Backend, HTTPS everywhere

---

## 🌟 Features

### Core Features
- **Product Management**: Manage different agricultural products (Wheat, Pulses, Sarso, etc.)
- **Purchase Management**: Record purchases from farmers and middlemen
- **Sales Management**: Track sales to mills, traders, and other adhats
- **Inventory Tracking**: Real-time stock management with automatic updates
- **Dashboard Analytics**: Visual insights into business metrics
- **Price Management**: Set and manage buying/selling prices
- **Multi-language Support**: English, Hindi interface

### Business Benefits
- Replace paper-based ledger (bahi-khata) with digital records
- Real-time inventory visibility
- Track pending payments (both receivables and payables)
- Calculate profit margins automatically
- Low stock alerts
- Complete transaction history

## 🛠️ Technology Stack

### Backend
- **Framework**: Spring Boot 3.2.0
- **Language**: Java 21
- **Database**: H2 (Development), PostgreSQL (Production)
- **Security**: JWT Authentication
- **Build Tool**: Maven

### Frontend
- **Framework**: Angular 18
- **Styling**: Tailwind CSS
- **Language**: TypeScript 5.4

## 📦 Project Structure

```
smart-adhat/
├── backend/                    # Spring Boot Backend
│   ├── src/main/java/
│   │   └── com/smartadhat/
│   │       ├── controller/     # REST Controllers
│   │       ├── service/        # Business Logic
│   │       ├── model/          # Entity Models
│   │       ├── repository/     # Data Access
│   │       ├── dto/            # Data Transfer Objects
│   │       ├── security/       # Security & JWT
│   │       └── config/         # Configuration
│   └── src/main/resources/
│       └── application.yml     # Application Config
├── frontend/                   # Angular Frontend
│   ├── src/app/
│   │   ├── features/          # Feature Modules
│   │   │   ├── auth/          # Authentication
│   │   │   ├── dashboard/     # Dashboard
│   │   │   ├── inventory/     # Inventory Management
│   │   │   ├── purchases/     # Purchase Entry
│   │   │   ├── sales/         # Sales Entry
│   │   │   ├── products/      # Product Management
│   │   │   └── prices/        # Price Management
│   │   ├── core/              # Core Services
│   │   │   ├── services/      # API Services
│   │   │   ├── models/        # TypeScript Models
│   │   │   ├── guards/        # Route Guards
│   │   │   └── interceptors/  # HTTP Interceptors
│   │   └── shared/            # Shared Components
│   └── tailwind.config.js     # Tailwind Configuration
└── PLAN.md                    # Development Roadmap
```

## 🚀 Getting Started

### Prerequisites
- Java 17 or higher
- Node.js 18 or higher
- Maven 3.8+
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
   ```cmd
   cd D:\Project\digital-kisan\backend
   ```

2. **Build the project**
   ```cmd
   mvn clean install
   ```

3. **Run the application**
   ```cmd
   mvn spring-boot:run
   ```

   The backend will start on `http://localhost:8080`

4. **Access H2 Console** (Development only)
   - URL: `http://localhost:8080/api/h2-console`
   - JDBC URL: `jdbc:h2:mem:smartadhat`
   - Username: `sa`
   - Password: (leave blank)

### Frontend Setup

1. **Navigate to frontend directory**
   ```cmd
   cd D:\Project\smart-adhat\frontend
   ```

2. **Install dependencies**
   ```cmd
   npm install
   ```

3. **Start development server**
   ```cmd
   npm start
   ```

   The frontend will start on `http://localhost:4200`

## 🔑 Default Login Credentials

After registering your first adhat shop through the registration page, use those credentials to login.

**Registration URL**: `http://localhost:4200/auth/register`

## 📊 API Documentation

Once the backend is running, access Swagger UI for API documentation:
```
http://localhost:8080/api/swagger-ui.html
```

## 🏗️ Key API Endpoints

### Authentication
- `POST /api/auth/register` - Register new adhat shop
- `POST /api/auth/login` - Login to system

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create new product
- `GET /api/products/{id}` - Get product by ID

### Purchases
- `POST /api/purchases` - Record new purchase
- `GET /api/purchases` - Get all purchases
- `GET /api/purchases/filter` - Filter by date range

### Sales
- `POST /api/sales` - Record new sale
- `GET /api/sales` - Get all sales
- `GET /api/sales/filter` - Filter by date range

### Inventory
- `GET /api/inventory` - Get current inventory
- `GET /api/inventory/product/{productId}` - Get inventory for specific product

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

## 🎨 User Interface

### Login Page
Clean and intuitive login interface with Hindi translations

### Dashboard
- Real-time metrics (Total Products, Inventory Value, Today's Sales/Purchases)
- Monthly statistics with profit calculations
- Pending payment tracking
- Low stock alerts
- Recent transactions list

### Inventory Page
- Complete stock overview
- Product-wise quantity and value
- Low stock indicators
- Total inventory value

### Purchase Entry
- Quick purchase recording
- Seller information capture
- Vehicle and bill details
- Payment status tracking
- Auto-calculates total amount

### Sales Entry
- Quick sales recording
- Stock validation (prevents overselling)
- Buyer information
- Payment tracking
- Auto-updates inventory

### Products Management
- Add new products
- Category-wise organization
- Hindi name support
- Unit management (Quintal, KG, Ton, Bag)

### Price Management
- Set buying and selling prices
- View profit margins
- Percentage calculations
- Price history (coming soon)

## 🔐 Security Features

- JWT-based authentication
- Password encryption with BCrypt
- Protected API endpoints
- Role-based access control
- Session management
- CORS configuration

## 🌐 Multi-language Support

Current support:
- English
- Hindi (हिंदी)

Planned:
- Punjabi (ਪੰਜਾਬੀ)
- Marathi (मराठी)

## 📱 Future Enhancements

### Phase 2 - Public Price Discovery
- Public page showing all adhat prices
- Farmers can view without login
- Location-based search
- Real-time price comparison

### Phase 3 - Advanced Features
- Mobile applications (Android/iOS)
- SMS/WhatsApp notifications
- Payment gateway integration
- GST invoice generation
- Report generation (PDF/Excel)
- Analytics and insights

## 🐛 Known Issues & Limitations

- Price entity integration pending (currently showing sample data)
- Report generation not yet implemented
- No mobile app yet
- Limited to single currency (INR)

## 🤝 Contributing

This is a startup project. For collaboration opportunities, please contact the development team.

## 📄 License

Proprietary - All rights reserved © 2025 Smart Adhat

## 📞 Support

For support and queries:
- Email: support@smartadhat.com (coming soon)
- Phone: +91-XXXXXXXXXX (coming soon)

## 🙏 Acknowledgments

Built for the agricultural community of India to modernize mandi operations and empower Adhat businesses.

---

**Note**: This is an active development project. Features and documentation are continuously being updated.

Last Updated: November 29, 2025
