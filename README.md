# Crypto Tracker

A real-time cryptocurrency tracking application built with React, TypeScript, and Vite. Monitor cryptocurrency prices with live updates, set price alerts, and manage your favorite coins.

## Features

- **Real-time Price Updates**: Live cryptocurrency prices via WebSocket connections
- **Price Alerts**: Set custom price alerts and receive notifications when triggered
- **Favorites Management**: Track your favorite cryptocurrencies
- **Detailed Charts**: View historical price data with interactive charts
- **Responsive Design**: Mobile-friendly interface with bottom navigation

## Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **React Router** - Client-side routing
- **Recharts** - Data visualization
- **Socket.io Client** - Real-time WebSocket communication
- **Axios** - HTTP client

### Backend Integration
- REST API for data fetching
- WebSocket (Socket.io) for real-time price updates
- Backend expected at `http://localhost:8000`, but the repo is not public 

## Architecture Highlights

### Service Layer Pattern
- **ApiService**: Centralized HTTP client with interceptors
- **SocketService**: Singleton WebSocket manager with event subscriptions

### Custom Hooks Pattern
- `useSocketConnection` - Connection state management
- `usePriceUpdates` - Real-time price update subscriptions
- `useCryptos` - Crypto list with live updates
- `useFavorites` - Favorites management
- `useAlerts` - Alert management

### Data Flow
1. Initial data fetched via REST API
2. WebSocket connection established automatically
3. Real-time updates merged into existing state
4. Type-safe integration throughout

## Getting Started

### Prerequisites
- Node.js 16+ and npm
- Backend API server running on port 8000

### Environment Setup

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_SOCKET_URL=http://localhost:8000
```

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm run dev
```

The app will be available at `http://localhost:5173`

### Development Commands

```bash
# Start dev server with hot reload
pnpm run dev

# Build for production
pnpm run build

# Preview production build
pnpm run preview

# Run linter
pnpm run lint
```

## Project Structure

```
src/
├── components/       # Reusable UI components
├── pages/           # Route page components
├── hooks/           # Custom React hooks
├── services/        # API and WebSocket services
├── types/           # TypeScript type definitions
└── App.tsx          # Root component with routing
```

## Key Routes

- `/` - Dashboard with crypto list
- `/crypto/:id` - Individual crypto detail page
- `/alerts` - Manage price alerts
- `/favorites` - View favorite cryptocurrencies

## Testing

E2E tests are available using Playwright:

```bash
# Run E2E tests (example in e2e/test.py)
python e2e/test.py
```

## Contributing

This project uses ESLint for code quality. Run `pnpm run lint` before committing changes.

## License

MIT
