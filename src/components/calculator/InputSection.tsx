
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
    const effectiveRevenue = useMemo(() => {
        return data.baseRevenue * (1 - data.badDebtPercent / 100);
    }, [data.baseRevenue, data.badDebtPercent]);

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

        // % based fees (calculated on baseRevenue)
        const gross = data.baseRevenue;
        const mgmt = gross * (data.managementRate / 100);
        const maint = gross * (data.maintenanceRate / 100);
        const misc = gross * (data.miscellaneousRate / 100);

        return fixed + data.cleaningCostPerStay + mgmt + maint + misc;
    }, [data]);

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
                    <div className="space-y-2 col-span-2">
                        <Label className={labelClass}>Adresse</Label>
                        <Input value={data.address} onChange={(e) => handleChange('address', e.target.value)} />
                    </div>
                    <div className="space-y-2 col-span-2">
                        <Label className={labelClass}>Ville</Label>
                        <Input value={data.city} onChange={(e) => handleChange('city', e.target.value)} />
                    </div>
                </CardContent>
            </Card>

            {/* Revenues */}
            <Card className={cardClass}>
                <CardHeader>
                    <CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        <span>📈</span> Revenus
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label className={labelClass}>Revenu d'Hébergement Excluant Ménage, Frais et Taxes</Label>
                        <FormattedInput value={data.baseRevenue} onChange={(v) => handleChange('baseRevenue', v)} />
                    </div>

                    <div className="flex items-center justify-between pt-2">
                        <Label className={labelClass}>Mauvaise créance (%)</Label>
                        <FormattedInput className="w-24 text-right" value={data.badDebtPercent} onChange={(v) => handleChange('badDebtPercent', v)} />
                    </div>

                    <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
                        <div className="space-y-1 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-100 dark:border-emerald-800">
                            <Label className="text-emerald-700 dark:text-emerald-300 font-bold block">Revenu d'Hébergement Effectif Incluant Mauvaise Créance</Label>
                            <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(effectiveRevenue)}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Expenses */}
            <Card className={cardClass}>
                <CardHeader>
                    <CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        <span>💸</span> Dépense Annuelle d'Exploitation
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-12 gap-2 text-sm font-semibold text-slate-500 mb-2">
                        <div className="col-span-8">Item</div>
                        <div className="col-span-4 text-right">Montant ($)</div>
                    </div>

                    <ExpenseRow label="Taxes municipale" value={data.taxMunicipal} onChange={(v) => handleChange('taxMunicipal', v)} />
                    <ExpenseRow label="Taxes scolaire" value={data.taxSchool} onChange={(v) => handleChange('taxSchool', v)} />
                    <ExpenseRow label="Taxes eau" value={data.taxWater} onChange={(v) => handleChange('taxWater', v)} />
                    <ExpenseRow label="Assurances" value={data.insurance} onChange={(v) => handleChange('insurance', v)} />
                    <ExpenseRow label="Publicité" value={data.advertising} onChange={(v) => handleChange('advertising', v)} />
                    <ExpenseRow label="CITQ" value={data.citq} onChange={(v) => handleChange('citq', v)} />

                    <ExpenseRow
                        label="Frais de Gestion (%)"
                        isPercent
                        percentValue={data.managementRate}
                        onPercentChange={(v) => handleChange('managementRate', v)}
                        calculatedValue={data.baseRevenue * (data.managementRate / 100)}
                    />

                    <ExpenseRow label="Frais de Ménage ($ total)" value={data.cleaningCostPerStay} onChange={(v) => handleChange('cleaningCostPerStay', v)} />

                    <ExpenseRow label="Déneigement" value={data.snowRemoval} onChange={(v) => handleChange('snowRemoval', v)} />
                    <ExpenseRow label="Pelouse, paysagement" value={data.lawnCare} onChange={(v) => handleChange('lawnCare', v)} />

                    <ExpenseRow
                        label="Entretien par mois/logement (%)"
                        isPercent
                        percentValue={data.maintenanceRate}
                        onPercentChange={(v) => handleChange('maintenanceRate', v)}
                        calculatedValue={data.baseRevenue * (data.maintenanceRate / 100)}
                    />

                    <ExpenseRow label="Exterminateur" value={data.exterminator} onChange={(v) => handleChange('exterminator', v)} />
                    <ExpenseRow label="Location appareils / eau chaude" value={data.waterHeating} onChange={(v) => handleChange('waterHeating', v)} />
                    <ExpenseRow label="Réparation électroménagers" value={data.applianceRepair} onChange={(v) => handleChange('applianceRepair', v)} />
                    <ExpenseRow label="Déchets" value={data.waste} onChange={(v) => handleChange('waste', v)} />
                    <ExpenseRow label="Electricité" value={data.electricity} onChange={(v) => handleChange('electricity', v)} />
                    <ExpenseRow label="Huile ou gaz naturel" value={data.heating} onChange={(v) => handleChange('heating', v)} />
                    <ExpenseRow label="Bois" value={data.wood} onChange={(v) => handleChange('wood', v)} />
                    <ExpenseRow label="Piscine ou SPA" value={data.poolSpa} onChange={(v) => handleChange('poolSpa', v)} />
                    <ExpenseRow label="Câble / internet / téléphone" value={data.cableInternet} onChange={(v) => handleChange('cableInternet', v)} />
                    <ExpenseRow label="Comptabilité" value={data.accounting} onChange={(v) => handleChange('accounting', v)} />
                    <ExpenseRow label="Frais de condo (par mois)" value={data.condoFees} onChange={(v) => handleChange('condoFees', v)} />
                    <ExpenseRow label="Frais d'association Fiddler Lake" value={data.fiddlerLakeFees} onChange={(v) => handleChange('fiddlerLakeFees', v)} />

                    <ExpenseRow
                        label="Divers (%)"
                        isPercent
                        percentValue={data.miscellaneousRate}
                        onPercentChange={(v) => handleChange('miscellaneousRate', v)}
                        calculatedValue={data.baseRevenue * (data.miscellaneousRate / 100)}
                    />

                    <div className="pt-4 mt-6 border-t border-slate-100 dark:border-slate-700">
                        <div className="flex items-center justify-between p-3 bg-rose-50 dark:bg-rose-900/20 rounded-lg border border-rose-100 dark:border-rose-800">
                            <Label className="text-rose-700 dark:text-rose-300 font-bold text-lg">Dépenses Totales (Est.)</Label>
                            <span className="text-xl font-bold text-rose-600 dark:text-rose-400">{formatCurrency(totalExpenses)}</span>
                        </div>
                    </div>

                </CardContent>
            </Card>

            {/* Mortgage Section */}
            <Card className={cardClass}>
                <CardHeader>
                    <CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        <span>🏠</span> Hypothèque
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label className={labelClass}>Hypothèque Mensuelle</Label>
                        <FormattedInput value={data.monthlyMortgageAmount} onChange={(v) => handleChange('monthlyMortgageAmount', v)} />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                        <Label className={labelClass}>Hypothèque Annuelle</Label>
                        <span className="font-bold text-slate-700 dark:text-slate-200">{formatCurrency(data.monthlyMortgageAmount * 12)}</span>
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

