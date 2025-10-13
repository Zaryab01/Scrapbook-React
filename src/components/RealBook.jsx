import { useEffect, useMemo, useRef, useState } from 'react'
import { useSwipeable } from 'react-swipeable'

/** Realistic 3D book:
 * - Real spine; leaves hinge exactly at center
 * - Each leaf = two faces (front=right/odd, back=left/even)
 * - Turn adds believable shadows & edge highlight tied to rotation
 */
export default function RealBook({ pages, width=980, height=640 }) {
    const leaves = useMemo(() => {
        const out = []
        for (let i = 0; i < pages.length; i += 2) {
            out.push({ front: pages[i], back: pages[i+1] ?? null })
        }
        return out
    }, [pages])

    // how many leaves have been turned to the left
    const [turnedCount, setTurnedCount] = useState(0)
    const canPrev = turnedCount > 0
    const canNext = turnedCount < leaves.length

    const next = () => canNext && setTurnedCount(c => c + 1)
    const prev = () => canPrev && setTurnedCount(c => c - 1)

    // keyboard + swipe
    useEffect(() => {
        const onKey = (e) => {
            if (e.key === 'ArrowRight') next()
            if (e.key === 'ArrowLeft') prev()
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [canNext, canPrev])

    const swipeHandlers = useSwipeable({
        onSwipedLeft: next,
        onSwipedRight: prev,
        trackTouch: true,
        trackMouse: false,
    })

    const W = width, H = height, HALF = W/2

    return (
        <div className="book3d-wrap" {...swipeHandlers}>
            <div className="book3d" style={{ width: W, height: H }}>
                {/* left hard cover */}
                <div className="cover cover-left" style={{ width: HALF, height: H }}>
                    <div className="cover-surface left">
                        <span className="brand">Scrapbook</span>
                    </div>
                </div>

                {/* right hard cover */}
                <div className="cover cover-right" style={{ width: HALF, height: H }}>
                    <div className="cover-surface right" />
                </div>

                {/* SPINE */}
                <div className="spine" style={{ height: H }} />

                {/* LEAVES STACK */}
                <div className="leaves" style={{ width: W, height: H }}>
                    {leaves.map((leaf, i) => {
                        const turned = i < turnedCount
                        const z = 2000 - i // stack topmost on the right
                        return (
                            <Leaf
                                key={i}
                                zIndex={z}
                                width={HALF}
                                height={H}
                                turned={turned}
                                front={leaf.front}
                                back={leaf.back}
                            />
                        )
                    })}
                </div>

                {/* controls */}
                <button className="book-nav nav-left" onClick={prev} disabled={!canPrev} aria-label="Previous">‹</button>
                <button className="book-nav nav-right" onClick={next} disabled={!canNext} aria-label="Next">›</button>
            </div>
        </div>
    )
}

function Leaf({ zIndex, width, height, turned, front, back }) {
    // CSS var --t animates 0→1 during turn to drive shadows/highlights
    const ref = useRef(null)
    useEffect(() => {
        const el = ref.current
        if (!el) return
        el.style.setProperty('--t', turned ? '1' : '0')
    }, [turned])

    return (
        <div
            ref={ref}
            className={`leaf3d ${turned ? 'is-turned' : ''}`}
            style={{ zIndex, width, height }}
            aria-hidden="true"
        >
            {/* Right page (front face) */}
            <div className="page3d front">
                <PaperFace page={front} side="front" />
                <div className="edge edge-right" />
                <div className="shade shade-front" />
                <div className="curl curl-front" />
            </div>

            {/* Left page (back face after flip) */}
            <div className="page3d back">
                <PaperFace page={back} side="back" />
                <div className="edge edge-left" />
                <div className="shade shade-back" />
                <div className="curl curl-back" />
            </div>
        </div>
    )
}

function PaperFace({ page, side }) {
    if (!page || page.type === 'blank') {
        return (
            <div className="face blank">
                <div className="ruler" />
                <div className="ruler faint" />
            </div>
        )
    }
    // extend later for images/text
    return (
        <div className="face">
            <div className="content">
                <h3>{page.title}</h3>
                <p>Coming soon…</p>
            </div>
        </div>
    )
}
