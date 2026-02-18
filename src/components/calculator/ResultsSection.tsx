
"use client";
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { AnnualResult } from "../../lib/calculations";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ResultsSectionProps {
    results: AnnualResult[];
}

export const ResultsSection: React.FC<ResultsSectionProps> = ({ results }) => {
    const currentYear = results[0]; // Year 1 preview

    const formatCurrency = (val: number) => new Intl.NumberFormat('fr-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(val);
    const formatPercent = (val: number) => new Intl.NumberFormat('fr-CA', { style: 'percent', minimumFractionDigits: 1 }).format(val / 100);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* High Level Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                    title="RNE (Année 1)"
                    value={currentYear.noi}
                    formatter={formatCurrency}
                    className="bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-blue-900/20"
                    trendLabel="Revenu Net d'Exploitation"
                />
                <MetricCard
                    title="Cashflow (Année 1)"
                    value={currentYear.cashflow}
                    formatter={formatCurrency}
                    className={`bg-gradient-to-br ${currentYear.cashflow < 0 ? 'from-red-500 to-red-600 shadow-red-200' : 'from-emerald-500 to-emerald-600 shadow-emerald-200'} text-white shadow-lg dark:shadow-none`}
                    trendLabel="Profit Net Annuel"
                />
                <MetricCard
                    title="ROI Partenaire"
                    value={currentYear.partnerTotalRoi}
                    formatter={formatPercent}
                    className="bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20"
                    trendLabel="Retour sur Investissement Total"
                />
                <MetricCard
                    title="Bénéfice Gestionnaire"
                    value={currentYear.totalManagerBenefit}
                    formatter={formatCurrency}
                    className="bg-gradient-to-br from-fuchsia-500 to-pink-600 text-white shadow-lg shadow-fuchsia-200 dark:shadow-fuchsia-900/20"
                    trendLabel="Valeur Totale Créée"
                />
            </div>

            <Tabs defaultValue="charts" className="w-full">
                <div className="flex justify-center mb-6">
                    <TabsList className="grid w-[400px] grid-cols-2 bg-slate-100 dark:bg-slate-800 p-1">
                        <TabsTrigger value="charts" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-slate-900 dark:data-[state=active]:text-white data-[state=active]:shadow-sm transition-all">
                            Analyse Visuelle
                        </TabsTrigger>
                        <TabsTrigger value="table" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-slate-900 dark:data-[state=active]:text-white data-[state=active]:shadow-sm transition-all">
                            Données Détaillées
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="charts" className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
                    <Card className="border-none shadow-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm ring-1 ring-slate-200 dark:ring-slate-700">
                        <CardHeader>
                            <CardTitle className="text-xl text-slate-800 dark:text-slate-100">Projection du Cashflow</CardTitle>
                            <CardDescription>Prévision sur 5 ans basée sur les hypothèses de croissance</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[350px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={results} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                                    <XAxis
                                        dataKey="year"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#64748b' }}
                                        tickFormatter={(value) => `Année ${value}`}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#64748b' }}
                                        tickFormatter={(value) => `$${value / 1000}k`}
                                    />
                                    <Tooltip
                                        cursor={{ fill: 'transparent' }}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                        formatter={(value: number) => [formatCurrency(value), '']}
                                    />
                                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                    <Bar dataKey="cashflow" name="Cashflow Total" fill="#10b981" radius={[4, 4, 0, 0]} animationDuration={1500} />
                                    <Bar dataKey="partnerCashflow" name="Part du Partenaire" fill="#3b82f6" radius={[4, 4, 0, 0]} animationDuration={1500} />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm ring-1 ring-slate-200 dark:ring-slate-700">
                        <CardHeader>
                            <CardTitle className="text-xl text-slate-800 dark:text-slate-100">Composition des Retours Partenaire</CardTitle>
                            <CardDescription>Comprendre la source du ROI</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[350px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={results} stackOffset="sign" margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                                    <XAxis
                                        dataKey="year"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#64748b' }}
                                        tickFormatter={(value) => `Année ${value}`}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#64748b' }}
                                        tickFormatter={(value) => `$${value / 1000}k`}
                                    />
                                    <Tooltip
                                        cursor={{ fill: 'transparent' }}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                        formatter={(value: number) => [formatCurrency(value), '']}
                                    />
                                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                    <Bar dataKey="partnerCashflow" name="Cashflow" stackId="a" fill="#10b981" animationDuration={1500} />
                                    <Bar dataKey="partnerPrincipalPaydown" name="Remboursement Capital" stackId="a" fill="#6366f1" animationDuration={1500} />
                                    <Bar dataKey="partnerAppreciation" name="Appréciation" stackId="a" fill="#8b5cf6" radius={[4, 4, 0, 0]} animationDuration={1500} />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="table" className="animate-in fade-in zoom-in-95 duration-500">
                    <Card className="border-none shadow-xl overflow-hidden ring-1 ring-slate-200 dark:ring-slate-700">
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-slate-500 uppercase bg-slate-50/80 dark:bg-slate-800/80 backdrop-blur-sm border-b">
                                        <tr>
                                            <th className="px-6 py-4 font-semibold">Année</th>
                                            <th className="px-6 py-4 font-semibold">Revenus</th>
                                            <th className="px-6 py-4 font-semibold">Dépenses</th>
                                            <th className="px-6 py-4 font-semibold">RNE</th>
                                            <th className="px-6 py-4 font-semibold">Service de la Dette</th>
                                            <th className="px-6 py-4 font-semibold">Cashflow</th>
                                            <th className="px-6 py-4 font-semibold bg-blue-50/50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300">ROI Partenaire</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {results.map((r, i) => (
                                            <tr key={r.year} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                                <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-200">{r.year}</td>
                                                <td className="px-6 py-4 text-emerald-600 font-medium">{formatCurrency(r.revenue)}</td>
                                                <td className="px-6 py-4 text-rose-500">{formatCurrency(r.expenses)}</td>
                                                <td className="px-6 py-4 font-bold text-slate-700 dark:text-slate-300">{formatCurrency(r.noi)}</td>
                                                <td className="px-6 py-4 text-slate-500">{formatCurrency(r.mortgagePayment)}</td>
                                                <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{formatCurrency(r.cashflow)}</td>
                                                <td className="px-6 py-4 bg-blue-50/30 dark:bg-blue-900/10 font-bold text-blue-600 dark:text-blue-400">{formatPercent(r.partnerTotalRoi)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

// Animated Number Component Helper
function useAnimatedNumber(target: number, duration: number = 1000) {
    const [display, setDisplay] = React.useState(0);

    React.useEffect(() => {
        let startTimestamp: number | null = null;
        const startValue = display;

        const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);

            // Ease out quart
            const ease = 1 - Math.pow(1 - progress, 4);

            setDisplay(startValue + (target - startValue) * ease);

            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                setDisplay(target);
            }
        };

        window.requestAnimationFrame(step);
    }, [target]);

    return display;
}

const MetricCard = ({ title, value, formatter, className, trendLabel }: { title: string, value: number, formatter: (v: number) => string, className?: string, trendLabel?: string }) => {
    const animatedValue = useAnimatedNumber(value);

    return (
        <Card className={`border-none ring-1 ring-black/5 transform transition-all duration-300 hover:-translate-y-1 ${className}`}>
            <CardHeader className="pb-2">
                <CardDescription className="text-white/80 font-medium">{title}</CardDescription>
                <CardTitle className="text-3xl font-bold tracking-tight">
                    {formatter(animatedValue)}
                </CardTitle>
                {trendLabel && <p className="text-xs text-white/60 mt-1">{trendLabel}</p>}
            </CardHeader>
        </Card>
    );
};
