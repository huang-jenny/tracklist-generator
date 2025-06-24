import './App.css';
import './index.css';
import TracklistGenerator from './TracklistGenerator';
import { Analytics } from '@vercel/analytics/react';

const App = () => {
  return (
    <>
      <TracklistGenerator />
      <Analytics />
    </>
  );
};

export default App;
