
import React from 'react';
import { COLORS } from '../constants';

const Bunny: React.FC = () => {
  return (
    <group position={[-8, -5, 5]} rotation={[0, 0.4, 0]} scale={0.8}>
      {/* Body */}
      <mesh position={[0, 1.5, 0]}>
        <capsuleGeometry args={[1.5, 2, 8, 16]} />
        <meshStandardMaterial color={COLORS.rosePink} roughness={0.8} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 4.2, 0]}>
        <sphereGeometry args={[1.3, 16, 16]} />
        <meshStandardMaterial color={COLORS.rosePink} roughness={0.8} />
      </mesh>
      {/* Ears */}
      <mesh position={[-0.6, 6, 0]} rotation={[0, 0, 0.2]}>
        <capsuleGeometry args={[0.3, 2, 4, 8]} />
        <meshStandardMaterial color={COLORS.rosePink} roughness={0.8} />
      </mesh>
      <mesh position={[0.6, 6, 0]} rotation={[0, 0, -0.2]}>
        <capsuleGeometry args={[0.3, 2, 4, 8]} />
        <meshStandardMaterial color={COLORS.rosePink} roughness={0.8} />
      </mesh>
      {/* Eyes */}
      <mesh position={[-0.4, 4.4, 1.1]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshBasicMaterial color="#000" />
      </mesh>
      <mesh position={[0.4, 4.4, 1.1]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshBasicMaterial color="#000" />
      </mesh>
      {/* Gift */}
      <mesh position={[0, 1, 1.8]}>
        <boxGeometry args={[1.5, 1.5, 1.5]} />
        <meshStandardMaterial color={COLORS.gold} metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
};

export default Bunny;
