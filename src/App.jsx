import RealBook from './components/RealBook'
import './styles.css'

const PAGES = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    type: 'blank',
    title: `Page ${i + 1}`,
}))

export default function App() {
    return (
        <div className="app">
            <header className="topbar"><h1>3D Scrapbook</h1></header>
            <div className="stage">
                <RealBook pages={PAGES} width={980} height={640}/>
            </div>
        </div>
    )
}
