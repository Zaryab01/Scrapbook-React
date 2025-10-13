import RealBook from './components/RealBook'
import './styles.css'

const PAGES = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    type: 'blank',
}))

export default function App() {
    return (
        <div className="app-shell">
            <div className="app-stage">
                <RealBook pages={PAGES} width={960} height={620} />
            </div>
        </div>
    )
}
