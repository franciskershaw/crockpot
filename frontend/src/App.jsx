import Button from './components/global/buttons/Button'
import Icon from './components/global/icons/Icon'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SharedLayout from './layout/SharedLayout'
import LandingPage from './pages/LandingPage/LandingPage'
import LoginPage from './pages/LoginPage/LoginPage'
import RegisterPage from './pages/RegisterPage/RegisterPage'

function App() {

  return (
    <div>
      Crockpot

      <Button />
      <Icon />

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
