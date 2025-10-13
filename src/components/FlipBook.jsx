import { useEffect, useMemo, useState } from 'react'
import { useSwipeable } from 'react-swipeable'

/**
 * A physical-like 3D flipbook:
 * - Double-page view (left/right)
 * - Each "leaf" holds two pages: front (odd), back (even)
 * - Turning flips a leaf from right to left with 3D rotateY
 */
export default function FlipBook({ pages, width = 900, height = 600 }) {
    // Build leaves: [{front: page1, back: page2}, ...]
    const leaves = useMemo(() => {
        const out = []
        for (let i = 0; i < pages.length; i += 2) {
            out.push({ front: pages[i], back: pages[i + 1] ?? null })
        }
        return out
    }, [pages])

    // Set of turned leaf indexes (0..n-1). Turned = moved to left stack.
    const [turned, setTurned] = useState(new Set())

    const canNext = turned.size < leaves.length
    const canPrev = turned.size > 0

    const next = () => {
        if (!canNext) return
        setTurned(prev => {
            const s = new Set(prev)
            s.add(prev.size) // turn the next leaf on the right
            return s
        })
    }

    const prev = () => {
        if (!canPrev) return
        setTurned(prev => {
            const s = new Set(prev)
            s.delete(prev.size - 1) // unturn the last turned leaf
            return s
        })
    }

    // Keyboard arrows
    useEffect(() => {
        const onKey = (e) => {
            if (e.key === 'ArrowRight') next()
            if (e.key === 'ArrowLeft') prev()
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [canNext, canPrev])

    // Swipe on mobile
    const swipeHandlers = useSwipeable({
        onSwipedLeft: next,
        onSwipedRight: prev,
        trackTouch: true,
        trackMouse: false,
    })

    const W = width
    const H = height

    return (
        <div className="book3d-wrap" {...swipeHandlers}>
            <div className="book3d" style={{ width: W, height: H }}>
                {/* Hard cover left */}
                <div className="hard hard-left" style={{ width: W / 2, height: H }}>
                    <div className="hard-inner">
                        <span className="brand">My Scrapbook</span>
                    </div>
                </div>

                {/* Leaves stack in the middle. Highest zIndex on top (rightmost leaf) */}
                <div className="stack" style={{ width: W, height: H }}>
                    {leaves.map((leaf, i) => {
                        const isTurned = turned.has(i)
                        const z = 1000 - i // ensure ordering
                        return (
                            <div
                                key={i}
                                className={`leaf ${isTurned ? 'turned' : ''}`}
                                style={{
                                    zIndex: z,
                                    width: W / 2,
                                    height: H,
                                    // transform set by CSS via .turned class
                                }}
                            >
                                {/* FRONT (right side) — odd page number */}
                                <div className="page front">
                                    <PageFace page={leaf.front} side="front" />
                                    <div className="gutter-shadow" />
                                </div>

                                {/* BACK (left side, visible after turn) — even page number */}
                                <div className="page back">
                                    <PageFace page={leaf.back} side="back" />
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Hard cover right */}
                <div className="hard hard-right" style={{ width: W / 2, height: H }}>
                    <div className="hard-inner right" />
                </div>

                {/* Controls */}
                <button className="book-nav nav-left" onClick={prev} disabled={!canPrev} aria-label="Previous">
                    ‹
                </button>
                <button className="book-nav nav-right" onClick={next} disabled={!canNext} aria-label="Next">
                    ›
                </button>
            </div>
        </div>
    )
}

function PageFace({ page, side }) {
    if (!page) {
        return (
            <div className="face blank">
                <div className="rule faint">Blank</div>
            </div>
        )
    }

    if (page.type === 'blank') {
        return (
            <div className="face blank">
                <div className="rule" />
                <div className="rule faint" />
            </div>
        )
    }

    // Extend later for image/text pages
    return (
        <div className="face">
            <div className="content">
                <h3>{page.title}</h3>
                <p>Content goes here.</p>
            </div>
        </div>
    )
}
