import { Outlet } from 'react-router-dom'
import Header from './components/Header/Header'
import { ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";
function App() {
  return (
    <div className='bg-gray-900 min-h-screen'>
      <Header/>
      <Outlet/>
      <ToastContainer theme='dark'/>
    </div>
  )
}

export default App
