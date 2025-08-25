import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { UserProvider } from './store/UserContext.jsx';
createRoot(document.getElementById('root')).render(
  <>
   <GoogleOAuthProvider clientId="1072080904430-0236i9rhvvrkpgiaknio6umne28gt790.apps.googleusercontent.com">
    <UserProvider>
      <App />
    </UserProvider>
  </GoogleOAuthProvider>
  </>
);