# React Todo App with Spring Boot Backend

A modern, responsive Todo application built with React.js and Vite, connected to a Spring Boot RESTful API backend.

![Todo App Screenshot](https://github.com/username/todo-app/raw/main/screenshots/todo-app.png)

## Features

- ✅ Create, read, and complete tasks
- 📱 Responsive design that works on all devices
- 🔄 Real-time synchronization with backend
- 🎯 Focused interface showing only the 5 most recent tasks
- ⚡ Built with modern React (hooks, context) and Vite for fast development
- 💼 Proper error handling and loading states
- 🌐 Connected to a Spring Boot RESTful API

## Tech Stack

### Frontend
- **React** - UI library
- **Context API** - State management
- **Axios** - API requests
- **Tailwind CSS** - Styling
- **Vite** - Build tool


## Installation

### Prerequisites
- Node.js (>= 14.x)
- npm or yarn

### Frontend Setup

1. Clone the repository
```bash
git clone https://github.com/username/todo-app.git
cd todo-app/frontend
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

The application will be available at http://localhost:5173


### Adding a Task
1. Enter a title in the "Title" field
2. Add a description (optional)
3. Click "Save"

### Completing a Task
1. Click the "Done" button on a task card

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── AddTaskForm.jsx   # Form for adding new tasks
│   │   └── TaskList.jsx      # List of tasks with completion functionality
│   ├── context/
│   │   └── TaskContext.jsx   # Context for state management
│   ├── services/
│   │   └── TaskService.js    # API integration service
│   └── App.jsx               # Main application component
├── package.json
└── vite.config.js
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/tasks | Get all tasks |
| GET | /api/tasks?completed=true/false | Get tasks by completion status |
| GET | /api/tasks/{id} | Get a specific task |
| POST | /api/tasks | Create a new task |
| PUT | /api/tasks/{id} | Update a task |
| DELETE | /api/tasks/{id} | Delete a task |

## Task DTO Structure

```json
{
  "id": 1,
  "title": "Task title",
  "description": "Task description",
  "completed": false
}
```

## Configuration

### API URL

The API URL is configured in `src/services/TaskService.js`. If your backend runs on a different host or port, update the `API_URL` constant:

```javascript
const API_URL = 'http://your-backend-url/api/tasks';
```


## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request



