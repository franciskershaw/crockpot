import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SharedLayout from './layout/SharedLayout';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import AddRecipePage from './pages/AddRecipePage/AddRecipePage';
import BrowsePage from './pages/BrowsePage/BrowsePage';
import CookbookPage from './pages/CookbookPage/CookbookPage';
import LandingPage from './pages/LandingPage/LandingPage';
import LoginPage from './pages/LoginPage/LoginPage';
import MenuPage from './pages/MenuPage/MenuPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import ViewRecipePage from './pages/ViewRecipePage/ViewRecipePage';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SharedLayout />}>
            <Route index element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/browse" element={<BrowsePage />} />
            <Route path="/cookbook" element={<PrivateRoute />}>
              <Route path="/cookbook" element={<CookbookPage />} />
            </Route>
            <Route path="/viewrecipe/:id" element={<ViewRecipePage />} />
            <Route path="/addrecipe" element={<PrivateRoute />}>
              <Route path="/addrecipe" element={<AddRecipePage />} />
            </Route>
            <Route path="/menu" element={<PrivateRoute />}>
              <Route path="/menu" element={<MenuPage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
