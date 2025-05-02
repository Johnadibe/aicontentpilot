export default function JobDetailsPage({ params }: { params: { slug: string } }) {
    return (
        <div className="container mx-auto py-24 px-4">
            <div className="max-w-3xl mx-auto text-center space-y-8">
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                    {params.slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </h1>

                <div className="p-12 rounded-xl bg-muted/50 flex items-center justify-center">
                    <p className="text-xl text-muted-foreground">Job details will be posted soon</p>
                </div>

                <a
                    href="/careers"
                    className="inline-block text-primary hover:underline"
                >
                    ← Back to all positions
                </a>
            </div>
        </div>
    );
}