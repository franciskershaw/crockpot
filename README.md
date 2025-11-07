# Crockpot 🍲

Crockpot is a modern recipe and meal planning application built with Next.js. Crockpot helps you discover recipes, plan your weekly meals, and automatically generate shopping lists. This is version 2 (or 3? I lose track with how much this thing has been iterated upon!), and is a long winded attempt to remove shopping lists from people's day-to-day lives.

The live website is found at [crockpot.app](https://www.crockpot.app/). Happy cooking!

![crockpot-hero](/public/images/crockpot.png)

## Features

- **Recipe Browsing**: Browse and search through a collection of recipes with detailed instructions, ingredients, and images
- **Meal Planning**: Create weekly meal plans by adding recipes to your menu
- **Smart Shopping Lists**: Automatically generate shopping lists from your meal plan
- **Favorites**: Save your favorite recipes for quick access
- **Custom Recipes**: Users can create and submit their own recipes which can become public facing upon admin approval
- **User Roles**: Tiered access system (FREE, PREMIUM, PRO, ADMIN)
- **Admin Panel**: Comprehensive admin interface for managing users, recipes, items, categories, and more
- **Authentication**: Secure authentication with Google OAuth and email magic links

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Prisma](https://www.prisma.io/)
- **Authentication**: [NextAuth.js v5](https://next-auth.js.org/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: [TanStack Query](https://tanstack.com/query)
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Image Upload**: [Cloudinary](https://cloudinary.com/)
- **Email**: [Resend](https://resend.com/)

## Project Structure

```
crockpot/
├── src/
│   ├── actions/          # Server actions for data mutations
│   ├── app/              # Next.js App Router pages and layouts
│   │   ├── admin/        # Admin panel routes
│   │   ├── recipes/      # Recipe browsing and detail pages
│   │   ├── your-crockpot/# User dashboard (menu, favorites, recipes)
│   │   └── api/          # API routes
│   ├── components/       # React components
│   │   ├── ui/           # Reusable UI components (Radix UI based)
│   │   ├── landing/      # Landing page components
│   │   └── dialogs/      # Dialog components
│   ├── data/             # Data access layer (Prisma queries)
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions and configurations
│   ├── types/            # TypeScript type definitions
│   └── styles/           # Global styles
├── prisma/
│   └── schema.prisma     # Prisma database schema
└── public/               # Static assets
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- MongoDB database (local or cloud instance)
- Cloudinary account (for image uploads)
- Resend account (for email authentication)
- Google OAuth credentials (optional, for Google sign-in)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd crockpot
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="mongodb://localhost:27017/crockpot"
# or for MongoDB Atlas:
# DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/crockpot"

# NextAuth
AUTH_SECRET="your-secret-key-here"
AUTH_URL="http://localhost:3000"

# Email Authentication (Resend)
AUTH_RESEND_KEY="your-resend-api-key"
EMAIL_FROM="noreply@yourdomain.com"

# Google OAuth (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

4. Set up the database:

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations (if using migrations)
npx prisma migrate dev

# Or push the schema directly (for MongoDB)
npx prisma db push
```

5. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start the development server with Turbopack
- `npm run build` - Generate Prisma Client and build the production application
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check for code issues

## User Roles

The application supports four user roles with different permissions:

- **FREE**: Basic users can browse recipes, favorite them, and create meal plans/shopping lists
- **PREMIUM**: Can create custom recipes and items (pending admin approval)
- **PRO**: Access to advanced features and AI functionality (future)
- **ADMIN**: Full access to admin panel for managing all content and users

You'll need to manually update your first user to admin in order to test those capabilities

## Key Features Explained

### Recipe Management

- Recipes include name, cooking time, servings, instructions, notes, and images
- Recipes can be categorised and favorited by users
- Premium users can create custom recipes that require admin approval

### Meal Planning

- Users can add recipes to their weekly menu
- Menu tracks serving sizes for each recipe
- Shopping lists are automatically generated from menu items

### Shopping Lists

- Automatically generated from meal plan recipes
- Items are aggregated by ingredient
- Users can manually add items
- Items can be marked as obtained

### Admin Panel

- User management with role assignment
- Recipe approval and management
- Item and category management
- Unit management
- Usage statistics for categories and units

## Database Schema

The application uses MongoDB with Prisma. Key models include:

- **User**: User accounts with roles and authentication
- **Recipe**: Recipe data with embedded ingredients
- **Item**: Ingredient items with categories and units
- **ItemCategory**: Categories for organising items
- **RecipeCategory**: Categories for organising recipes
- **Unit**: Measurement units (cups, grams, etc.)
- **RecipeMenu**: User meal plans
- **ShoppingList**: User shopping lists

See `prisma/schema.prisma` for the complete schema definition.
