import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import { Box } from "@yamada-ui/react"
import Sidebar from './components/Sidebar'
import './App.css'
import Task from './pages/Task'
import Reward from './pages/Reward'
import Report from './pages/Report'


function App() {
  return (
    <Router basename="/pomodoro-frontend">
      <Box>
        <Sidebar />
      </Box>
      <Routes>
        <Route path="/" element={<Navigate to="/task" replace />} />
        <Route path="/task" element={<Task />} />
        <Route path="/reward" element={<Reward />} />
        <Route path="/report" element={<Report />} />
      </Routes>
    </Router>
  )
}

export default App