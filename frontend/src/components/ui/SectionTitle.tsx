export default function SectionTitle({
    title,
    subtitle,
}: {
    title: string;
    subtitle?: string;
}) {
    return (
        <div className="mb-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-blue-800">
                {title}
            </h2>
            {subtitle && (
                <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
                    {subtitle}
                </p>
            )}
        </div>
    );
}
