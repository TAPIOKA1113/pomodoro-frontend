import { BrowserRouter as Router } from 'react-router-dom'
import { Box, Button } from "@yamada-ui/react"
import Sidebar from './components/Sidebar'
import './App.css'

function App() {
  return (
    <Router>
      <Box>
        <Sidebar />
        <Button>あいうおえ</Button>
      </Box>
    </Router>
  )
}

export default App