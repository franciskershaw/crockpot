import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SharedLayout from './layout/SharedLayout'
import LandingPage from './pages/LandingPage/LandingPage'
import LoginPage from './pages/LoginPage/LoginPage'
import RegisterPage from './pages/RegisterPage/RegisterPage'

function App() {

  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<SharedLayout />}>
          <Route index element={<LandingPage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </div>
    
  )
}

export default App
