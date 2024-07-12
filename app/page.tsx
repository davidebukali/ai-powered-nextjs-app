'use client'

import Link from 'next/link'
import { memo, useRef, useState } from 'react'
import { useAuth } from '@clerk/clerk-react'
import classNames from 'classnames'
import { requestAnalysis } from '@/utils/api'
import { FaSpinner } from 'react-icons/fa'
import { Object3D } from 'three'
import { Canvas, useFrame, extend, useThree } from '@react-three/fiber'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Image from 'next/image'

const dummy = new Object3D()
extend({ OrbitControls })

const Cubes = ({ color }) => {
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

const DEFAULT_ANALYSIS = {
  mood: '',
  summary: '',
  color: '049ef4',
  subject: '',
  negative: false,
}

const Home = memo(function HomePage() {
  const { isSignedIn } = useAuth()
  const [textAreaContent, setTextareaContent] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [analysis, setAnalysis] = useState(DEFAULT_ANALYSIS)
  const [requestsLeft, setRequestsLeft] = useState()
  const { mood, summary, color } = analysis || DEFAULT_ANALYSIS
  const [isLoading, setIsLoading] = useState(false)

  let href = '/'
  if (isSignedIn) {
    href = '/journal'
  } else {
    href = '/new-user'
  }

  return (
    <div className="w-screen h-screen grid gap-2 md:grid-cols-2 sm:grid-cols-1">
      <div className="flex justify-center items-center">
        <div className="p-10">
          <h1 className="flex flex-row mb-4 text-black">
            <Image src="/images/logov3.jpg" alt="logo" width={60} height={20} />
            <span className="text-6xl px-4">Mood</span>
          </h1>
          <p className="text-2xl text-black/60 mb-4">
            A journal writing app that uses AI to track how you are feeling by
            analysing your daily entries.
          </p>
          <div>
            <div
              className={classNames({
                hidden: showForm,
              })}
            >
              {isLoading && (
                <div className="flex">
                  <FaSpinner className="animate-spin" />
                  <span className="mx-1">Loading</span>
                </div>
              )}
              <textarea
                value={textAreaContent}
                onChange={(e) => {
                  setTextareaContent(e.currentTarget.value)
                }}
                placeholder="What is on your mind today ?"
                className="w-full p-3 border border-solid rounded border-sky-500"
              />
              <div
                className={classNames('text-xs text-black/60', {
                  hidden: requestsLeft == null,
                })}
              >
                Remaining requests - {requestsLeft}. Login to save your entries
                and view trends over time.
              </div>
              <button
                className={classNames(
                  'bg-green-600 px-4 py-2 rounded-lg text-xl text-white my-2',
                  {
                    hidden: requestsLeft == 0,
                  }
                )}
                onClick={async () => {
                  setIsLoading(true)
                  const { ai, left, error } = await requestAnalysis(
                    textAreaContent
                  )
                  if (ai) {
                    setAnalysis(ai)
                  }
                  setRequestsLeft(left)
                  setIsLoading(false)
                }}
                disabled={isLoading || textAreaContent.length === 0}
              >
                Submit
              </button>
              {mood && (
                <div className="text-xl text-black/60 m-2">
                  {mood.toLocaleUpperCase()}
                </div>
              )}
              {summary && (
                <div className="text-lg text-black/60 m-2">{summary}</div>
              )}
            </div>
            <Link
              href={href}
              className={classNames({
                hidden:
                  requestsLeft == null || (requestsLeft && requestsLeft > 0),
              })}
            >
              <button className="bg-blue-600 px-4 py-2 my-4 rounded-lg text-xl text-white">
                {isSignedIn ? 'Get started' : 'Login'}
              </button>
            </Link>
          </div>
        </div>
      </div>
      <div>
        <Canvas camera={{ position: [0, 20, 5] }}>
          <ambientLight intensity={1} />
          <directionalLight />
          <Cubes color={color} />
          <CameraControls />
        </Canvas>
      </div>
    </div>
  )
})

export default Home
