export default function NotePage({ heading, body }) {
    const paragraphs = body
        ?.split(/\n{2,}/)
        .map(block => block.trim())
        .filter(Boolean) ?? []

    return (
        <div className="note-face">
            <div className="note-paper">
                {heading && <h2>{heading}</h2>}
                {paragraphs.map((block, index) => (
                    <p key={`note-block-${index}`}>
                        {block.split('\n').map((segment, lineIndex) => (
                            lineIndex === 0
                                ? segment
                                : (
                                    <span key={`note-line-${lineIndex}`}>
                                        <br />
                                        {segment}
                                    </span>
                                )
                        ))}
                    </p>
                ))}
            </div>
        </div>
    )
}
