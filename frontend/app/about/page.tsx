import Link from "next/link";


export default function About() {

    return (
        <div className="flex flex-col gap-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-8 tracking-tight">
                The Vision behind <span className="text-rose-600">inspiringquotes.ch</span>
            </h1>
            <div className="flex flex-col gap-4">
                <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest">
                    Curated Wisdom for a Modern World
                </h2>
                <p>
                    In an age of digital noise, clarity is the ultimate luxury. inspiringquotes.ch is a digital refuge designed to offer perspective, foster personal growth, and provide a moment of stillness through the power of words.
                </p>
            </div>

            <div className="flex flex-col gap-4">
                <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest">
                    Our Mission
                </h2>
                <p>
                    We believe that the right words at the right time can change a life. Our mission is to collect and present insights that challenge your status quo and inspire new ways of thinking. Each quote is more than just text; it’s a gateway to a new perspective.
                </p>
            </div>

            <div className="flex flex-col gap-4">
                <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest">
                    Swiss-Quality Curation
                </h2>
                <div>
                    Quality over quantity is our guiding principle. Every entry on this platform is <span className="font-medium">handpicked by a</span> 
                    <span>{" "}</span>
                    <Link 
                    href="/authors/1"
                    title="Stefan Wohlgensinger"
                    className="text-green-500 font-bold hover:text-rose-600 transition-colors cursor-pointer underline-offset-4 hover:underline"
                    >
                        Swiss expert
                    </Link>
                    <span>{" "}</span>
                    with a <span className="font-medium">deep understanding of personal development and philosophical depth.</span> We don’t use algorithms to fill pages; we use human intuition to ensure that every quote you find here carries genuine weight.
                </div>
            </div>

            <div className="flex flex-col gap-4">
                <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest">
                    Beyond the Quote: Connect with Mentors
                </h2>
                <p>
                    A quote can be a spark, but growth often requires a guide. That is why we bridge the gap between inspiration and action. Our platform helps you discover the experts and mentors behind the wisdom - people who can support you in different stages of your life and professional journey.
                </p>
            </div>

            <div className="flex flex-col gap-4">
                <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest">
                    Share the Light
                </h2>
                <p>
                    Inspiration is one of the few things that doubles when you share it. We’ve made it simple for you to send a spark of joy or a moment of reflection to your friends and loved ones. Use our sharing features to express yourself and uplift others in your circle.
                </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-between mt-12 pt-8 border-t border-slate-100">
  
                {/* Primary CTA: Auffällig, führt zum Kern der App */}
                <Link 
                    href="/quotes" 
                    className="inline-flex items-center justify-center px-6 py-3 bg-slate-900 text-white font-medium rounded-xl hover:bg-rose-600 transition-all duration-300 shadow-sm active:scale-95"
                >
                    Explore the Collection
                </Link>

                {/* Secondary CTA: Dezenter, führt zu den Autoren/Experten */}
                <Link 
                    href="/authors" 
                    className="inline-flex items-center justify-center px-6 py-3 bg-white text-slate-700 font-medium rounded-xl border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 active:scale-95"
                >
                    Meet the Experts
                </Link>

            </div>
        </div>
    )
}