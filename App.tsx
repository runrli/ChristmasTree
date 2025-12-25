
import React, { useState, useEffect, useCallback } from 'react';
import Experience from './components/Experience';
import UI from './components/UI';
import HandTracker from './components/HandTracker';
import { TreeMorphState, HandData } from './types';

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState<TreeMorphState>(TreeMorphState.TREE);
  const [uiVisible, setUiVisible] = useState(true);
  const [handData, setHandData] = useState<HandData>({
    x: 0,
    y: 0,
    gesture: 'none',
    detected: false
  });

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'h') {
        setUiVisible(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    
    // Simulate initial loading
    const timer = setTimeout(() => setLoading(false), 2000);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timer);
    };
  }, []);

  // Update state based on hand gesture
  const handleHandUpdate = useCallback((data: HandData) => {
    setHandData(data);
    
    if (data.detected) {
      if (data.gesture === 'pinch') setState(TreeMorphState.LOVE);
      else if (data.gesture === 'open') setState(TreeMorphState.SCATTER);
      else if (data.gesture === 'fist') setState(TreeMorphState.TREE);
    }
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-[100]">
        <div className="w-16 h-16 border-2 border-pink-500/20 border-t-pink-500 rounded-full animate-spin mb-4" />
        <p className="text-pink-400 tracking-widest uppercase text-xs animate-pulse">Loading Luxury Experience</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      <Experience state={state} handData={handData} />
      
      <UI 
        state={state} 
        visible={uiVisible} 
        onSetState={setState} 
      />
      
      <HandTracker onUpdate={handleHandUpdate} />

      {/* Aesthetic Overlays */}
      <div className="fixed inset-0 pointer-events-none border-[1px] border-white/5 m-4 rounded-3xl" />
      <div className="fixed top-0 left-0 w-full h-32 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
    </div>
  );
};

export default App;
