import logo from './logo.svg';
import './App.css';
import './index.css';
import { useState } from 'react';
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
