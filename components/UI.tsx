
import React from 'react';
import { TreeMorphState } from '../types';

interface UIProps {
  state: TreeMorphState;
  visible: boolean;
  onSetState: (state: TreeMorphState) => void;
}

const UI: React.FC<UIProps> = ({ state, visible, onSetState }) => {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none flex flex-col justify-between p-8 z-40">
      {/* Header */}
      <div className="text-center mt-12 animate-fade-in">
        <h1 className="text-6xl md:text-8xl font-serif tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-rose-300 to-yellow-200 drop-shadow-lg italic">
          Merry Christmas
        </h1>
        <p className="text-pink-300/60 mt-4 tracking-widest uppercase text-xs">A High-Fidelity 3D Vision Experience</p>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center gap-6 mb-12">
        <div className="flex gap-4 pointer-events-auto">
          {(Object.keys(TreeMorphState) as Array<keyof typeof TreeMorphState>).map((s) => (
            <button
              key={s}
              onClick={() => onSetState(TreeMorphState[s])}
              className={`px-6 py-2 rounded-full border transition-all duration-300 backdrop-blur-md ${
                state === TreeMorphState[s]
                  ? 'bg-pink-500/20 border-pink-400 text-pink-200 shadow-[0_0_15px_rgba(236,72,153,0.3)]'
                  : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="text-center text-white/40 text-[10px] tracking-widest uppercase space-y-2">
          <div className="flex gap-8 justify-center">
            <div className="flex flex-col items-center">
              <span className="text-pink-400 font-bold mb-1">✊ Fist</span>
              <span>Tree Mode</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-pink-400 font-bold mb-1">✋ Open</span>
              <span>Scatter Mode</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-pink-400 font-bold mb-1">🤌 Pinch</span>
              <span>Love Mode</span>
            </div>
          </div>
          <p className="mt-8">Press "H" to Hide Controls.</p>
        </div>
      </div>
    </div>
  );
};

export default UI;
