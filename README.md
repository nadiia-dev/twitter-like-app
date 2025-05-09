# Twitter-Like App

This project is a **Twitter-like application** built with **React**, **Nest.js**, **Typescript** and **Firebase**. It allows users to post, like, and comment on posts, as well as manage their profiles. The app also implements authentication, allowing users to sign in using Google.

## Features

- **User Authentication**: Users can sign up and log in using their Google account via Firebase Authentication.
- **Post Creation**: Users can create posts with text, images, and like/unlike them.
- **Comments**: Users can comment on posts and reply to other users comments, making the interaction more social.
- **Profile Management**: Users can update their profile pictures and personal details.
- **Smart Search**: A powerful search functionality powered by **Algolia**, which provides fast and relevant results when searching for posts or users.
- **Infinite Scrolling**: The main feed supports **infinite scrolling**, ensuring that users can load more posts seamlessly as they scroll down without reloading the page.

## Tech Stack

- **Frontend**: React, React Context (for authentication), React Query (for data fetching), React Router, Firebase
- **Backend**: Firebase Functions, Firestore
- **Authentication**: Firebase Authentication with email and password and Google Sign-In
- **Search**: Algolia for fast and relevant search results
- **Styling**: Shadcn.ui, Tailwind CSS for fast and responsive styling

## Setup

### Prerequisites

- Node.js (v18 or higher)
- Firebase account

### Installation

1. Clone the repository:

```bash
git clone https://github.com/nadiia-dev/twitter-like-app.git
Navigate to the project folder:
```

2. Navigate to the frontend folder and install dependencies:

```bash
cd twitter-like-app/frontend
npm install
```

3. Set up Firebase:

Create a Firebase project at Firebase Console.

Add Firebase SDK configuration to the .env file.

5. Run the frontend locally:

```bash
npm run dev
```

This will run the app at http://localhost:5173.

6. Navigate to the backend folder and install dependencies:

```bash
cd twitter-like-app/backend
npm install
```

7. Run the backend locally:

```bash
npm run start:dev
```

This will run the app at http://localhost:3000.
