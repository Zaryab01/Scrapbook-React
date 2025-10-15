export default function PolaroidPage({ photoSrc, caption }) {
    return (
        <div className="polaroid-face">
            <div className={`polaroid-frame ${photoSrc ? 'has-photo' : ''}`}>
                <div className="polaroid-photo">
                    {photoSrc ? (
                        <img src={photoSrc} alt={caption || 'Scrapbook memory'} loading="lazy" />
                    ) : (
                        <span className="polaroid-placeholder">Awaiting a keepsake from the gallery</span>
                    )}
                </div>
                {caption && <span className="polaroid-caption">{caption}</span>}
            </div>
        </div>
    )
}
