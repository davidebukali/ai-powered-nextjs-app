import React, { memo, useRef } from 'react'
import { Object3D } from 'three'
import { Canvas, useFrame, extend, useThree } from '@react-three/fiber'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const dummy = new Object3D()
extend({ OrbitControls })

const Cubes = ({ color }: { color: string }) => {
  const meshRef = useRef(null)

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime()
    meshRef.current.rotation.x = Math.sin(time / 4)
    meshRef.current.rotation.y = Math.sin(time / 4)
    let i = 0
    const amount = 4
    const offset = (amount - 1) / 2

    for (let x = 0; x < amount; x++) {
      for (let y = 0; y < amount; y++) {
        for (let z = 0; z < amount; z++) {
          dummy.position.set(offset - x, offset - y, offset - z)
          dummy.rotation.y =
            Math.sin(x / 2 + time) +
            Math.sin(y / 3 + time) +
            Math.sin(z / 4 + time)
          dummy.rotation.z = dummy.rotation.y * 2

          dummy.updateMatrix()

          meshRef.current.setMatrixAt(i++, dummy.matrix)
        }
        meshRef.current.instanceMatrix.needsUpdate = true
      }
    }
  })

  return (
    <instancedMesh ref={meshRef} args={[null, null, 1000]}>
      <torusGeometry args={[6, 0.1, 32, 32]}></torusGeometry>
      <meshPhongMaterial color={color} />
    </instancedMesh>
  )
}

const CameraControls = () => {
  const {
    camera,
    gl: { domElement },
  } = useThree()
  // Ref to the controls, so that we can update them on every frame using useFrame
  const controls = useRef(null)
  useFrame((state) => controls.current.update())
  return <orbitControls ref={controls} args={[camera, domElement]} />
}

const TorusKnot = memo(function TorusKnot(props: { color: string }) {
  return (
    <Canvas camera={{ position: [0, 20, 5] }}>
      <ambientLight intensity={1} />
      <directionalLight />
      <Cubes color={props.color} />
      <CameraControls />
    </Canvas>
  )
})

export default TorusKnot
