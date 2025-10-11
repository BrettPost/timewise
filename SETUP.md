# TimeWise - Setup Guide

TimeWise is a time budgeting application that helps you track and manage your time like money.

## Prerequisites

- Node.js 18+ installed
- A Stack Auth account (https://app.stack-auth.com/)
- A Convex account (https://dashboard.convex.dev/)

## Setup Instructions

### 1. Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Stack Auth Configuration
# Get these values from https://app.stack-auth.com/
NEXT_PUBLIC_STACK_PROJECT_ID=your_stack_project_id
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=your_stack_publishable_key
STACK_SECRET_SERVER_KEY=your_stack_secret_key

# Convex Configuration
# Get this from https://dashboard.convex.dev/
NEXT_PUBLIC_CONVEX_URL=https://your-convex-deployment.convex.cloud

# Production URL (for Stack Auth redirects)
NEXT_PUBLIC_STACK_URL=http://localhost:3000
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set up Convex

```bash
# Login to Convex
npx convex login

# Initialize your Convex project (if not already done)
npx convex dev
```

This will:
- Create your Convex deployment
- Push your schema and functions
- Provide you with the NEXT_PUBLIC_CONVEX_URL

### 4. Set up Stack Auth

1. Go to https://app.stack-auth.com/
2. Create a new project
3. Copy your project credentials
4. Configure the allowed redirect URLs:
   - Development: `http://localhost:3000`
   - Production: Your production URL
5. Enable email/password authentication

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Features

### 1. Calendar View
- View all your time sections in a monthly calendar
- Click on any day to create a new time section
- Click on existing time sections to edit them
- Color-coded categories for easy identification
- Quick add button for creating time sections

### 2. Summary View
- Filter time sections by date range and category
- View statistics on time spent across categories
- See total time, number of sections, and days of time tracked
- Visual breakdown of time by category with percentages
- List of recent time sections

### 3. Category Management
- Create custom categories with names and colors
- Edit existing categories
- Delete categories (will also delete associated time sections)
- 12 preset colors to choose from

## Database Schema

### Categories
- `userId`: The user who owns the category
- `name`: Category name (e.g., "Work", "Exercise", "Sleep")
- `color`: Hex color for visual distinction
- `createdAt`: Timestamp when created

### Time Sections
- `userId`: The user who owns the time section
- `categoryId`: Reference to the category
- `title`: Optional title/description
- `startTime`: Start timestamp (milliseconds)
- `endTime`: End timestamp (milliseconds)
- `createdAt`: Timestamp when created

## Tech Stack

- **Next.js 15** - React framework
- **Stack Auth** - Authentication
- **Convex** - Real-time database
- **Tailwind CSS** - Styling
- **TypeScript** - Type safety

## Tips for Using TimeWise

1. **Start with broad categories** like "Work", "Personal", "Sleep", then create more specific subcategories as needed
2. **Use the quick filters** in the Summary view to analyze your time usage patterns
3. **Add optional titles** to time sections for more detailed tracking
4. **Review your statistics regularly** to understand where your time is going
5. **Set realistic expectations** - tracking doesn't need to be perfect to be useful!

## Future Feature Ideas (commented in code)

- Time budgets/goals per category
- Recurring time sections
- Weekly/monthly reports
- Export data functionality
- Time section templates
- Notifications/reminders

Enjoy tracking your time with TimeWise! 🎯⏱️

