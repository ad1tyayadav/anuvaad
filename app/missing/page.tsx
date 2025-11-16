import { getMissingSummary } from "../lib/missing-keys";

export default function MissingPage() {
    const summary = getMissingSummary();

    const { missingInEn, unusedInCode, missingByLocale } = summary;

    return (
        <div className="max-w-4xl mx-auto p-10 space-y-10">
            <h1 className="text-3xl font-bold mb-4">Missing Keys Report</h1>
            <p className="text-gray-600">
                This report compares keys used in your code with keys defined in
                <code className="mx-1 px-1 py-0.5 bg-gray-100 rounded text-xs">
                    locales/en.json
                </code>
                and all other locale files.
            </p>

            {/* 1. Used in code but missing in en.json */}
            <section className="space-y-3">
                <h2 className="text-xl font-semibold">
                    Keys used in code but missing in en.json
                </h2>
                {missingInEn.length === 0 ? (
                    <p className="text-sm text-green-600">
                        ✅ All used keys exist in en.json.
                    </p>
                ) : (
                    <ul className="text-sm bg-red-50 border border-red-200 rounded p-3 space-y-1">
                        {missingInEn.map((key) => (
                            <li key={key} className="font-mono">
                                {key}
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            {/* 2. Defined in en.json but never used */}
            <section className="space-y-3">
                <h2 className="text-xl font-semibold">
                    Keys defined in en.json but never used in code
                </h2>
                {unusedInCode.length === 0 ? (
                    <p className="text-sm text-green-600">
                        ✅ No unused keys in en.json.
                    </p>
                ) : (
                    <ul className="text-sm bg-yellow-50 border border-yellow-200 rounded p-3 space-y-1 max-h-60 overflow-auto">
                        {unusedInCode.map((key) => (
                            <li key={key} className="font-mono">
                                {key}
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            {/* 3. Missing translations per locale */}
            <section className="space-y-4">
                <h2 className="text-xl font-semibold">Missing translations by locale</h2>

                {Object.keys(missingByLocale).length === 0 && (
                    <p className="text-sm text-green-600">
                        ✅ No target locales found or all translations are complete.
                    </p>
                )}

                {Object.entries(missingByLocale).map(([locale, keys]) => (
                    <div key={locale} className="space-y-2">
                        <h3 className="text-lg font-medium">
                            {locale.toUpperCase()}{" "}
                            <span className="text-sm text-gray-500">
                                ({keys.length} missing)
                            </span>
                        </h3>

                        {keys.length === 0 ? (
                            <p className="text-sm text-green-600">
                                ✅ All keys translated for this locale.
                            </p>
                        ) : (
                            <ul className="text-sm bg-blue-50 border border-blue-200 rounded p-3 space-y-1 max-h-60 overflow-auto">
                                {keys.map((key) => (
                                    <li key={key} className="font-mono">
                                        {key}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                ))}
            </section>
        </div>
    );
}
