import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSwipeable } from 'react-swipeable'
import Leaf3D from './book/Leaf3D'

/** Realistic 3D book with paired spreads */
export default function RealBook({ spreads, width = 980, height = 640 }) {
    const leaves = useMemo(() => {
        if (!Array.isArray(spreads)) return []
        return spreads.map((spread, index) => {
            const baseId = spread.id ?? `spread-${index}`
            return {
                id: baseId,
                front: spread.right ? { ...spread.right, side: 'right', id: `${baseId}-right` } : null,
                back: spread.left ? { ...spread.left, side: 'left', id: `${baseId}-left` } : null,
            }
        })
    }, [spreads])

    const leafCount = leaves.length
    const [turnedCount, setTurnedCount] = useState(0)
    const [isOpen, setIsOpen] = useState(false)

    const canPrev = turnedCount > 0
    const canNext = turnedCount < leafCount

    const next = useCallback(() => {
        setTurnedCount(count => (count < leafCount ? count + 1 : count))
    }, [leafCount])

    const prev = useCallback(() => {
        setTurnedCount(count => (count > 0 ? count - 1 : count))
    }, [])

    const openBook = useCallback(() => setIsOpen(true), [])

    useEffect(() => {
        if (!isOpen) return undefined
        if (turnedCount !== 0) return undefined
        if (leafCount < 2) return undefined

        const id = window.setTimeout(() => {
            setTurnedCount(1)
        }, 520)

        return () => window.clearTimeout(id)
    }, [isOpen, turnedCount, leafCount])

    useEffect(() => {
        if (!isOpen) return undefined
        const onKey = (event) => {
            if (event.key === 'ArrowRight') next()
            if (event.key === 'ArrowLeft') prev()
        }

        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [isOpen, next, prev])

    const swipeHandlers = useSwipeable({
        onSwipedLeft: next,
        onSwipedRight: prev,
        trackTouch: true,
        trackMouse: false,
        preventScrollOnSwipe: true,
        delta: 12,
        enabled: isOpen,
    })

    const W = width
    const H = height
    const HALF = W / 2

    return (
        <div className={`book3d-wrap ${isOpen ? 'is-open' : 'is-closed'}`} {...swipeHandlers}>
            <div className={`book3d ${isOpen ? 'is-open' : 'is-closed'}`} style={{ width: W, height: H }}>
                <div className="cover cover-left" style={{ width: HALF, height: H }}>
                    <div className="cover-surface left" />
                </div>

                <div className="cover cover-right" style={{ width: HALF, height: H }}>
                    <div className="cover-surface right" />
                </div>

                <div className="spine" style={{ height: H }} />

                <div className="leaves" style={{ width: W, height: H }}>
                    {leaves.map((leaf, index) => {
                        const turned = index < turnedCount
                        const z = 2000 - index
                        return (
                            <Leaf3D
                                key={leaf.id}
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

                <button
                    className="book-nav nav-left"
                    onClick={prev}
                    disabled={!isOpen || !canPrev}
                    aria-label="Previous"
                    type="button"
                >
                    ‹
                </button>
                <button
                    className="book-nav nav-right"
                    onClick={next}
                    disabled={!isOpen || !canNext}
                    aria-label="Next"
                    type="button"
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
