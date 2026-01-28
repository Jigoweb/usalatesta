import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
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
import Games from './pages/Games';
import ArticleDetail from './pages/ArticleDetail';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Splash />} />
        
        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/quiz/result" element={<QuizResult />} />
          <Route path="/timer" element={<Timer />} />
          <Route path="/decalogo" element={<Decalogo />} />
          <Route path="/support" element={<Support />} />
          <Route path="/support/centers" element={<HelpCenters />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/articles/:id" element={<ArticleDetail />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/games" element={<Games />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
