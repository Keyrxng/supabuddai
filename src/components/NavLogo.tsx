"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"

function NavLogo({ className }: { className?: string }) {
  const containerRef = useRef(null)
  const ref = useRef(null)
  const [gradientPos, setGradientPos] = useState({ x: 0, y: 0 })
  const [isActive, setIsActive] = useState(false)

  const handleGlow = (event: any) => {
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

    const center_x = x + width / 2
    const center_y = y + height / 2
    const mouse_x = event.clientX
    const mouse_y = event.clientY

    const deltaX = center_x - mouse_x
    const deltaY = center_y - mouse_y
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

    const intensity = Math.max(150 / distance, 1)
    svgElement.style.stroke = `1px solid rgba(62, 207, 149, ${intensity})`
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
      className={`${className} aspect-auto -space-y-6 border-[#3ecf95] rounded-md p-2 w-[fit-content] h-[fit-content] `}
    >
      <div className="flex justify-center items-center ">
        <figure
          className="inset-0 z-0"
          ref={containerRef}
          role="img"
          aria-label="SupaBuddAi Logo"
        >
          <svg
            ref={ref}
            viewBox="0 0 390 430"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`relative top-1/2 bottom-1/2 left-1/2 transform -translate-x-1/2 mr-1 pr-1 w-[150%] h-[150%] z-20 m-auto ml-1 mb-6`}
            id="glowElement"
          >
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
                <stop stopColor="#3ecf95" />
                <stop offset="1" stopColor="#3ecf95" stopOpacity="0" />
              </radialGradient>
            </defs>
          </svg>
          <Image
            src="/SupaBuddAi-logo.png"
            priority
            quality={100}
            className={`absolute opacity-35 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`}
            width={1000}
            height={1000}
            alt="SupaBuddAi Logo"
          />
        </figure>
      </div>
    </div>
  )
}

export default NavLogo
