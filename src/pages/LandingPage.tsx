import React from 'react';
import {
    Library,
    Search,
    User,
    Menu,
    ChevronRight,
    Shield,
    Users,
    MessageCircle,
    ArrowRight,
    ArrowUpRight,
    Mail,
    Check,
    LayoutDashboard,
    PenTool,
    FolderOpen,
    Image as ImageIcon,
    Settings,
    Plus,
    MoreHorizontal,
    Twitter,
    Github,
    Instagram,
    Key
} from 'lucide-react';
import { ModeToggle } from '@/components/mode-toggle';
import { Link, useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-300 font-serif antialiased selection:bg-amber-100 dark:selection:bg-amber-900 selection:text-amber-900 dark:selection:text-amber-50 leading-relaxed min-h-screen transition-colors duration-500">

            {/* 
            ========================================
            GLOBAL STICKY HEADER
            ========================================
            */}
            <header className="sticky top-0 z-50 w-full border-b border-stone-300 dark:border-stone-800 bg-white/90 dark:bg-stone-950/90 backdrop-blur-md transition-colors duration-500">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

                    {/* Left: Logo */}
                    <div className="flex items-center gap-3">
                        <Link to="/" className="text-xl font-semibold tracking-tight text-amber-900 dark:text-amber-50 hover:text-amber-600 dark:hover:text-amber-500 transition-colors duration-300 font-serif">
                            SAHARA
                        </Link>
                    </div>

                    {/* Center: Navigation (Desktop) */}
                    <nav className="hidden md:flex items-center gap-8 font-mono text-xs tracking-widest uppercase text-stone-400">
                        <a href="#home" className="hover:text-amber-500 transition-colors decoration-amber-700 underline-offset-4 hover:underline">Home</a>
                        <a href="#resources" className="hover:text-amber-500 transition-colors decoration-amber-700 underline-offset-4 hover:underline">Resources</a>
                        <a href="#counselors" className="hover:text-amber-500 transition-colors decoration-amber-700 underline-offset-4 hover:underline">Counselors</a>
                        <a href="#community" className="hover:text-amber-500 transition-colors decoration-amber-700 underline-offset-4 hover:underline">Community</a>
                        <a href="#about" className="hover:text-amber-600 dark:hover:text-amber-500 transition-colors decoration-amber-700 underline-offset-4 hover:underline">About</a>
                    </nav>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-4">
                        {/* Search */}
                        <div className="hidden lg:flex items-center bg-stone-100 dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded-sm px-3 py-1.5 focus-within:border-amber-700 transition-colors group w-48">
                            <Search className="w-3.5 h-3.5 text-stone-500 group-focus-within:text-amber-600" />
                            <input type="text" placeholder="Search resources..." className="bg-transparent border-none text-xs font-mono text-stone-700 dark:text-stone-300 placeholder-stone-400 dark:placeholder-stone-600 focus:ring-0 w-full ml-2 outline-none h-full" />
                        </div>

                        {/* Theme Toggle */}
                        <ModeToggle />

                        {/* Auth / Profile */}
                        <div className="flex items-center gap-3">
                            <Link to="/auth/sign-in" className="hidden md:flex items-center gap-2 px-3 py-1.5 border border-amber-900/50 hover:border-amber-600 rounded-sm bg-amber-950/20 text-amber-500 hover:text-amber-400 font-mono text-xs transition-all uppercase tracking-wider">
                                <User className="w-3.5 h-3.5" />
                                <span>Member Access</span>
                            </Link>
                            {/* Mobile Menu Trigger */}
                            <button className="md:hidden text-stone-400 hover:text-amber-50">
                                <Menu className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Breadcrumb / Divider Line */}
                <div className="w-full border-b border-stone-300 dark:border-stone-800 flex items-center px-6 py-1 bg-stone-50 dark:bg-stone-900/50 transition-colors duration-500">
                    <span className="font-mono text-[10px] text-stone-500 uppercase tracking-widest flex items-center gap-2">
                        System <ChevronRight className="w-2.5 h-2.5" /> Online
                    </span>
                </div>
            </header>

            <main className="w-full min-h-screen">

                {/* 
                ========================================
                1. HOMEPAGE HERO
                ========================================
                */}
                <section id="home" className="relative py-24 px-6 border-b border-stone-300 dark:border-stone-800 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-stone-100 to-stone-200 dark:from-stone-900 dark:via-stone-950 dark:to-stone-950 transition-colors duration-500">
                    <div className="max-w-3xl mx-auto text-center space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-stone-300 dark:border-stone-800 bg-white/50 dark:bg-stone-900/50 text-amber-800 dark:text-amber-600 font-mono text-xs tracking-wider uppercase mb-4">
                            <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse"></span>
                            Est. 2024
                        </div>
                        <h1 className="text-5xl md:text-7xl font-serif font-medium text-amber-900 dark:text-amber-50 tracking-tight leading-[1.1]">
                            The Sanctuary <br /> <span className="text-stone-500 dark:text-stone-400 italic font-light">of Mind</span>
                        </h1>
                        <p className="text-lg md:text-xl text-stone-700 dark:text-stone-400 font-serif leading-relaxed max-w-2xl mx-auto">
                            A curated space for mental clarity. Anonymous support, professional guidance, and resources preserved for your well-being.
                        </p>
                        <div className="pt-8 flex justify-center gap-4">
                            <button onClick={() => navigate('/auth/sign-up')} className="px-6 py-3 bg-amber-700 hover:bg-amber-600 text-amber-50 font-mono text-xs uppercase tracking-widest rounded-sm transition-colors border border-amber-600 shadow-lg shadow-amber-900/20">
                                Begin Journey
                            </button>
                            <button onClick={() => navigate('/resources')} className="px-6 py-3 bg-white/50 dark:bg-transparent border border-stone-400 dark:border-stone-700 hover:border-amber-700 text-stone-800 dark:text-stone-300 hover:text-amber-800 dark:hover:text-amber-500 font-mono text-xs uppercase tracking-widest rounded-sm transition-colors">
                                Browse Library
                            </button>
                        </div>
                    </div>
                </section>

                {/* 
                ========================================
                2. FEATURED STRIP
                ========================================
                */}
                <section className="border-b border-stone-300 dark:border-stone-800 bg-white dark:bg-stone-900 transition-colors duration-500">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-stone-300 dark:divide-stone-800">

                        {/* Block 1 */}
                        <div className="group block p-8 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Shield className="w-16 h-16 text-stone-900 dark:text-stone-100" />
                            </div>
                            <span className="font-mono text-xs text-amber-700 tracking-widest uppercase mb-2 block">Protocol 01</span>
                            <h3 className="text-2xl font-serif text-stone-800 dark:text-stone-200 group-hover:text-amber-800 dark:group-hover:text-amber-50 mb-2">Anonymous Access</h3>
                            <p className="text-sm text-stone-600 dark:text-stone-500 font-serif italic">Your identity remains encrypted. Share freely without judgment.</p>
                        </div>

                        {/* Block 2 */}
                        <div className="group block p-8 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Users className="w-16 h-16 text-stone-900 dark:text-stone-100" />
                            </div>
                            <span className="font-mono text-xs text-amber-700 tracking-widest uppercase mb-2 block">Protocol 02</span>
                            <h3 className="text-2xl font-serif text-stone-800 dark:text-stone-200 group-hover:text-amber-800 dark:group-hover:text-amber-50 mb-2">Expert Counsel</h3>
                            <p className="text-sm text-stone-600 dark:text-stone-500 font-serif italic">Verified professionals dedicated to your guidance.</p>
                        </div>

                        {/* Block 3 */}
                        <div className="group block p-8 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <MessageCircle className="w-16 h-16 text-stone-900 dark:text-stone-100" />
                            </div>
                            <span className="font-mono text-xs text-amber-700 tracking-widest uppercase mb-2 block">Protocol 03</span>
                            <h3 className="text-2xl font-serif text-stone-800 dark:text-stone-200 group-hover:text-amber-800 dark:group-hover:text-amber-50 mb-2">Open Dialogue</h3>
                            <p className="text-sm text-stone-600 dark:text-stone-500 font-serif italic">24/7 peer support and crisis intervention resources.</p>
                        </div>

                    </div>
                </section>

                {/* 
                ========================================
                3. LATEST POSTS GRID (ADAPTED TO RESOURCES/ARTICLES)
                ========================================
                */}
                <section id="resources" className="py-20 px-6 max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-12 border-b border-stone-300 dark:border-stone-800 pb-4">
                        <h2 className="text-3xl font-serif text-amber-900 dark:text-amber-50 tracking-tight">Recent Manuscripts</h2>
                        <a href="#" className="font-mono text-xs text-amber-600 hover:text-amber-500 uppercase tracking-widest flex items-center gap-1">
                            View Full Index <ArrowRight className="w-3 h-3" />
                        </a>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                        {/* Card 1 */}
                        <article className="flex flex-col group cursor-pointer">
                            <div className="relative overflow-hidden aspect-[4/3] rounded-sm border border-stone-800 mb-4 bg-stone-900">
                                <div className="absolute inset-0 bg-stone-900/20 z-10 group-hover:bg-transparent transition-colors duration-500"></div>
                                <img src="/architecture_of_silence_1768875309201.png" alt="Architecture of Silence" className="w-full h-full object-cover sepia-[.1] opacity-90 group-hover:scale-105 transition-transform duration-700 ease-out" />
                            </div>
                            <div className="flex items-center gap-3 text-xs font-mono text-stone-500 mb-2">
                                <span className="text-amber-700">Oct 12, 2024</span>
                                <span>//</span>
                                <span>Anxiety</span>
                            </div>
                            <h3 className="text-xl font-serif text-stone-200 group-hover:text-amber-50 leading-snug mb-2 transition-colors">
                                The Architecture of Silence
                            </h3>
                            <p className="text-stone-500 text-sm line-clamp-2 mb-3">
                                Exploring how physical spaces influence the quietude of the mind, and finding peace in chaos.
                            </p>
                            <span className="inline-flex items-center text-xs font-mono text-amber-700 hover:text-amber-500 uppercase tracking-wider mt-auto">
                                Read Entry <ArrowUpRight className="ml-1 w-3 h-3" />
                            </span>
                        </article>

                        {/* Card 2 */}
                        <article className="flex flex-col group cursor-pointer">
                            <div className="relative overflow-hidden aspect-[4/3] rounded-sm border border-stone-800 mb-4 bg-stone-900">
                                <div className="absolute inset-0 bg-stone-900/20 z-10 group-hover:bg-transparent transition-colors duration-500"></div>
                                <img src="/old_machinery_tactile_1768875338093.png" alt="Antique Typewriter" className="w-full h-full object-cover sepia-[.2] opacity-90 group-hover:scale-105 transition-transform duration-700 ease-out" />
                            </div>
                            <div className="flex items-center gap-3 text-xs font-mono text-stone-500 mb-2">
                                <span className="text-amber-700">Oct 08, 2024</span>
                                <span>//</span>
                                <span>Study</span>
                            </div>
                            <h3 className="text-xl font-serif text-stone-200 group-hover:text-amber-50 leading-snug mb-2 transition-colors">
                                Managing Academic Pressure
                            </h3>
                            <p className="text-stone-500 text-sm line-clamp-2 mb-3">
                                Why the tactile feedback of old machinery still captivates us in an era of touchscreens and voice commands.
                            </p>
                            <span className="inline-flex items-center text-xs font-mono text-amber-700 hover:text-amber-500 uppercase tracking-wider mt-auto">
                                Read Entry <ArrowUpRight className="ml-1 w-3 h-3" />
                            </span>
                        </article>

                        {/* Card 3 */}
                        <article className="flex flex-col group cursor-pointer">
                            <div className="relative overflow-hidden aspect-[4/3] rounded-sm border border-stone-800 mb-4 bg-stone-900">
                                <div className="absolute inset-0 bg-stone-900/20 z-10 group-hover:bg-transparent transition-colors duration-500"></div>
                                <img src="/misty_isles_nature_1768875361148.png" alt="Misty Highlands" className="w-full h-full object-cover sepia-[.1] opacity-90 group-hover:scale-105 transition-transform duration-700 ease-out" />
                            </div>
                            <div className="flex items-center gap-3 text-xs font-mono text-stone-500 mb-2">
                                <span className="text-amber-700">Sep 29, 2024</span>
                                <span>//</span>
                                <span>Wellness</span>
                            </div>
                            <h3 className="text-xl font-serif text-stone-200 group-hover:text-amber-50 leading-snug mb-2 transition-colors">
                                Notes from the Misty Isles
                            </h3>
                            <p className="text-stone-500 text-sm line-clamp-2 mb-3">
                                A week spent wandering through the northern highlands, chasing fog and the smell of peat fires.
                            </p>
                            <span className="inline-flex items-center text-xs font-mono text-amber-700 hover:text-amber-500 uppercase tracking-wider mt-auto">
                                Read Entry <ArrowUpRight className="ml-1 w-3 h-3" />
                            </span>
                        </article>
                    </div>
                </section>

                {/* 
                ========================================
                5. NEWSLETTER ("THE LEDGER")
                ========================================
                */}
                <section className="py-16 px-6 border-b border-stone-300 dark:border-stone-800 bg-stone-100 dark:bg-stone-900 relative">
                    {/* Texture overlay with mix-blend-mode for adaptability */}
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-30 mix-blend-multiply dark:mix-blend-soft-light pointer-events-none"></div>

                    <div className="max-w-2xl mx-auto border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-1 relative z-10 transition-colors duration-500">
                        <div className="border border-stone-200 dark:border-stone-800 p-8 flex flex-col items-center text-center">
                            <Mail className="text-amber-700 mb-4 w-8 h-8" />
                            <h3 className="text-2xl font-serif text-amber-900 dark:text-amber-50 mb-2">The Weekly Ledger</h3>
                            <p className="text-stone-600 dark:text-stone-500 mb-6 text-sm">Receive a curated summary of new resources, thoughts, and discoveries delivered via electronic mail.</p>
                            <form className="w-full max-w-sm flex gap-2" onSubmit={(e) => e.preventDefault()}>
                                <input type="email" placeholder="email@address.com" className="flex-1 bg-white dark:bg-stone-950 border border-stone-400 dark:border-stone-800 p-2 text-stone-900 dark:text-stone-300 placeholder-stone-500 dark:placeholder-stone-700 focus:border-amber-700 focus:outline-none font-mono text-xs shadow-inner" />
                                <button className="bg-amber-800 text-amber-100 px-4 py-2 font-mono text-xs uppercase tracking-wider hover:bg-amber-700 transition-colors">Subscribe</button>
                            </form>
                            <p className="text-[10px] font-mono text-stone-600 mt-4 uppercase tracking-widest">No spam. Only essential data.</p>
                        </div>
                    </div>
                </section>

                {/* 
                ========================================
                7. DASHBOARD PREVIEW (ADMIN/STUDENT)
                ========================================
                */}
                <section className="bg-stone-100 dark:bg-stone-950 py-20 px-6 border-t border-stone-200 dark:border-stone-800 transition-colors duration-500">
                    <div className="max-w-7xl mx-auto">
                        <div className="mb-8">
                            <h2 className="text-2xl font-serif text-amber-900 dark:text-amber-50">Student Dashboard</h2>
                            <p className="text-stone-500 font-mono text-xs mt-1 uppercase tracking-widest">Preview Mode // Confidential</p>
                        </div>

                        <div className="flex flex-col lg:flex-row border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 min-h-[500px] rounded-sm overflow-hidden opacity-90 hover:opacity-100 transition-all duration-500 shadow-xl shadow-stone-900/5 dark:shadow-none">

                            {/* Sidebar Mockup */}
                            <aside className="w-full lg:w-64 bg-stone-950 border-b lg:border-b-0 lg:border-r border-stone-800 p-4 flex flex-col gap-1">
                                <div className="flex items-center gap-3 px-3 py-2 bg-stone-900 text-amber-500 border-l-2 border-amber-600 font-mono text-xs uppercase tracking-wider">
                                    <LayoutDashboard className="w-4 h-4" /> Dashboard
                                </div>
                                <div className="flex items-center gap-3 px-3 py-2 text-stone-400 hover:bg-stone-900 hover:text-stone-200 transition-colors font-mono text-xs uppercase tracking-wider">
                                    <MessageCircle className="w-4 h-4" /> Chats
                                </div>
                                <div className="flex items-center gap-3 px-3 py-2 text-stone-400 hover:bg-stone-900 hover:text-stone-200 transition-colors font-mono text-xs uppercase tracking-wider">
                                    <PenTool className="w-4 h-4" /> Journals
                                </div>
                                <div className="flex items-center gap-3 px-3 py-2 text-stone-400 hover:bg-stone-900 hover:text-stone-200 transition-colors font-mono text-xs uppercase tracking-wider mt-auto">
                                    <Settings className="w-4 h-4" /> Settings
                                </div>
                            </aside>

                            {/* Main Area Mockup */}
                            <div className="flex-1 p-6 overflow-x-auto">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="font-serif text-xl text-stone-200">Active Sessions</h3>
                                    <button className="bg-amber-800 hover:bg-amber-700 text-white px-4 py-2 text-xs font-mono uppercase tracking-wider rounded-sm flex items-center gap-2">
                                        <Plus className="w-3 h-3" /> New Chat
                                    </button>
                                </div>

                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-stone-800 text-stone-500 font-mono text-[10px] uppercase tracking-widest">
                                            <th className="py-3 px-2 font-normal">ID</th>
                                            <th className="py-3 px-2 font-normal">Counselor</th>
                                            <th className="py-3 px-2 font-normal">Topic</th>
                                            <th className="py-3 px-2 font-normal">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm font-serif text-stone-300 divide-y divide-stone-800">
                                        <tr className="hover:bg-stone-950/50 transition-colors">
                                            <td className="py-3 px-2 font-mono text-xs text-stone-500">#0492</td>
                                            <td className="py-3 px-2 text-amber-50">Dr. Sarah J.</td>
                                            <td className="py-3 px-2">Academic Stress</td>
                                            <td className="py-3 px-2"><span className="text-green-600 bg-green-900/20 px-2 py-0.5 text-[10px] font-mono uppercase rounded-sm border border-green-900/30">Active</span></td>
                                        </tr>
                                        <tr className="hover:bg-stone-950/50 transition-colors">
                                            <td className="py-3 px-2 font-mono text-xs text-stone-500">#0491</td>
                                            <td className="py-3 px-2 text-amber-50">Peer Support</td>
                                            <td className="py-3 px-2">General Anxiety</td>
                                            <td className="py-3 px-2"><span className="text-stone-400 bg-stone-800 px-2 py-0.5 text-[10px] font-mono uppercase rounded-sm border border-stone-700">Closed</span></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="mt-8 text-center">
                            <p className="text-sm text-stone-500 italic font-serif">"The first step is the hardest, but the most important."</p>
                        </div>
                    </div>
                </section>

                {/* 
                ========================================
                9. LOGIN MODAL (STATIC/Teaser)
                ========================================
                */}
                <section className="py-20 flex justify-center items-center bg-stone-950/80 backdrop-blur-sm border-t border-stone-800">
                    <div className="w-full max-w-md bg-stone-900 border border-stone-800 p-8 shadow-2xl relative">
                        {/* Decorative corners */}
                        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-amber-700"></div>
                        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-amber-700"></div>
                        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-amber-700"></div>
                        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-amber-700"></div>

                        <div className="text-center mb-8">
                            <Key className="mx-auto text-amber-600 mb-4 w-6 h-6" />
                            <h2 className="text-2xl font-serif text-amber-50">Secure Access</h2>
                            <p className="text-xs font-mono text-stone-500 mt-2 uppercase tracking-widest">Sahara Members Only</p>
                        </div>

                        <div className="space-y-4">
                            <button onClick={() => navigate('/auth/sign-in')} className="w-full bg-amber-800 hover:bg-amber-700 text-amber-50 py-3 font-mono text-xs uppercase tracking-widest transition-colors rounded-sm shadow-lg">
                                Enter Portal
                            </button>
                            <button onClick={() => navigate('/auth/sign-up')} className="w-full bg-transparent border border-stone-700 hover:border-amber-700 text-stone-300 hover:text-amber-500 py-3 font-mono text-xs uppercase tracking-widest transition-colors rounded-sm">
                                Register New Key
                            </button>
                        </div>
                    </div>
                </section>

            </main>

            {/* 
            ========================================
            FOOTER
            ========================================
            */}
            <footer className="bg-stone-100 dark:bg-stone-950 border-t border-stone-200 dark:border-stone-800 pt-16 pb-8 text-stone-500 transition-colors duration-500">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2 mb-4 text-amber-900 dark:text-amber-50">
                            <Library className="w-5 h-5" />
                            <span className="font-bold font-serif text-xl tracking-tight">SAHARA</span>
                        </div>
                        <p className="font-serif text-sm leading-relaxed max-w-sm mb-6 text-stone-400">
                            A digital repository dedicated to the preservation of mental well-being. Confidential, accessible, and safe. Est. 2024.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="text-stone-500 hover:text-amber-600 transition-colors"><Twitter className="w-4 h-4" /></a>
                            <a href="#" className="text-stone-500 hover:text-amber-600 transition-colors"><Github className="w-4 h-4" /></a>
                            <a href="#" className="text-stone-500 hover:text-amber-600 transition-colors"><Instagram className="w-4 h-4" /></a>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-mono text-xs uppercase tracking-widest text-stone-400 dark:text-stone-300 mb-4">Sitemap</h4>
                        <ul className="space-y-2 font-serif text-sm">
                            <li><a href="#" className="hover:text-amber-600 transition-colors">Home Index</a></li>
                            <li><a href="#" className="hover:text-amber-600 transition-colors">Resources</a></li>
                            <li><a href="#" className="hover:text-amber-600 transition-colors">Counselors</a></li>
                            <li><a href="#" className="hover:text-amber-600 transition-colors">Emergency</a></li>
                            <li><a href="#" className="hover:text-amber-600 transition-colors">About</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-mono text-xs uppercase tracking-widest text-stone-400 dark:text-stone-300 mb-4">Legal & Meta</h4>
                        <ul className="space-y-2 font-serif text-sm">
                            <li><a href="#" className="hover:text-amber-600 transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-amber-600 transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-amber-600 transition-colors">Colophon</a></li>
                            <li><a href="#" className="hover:text-amber-600 transition-colors">RSS Feed</a></li>
                        </ul>
                    </div>

                </div>

                <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-stone-200 dark:border-stone-900 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-mono uppercase tracking-widest">
                    <span>© 2024 Sahara Project. All rights reserved.</span>
                    <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-900 border border-green-700"></span>
                        System Operational
                    </span>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
