import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PassportLogin from "./components/Frontpage";
import ErrorPage from './components/utilites/ErrorPage';
import Login from './components/User_Login';
import PassportDetailsForm from './components/Redirect';
import Sign_up from './components/Sign_up';
import User from './components/User';
import User_Details from './components/Details';
import { SubContractProvider } from './components/utilites/SubContractContext';
import Signup_border from './components/Signup_border';
import Border_Login from './components/Border_Login';
import Signup_visa from './components/Signup_visa';
import Visa_Login from './components/Visa_Login';
import Visa_status from './components/Visa_status';
import CheckStatus from './components/CheckStatus';

function App() {
  return (
    <Router>
      <SubContractProvider>
        <div>
          <Routes>
            <Route path="/" element={<PassportLogin />} errorElement={<ErrorPage />} />

            <Route path="/user_login" element={<Login />} errorElement={<ErrorPage />} />
            <Route path="/sign_up" element={<Sign_up />} errorElement={<ErrorPage />} />
            <Route path="/details" element={<User_Details />} errorElement={<ErrorPage />} />
            <Route path="/user" element={<User />} errorElement={<ErrorPage />} />
            <Route path="/redirect" element={<PassportDetailsForm />} errorElement={<ErrorPage />} />
            <Route path="/CheckStatus" element={<CheckStatus />} errorElement={<ErrorPage />} />

            <Route path="/signup_visa" element={<Signup_visa />} errorElement={<ErrorPage />} />
            <Route path="/visa_login" element={<Visa_Login />} errorElement={<ErrorPage />} />
            <Route path="/visa" element={<Visa_status />} errorElement={<ErrorPage />} />

            <Route path="/border_login" element={<Border_Login />} errorElement={<ErrorPage />} />
            <Route path="/signup_border" element={<Signup_border />} errorElement={<ErrorPage />} />

          </Routes>
        </div>
      </SubContractProvider>
    </Router>
  );
}

export default App;
