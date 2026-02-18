import Calculator from "../components/calculator/Calculator";

export default function Home() {
    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Rental Profitability Calculator</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">Analyze cashflow, partner returns, and long-term equity.</p>
                    </div>
                    <div className="flex gap-3">
                        {/* Future: Save/Export buttons */}
                    </div>
                </header>

                <Calculator />
            </div>
        </main>
    );
}
