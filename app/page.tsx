'use client'

import Link from 'next/link'
import * as THREE from 'three'
import { memo, useEffect, useRef } from 'react'
import { useAuth } from '@clerk/clerk-react'

const Home = memo(function HomePage() {
  const { getToken, isLoaded, isSignedIn } = useAuth()
  const renderTarget = useRef(null)
  useEffect(() => {
    let continueRendering = true
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xffffff)
    const camera = new THREE.PerspectiveCamera(
      75,
      renderTarget.current.clientWidth / renderTarget.current.clientHeight,
      0.1,
      1000
    )
    const renderer = new THREE.WebGLRenderer()
    renderer.setSize(
      renderTarget.current.clientWidth,
      renderTarget.current.clientHeight
    )
    renderTarget.current.replaceChildren(renderer.domElement)
    const geometry = new THREE.TorusKnotGeometry(50, 20, 50, 16)
    const material = new THREE.MeshBasicMaterial({
      color: 0x049ef4,
      wireframe: true,
    })
    const torusKnot = new THREE.Mesh(geometry, material)
    scene.add(torusKnot)
    const directionalLight = new THREE.DirectionalLight(0x000000, 0.5)
    scene.add(directionalLight)
    const light = new THREE.AmbientLight(0x404040)
    scene.add(light)
    camera.position.z = 200
    function animate() {
      if (continueRendering) {
        requestAnimationFrame(animate)
      }
      torusKnot.rotation.x += 0.01
      torusKnot.rotation.y += 0.01
      renderer.render(scene, camera)
    }
    animate()
    return () => {
      continueRendering = false
    }
  }, [])

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
          <h1 className="text-6xl mb-4 text-black">Mood</h1>
          <p className="text-2xl text-black/60 mb-4">
            A journal writing app that uses AI to track how you are feeling by
            analysing your daily entries.
          </p>
          <div>
            <Link href={href}>
              <button className="bg-blue-600 px-4 py-2 rounded-lg text-xl text-white">
                Get started
              </button>
            </Link>
          </div>
        </div>
      </div>
      <div ref={renderTarget}></div>
    </div>
  )
})

export default Home
