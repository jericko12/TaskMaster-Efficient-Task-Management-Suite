# TaskMaster - Efficient Task Management Suite

TaskMaster is a modern, feature-rich task management application built with React, TypeScript, and Vite. It helps you organize your work, track progress, and improve productivity with a beautiful, responsive interface.

![TaskMaster Screenshot](public/taskmaster-screenshot.png)

## 🚀 Features

- **Task Management**: Create, edit, delete, and organize tasks with priorities and due dates
- **Multiple Views**: List, grid, and calendar views for different ways to visualize your tasks
- **Pomodoro Timer**: Built-in productivity timer to help you focus and take breaks
- **Dark/Light Themes**: Choose your preferred appearance or sync with system preference
- **Statistics & Analytics**: Track your productivity with visual task completion metrics
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Offline Support**: Local storage ensures your data is always available

## 🛠️ Technologies

- React 19
- TypeScript
- Vite
- Tailwind CSS
- DaisyUI
- React Router
- React Icons
- date-fns
- UUID
- dnd-kit (for drag and drop)

## 📋 Prerequisites

- Node.js 18+ and npm

## 🔧 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/taskmaster.git
   cd taskmaster
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser to:
   ```
   http://localhost:5173
   ```

## 🚢 Deployment

The application is configured for easy deployment on Vercel:

1. Push your code to a GitHub repository
2. Connect the repository to Vercel
3. Vercel will automatically detect the Vite configuration
4. The application will be built and deployed

## 🔑 Environment Variables

Create a `.env` file in the project root with the following variables (if needed):

```
VITE_APP_NAME=TaskMaster
VITE_STORAGE_PREFIX=taskmaster
```

## 📂 Project Structure

```
/src
  /assets        # Static assets
  /components    # Reusable UI components
  /hooks         # Custom React hooks
  /pages         # Page components
  /store         # Global state management
  /types         # TypeScript type definitions
  /utils         # Utility functions
  App.tsx        # Main application component
  main.tsx       # Application entry point
```

## 🧪 Testing

Run tests with:

```bash
npm test
```

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📫 Contact

If you have any questions or suggestions, please feel free to open an issue or pull request.

---

Happy task managing! 📅✅
