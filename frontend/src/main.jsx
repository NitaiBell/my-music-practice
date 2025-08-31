import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx'; // ✅ Import context
import PasswordGateServer from './PasswordGateServer.jsx'; // ✅ Import password gate

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider> {/* ✅ Context stays as wrapper */}
      <PasswordGateServer> {/* ✅ Add password protection wrapper */}
        <App />
      </PasswordGateServer>
    </AuthProvider>
  </StrictMode>
);
