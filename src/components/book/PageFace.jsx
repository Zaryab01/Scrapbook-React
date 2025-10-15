import NotePage from '../pages/NotePage'
import PolaroidPage from '../pages/PolaroidPage'
import StoryPage from '../pages/StoryPage'

export default function PageFace({ page, side }) {
    if (!page) {
        return <div className={`face blank blank-${side}`} />
    }

    switch (page.type) {
    case 'blank':
        return <div className={`face blank blank-${side}`} />
    case 'cover-inner':
        return (
            <div className={`face inner-cover inner-cover-${side}`}>
                <div className="inner-cover-pattern" />
            </div>
        )
    case 'note':
        return <NotePage heading={page.heading} body={page.body} />
    case 'story':
        return <StoryPage title={page.title} subtitle={page.subtitle} body={page.body} footer={page.footer} />
    case 'polaroid':
        return <PolaroidPage photoSrc={page.photoSrc} caption={page.caption} />
    default:
        return <div className={`face blank blank-${side}`} />
    }
}
