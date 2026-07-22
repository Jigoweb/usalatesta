import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TimerProvider } from './contexts/TimerContext';
import Layout from './components/Layout';
import AnalyticsPageViews from './components/AnalyticsPageViews';
import Splash from './pages/Splash';
import Home from './pages/Home';
import Quiz from './pages/Quiz';
import QuizResult from './pages/QuizResult';
import Timer from './pages/Timer';
import Decalogo from './pages/Decalogo';
import Support from './pages/Support';
import HelpCenters from './pages/HelpCenters';
import Articles from './pages/Articles';
import Chatbot from './pages/Chatbot';
import ArticleDetail from './pages/ArticleDetail';
import Games from './pages/Games';
import BrainExperience from './pages/BrainExperience';
import LabyrinthExperience from './pages/LabyrinthExperience';
import Privacy from './pages/Privacy';

function App() {
  return (
    <TimerProvider>
      <BrowserRouter>
        <AnalyticsPageViews />
        <Routes>
          <Route path="/" element={<Splash />} />
          
          <Route element={<Layout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/timer" element={<Timer />} />
            <Route path="/chatbot" element={<Chatbot />} />
            <Route path="/games" element={<Games />} />
          </Route>

          {/* Routes without BottomNav */}
          <Route path="/games/cervello" element={<BrainExperience />} />
          <Route path="/games/labyrinth" element={<LabyrinthExperience />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/quiz/result" element={<QuizResult />} />
          <Route path="/decalogo" element={<Decalogo />} />
          <Route path="/support" element={<Support />} />
          <Route path="/support/centers" element={<HelpCenters />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/articles/:id" element={<ArticleDetail />} />
        </Routes>
      </BrowserRouter>
    </TimerProvider>
  );
}

export default App;
