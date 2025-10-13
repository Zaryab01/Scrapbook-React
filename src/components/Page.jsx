export default function Page({ page, pageNumber, total }) {
    return (
        <div className="page">
            <div className="page-inner">
                <div className="page-shadow" />
                <div className="page-content">
                    {page.type === 'image' ? (
                        <img className="page-image" src={page.src} alt={page.title || `Page ${pageNumber}`} />
                    ) : (
                        <div className="page-text">
                            <h2>{page.title || `Page ${pageNumber}`}</h2>
                            <p>{page.content}</p>
                        </div>
                    )}
                </div>
                <div className="page-footer">
                    <span>{page.title ?? 'Untitled'}</span>
                    <span>{pageNumber} / {total}</span>
                </div>
            </div>
        </div>
    )
}
