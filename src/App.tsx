import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { Box } from "@yamada-ui/react"
import Sidebar from './components/Sidebar'
import './App.css'
import Task from './pages/Task'
import Reward from './pages/Reward'
import Report from './pages/Report'


function App() {
  return (
    <Router>
      <Box>
        <Sidebar />
      </Box>
      <Routes>
        <Route path="/task" element={<Task />} />
        <Route path="/reward" element={<Reward />} />
        <Route path="/report" element={<Report />} />
      </Routes>
    </Router>
  )
}

export default App