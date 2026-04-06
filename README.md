# Photo Sharing App

ReactJS + Material-UI photo sharing web application with Master-Detail pattern.

## Features

- **Problem 1**: Complete photo sharing app with UserList, UserDetail, UserPhotos components
- **Problem 2**: Fetch data from web server (with local fallback for CodeSandbox)
- **Extra Credit**: Advanced Features with photo stepper (deep-linkable URLs)
- **Style**: Material-UI components, clean MVC architecture

## Running on CodeSandbox

1. Open your CodeSandbox: https://codesandbox.io/p/github/mindu2kk/TH-Lap-Trinh-web/vite-version
2. CodeSandbox will automatically:
   - Install dependencies
   - Start the Vite dev server on port 3000
   - Start the Express API server on port 3001
3. Click the preview URL to view the app

The app uses Vite for fast development and hot module replacement.

## Running Locally

```bash
# Install dependencies
npm install

# Terminal 1 - API Server (port 3001)
npm run server

# Terminal 2 - Vite Dev Server (port 3000)
npm run dev
```

Open http://localhost:3000

## Architecture

- `src/App.js` - Main app with routing and state management
- `src/components/TopBar/` - Header with context and advanced features toggle
- `src/components/UserList/` - Sidebar navigation
- `src/components/UserDetail/` - User information display
- `src/components/UserPhotos/` - Photo gallery with comments (+ stepper mode)
- `src/lib/fetchModelData.js` - Data fetching with server/local fallback
- `server.js` - Express API server on port 3001

## Advanced Features

Enable "Advanced Features" checkbox to use the photo stepper:
- Navigate through photos one at a time
- Deep-linkable URLs: `/photos/:userId/stepper/:photoIndex`
- Browser back/forward buttons work correctly

## Tech Stack

- React 18
- React Router v6
- Material-UI v5
- Vite (build tool)
- Express (API server)
