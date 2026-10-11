import React, { useRef, Component, type ReactNode } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { SceneFallback } from './SceneFallback'

// Error boundary to catch WebGL context creation errors
interface ErrorBoundaryProps {
  fallback: ReactNode
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

export class WebGLErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch() {
    // Graceful fallback to SceneFallback
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback
    }
    return this.props.children
  }
}

// Deterministic particle coordinates generated once statically
const PARTICLE_COUNT = 45
const STATIC_PARTICLES = new Float32Array(PARTICLE_COUNT * 3)
for (let i = 0; i < PARTICLE_COUNT; i++) {
  const angle = (i / PARTICLE_COUNT) * Math.PI * 2
  const radius = 2.5 + ((i % 5) * 0.4)
  STATIC_PARTICLES[i * 3] = Math.cos(angle) * radius
  STATIC_PARTICLES[i * 3 + 1] = Math.sin(angle * 2) * 1.5
  STATIC_PARTICLES[i * 3 + 2] = Math.sin(angle) * (radius * 0.5)
}

const CoinAndRings: React.FC = () => {
  const coinGroupRef = useRef<THREE.Group>(null)
  const ringRef = useRef<THREE.Mesh>(null)
  const orb1Ref = useRef<THREE.Mesh>(null)
  const orb2Ref = useRef<THREE.Mesh>(null)
  const orb3Ref = useRef<THREE.Mesh>(null)

  useFrame((state, delta) => {
    // Gentle rotation of the central coin group
    if (coinGroupRef.current) {
      coinGroupRef.current.rotation.y += delta * 0.4
      coinGroupRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.12
    }

    // Orbiting rings
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.2
      ringRef.current.rotation.x = Math.PI / 3 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }

    // Orbiting financial nodes (savings, commitments, allowance)
    const t = state.clock.elapsedTime
    if (orb1Ref.current) {
      orb1Ref.current.position.x = Math.cos(t * 0.8) * 2.4
      orb1Ref.current.position.z = Math.sin(t * 0.8) * 2.4
      orb1Ref.current.position.y = Math.sin(t * 1.2) * 0.4
    }
    if (orb2Ref.current) {
      orb2Ref.current.position.x = Math.cos(t * 0.6 + Math.PI) * 2.7
      orb2Ref.current.position.z = Math.sin(t * 0.6 + Math.PI) * 2.7
      orb2Ref.current.position.y = Math.cos(t * 1.0) * 0.35
    }
    if (orb3Ref.current) {
      orb3Ref.current.position.x = Math.cos(t * 1.1 + Math.PI / 2) * 2.1
      orb3Ref.current.position.z = Math.sin(t * 1.1 + Math.PI / 2) * 2.1
      orb3Ref.current.position.y = Math.sin(t * 0.9) * 0.3
    }
  })

  return (
    <group>
      {/* Lights */}
      <ambientLight intensity={0.8} />
      <directionalLight position={[4, 6, 5]} intensity={2.2} color="#FFFFFF" />
      <pointLight position={[-3, -2, -2]} intensity={1.5} color="#C8FF4D" />
      <pointLight position={[3, -2, 2]} intensity={1.5} color="#9875FF" />
      <pointLight position={[0, 4, 2]} intensity={1.0} color="#63E5F4" />

      {/* Centerpiece Coin Group */}
      <group ref={coinGroupRef}>
        {/* Outer Coin Body */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[1.5, 1.5, 0.2, 48]} />
          <meshStandardMaterial
            color="#E2E8F0"
            metalness={0.92}
            roughness={0.15}
            envMapIntensity={1.5}
          />
        </mesh>

        {/* Coin Inner Rim (Electric Lime Accent) */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[1.35, 1.35, 0.22, 48]} />
          <meshStandardMaterial
            color="#C8FF4D"
            metalness={0.85}
            roughness={0.2}
            emissive="#C8FF4D"
            emissiveIntensity={0.25}
          />
        </mesh>

        {/* Coin Core Plate */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[1.2, 1.2, 0.23, 48]} />
          <meshStandardMaterial
            color="#141822"
            metalness={0.7}
            roughness={0.4}
          />
        </mesh>
      </group>

      {/* 30-Day Budget Cycle Orbit Ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[2.5, 0.035, 16, 64]} />
        <meshStandardMaterial
          color="#C8FF4D"
          emissive="#C8FF4D"
          emissiveIntensity={0.6}
          roughness={0.2}
        />
      </mesh>

      {/* Secondary Depth Ring */}
      <mesh rotation={[-Math.PI / 4, 0, 0]}>
        <torusGeometry args={[2.9, 0.02, 16, 64]} />
        <meshStandardMaterial
          color="#63E5F4"
          emissive="#63E5F4"
          emissiveIntensity={0.4}
          roughness={0.3}
        />
      </mesh>

      {/* Tertiary Outer Cycle Ring */}
      <mesh rotation={[Math.PI / 6, Math.PI / 4, 0]}>
        <torusGeometry args={[3.2, 0.015, 16, 64]} />
        <meshStandardMaterial
          color="#9875FF"
          emissive="#9875FF"
          emissiveIntensity={0.35}
          roughness={0.4}
        />
      </mesh>

      {/* Floating Financial Nodes */}
      {/* Node 1: Electric Lime (Safe Daily Allowance) */}
      <mesh ref={orb1Ref}>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshStandardMaterial
          color="#C8FF4D"
          emissive="#C8FF4D"
          emissiveIntensity={0.8}
          roughness={0.1}
        />
      </mesh>

      {/* Node 2: Cyan (Savings Goals Cushion) */}
      <mesh ref={orb2Ref}>
        <sphereGeometry args={[0.18, 32, 32]} />
        <meshStandardMaterial
          color="#63E5F4"
          emissive="#63E5F4"
          emissiveIntensity={0.8}
          roughness={0.1}
        />
      </mesh>

      {/* Node 3: Electric Violet (Upcoming Obligations) */}
      <mesh ref={orb3Ref}>
        <sphereGeometry args={[0.16, 32, 32]} />
        <meshStandardMaterial
          color="#9875FF"
          emissive="#9875FF"
          emissiveIntensity={0.7}
          roughness={0.2}
        />
      </mesh>

      {/* Ambient Particle Field */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[STATIC_PARTICLES, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.04}
          color="#A5ADBE"
          transparent
          opacity={0.6}
        />
      </points>
    </group>
  )
}

