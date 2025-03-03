# Flashcard Study App

A modern, interactive flashcard application built with Next.js and TypeScript for effective studying and memorization.

## Features

- Create and Manage Card Sets: Organize your study materials into separate card sets
- Interactive Flashcards: Flip cards to reveal answers with smooth animations
- Dual Review Modes:
  - Standard review (front → back)
  - Reverse review (back → front) for enhanced learning
- Randomized Study: Option to shuffle cards for more effective memorization
- Card Management: Edit and delete cards directly from the interface
- Responsive Design: Works seamlessly on desktop and mobile devices

## Technology Stack

- Frontend: Next.js, React, TypeScript
- Styling: Tailwind CSS
- Database: SQL Server (accessed via server actions)

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- SQL Server instance

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/flashcard-study-app.git
cd flashcard-study-app
```

2. Install dependencies

```bash
npm install
```

3. Configure your database connection in the environment variables after running and following steps in dbSetup.sql under /lib/db/

4. Run the development server

```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:3000`

## Usage

### Creating a Card Set

1. Navigate to the home page
2. Click "Create New Set"
3. Enter a name for your card set
4. Submit the form

### Adding Cards

1. Open a card set
2. Click "Edit Set"
3. Fill in the front and back content for your card
4. Click "Add Card"

### Studying Cards

1. Open a card set
2. Choose "Review Cards" for standard review or "Reverse Review" to test yourself in the opposite direction
3. (Optional) Check "Randomize cards" to shuffle the order
4. Click on a card to flip it and reveal the answer
5. Use the "Previous" and "Next" buttons to navigate through the cards

### Editing Cards

1. Open a card set
2. Click on any card to open the edit modal
3. Modify the content as needed
4. Click "Save Changes" to update the card
5. Click outside the modal to cancel without saving

## Project Structure

/app: Next.js app router pages
/components: React components
/core: Main application components
/Review: Card review components
/shared: Reusable UI components
/lib: Utility functions and server actions
/actions: Server actions for database operations
/db: Database connection and query utilities

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
