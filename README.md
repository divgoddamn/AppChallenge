# PathFinder - AI-Powered Social Impact Platform

PathFinder is an AI-powered social impact platform that helps homeless and housing-insecure individuals find and access essential resources in cities like Nashua or Manchester, New Hampshire.

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL database
- Google Gemini API key

### Environment Setup

1. **Get your Gemini API key**:
   - Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Create an account or sign in with your Google account
   - Click "Create API Key"
   - Copy the API key
   
   **Important**: After getting your API key, you need to enable the Gemini API in your Google Cloud project:
   - Go to the [Google Cloud Console](https://console.cloud.google.com/)
   - Select or create a project
   - Go to "APIs & Services" > "Library"
   - Search for "Gemini API" or "Google AI SDK API"
   - Enable the API for your project
   - Make sure your API key has access to the Gemini models

2. **Set up the backend**:
   ```bash
   cd backend
   cp .env .env.example  # if you want to save your original .env
   # Edit the .env file and add your Gemini API key:
   # GEMINI_API_KEY=your_actual_api_key_here
   ```

3. **Install dependencies**:
   ```bash
   # Install root dependencies
   npm install
   
   # Install mobile app dependencies
   cd mobile
   npm install
   
   # Install backend dependencies  
   cd ../backend
   npm install
   ```

### Database Setup

1. **Install PostgreSQL** (if not already installed)

2. **Create the database**:
   ```sql
   CREATE DATABASE pathfinder;
   ```

3. **Update the .env file** with your database credentials if different from default

### Running the Application

#### Backend Server:
```bash
cd backend
npm run dev
```
The backend will run on `http://localhost:8000`

#### Mobile App:
```bash
cd mobile
npx react-native run-android  # For Android
# OR
npx react-native run-ios      # For iOS
```

## 🏗️ Project Structure

```
pathfinder-app/
├── mobile/                 # React Native mobile application
│   ├── src/
│   │   ├── screens/       # UI screens
│   │   ├── components/    # Reusable components
│   │   ├── navigation/    # Navigation structure
│   │   └── constants/     # App constants
│   └── App.js             # Main application component
├── web/                   # Web application (future)
├── backend/               # Backend API server
│   ├── api/              # API routes
│   ├── models/           # Database models
│   ├── services/         # External services (AI, etc.)
│   ├── config/           # Configuration files
│   └── server.js         # Main server file
└── docs/                 # Documentation
```

## 🤖 AI Features

The app uses Google's Gemini API for:
- Conversational AI assistant
- Resource recommendations
- Job description summarization
- Resume generation

## 📱 Features

- **Resource Locator**: Map-based and list-based views for nearby shelters, food programs, health clinics, and social services
- **Job Finder**: Integration with job boards and local listings
- **AI Assistant**: Conversational interface for personalized recommendations
- **Resume Builder**: AI-powered resume generation
- **Offline-First**: Core data stored locally for use without internet

## 🛠️ API Endpoints

### Resources
- `GET /api/resources` - Get all resources with optional filtering
- `GET /api/resources/:id` - Get a specific resource
- `POST /api/resources` - Create a new resource
- `PUT /api/resources/:id` - Update a resource
- `DELETE /api/resources/:id` - Delete a resource
- `GET /api/resources/nearby/:lat/:lng` - Get resources near a location

### Jobs
- `GET /api/jobs` - Get all jobs with optional filtering
- `GET /api/jobs/:id` - Get a specific job
- `POST /api/jobs` - Create a new job
- `PUT /api/jobs/:id` - Update a job
- `DELETE /api/jobs/:id` - Delete a job
- `GET /api/jobs/nearby/:lat/:lng` - Get jobs near a location

### Chat
- `POST /api/chat` - Chat with the AI assistant

### Resume
- `POST /api/resume/generate` - Generate a resume from user input
- `GET /api/resume/template` - Get a resume template

### Health Check
- `GET /health` - Server health status

## 🔐 Environment Variables

Create a `.env` file in the `backend/` directory with the following variables:

```env
PORT=8000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=pathfinder
DB_USER=postgres
DB_PASSWORD=postgres
GEMINI_API_KEY=your_gemini_api_key_here
NODE_ENV=development
```

## 🧪 Testing

Run backend tests:
```bash
cd backend
npm test
```

Run mobile app tests:
```bash
cd mobile
npm test
```

## 🚀 Deployment

For production deployment:
1. Set `NODE_ENV=production` in your environment
2. Use a production database
3. Configure proper authentication and security
4. Set up a reverse proxy (like Nginx)
5. Use a process manager (like PM2) for the backend

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues, please file them in the Issues section of this repository.