import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SharedLayout from './layout/SharedLayout';
import PrivateRoute from './components/privateRoutes/PrivateRoute';
import AdminRoute from './components/privateRoutes/AdminRoute';
import AddRecipePage from './pages/AddRecipePage/AddRecipePage';
import BrowsePage from './pages/BrowsePage/BrowsePage';
import CookbookPage from './pages/CookbookPage/CookbookPage';
import LandingPage from './pages/LandingPage/LandingPage';
import MenuPage from './pages/MenuPage/MenuPage';
import ViewRecipePage from './pages/ViewRecipePage/ViewRecipePage';
import SandBoxPage from './pages/SandBoxPage/SandBoxPage';
import ErrorPage from './pages/ErrorPage/ErrorPage';
import AdminPage from './pages/AdminPage/AdminPage';
import AddItemPage from './pages/AddItemPage/AddItemPage';
import AuthPage from './pages/AuthPage/AuthPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SharedLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="/login" element={<AuthPage page="login" />} />
          <Route path="/register" element={<AuthPage page="register" />} />
          <Route path="/browse" element={<BrowsePage />} />
          <Route path="/cookbook" element={<PrivateRoute />}>
            <Route path="/cookbook" element={<CookbookPage />} />
          </Route>
          <Route path="/viewrecipe/:id" element={<ViewRecipePage />} />
          <Route path="/admin" element={<AdminRoute />}>
            <Route path="/admin" element={<AdminPage />} />
          </Route>
          <Route path="/addrecipe" element={<AdminRoute />}>
            <Route path="/addrecipe" element={<AddRecipePage />} />
          </Route>
          <Route path="/additem" element={<AdminRoute />}>
            <Route path="/additem" element={<AddItemPage />} />
          </Route>

          <Route path="/menu" element={<PrivateRoute />}>
            <Route path="/menu" element={<MenuPage />} />
          </Route>
          <Route path="/sandbox" element={<PrivateRoute />}>
            <Route path="/sandbox" element={<SandBoxPage />} />
          </Route>
          <Route path="*" element={<ErrorPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
