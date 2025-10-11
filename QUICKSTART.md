# TimeWise - Quick Start Guide

Get up and running in under 5 minutes!

## 🚀 Quick Setup

### 1. Create `.env.local` file

```bash
# Copy and paste this into a new .env.local file in the root directory
NEXT_PUBLIC_STACK_PROJECT_ID=your_stack_project_id
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=your_stack_publishable_key
STACK_SECRET_SERVER_KEY=your_stack_secret_key
NEXT_PUBLIC_CONVEX_URL=https://your-convex-deployment.convex.cloud
NEXT_PUBLIC_STACK_URL=http://localhost:3000
```

### 2. Get Your Credentials

**Stack Auth:**
- Visit https://app.stack-auth.com/
- Create a new project
- Copy the credentials to your `.env.local`

**Convex:**
```bash
npx convex login
npx convex dev
```
This will give you the `NEXT_PUBLIC_CONVEX_URL` - add it to `.env.local`

### 3. Install & Run

```bash
npm install
npm run dev
```

Visit http://localhost:3000 🎉

## 📝 First Steps

1. **Sign Up** - Create an account with your email
2. **Create Categories** - Click "Manage Categories" and add some:
   - Work
   - Personal
   - Exercise
   - Sleep
   - etc.
3. **Add Time Sections** - Click the "+" button or click on any day in the calendar
4. **View Statistics** - Switch to the "Summary" tab to see your time breakdown

## 🎯 Features Overview

### Calendar View
- **Monthly Calendar** - See all your time sections at a glance
- **Color-coded** - Categories are visually distinguished
- **Quick Add** - Floating "+" button for fast entry
- **Edit/Delete** - Click any time section to modify

### Summary View
- **Date Range Filters** - Analyze any time period
- **Category Filters** - Focus on specific activities
- **Statistics** - Total time, sections, and breakdowns
- **Visual Charts** - See percentages by category
- **Recent History** - List of all time sections

### Category Management
- **Custom Categories** - Create unlimited categories
- **12 Preset Colors** - Beautiful color palette
- **Easy Editing** - Update names and colors
- **Safe Deletion** - Warning before removing

## 💡 Pro Tips

1. Start broad with categories, get specific later
2. Use optional titles for important time sections
3. Review your week every Sunday
4. Look for patterns in the Summary view
5. Don't obsess over perfection - rough tracking is still valuable!

## 🏗️ Architecture

```
timewise/
├── src/
│   ├── app/               # Next.js pages
│   ├── components/        # React components
│   ├── lib/              # Convex provider
│   └── stack/            # Stack Auth config
├── convex/               # Backend (Convex)
│   ├── schema.ts         # Database schema
│   ├── categories.ts     # Category functions
│   └── timeSections.ts   # Time section functions
```

## 🔧 Tech Stack

- **Next.js 15** - React framework with App Router
- **Stack Auth** - Authentication (email/password)
- **Convex** - Real-time serverless database
- **Tailwind CSS 4** - Utility-first styling
- **TypeScript** - Type safety

## 🐛 Troubleshooting

**Can't see categories?**
- Make sure Convex dev is running (`npx convex dev`)
- Check browser console for errors
- Verify `NEXT_PUBLIC_CONVEX_URL` is set correctly

**Authentication not working?**
- Verify Stack Auth credentials in `.env.local`
- Check allowed redirect URLs in Stack Auth dashboard
- Make sure `NEXT_PUBLIC_STACK_URL` matches your dev URL

**Build errors?**
- Run `npm install` again
- Delete `.next` folder and restart
- Check Node.js version (needs 18+)

## 📚 Learn More

See [SETUP.md](./SETUP.md) for detailed documentation.

## 🎨 Customization Ideas

- Change the color palette in `CategoryManager.tsx`
- Add more quick filters in `SummaryView.tsx`
- Modify the calendar grid size in `CalendarView.tsx`
- Customize the gradient colors in `page.tsx`

Happy time tracking! ⏰✨

