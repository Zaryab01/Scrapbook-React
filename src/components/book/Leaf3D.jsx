import { useEffect, useRef } from 'react'
import PageFace from './PageFace'

export default function Leaf3D({ zIndex, width, height, turned, front, back }) {
    const ref = useRef(null)

    useEffect(() => {
        const el = ref.current
        if (!el) return undefined

        const handleTransitionEnd = (event) => {
            if (event.propertyName === 'transform') {
                el.classList.remove('is-animating')
            }
        }

        el.addEventListener('transitionend', handleTransitionEnd)
        return () => {
            el.removeEventListener('transitionend', handleTransitionEnd)
        }
    }, [])

    useEffect(() => {
        const el = ref.current
        if (!el) return

        window.requestAnimationFrame(() => {
            el.style.setProperty('--t', turned ? '1' : '0')
            el.classList.add('is-animating')
        })
    }, [turned])

    return (
        <div
            ref={ref}
            className={`leaf3d ${turned ? 'is-turned' : 'is-resting'}`}
            style={{ zIndex, width, height }}
            aria-hidden="true"
        >
            <div className="page3d front">
                <PageFace page={front} side="right" />
                <div className="edge edge-right" />
                <div className="shade shade-front" />
                <div className="curl curl-front" />
            </div>

            <div className="page3d back">
                <PageFace page={back} side="left" />
                <div className="edge edge-left" />
                <div className="shade shade-back" />
                <div className="curl curl-back" />
            </div>
        </div>
    )
}