interface FinanceSceneProps {
  cashBalance: number
  safeDailyAllowance: number
  currentDay: number
}

export const FinanceScene: React.FC<FinanceSceneProps> = ({
  cashBalance,
  safeDailyAllowance,
  currentDay,
}) => {
  return (
    <WebGLErrorBoundary
      fallback={
        <SceneFallback
          cashBalance={cashBalance}
          safeDailyAllowance={safeDailyAllowance}
        />
      }
    >
      <div className="relative w-full h-[320px] sm:h-[380px] rounded-2xl overflow-hidden bg-gradient-to-br from-[#141822] via-[#0E121B] to-[#141822] border border-[#263045] shadow-2xl">
        {/* Subtle background glow */}
        <div className="absolute w-72 h-72 rounded-full bg-[#C8FF4D]/10 blur-3xl pointer-events-none -top-10 -left-10" />
        <div className="absolute w-72 h-72 rounded-full bg-[#9875FF]/15 blur-3xl pointer-events-none -bottom-10 -right-10" />

        {/* 3D Canvas */}
        <Canvas
          camera={{ position: [0, 0, 5.2], fov: 45 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          className="cursor-grab active:cursor-grabbing"
        >
          <CoinAndRings />
        </Canvas>

        {/* Overlay Overlay Info Overlay */}
        <div className="absolute top-4 left-4 pointer-events-none flex flex-col gap-1">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#A5ADBE] font-bold">
            RupeeFlow 3D Core
          </span>
          <span className="text-xs font-semibold text-[#F5F7FA]">
            ₹10,000 Cap • Day {currentDay} of 30
          </span>
        </div>

        {/* Real-time metrics badges overlay */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
          <div className="px-3 py-1.5 rounded-xl bg-[#141822]/90 border border-[#C8FF4D]/30 backdrop-blur-md shadow-lg text-xs font-mono font-bold text-[#C8FF4D]">
            ₹{Math.round(cashBalance).toLocaleString('en-IN')} Cash In Hand
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-[#141822]/90 border border-[#63E5F4]/30 backdrop-blur-md shadow-lg text-xs font-mono font-bold text-[#63E5F4]">
            ₹{Math.round(safeDailyAllowance)}/day Safe
          </div>
        </div>
      </div>
    </WebGLErrorBoundary>
  )
}

export default FinanceScene
