import { useMemo } from 'react'
import RealBook from './components/RealBook'
import './styles.css'

const polaroidSources = [
    {
        src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
        caption: 'Sunrise over the old harbour',
    },
    {
        src: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=900&q=80',
        caption: 'Sketching stories at the café nook',
    },
    {
        src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=900&q=80',
        caption: 'Trail of gold leaves in the park',
    },
    {
        src: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=900&q=80',
        caption: 'Twilight lights the city skyline',
    },
    {
        src: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=900&q=80',
        caption: 'Homeward bound through the lantern street',
    },
]

export default function App() {
    const spreads = useMemo(() => [
        {
            id: 'opening',
            left: { type: 'cover-inner' },
            right: {
                type: 'polaroid',
                photoSrc: polaroidSources[0].src,
                caption: polaroidSources[0].caption,
            },
        },
        {
            id: 'morning-walk',
            left: {
                type: 'note',
                heading: 'A Memory in Ink',
                body: `Dear Friend,\n\nI opened the day with a wandering walk. The cobblestones were still damp from dawn, and the bakery windows were fogged with the promise of warmth.\n\nHere are the fragments of a day that made my heart feel lighter. Scribble a thought, tuck in a ticket stub, or leave a pressed flower — it all belongs here.\n\nWith warmth,\nMe`,
            },
            right: {
                type: 'polaroid',
                photoSrc: polaroidSources[1].src,
                caption: polaroidSources[1].caption,
            },
        },
        {
            id: 'afternoon',
            left: {
                type: 'story',
                title: 'Afternoon Sketches',
                subtitle: 'Market Square • 2:30pm',
                body: `The street musician swapped melodies with the breeze while I sketched the scene in pencil.\n\nA passerby left a tiny pressed flower between my pages — a quiet reminder to slow down.\n\nI promised myself to return next week with a box of pastries and a new tune to hum along.`,
                footer: 'Remember to bring extra charcoal sticks.',
            },
            right: {
                type: 'polaroid',
                photoSrc: polaroidSources[2].src,
                caption: polaroidSources[2].caption,
            },
        },
        {
            id: 'evening',
            left: {
                type: 'story',
                title: 'Evening Promenade',
                subtitle: 'Riverbank • 6:10pm',
                body: `Lanterns floated in the river like drifting constellations. I collected a handful of ticket stubs from the ferry ride and tucked them between the pages.\n\nThe smell of roasted chestnuts followed us home, mixing with the cool air.`,
                footer: 'Chestnut vendor closes at 7pm — don\'t be late.',
            },
            right: {
                type: 'polaroid',
                photoSrc: polaroidSources[3].src,
                caption: polaroidSources[3].caption,
            },
        },
        {
            id: 'closing',
            left: {
                type: 'story',
                title: 'Nightfall Reflections',
                subtitle: 'Window seat • 10:45pm',
                body: `I taped a postcard beneath this entry — the one with the painted moon.\n\nThe pages carry the scent of cinnamon and rain now. Here\'s to another chapter waiting in the morning light.`,
            },
            right: {
                type: 'polaroid',
                photoSrc: polaroidSources[4].src,
                caption: polaroidSources[4].caption,
            },
        },
    ], [])

    return (
        <div className="app-shell">
            <header className="scrapbook-header">
                <h1>Scrapbook</h1>
                <p>Collect, cherish, and reminisce.</p>
            </header>

            <main className="app-stage" aria-label="Interactive scrapbook">
                <RealBook spreads={spreads} width={960} height={620} />
            </main>

            <footer className="scrapbook-footer">
                <small>Crafted with love for treasured memories.</small>
            </footer>
        </div>
    )
}
