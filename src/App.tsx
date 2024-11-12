import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from 'react-router-dom';
import { AuthProvider } from './context/auth';
import LoginPage from './routes/login';
import SignUpPage from './routes/signup';
import CalendarPage from './routes/calendar';

function App() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route path='/login' element={<LoginPage />} />
                    <Route path='/signup' element={<SignUpPage />} />
                    <Route path='/calendar' element={<CalendarPage />} />
                    <Route
                        path='/'
                        element={<Navigate to='/login' replace />}
                    />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;
