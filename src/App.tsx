import { Header } from './components/Header';
import { MapSection } from './components/MapSection';
import { Insights } from './components/Insights';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <MapSection />
        <Insights />
      </main>

      <footer className="footer">
        <div className="footer-content">
          <p className="footer-copyright">© 2025 Wizeline. All rights reserved.</p>
          <p className="footer-tagline">Interactive Data Visualization Platform</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
