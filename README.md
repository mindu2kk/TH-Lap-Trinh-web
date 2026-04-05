# Photo Sharing App

ReactJS + Material-UI photo sharing web application with Master-Detail pattern.

## Features

- **Problem 1**: Complete photo sharing app with UserList, UserDetail, UserPhotos components
- **Problem 2**: Fetch data from web server (with local fallback for CodeSandbox)
- **Extra Credit**: Advanced Features with photo stepper (deep-linkable URLs)
- **Style**: Material-UI components, clean MVC architecture

## Running Locally

```bash
# Terminal 1 - API Server
npm run server

# Terminal 2 - React App
npm start
```

Open http://localhost:3000

## Running on CodeSandbox

The app automatically falls back to local model data when the server is unavailable. Just click "Start" and it will work with the built-in fake data.

## Architecture

- `src/App.js` - Main app with routing and state management
- `src/components/TopBar/` - Header with context and advanced features toggle
- `src/components/UserList/` - Sidebar navigation
- `src/components/UserDetail/` - User information display
- `src/components/UserPhotos/` - Photo gallery with comments (+ stepper mode)
- `src/lib/fetchModelData.js` - Data fetching with server/local fallback
- `server.js` - Express API server (for local development)

## Advanced Features

Enable "Advanced Features" checkbox to use the photo stepper:
- Navigate through photos one at a time
- Deep-linkable URLs: `/photos/:userId/stepper/:photoIndex`
- Browser back/forward buttons work correctly