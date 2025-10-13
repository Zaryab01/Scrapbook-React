import { useCallback, useMemo, useState } from 'react'
import RealBook from './components/RealBook'
import './styles.css'

export default function App() {
    const [photoSrc, setPhotoSrc] = useState(null)

    const handlePhotoSelect = useCallback((file) => {
        if (!file) {
            setPhotoSrc(null)
            return
        }

        const reader = new FileReader()
        reader.onload = (event) => {
            const result = event.target?.result
            setPhotoSrc(typeof result === 'string' ? result : null)
        }
        reader.readAsDataURL(file)
    }, [])

    const pages = useMemo(() => {
        const introPages = [
            { id: 'inner-cover', type: 'cover-inner' },
            {
                id: 'intro-note',
                type: 'note',
                heading: 'A Memory in Ink',
                body: `Dear Friend,

Here are the fragments of a day that made my heart feel lighter. Scribble a thought, tuck in a ticket stub, or leave a pressed flower — it all belongs here.

With warmth,
Me`,
            },
            {
                id: 'feature-polaroid',
                type: 'polaroid',
                photoSrc,
                onPhotoSelect: handlePhotoSelect,
            },
        ]

        const totalPages = 12
        const filled = [...introPages]
        for (let i = introPages.length; i < totalPages; i += 1) {
            filled.push({ id: `blank-${i}`, type: 'blank' })
        }
        return filled
    }, [photoSrc, handlePhotoSelect])

    return (
        <div className="app-shell">
            <header className="scrapbook-header">
                <h1>Scrapbook</h1>
                <p>Collect, cherish, and reminisce.</p>
            </header>

            <main className="app-stage" aria-label="Interactive scrapbook">
                <RealBook pages={pages} width={960} height={620} />
            </main>

            <footer className="scrapbook-footer">
                <small>Crafted with love for treasured memories.</small>
            </footer>
        </div>
    )
}
