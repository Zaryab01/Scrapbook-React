import { useEffect, useRef, useState } from 'react'
import { useSwipeable } from 'react-swipeable'
import Page from './Page'

export default function Book({ pages }) {
    const [index, setIndex] = useState(0)
    const trackRef = useRef(null)

    const clamp = (n) => Math.max(0, Math.min(n, pages.length - 1))
    const next = () => setIndex((i) => clamp(i + 1))
    const prev = () => setIndex((i) => clamp(i - 1))

    // Keyboard arrows on desktop
    useEffect(() => {
        const onKey = (e) => {
            if (e.key === 'ArrowRight') next()
            if (e.key === 'ArrowLeft') prev()
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [])

    // Swipe on mobile
    const swipeHandlers = useSwipeable({
        onSwipedLeft: next,
        onSwipedRight: prev,
        trackTouch: true,
        trackMouse: false,
    })

    return (
        <div className="book" {...swipeHandlers}>
            {/* Track */}
            <div
                ref={trackRef}
                className="book-track"
                style={{ transform: `translateX(${-index * 100}%)` }}
            >
                {pages.map((p, i) => (
                    <div className="book-slide" key={p.id}>
                        <Page page={p} pageNumber={i + 1} total={pages.length} />
                    </div>
                ))}
            </div>

            {/* Desktop arrows */}
            <button className="nav nav-left" onClick={prev} aria-label="Previous page">
                ‹
            </button>
            <button className="nav nav-right" onClick={next} aria-label="Next page">
                ›
            </button>

            {/* Simple indicator */}
            <div className="pager">
                {index + 1} / {pages.length}
            </div>
        </div>
    )
}
