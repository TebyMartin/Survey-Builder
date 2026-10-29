# Agent Instructions

## Project Structure
- `backend/`: Node.js/TypeScript backend using Express and Prisma.
- `fronted/`: Vite/React/TypeScript frontend. **Note: The directory is named `fronted`, not `frontend`.**

## Development Workflow

### Backend
- **Development**: `cd backend && npm run dev`
- **Database Seeding**: `cd backend && npm run seed`
- **Build**: `cd backend && npm run build`
- **ORM**: Uses Prisma. Schema is located in `backend/prisma/schema.prisma`.

### Frontend
- **Development**: `cd fronted && npm run dev`
- **Build**: `cd fronted && npm run build`
- **Linting**: `cd fronted && npm run lint`

## Key Technologies & Patterns
- **Data Validation**: Zod is used in both backend and frontend.
- **Data Fetching**: React Query (`@tanstack/react-query`) is used on the frontend.
- **UI Components**: Material UI (`@mui/material`) is the primary component library.
- **Complex Questions**: The survey system supports advanced question types like `MATRIX` and `COMPOSITE` (see `backend/prisma/schema.prisma` for details).
- **Maps**: Leaflet is used for location-based features.
