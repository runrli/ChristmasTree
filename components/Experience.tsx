import React, { useRef } from 'react';
// Fix: Added missing THREE import to resolve namespace and name errors
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera, ContactShadows } from '@react-three/drei';
import { Bloom, EffectComposer, Noise, Vignette } from '@react-three/postprocessing';
import { TreeMorphState, HandData } from '../types';
import { CAMERA_CONFIG, BLOOM_CONFIG } from '../constants';
import Particles from './Particles';
import Ornaments from './Ornaments';
import Bunny from './Bunny';

interface ExperienceProps {
  state: TreeMorphState;
  handData: HandData;
}

const SceneController: React.FC<{ handData: HandData }> = ({ handData }) => {
  // Fix: Reference THREE namespace for Group type
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Rotation based on hand position
      const targetRotationX = handData.detected ? handData.y * 0.2 : 0;
      const targetRotationY = handData.detected ? handData.x * 0.3 : state.clock.elapsedTime * 0.1;
      
      // Fix: Use THREE namespace for MathUtils.lerp
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotationX, delta * 2);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotationY, delta * 2);
    }
  });

  return <group ref={groupRef} />;
};

const Experience: React.FC<ExperienceProps> = ({ state, handData }) => {
  // Fix: Reference THREE namespace for Group type
  const containerRef = useRef<THREE.Group>(null);

  return (
    <Canvas shadows gl={{ antialias: false }}>
      <PerspectiveCamera makeDefault position={CAMERA_CONFIG.position} fov={CAMERA_CONFIG.fov} />
      <color attach="background" args={['#050505']} />
      
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 20, 10]} angle={0.15} penumbra={1} intensity={2000} color="#ffddaa" castShadow />
      <pointLight position={[-10, -10, -10]} intensity={500} color="#ffbbaa" />

      <Environment preset="lobby" />

      <group ref={containerRef}>
        <SceneController handData={handData} />
        
        {/* Main Tree Group that rotates with camera/hand */}
        <group rotation={[0, 0, 0]}>
          <Particles state={state} />
          <Ornaments state={state} />
        </group>

        {/* Bunny is a static background/side element */}
        <Bunny />
      </group>

      <ContactShadows 
        position={[0, -6, 0]} 
        opacity={0.4} 
        scale={20} 
        blur={2.4} 
        far={10} 
      />

      <EffectComposer disableNormalPass>
        <Bloom 
          luminanceThreshold={BLOOM_CONFIG.threshold} 
          intensity={BLOOM_CONFIG.strength} 
          radius={BLOOM_CONFIG.radius} 
          mipmapBlur 
        />
        <Noise opacity={0.02} />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
      </EffectComposer>

      <OrbitControls 
        enablePan={false} 
        minDistance={10} 
        maxDistance={40} 
        autoRotate={!handData.detected}
        autoRotateSpeed={0.5}
      />
    </Canvas>
  );
};

export default Experience;