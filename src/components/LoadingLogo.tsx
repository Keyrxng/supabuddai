"use client"

import { Suspense, useEffect, useRef, useState } from "react"
import Image from "next/image"

type Props = {}

function LoadingLogo({}: Props) {
  const containerRef = useRef(null)
  const ref = useRef(null)
  const [gradientPos, setGradientPos] = useState({ x: 0, y: 0 })
  const [intensity, setIntensity] = useState(350)
  const [isActive, setIsActive] = useState(false)
  const handleGlow = (event) => {
    if (!ref.current || !containerRef.current) return null
    const containerRefElement = containerRef.current as HTMLDivElement
    if (event.target.id !== "glowElement") return
    const {
      x: contX,
      y: contY,
      width: containerWidth,
      height: containerHeight,
    } = containerRefElement.getBoundingClientRect()
    const xCont = event.clientX - contX
    const yCont = event.clientY - contY

    const isContainerHovered =
      xCont > -3 &&
      xCont < containerWidth + 3 &&
      yCont > -3 &&
      yCont < containerHeight + 3
    setIsActive(isContainerHovered)

    if (!isContainerHovered) return

    const svgElement = ref.current as SVGElement
    const {
      x: svgX,
      y: svgY,
      width,
      height,
    } = svgElement.getBoundingClientRect()

    const x = event.clientX - svgX
    const y = event.clientY - svgY

    setGradientPos({ x, y })

    const glowElement = event.target

    const center_x = x + width / 2
    const center_y = y + height / 2
    const mouse_x = event.clientX
    const mouse_y = event.clientY

    const deltaX = center_x - mouse_x
    const deltaY = center_y - mouse_y
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

    const intensity = Math.min(150 / distance, 1)
    const colorIntensity = Math.floor(255 * intensity)
  }

  useEffect(() => {
    if (typeof window === "undefined") return

    window.addEventListener("mousemove", handleGlow)
    return () => {
      window.removeEventListener("mousemove", handleGlow)
    }
  }, [])

  return (
    <div
      onMouseMove={handleGlow}
      className="w-screen   absolute mx-auto grid h-screen justify-center items-center "
    >
      <div className="w-full h-full flex justify-center items-center ">
        <figure
          className="inset-0  z-0"
          ref={containerRef}
          role="img"
          aria-label="Supabase Vector uses pgvector to store, index, and access embeddings"
        >
          <span className="w-full lg:w-auto h-full lg:aspect-square flex items-end">
            <svg
              ref={ref}
              viewBox="0 0 390 430"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-[99%] h-[99%] z-20 m-auto text-[#3ecf95] ml-1 mb-3"
              id="glowElement"
            >
              {/* Animated ouline */}
              <path
                d="M195.918 125.344L276.779 172.029V265.399L195.918 312.084L115.057 265.399V172.029L195.918 125.344Z"
                stroke="url(#paint0_radial_484_53266)"
                strokeWidth={2}
              />
              <defs>
                <radialGradient
                  id="paint0_radial_484_53266"
                  cx="0"
                  cy="0"
                  r="2"
                  gradientUnits="userSpaceOnUse"
                  gradientTransform={`translate(${gradientPos?.x} ${gradientPos.y}) rotate(56.4303) scale(132.019)`}
                >
                  <stop id="glowElement" stopColor="#3ecf95" />
                  <stop
                    id="glowElement"
                    offset="1"
                    stopColor="#3ecf95"
                    stopOpacity="0"
                  />
                </radialGradient>
              </defs>
            </svg>
            <Image
              src="/SupaBuddAi-logo.png"
              className="object-contain aspect-auto animate-none absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              width={175}
              height={175}
              alt="SupaBuddAi Logo"
            />
          </span>
        </figure>
      </div>
    </div>
  )
}

export default LoadingLogo
