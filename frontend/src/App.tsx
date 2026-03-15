import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import ResultsPage from './pages/ResultsPage';

function App() {
  return (
    <BrowserRouter>
      <div className="font-display text-slate-900 min-h-screen flex flex-col">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/results/:id?" element={<ResultsPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
