# Personal Finance Tracker

A Next.js application for tracking personal finances with MongoDB integration.

## Features

- Add/Edit/Delete transactions
- Transaction list view with sorting
- Form validation with Zod
- Modern UI with shadcn/ui
- Toast notifications for user feedback
- Responsive design with error states

## Prerequisites

- Node.js 18 or later
- MongoDB instance running locally or connection string to MongoDB Atlas
- npm or pnpm package manager

## Getting Started

1. Clone the repository:

```bash
git clone <repository-url>
cd personal-finance-tracker
```

2. Install dependencies:

```bash
npm install
# or
pnpm install
```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:

```env
MONGODB_URI=your_mongodb_connection_string
```

4. Run the development server:

```bash
npm run dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Testing the Application

1. Add a new transaction:

   - Click the "Add Transaction" button
   - Fill in the amount, description, and date
   - Click "Add Transaction" to save
   - You should see a success toast notification

2. View transactions:

   - All transactions are listed on the main page
   - Transactions are sorted by date (newest first)
   - Each transaction shows amount, description, and date

3. Edit a transaction:

   - Click the pencil icon on any transaction
   - Modify the details in the form
   - Click "Update Transaction" to save changes
   - You should see a success toast notification

4. Delete a transaction:
   - Click the trash icon on any transaction
   - The transaction will be removed immediately
   - You should see a success toast notification

## Tech Stack

- **Framework:** Next.js 14 with App Router
- **Database:** MongoDB with Mongoose
- **UI Components:** shadcn/ui
- **Form Handling:** react-hook-form
- **Validation:** Zod
- **Styling:** Tailwind CSS
- **Icons:** Lucide Icons

## Project Structure

```
src/
├── app/                  # App router pages and API routes
├── components/          # React components
│   ├── forms/          # Form components
│   └── ui/             # UI components from shadcn/ui
├── lib/                # Utility functions and configurations
├── models/            # MongoDB schemas
└── types/             # TypeScript type definitions
```

## Error Handling

The application includes comprehensive error handling:

- Form validation errors with clear messages
- API error responses with appropriate status codes
- Toast notifications for user feedback
- Loading states during API calls
- Error states for failed data fetches

## Future Enhancements

- Monthly expenses bar chart using Recharts
- Category-based filtering
- Date range filtering
- Export transactions to CSV
- Dark mode support
- Mobile-responsive optimizations
