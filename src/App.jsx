import { EditorProvider } from './context/EditorContext';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import CanvasArea from './components/Layout/CanvasArea';
import Panel from './components/Layout/Panel';
import StatusBar from './components/Layout/StatusBar';
import MobileNav from './components/Layout/MobileNav';
import './index.css';

function App() {
  return (
    <EditorProvider>
      {/* Animated Background */}
      <div className="animated-bg" />

      <div className="app-layout">
        <Header />
        <div className="app-main">
          <Sidebar />
          <CanvasArea />
          <Panel />
        </div>
        <StatusBar />
        <MobileNav />
      </div>
    </EditorProvider>
  );
}

export default App;
