# CodeOverflow - StackOverflow Clone

A simple question and answer platform built with Next.js, similar to StackOverflow.

## What is this project?

This is a web application where users can:

- Ask questions about programming and technology
- Answer questions from other users
- Vote on questions and answers
- Browse questions by tags
- View user profiles
- Search for specific questions

## How to run this project

1. Make sure you have Node.js installed (version 18 or higher)
2. Copy the example environment file:
   ```bash
   cp .env.sample .env.local
   ```
3. Fill in your environment variables in `.env.local` (you'll need a MongoDB connection string and Clerk API keys)
4. Install the dependencies:
   ```bash
   npm install
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```
6. Open your browser to http://localhost:3000

## Key Features

- **User Authentication**: Users can sign up and log in using email/password or social providers (powered by Clerk)
- **Question Management**: Users can ask, edit, and delete their own questions
- **Answering System**: Users can provide answers to questions and mark them as accepted
- **Voting System**: Upvote and downvote questions and answers
- **Tagging System**: Questions can be tagged with topics for easy categorization
- **Search Functionality**: Search questions by title or content
- **User Profiles**: View user information and their activity
- **Responsive Design**: Works on mobile phones, tablets, and desktops

## Important Files and Folders

### Pages (app/ directory)

- `app/(root)/(home)/page.tsx` - Main homepage showing questions
- `app/(root)/ask-question/page.tsx` - Page to ask new questions
- `app/(root)/question/[id]/page.tsx` - Page to view a specific question and its answers
- `app/(root)/profile/[id]/page.tsx` - Page to view user profiles
- `app/(root)/tags/[id]/page.tsx` - Page to view questions by tag
- `app/(auth)/sign-in/[[...sign-in]]/page.tsx` - Sign in page
- `app/(auth)/sign-up/[[...sign-up]]/page.tsx` - Sign up page

### Components

- `components/cards/QuestionCard.tsx` - Displays individual questions in lists
- `components/shared/Navbar.tsx` - Navigation bar at the top
- `components/shared/LeftSidebar.tsx` - Left sidebar navigation
- `components/shared/RightSidebar.tsx` - Right sidebar with additional info
- `components/home/HomeFilters.tsx` - Filter options for questions
- `components/shared/search/LocalSearch.tsx` - Search input component

### Logic and Data

- `lib/actions/` - Contains functions that interact with the database:
  - `question.action.ts` - Functions for getting, creating, updating questions
  - `answer.action.ts` - Functions for handling answers
  - `user.action.ts` - Functions for user-related operations
  - `tag.actions.ts` - Functions for handling tags
  - `general.action.ts` - General utility functions
  - `interaction.action.ts` - Functions for voting, bookmarking, etc.

### Configuration

- `next.config.ts` - Next.js configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `middleware.ts` - Handles authentication redirects
- `constants/filters.ts` - Defines filter options for questions

## Technologies Used

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Clerk (handles user sign up, login, sessions)
- **Database**: MongoDB with Mongoose ODM
- **Forms**: React Hook Form with Zod validation
- **UI Components**: Radix UI primitives (accessible UI components)
- **Rich Text**: TinyMCE editor for question/answer content
- **Syntax Highlighting**: PrismJS for code highlighting
- **Utilities**:
  - Class Variance Authority for CSS variants
  - clsx for conditional class names
  - query-string for parsing URL parameters
  - Lucide icons for beautiful icons

## How It Works (Simple Explanation)

1. When a user visits the site, they see a list of questions on the homepage
2. Clicking on a question shows the full question and all its answers
3. Users can click "Ask a Question" to create a new question (requires login)
4. When asking a question, they fill in a title, write the question body, and add tags
5. Other users can answer the question, vote on questions/answers, and leave comments
6. The question owner can mark one answer as "accepted" if it solves their problem
7. Users earn reputation points based on upvotes their questions and answers receive

## Environment Variables Needed

Create a `.env.local` file with these variables:

- `MONGODB_URI` - Your MongoDB connection string
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Your Clerk publishable key
- `CLERK_SECRET_KEY` - Your Clerk secret key

## Deploying to Production

This project can be easily deployed to Vercel (since it's a Next.js app):

1. Push your code to a GitHub repository
2. Import the project in Vercel
3. Add the environment variables in Vercel settings
4. Vercel will automatically build and deploy your app

## Learning Resources

If you're new to any of these technologies:

- [Next.js Tutorial](https://nextjs.org/learn)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [MongoDB University](https://university.mongodb.com/)
- [Clerk Documentation](https://clerk.com/docs)

---

Built for fun and knowledge as a learning project to understand how full-stack web applications work.
