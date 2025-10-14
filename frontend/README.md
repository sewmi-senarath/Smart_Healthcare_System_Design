# Healthcare System - Frontend

React + TypeScript + Tailwind CSS frontend for the Smart Healthcare System.

## 🚀 Quick Start

### Prerequisites
- Node.js >= 16.x
- npm or yarn

### Installation

1. **Install dependencies**
```bash
npm install
```

2. **Setup environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your backend API URL:
```env
VITE_API_URL=http://localhost:5000/api/v1
```

3. **Start development server**
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The build output will be in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── common/       # Reusable components
│   │   ├── features/     # Feature-specific components
│   │   ├── layout/       # Layout components
│   │   └── ui/           # UI library (shadcn)
│   ├── contexts/         # React contexts
│   ├── lib/
│   │   └── api/          # API service modules
│   ├── pages/            # Page components
│   ├── styles/           # Global styles
│   ├── App.tsx           # Main App component
│   └── main.tsx          # Entry point
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 🛠️ Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **Axios** - HTTP client
- **shadcn/ui** - UI components
- **Lucide React** - Icons

## 🔐 Environment Variables

- `VITE_API_URL` - Backend API base URL
- `VITE_APP_NAME` - Application name
- `VITE_APP_VERSION` - Application version

## 📚 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎨 Styling

This project uses:
- **Tailwind CSS v4.0** for utility-first styling
- **Custom design tokens** in `styles/globals.css`
- **shadcn/ui components** for pre-built UI elements

## 🔗 API Integration

API services are located in `src/lib/api/`:
- `auth.ts` - Authentication
- `patients.ts` - Patient management
- `appointments.ts` - Appointments
- `visits.ts` - Visit workflows
- `prescriptions.ts` - Prescriptions

Example usage:
```typescript
import { patientsAPI } from './lib/api';

const patients = await patientsAPI.getAll();
```

## 🧪 Testing

```bash
npm test
```

## 📦 Deployment

### Vercel
```bash
npm run build
# Deploy dist folder to Vercel
```

### Netlify
```bash
npm run build
# Deploy dist folder to Netlify
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
CMD ["npm", "run", "preview"]
```

## 🔒 Security

- JWT tokens stored in localStorage
- Automatic token refresh
- Protected routes
- Role-based access control

## 📖 Documentation

See the root documentation files:
- [Quick Start Guide](../QUICK_START.md)
- [Integration Guide](../INTEGRATION_GUIDE.md)
- [Developer Guide](../DEVELOPER_GUIDE.md)
- [Component Specs](../COMPONENT_SPECS.md)

## 🐛 Troubleshooting

### CORS Errors
Make sure backend CORS is configured for `http://localhost:5173`

### API Connection Failed
Check that:
- Backend is running on port 5000
- `VITE_API_URL` in `.env` is correct
- No firewall blocking the connection

### Build Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📞 Support

For issues, check:
1. Browser console for errors
2. Network tab for failed API calls
3. Backend logs for server errors

## 📄 License

MIT License
