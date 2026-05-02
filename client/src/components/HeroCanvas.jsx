import React, { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { RoundedBox, Float } from '@react-three/drei'

function ThumbnailCard({ position, rotation, color, delay = 0 }) {
    const meshRef = useRef()
    useFrame((state) => {
        const t = state.clock.elapsedTime + delay
        meshRef.current.rotation.x = Math.sin(t * 0.3) * 0.1
        meshRef.current.rotation.y = Math.sin(t * 0.2) * 0.15
        meshRef.current.position.y = position[1] + Math.sin(t * 0.5 + delay) * 0.1
    })

    return (
        <mesh ref={meshRef} position={position} rotation={rotation} castShadow>
            <RoundedBox args={[1.6, 0.9, 0.05]} radius={0.08} smoothness={4}>
                <meshStandardMaterial
                    color={color}
                    metalness={0.2}
                    roughness={0.1}
                    emissive={color}
                    emissiveIntensity={0.15}
                />
            </RoundedBox>
        </mesh>
    )
}

function GlowSphere({ position, color }) {
    const meshRef = useRef()
    useFrame((state) => {
        meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 1.5) * 0.05)
    })
    return (
        <mesh ref={meshRef} position={position}>
            <sphereGeometry args={[0.3, 32, 32]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} transparent opacity={0.6} />
        </mesh>
    )
}

function ParticleField() {
    const count = 80
    const positions = React.useMemo(() => {
        const pos = new Float32Array(count * 3)
        for (let i = 0; i < count; i++) {
            const seedX = Math.sin(i * 12.9898) * 43758.5453
            const seedY = Math.sin(i * 78.233) * 43758.5453
            const seedZ = Math.sin(i * 39.425) * 43758.5453
            pos[i * 3] = ((seedX - Math.floor(seedX)) - 0.5) * 10
            pos[i * 3 + 1] = ((seedY - Math.floor(seedY)) - 0.5) * 8
            pos[i * 3 + 2] = ((seedZ - Math.floor(seedZ)) - 0.5) * 5
        }
        return pos
    }, [])

    const pointsRef = useRef()
    useFrame((state) => {
        pointsRef.current.rotation.y = state.clock.elapsedTime * 0.05
    })

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
            </bufferGeometry>
            <pointsMaterial size={0.03} color="#6366f1" transparent opacity={0.6} />
        </points>
    )
}

export default function HeroCanvas() {
    return (
        <Canvas
            camera={{ position: [0, 0, 5], fov: 50 }}
            style={{ width: '100%', height: '100%' }}
            shadows
        >
            <ambientLight intensity={0.3} />
            <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
            <pointLight position={[-3, 2, 0]} intensity={2} color="#6366f1" />
            <pointLight position={[3, -2, 0]} intensity={1.5} color="#8b5cf6" />
            <pointLight position={[0, 0, 3]} intensity={1} color="#f59e0b" />

            <ParticleField />

            <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
                <ThumbnailCard position={[0, 0.2, 0]} rotation={[0, 0, -0.08]} color="#1e1b4b" delay={0} />
            </Float>

            <Float speed={2} rotationIntensity={0.2} floatIntensity={0.4}>
                <ThumbnailCard position={[-1.8, -0.4, -0.5]} rotation={[0.05, 0.1, -0.15]} color="#0f172a" delay={1} />
            </Float>

            <Float speed={1.8} rotationIntensity={0.25} floatIntensity={0.45}>
                <ThumbnailCard position={[1.8, -0.3, -0.4]} rotation={[-0.05, -0.1, 0.15]} color="#1e1b4b" delay={2} />
            </Float>

            <GlowSphere position={[-1, 1.5, -1]} color="#6366f1" />
            <GlowSphere position={[1.5, -1.2, -0.5]} color="#8b5cf6" />
            <GlowSphere position={[0, -1.8, -1]} color="#f59e0b" />
        </Canvas>
    )
}
