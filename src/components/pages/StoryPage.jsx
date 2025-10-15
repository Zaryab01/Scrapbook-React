export default function StoryPage({ title, subtitle, body, footer }) {
    const paragraphs = body
        ?.split(/\n{2,}/)
        .map(block => block.trim())
        .filter(Boolean) ?? []

    return (
        <div className="story-face">
            <div className="story-overlay" aria-hidden="true" />
            <article className="story-content">
                {title && <h2>{title}</h2>}
                {subtitle && <p className="story-subtitle">{subtitle}</p>}
                {paragraphs.map((paragraph, index) => (
                    <p key={`story-paragraph-${index}`}>{paragraph}</p>
                ))}
                {footer && <footer className="story-footer">{footer}</footer>}
            </article>
        </div>
    )
}
