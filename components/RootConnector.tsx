"use client"
import React from "react"

interface RootConnectorProps {
    childCount: number
    nameTag?: string
}

const RootConnector: React.FC<RootConnectorProps> = ({ childCount, nameTag }) => {
    if (childCount === 0) return null

    const rootX = 60
    const shiftX = 60
    const trunkPath = `M${rootX} 5 C${rootX + 2} 10, ${rootX - 2} 0, ${rootX} 23`

    console.log(`RootConnector for ${nameTag}: childCount = ${childCount}`)

    return (
        <svg
            className="svg-root"
            viewBox="-40 0 200 70"
            width="800"
            height="110"
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <filter id="morph-jagged" x="-80" y="-120" width="400" height="400">
                    <feTurbulence type="turbulence" baseFrequency="0.015" numOctaves="6" stitchTiles="noStitch" result="turbulence" />
                    <feDisplacementMap in="SourceGraphic" in2="turbulence" scale="10" />
                </filter>
                <radialGradient id="brown-gradient-trunk" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="20%" stopColor="#895012ff" />
                    <stop offset="50%" stopColor="#773f0eff" />
                    <stop offset="100%" stopColor="#5a310bff" />
                </radialGradient>
                <filter id="root-shadow" x="-60" y="-60" width="200" height="250">
                    <feDropShadow dx="2.7" dy="2.7" stdDeviation="2" floodColor="#3b2f1b" floodOpacity="0.6" />
                </filter>
            </defs>

            {/* Vertical trunk */}
            <path
                d={trunkPath}
                fill="none"
                stroke="url(#brown-gradient-trunk)"
                strokeWidth={10}
                strokeLinecap="round"
                filter="url(#morph-jagged) url(#root-shadow)"
            />

            {/* Dynamic branches */}
            {childCount === 1 ? (
                // Unique single-child root path
                <path
                    d={`M${shiftX} 20 C${shiftX} 45, 30 40, 25 54`}
                    fill="none"
                    stroke="url(#brown-gradient-trunk)"
                    strokeWidth={9.5}
                    strokeLinecap="round"
                    filter="url(#morph-jagged) url(#root-shadow)"
                />
            ) : (
                Array.from({ length: childCount }).map((_, index) => {
                    const MAX_OFFSET = 180

                    // Evenly spread across [-MAX_OFFSET, MAX_OFFSET]
                    const x = -MAX_OFFSET + (2 * MAX_OFFSET) * (index / (childCount - 1))

                    

                    console.log(`↳ Path ${index + 1} for ${nameTag}: x = ${x}`)

                    return (
                        <path
                            key={index}
                            d={`M${shiftX} 30 C${shiftX} 55, ${x + shiftX} 0, ${x + shiftX + 10} 54`}
                            fill="none"
                            stroke="url(#brown-gradient-trunk)"
                            strokeWidth={9.5}
                            strokeLinecap="round"
                            filter="url(#morph-jagged) url(#root-shadow)"
                        />
                    )
                })
            )}
        </svg>
    )
}

export default RootConnector
