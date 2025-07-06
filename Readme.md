# ModernCart - E-commerce Platform

ModernCart is a full-stack e-commerce platform built with React and Express, designed to provide a modern shopping experience with comprehensive product management, user authentication, and cart functionality. The application follows a monorepo structure with shared schemas and types between frontend and backend.


## 🚀 Features

- **User Authentication**: Secure login system with Replit Auth integration
- **Product Catalog**: Browse products with categories, search, and filtering
- **Shopping Cart**: Add/remove items, quantity management, persistent cart
- **Admin Panel**: Complete product and user management system
- **Responsive Design**: Mobile-first approach with modern UI components
- **Database Integration**: PostgreSQL with Drizzle ORM for type-safe operations

## 🛠️ Technology Stack

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state, React Context for local state
- **Form Management**: React Hook Form with Zod validation
- **Build Tool**: Vite for development and build processes


### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Authentication**: Passport.js with local strategy and session-based auth
- **Database**: PostgreSQL with Drizzle ORM
- **Session Storage**: PostgreSQL-backed session store
- **API Structure**: RESTful API with proper error handling and middleware

### DevOps & Tools
- **ESBuild** for production bundling
- **Drizzle Kit** for database migrations
- **WebSocket** support for real-time features

### Data Storage
- **Database**: PostgreSQL (via Neon serverless)
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema**: Centralized schema definition in `/shared/schema.ts`
- **Migrations**: Drizzle-kit for database migrations

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone  https://github.com/Reaishma/ModernCart--E--commerce-platform .git
   cd moderncart
   ```

2. **Open in browser**
   ```bash
   # Simply open index.html in your web browser
   open index.html
   ```

3. **Or serve locally**
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:8000
   ```


## 🏗️ Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utilities and configurations
├── server/                 # Backend Express application
│   ├── routes.ts          # API route definitions
│   ├── storage.ts         # Database operations
│   ├── db.ts              # Database connection
│   └── replitAuth.ts      # Authentication setup
├── shared/                # Shared types and schemas
│   └── schema.ts          # Database schema definitions
└── package.json           # Project dependencies
```

## 🎯 Key Features Implementation

1. **User Authentication**: Client authenticates via login form → Server validates credentials → Session created → User context updated
2. **Product Browsing**: Client requests products → Server queries database → Filtered/paginated results returned → Products displayed
3. **Cart Operations**: User adds to cart → Client sends request → Server updates database → Cart state refreshed
4. **Admin Operations**: Admin accesses panel → Server validates admin role → CRUD operations on products/categories → Database updated


## Key Components

### Database Schema
- **Users**: Authentication with role-based access (user/admin)
- **Categories**: Product categorization with slug-based URLs
- **Products**: Complete product information with pricing, inventory, and ratings
- **Cart Items**: User-specific shopping cart functionality
- **Orders**: Order management system with order items relationship

### Authentication System
- Session-based authentication using Passport.js
- Password hashing with Node.js crypto module
- Role-based access control (user/admin)
- Protected routes on both frontend and backend

### Product Management
- Admin panel for product and category management
- Image upload and management
- Stock tracking and inventory management
- Product search and filtering capabilities
- Featured products system

### Shopping Cart
- Persistent cart storage for authenticated users
- Real-time cart updates with optimistic UI
- Quantity management and item removal
- Integrated checkout process

## External Dependencies

## frontend dependencies 

**UI Components**: Comprehensive shadcn/ui component library
- **Forms**: React Hook Form with Zod validation
- **State Management**: TanStack Query for API state
- **Icons**: Lucide React icon library
- **Styling**: Tailwind CSS with custom configuration

## Backend Dependencies
- **Database**: Neon PostgreSQL serverless database
- **Authentication**: Passport.js with session management
- **Validation**: Zod for request validation
- **ORM**: Drizzle ORM fFrontendase operations

## 🎯 Live Demo

[View Live Demo](https://reaishma.github.io/ModernCart--E--commerce-platform-/ )

### User Experience
- **Demo Authentication** (username: `admin`, password: `admin123`)
- **Toast Notifications** for user feedback
- **Loading States** and error handling
- **Smooth Animations** and micro-interactions

### Production Build
- Frontend: Vite production build with asset optimization
- Backend: ESBuild compilation for Node.js deployment
- Database: Neon PostgreSQL cloud database
- Static assets served via Express in production

### Configuration Management
- Environment variables for database connection
- Session secret management
- TypeScript path mapping for clean imports
- Shared types and schemas between frontend/backend

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

- ## 🙏 Acknowledgments

- **Tailwind CSS** for the utility-first CSS framework
- **Lucide** for the beautiful icon library
- **Unsplash** for high-quality product images
- **Web Development Community** for inspiration and best practices

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Developer
**Reaishma N**
- Email: [vra.9618@gmail.com](mailto:vra.9618@gmail.com)
- GitHub: [@Reaishma](https://github.com/Reaishma)



##  Acknowledgments

- Built with modern web development best practices
- Utilizes industry-standard tools and frameworks
- Designed for scalability and maintainability
- Optimized for performance and user experience

## 📞 Support

If you have any questions or need help with the project, please:
1. Check the [Issues](https://github.com/Reaishma/moderncart/issues) page
2. Create a new issue if your question isn't already answered
3. Contact me directly at vra.9618@gmail.com

---

⭐ If you find this project helpful, please consider giving it a star on GitHub!

---

*This project demonstrates full-stack development capabilities including frontend design, backend API development, database design, authentication systems, and deployment strategies.*