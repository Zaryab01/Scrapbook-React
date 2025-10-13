import { Fragment, useEffect, useMemo, useRef, useState, useId } from 'react'
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
    const [isOpen, setIsOpen] = useState(false)
    const leafCount = leaves.length
    const canPrev = turnedCount > 0
    const canNext = turnedCount < leafCount

    const next = () => canNext && setTurnedCount(c => c + 1)
    const prev = () => canPrev && setTurnedCount(c => c - 1)
    const openBook = () => setIsOpen(true)

    useEffect(() => {
        if (!isOpen) return
        if (turnedCount !== 0) return
        if (leafCount < 2) return

        const id = window.setTimeout(() => {
            setTurnedCount(1)
        }, 520)

        return () => window.clearTimeout(id)
    }, [isOpen, turnedCount, leafCount])

    // keyboard + swipe
    useEffect(() => {
        if (!isOpen) return undefined
        const onKey = (e) => {
            if (e.key === 'ArrowRight') next()
            if (e.key === 'ArrowLeft') prev()
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [isOpen, canNext, canPrev])

    const swipeHandlers = useSwipeable({
        onSwipedLeft: next,
        onSwipedRight: prev,
        trackTouch: true,
        trackMouse: false,
        preventScrollOnSwipe: true,
        delta: 12,
        enabled: isOpen,
    })

    const W = width, H = height, HALF = W/2

    return (
        <div className={`book3d-wrap ${isOpen ? 'is-open' : 'is-closed'}`} {...swipeHandlers}>
            <div className={`book3d ${isOpen ? 'is-open' : 'is-closed'}`} style={{ width: W, height: H }}>
                {/* left hard cover */}
                <div className="cover cover-left" style={{ width: HALF, height: H }}>
                    <div className="cover-surface left" />
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
                <button
                    className="book-nav nav-left"
                    onClick={prev}
                    disabled={!isOpen || !canPrev}
                    aria-label="Previous"
                >
                    ‹
                </button>
                <button
                    className="book-nav nav-right"
                    onClick={next}
                    disabled={!isOpen || !canNext}
                    aria-label="Next"
                >
                    ›
                </button>

                {!isOpen && (
                    <button className="book-open-button" type="button" onClick={openBook} aria-label="Open scrapbook">
                        Open scrapbook
                    </button>
                )}
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
                <PaperFace page={front} />
                <div className="edge edge-right" />
                <div className="shade shade-front" />
                <div className="curl curl-front" />
            </div>

            {/* Left page (back face after flip) */}
            <div className="page3d back">
                <PaperFace page={back} />
                <div className="edge edge-left" />
                <div className="shade shade-back" />
                <div className="curl curl-back" />
            </div>
        </div>
    )
}

function PaperFace({ page }) {
    const inputId = useId()

    if (!page || page.type === 'blank') {
        return <div className="face blank" />
    }

    if (page.type === 'cover-inner') {
        return (
            <div className="face inner-cover">
                <div className="inner-cover-pattern" />
            </div>
        )
    }

    if (page.type === 'note') {
        const paragraphs = page.body
            ?.split(/\n{2,}/)
            .map(block => block.trim())
            .filter(Boolean) ?? []

        return (
            <div className="face note-face">
                <div className="note-paper">
                    {page.heading && <h2>{page.heading}</h2>}
                    {paragraphs.map((block, index) => (
                        <p key={`${page.id}-line-${index}`}>
                            {block.split('\n').map((segment, lineIndex) => (
                                lineIndex === 0 ? (
                                    segment
                                ) : (
                                    <Fragment key={`seg-${lineIndex}`}>
                                        <br />
                                        {segment}
                                    </Fragment>
                                )
                            ))}
                        </p>
                    ))}
                </div>
            </div>
        )
    }

    if (page.type === 'polaroid') {
        const handleChange = (event) => {
            const file = event.target.files?.[0]
            if (file && page.onPhotoSelect) {
                page.onPhotoSelect(file)
            }
            event.target.value = ''
        }

        return (
            <div className="face polaroid-face">
                <div className={`polaroid-frame ${page.photoSrc ? 'has-photo' : ''}`}>
                    <div className="polaroid-photo">
                        {page.photoSrc ? (
                            <img src={page.photoSrc} alt="Scrapbook memory" />
                        ) : (
                            <span className="polaroid-placeholder">Tap below to add a photo</span>
                        )}
                    </div>
                    <label className="polaroid-action" htmlFor={inputId}>
                        {page.photoSrc ? 'Replace photo' : 'Add a photo'}
                    </label>
                    <input
                        id={inputId}
                        type="file"
                        className="polaroid-input"
                        accept="image/*"
                        onChange={handleChange}
                    />
                </div>
            </div>
        )
    }

    return <div className="face blank" />
}
