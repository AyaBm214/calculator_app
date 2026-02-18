
"use client";
import React, { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Slider } from "../ui/slider";
import { PropertyData } from "../../lib/calculations";

interface InputSectionProps {
    data: PropertyData;
    onChange: (data: PropertyData) => void;
}

export const InputSection: React.FC<InputSectionProps> = ({ data, onChange }) => {
    const handleChange = (field: keyof PropertyData, value: any) => {
        onChange({ ...data, [field]: value });
    };

    const cardClass = "border-none shadow-md bg-white/50 dark:bg-slate-900/80 backdrop-blur-sm ring-1 ring-slate-200 dark:ring-slate-700 transition-all hover:shadow-lg duration-300";
    const labelClass = "text-slate-700 dark:text-slate-200 font-medium";

    // 1. Calculate Total Revenue
    const totalRevenue = useMemo(() => {
        const r1 = data.revLowWeekendPrice * data.revLowWeekendCount;
        const r2 = data.revLowWeekPrice * data.revLowWeekCount;
        const r3 = data.revHighWeekendPrice * data.revHighWeekendCount;
        const r4 = data.revHighWeekPrice * data.revHighWeekCount;
        return r1 + r2 + r3 + r4;
    }, [data.revLowWeekendPrice, data.revLowWeekendCount, data.revLowWeekPrice, data.revLowWeekCount, data.revHighWeekendPrice, data.revHighWeekendCount, data.revHighWeekPrice, data.revHighWeekCount]);

    // 2. Calculate Total Expenses (Annual)
    const totalExpenses = useMemo(() => {
        const annualCondoFees = data.condoFees * 12;

        // Fixed Sum
        const fixed =
            data.taxMunicipal + data.taxSchool + data.taxWater + data.insurance +
            data.electricity + data.heating + data.wood + data.waterHeating +
            data.cableInternet + data.snowRemoval + data.lawnCare + data.citq +
            data.waste + data.poolSpa + data.exterminator + data.applianceRepair +
            annualCondoFees + data.fiddlerLakeFees + data.accounting + data.advertising;

        // Variable
        const bookings = data.revLowWeekendCount + data.revLowWeekCount + data.revHighWeekendCount + data.revHighWeekCount;
        const cleaning = data.cleaningCostPerStay * bookings;

        // % based fees
        const gross = totalRevenue;
        const mgmt = gross * (data.managementRate / 100);
        const maint = gross * (data.maintenanceRate / 100);
        const misc = gross * (data.miscellaneousRate / 100);

        return fixed + cleaning + mgmt + maint + misc;
    }, [data, totalRevenue]);

    const formatCurrency = (val: number) => new Intl.NumberFormat('fr-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(val);


    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-700">

            {/* Header Info */}
            <Card className={cardClass}>
                <CardHeader>
                    <CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        <span>📍</span> Infos Propriété
                    </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className={labelClass}>Date</Label>
                        <Input type="date" value={data.date} onChange={(e) => handleChange('date', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label className={labelClass}># MLS</Label>
                        <Input value={data.mlsNumber} onChange={(e) => handleChange('mlsNumber', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label className={labelClass}>Adresse</Label>
                        <Input value={data.address} onChange={(e) => handleChange('address', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label className={labelClass}>Ville</Label>
                        <Input value={data.city} onChange={(e) => handleChange('city', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label className={labelClass}>Cadastre</Label>
                        <Input value={data.cadastre} onChange={(e) => handleChange('cadastre', e.target.value)} />
                    </div>
                </CardContent>
            </Card>

            {/* Revenues */}
            <Card className={cardClass}>
                <CardHeader>
                    <CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        <span>📈</span> Revenus (Location Court Terme)
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-6 gap-2 text-sm font-semibold text-slate-500 mb-2">
                        <div className="col-span-3">Type</div>
                        <div className="col-span-2">Prix ($)</div>
                        <div className="col-span-1">Nb.</div>
                    </div>

                    <RevenueRow label="Fin de semaine basse saison"
                        price={data.revLowWeekendPrice} count={data.revLowWeekendCount}
                        onPriceChange={(v) => handleChange('revLowWeekendPrice', v)}
                        onCountChange={(v) => handleChange('revLowWeekendCount', v)} />

                    <RevenueRow label="Semaine basse saison"
                        price={data.revLowWeekPrice} count={data.revLowWeekCount}
                        onPriceChange={(v) => handleChange('revLowWeekPrice', v)}
                        onCountChange={(v) => handleChange('revLowWeekCount', v)} />

                    <RevenueRow label="Fin de semaine haute saison"
                        price={data.revHighWeekendPrice} count={data.revHighWeekendCount}
                        onPriceChange={(v) => handleChange('revHighWeekendPrice', v)}
                        onCountChange={(v) => handleChange('revHighWeekendCount', v)} />

                    <RevenueRow label="Semaine haute saison"
                        price={data.revHighWeekPrice} count={data.revHighWeekCount}
                        onPriceChange={(v) => handleChange('revHighWeekPrice', v)}
                        onCountChange={(v) => handleChange('revHighWeekCount', v)} />

                    <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
                        <div className="flex items-center justify-between mt-4 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-100 dark:border-emerald-800">
                            <Label className="text-emerald-700 dark:text-emerald-300 font-bold text-lg">Revenu Brut Total</Label>
                            <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(totalRevenue)}</span>
                        </div>
                    </div>
                    <div className="pt-2">
                        <div className="flex items-center justify-between">
                            <Label className={labelClass}>Mauvaise créance (%)</Label>
                            <Input className="w-24" type="number" value={data.badDebtPercent} onChange={(e) => handleChange('badDebtPercent', Number(e.target.value))} />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Expenses */}
            <Card className={cardClass}>
                <CardHeader>
                    <CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        <span>💸</span> Dépenses (Exploitation)
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-12 gap-2 text-sm font-semibold text-slate-500 mb-2">
                        <div className="col-span-6 md:col-span-5">Item</div>
                        <div className="hidden md:block col-span-3 text-center text-xs">Guide</div>
                        <div className="col-span-6 md:col-span-4 text-right">Montant</div>
                    </div>

                    <ExpenseRow label="Taxes municipale" hint="10% 13% 16%" value={data.taxMunicipal} onChange={(v) => handleChange('taxMunicipal', v)} />
                    <ExpenseRow label="Taxes scolaire" hint="2% 3% 4%" value={data.taxSchool} onChange={(v) => handleChange('taxSchool', v)} />
                    <ExpenseRow label="Taxes eau" hint="0%" value={data.taxWater} onChange={(v) => handleChange('taxWater', v)} />
                    <ExpenseRow label="Assurances" hint="3% 4% 5%" value={data.insurance} onChange={(v) => handleChange('insurance', v)} />
                    <ExpenseRow label="Publicité" hint="0%" value={data.advertising} onChange={(v) => handleChange('advertising', v)} />
                    <ExpenseRow label="CITQ" hint="" value={data.citq} onChange={(v) => handleChange('citq', v)} />

                    <ExpenseRow label="Frais d'admin / gestion (%)" isPercent hint="8% 12% 15%" value={data.managementRate} onChange={(v) => handleChange('managementRate', v)} />
                    <ExpenseRow label="Frais de Ménage par location ($/stay)" hint="" value={data.cleaningCostPerStay} onChange={(v) => handleChange('cleaningCostPerStay', v)} />

                    <ExpenseRow label="Déneigement" hint="0%" value={data.snowRemoval} onChange={(v) => handleChange('snowRemoval', v)} />
                    <ExpenseRow label="Pelouse, paysagement" hint="0%" value={data.lawnCare} onChange={(v) => handleChange('lawnCare', v)} />

                    <ExpenseRow label="Entretien par mois/logement (%)" isPercent hint="5% 8% 10%" value={data.maintenanceRate} onChange={(v) => handleChange('maintenanceRate', v)} />

                    <ExpenseRow label="Exterminateur" hint="0%" value={data.exterminator} onChange={(v) => handleChange('exterminator', v)} />
                    <ExpenseRow label="Location appareils / eau chaude" hint="0%" value={data.waterHeating} onChange={(v) => handleChange('waterHeating', v)} />
                    <ExpenseRow label="Réparation électroménagers" hint="0%" value={data.applianceRepair} onChange={(v) => handleChange('applianceRepair', v)} />
                    <ExpenseRow label="Déchets" hint="0%" value={data.waste} onChange={(v) => handleChange('waste', v)} />
                    <ExpenseRow label="Electricité" hint="0%" value={data.electricity} onChange={(v) => handleChange('electricity', v)} />
                    <ExpenseRow label="Huile ou gaz naturel" hint="0%" value={data.heating} onChange={(v) => handleChange('heating', v)} />
                    <ExpenseRow label="Bois" hint="" value={data.wood} onChange={(v) => handleChange('wood', v)} />
                    <ExpenseRow label="Piscine ou SPA" hint="0%" value={data.poolSpa} onChange={(v) => handleChange('poolSpa', v)} />
                    <ExpenseRow label="Câble / internet / téléphone" hint="0%" value={data.cableInternet} onChange={(v) => handleChange('cableInternet', v)} />
                    <ExpenseRow label="Comptabilité" hint="0%" value={data.accounting} onChange={(v) => handleChange('accounting', v)} />
                    <ExpenseRow label="Frais de condo (par mois)" hint="0%" value={data.condoFees} onChange={(v) => handleChange('condoFees', v)} />
                    <ExpenseRow label="Frais d'association Fiddler Lake" hint="" value={data.fiddlerLakeFees} onChange={(v) => handleChange('fiddlerLakeFees', v)} />

                    <ExpenseRow label="Divers (%)" isPercent hint="1% 3% 5%" value={data.miscellaneousRate} onChange={(v) => handleChange('miscellaneousRate', v)} />

                    <div className="pt-4 mt-6 border-t border-slate-100 dark:border-slate-700">
                        <div className="flex items-center justify-between p-3 bg-rose-50 dark:bg-rose-900/20 rounded-lg border border-rose-100 dark:border-rose-800">
                            <Label className="text-rose-700 dark:text-rose-300 font-bold text-lg">Dépenses Totales (Est.)</Label>
                            <span className="text-xl font-bold text-rose-600 dark:text-rose-400">{formatCurrency(totalExpenses)}</span>
                        </div>
                    </div>

                </CardContent>
            </Card>

            {/* Partnership */}
            <Card className={cardClass}>
                <CardHeader>
                    <CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        <span>🤝</span> Structure
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid w-full items-center gap-1.5">
                        <Label className={labelClass}>Part du Partenaire (%)</Label>
                        <div className="flex items-center gap-4 pt-2">
                            <Slider
                                min={0} max={100} step={5}
                                value={[data.partnerShare]}
                                onValueChange={(val: number[]) => {
                                    const share = val[0];
                                    onChange({ ...data, partnerShare: share, managerShare: 100 - share });
                                }}
                            />
                            <span className="w-12 text-sm font-bold text-indigo-600">{data.partnerShare}%</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">Part du Gestionnaire : {data.managerShare}%</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

const RevenueRow = ({ label, price, count, onPriceChange, onCountChange }: { label: string, price: number, count: number, onPriceChange: (v: number) => void, onCountChange: (v: number) => void }) => (
    <div className="grid grid-cols-6 gap-2 items-center">
        <Label className="col-span-3 text-xs md:text-sm text-slate-700 dark:text-slate-200">{label}</Label>
        <Input className="col-span-2 h-8" type="number" value={price} onChange={(e) => onPriceChange(Number(e.target.value))} />
        <Input className="col-span-1 h-8" type="number" value={count} onChange={(e) => onCountChange(Number(e.target.value))} />
    </div>
);

const ExpenseRow = ({ label, value, onChange, hint, isPercent }: { label: string, value: number, onChange: (v: number) => void, hint?: string, isPercent?: boolean }) => (
    <div className="grid grid-cols-12 gap-2 items-center border-b border-slate-50 dark:border-slate-800/50 last:border-0 pb-2 last:pb-0">
        <Label className="col-span-6 md:col-span-5 text-xs md:text-sm text-slate-700 dark:text-slate-200">{label}</Label>
        <div className="hidden md:block col-span-3 text-center text-xs text-slate-400 italic">{hint}</div>
        <div className="col-span-6 md:col-span-4 flex items-center gap-2">
            <Input className="h-8 text-right" type="number" step={isPercent ? "0.1" : "1"} value={value} onChange={(e) => onChange(Number(e.target.value))} />
            {isPercent && <span className="text-xs text-slate-500">%</span>}
        </div>
    </div>
);
