export default function Features() {
    return (
<section className="max-w-5xl mx-auto px-6 pb-28">
        <div className="grid md:grid-cols-3 gap-10">

          <Feature
            title="AI-powered translations"
            desc="Lingo.dev handles high-quality, automatic translations for all supported languages."
          />

          <Feature
            title="Human review workflow"
            desc="Use our dashboard to edit, refine, and approve translations using a clean interface."
          />

          <Feature
            title="One-click retranslation"
            desc="Fix wording or update tone instantly with our integrated SDK-based retranslation."
          />

          <Feature
            title="Version control automation"
            desc="Changes sync directly with GitHub using auto-PRs powered by Lingo.dev CLI."
          />

          <Feature
            title="Add languages anytime"
            desc="Enable new target languages and automatically generate fresh translations."
          />

          <Feature
            title="Clean developer experience"
            desc="Built with Next.js, server components, and a fully automated i18n pipeline."
          />
        </div>
      </section>
    );
}

function Feature({
    title,
    desc,
}: {
    title: string;
    desc: string;
}) {
    return (
        <div className="p-6 border border-gray-200 rounded-xl hover:shadow-sm transition">
            <h4 className="text-xl font-semibold mb-2">{title}</h4>
            <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
        </div>
    );
}