// Helper component for formatted numeric inputs
const FormattedInput = ({ value, onChange, className, step = "1" }: { value: number, onChange: (v: number) => void, className?: string, step?: string }) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const [inputValue, setInputValue] = React.useState(value.toString());

    React.useEffect(() => {
        if (!isFocused) {
            setInputValue(value.toString());
        }
    }, [value, isFocused]);

    const handleBlur = () => {
        setIsFocused(false);
        const parsed = parseFloat(inputValue.replace(/,/g, ''));
        if (!isNaN(parsed)) {
            onChange(parsed);
        } else {
            setInputValue(value.toString());
        }
    };

    const displayValue = isFocused
        ? inputValue
        : new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(value);

    return (
        <Input
            className={className}
            type="text"
            value={displayValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={handleBlur}
        />
    );
};

const ExpenseRow = ({
    label,
    value,
    onChange,
    isPercent,
    percentValue,
    onPercentChange,
    calculatedValue
}: {
    label: string,
    value?: number,
    onChange?: (v: number) => void,
    isPercent?: boolean,
    percentValue?: number,
    onPercentChange?: (v: number) => void,
    calculatedValue?: number
}) => (
    <div className="grid grid-cols-12 gap-2 items-center border-b border-slate-50 dark:border-slate-800/50 last:border-0 pb-2 last:pb-0">
        <Label className="col-span-8 text-xs md:text-sm text-slate-700 dark:text-slate-200">{label}</Label>
        <div className="col-span-4 flex items-center gap-2 justify-end">
            {isPercent ? (
                <>
                    <FormattedInput
                        className="h-8 w-20 text-right"
                        step="0.1"
                        value={percentValue || 0}
                        onChange={(v) => onPercentChange?.(v)}
                    />
                    <span className="text-xs text-slate-500">%</span>
                    <span className="text-xs font-medium min-w-[60px] text-right">({new Intl.NumberFormat('fr-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(calculatedValue || 0)})</span>
                </>
            ) : (
                <FormattedInput
                    className="h-8 text-right w-24"
                    value={value || 0}
                    onChange={(v) => onChange?.(v)}
                />
            )}
        </div>
    </div>
);
