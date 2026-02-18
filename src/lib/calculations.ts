
export interface PropertyData {
    // Header Info
    date: string;
    mlsNumber: string;
    address: string;
    city: string;
    cadastre: string;

    // Purchase & Financing
    purchasePrice: number;
    mortgageAmount: number;
    mortgageInterestRate: number;
    amortizationYears: number;

    // Revenue Details
    revLowWeekendPrice: number;
    revLowWeekendCount: number;
    revLowWeekPrice: number;
    revLowWeekCount: number;
    revHighWeekendPrice: number;
    revHighWeekendCount: number;
    revHighWeekPrice: number;
    revHighWeekCount: number;

    badDebtPercent: number;

    // Expenses (Annual unless specified)
    taxMunicipal: number;
    taxSchool: number;
    taxWater: number;
    insurance: number;
    electricity: number;
    heating: number;
    wood: number;
    waterHeating: number;
    cableInternet: number;
    snowRemoval: number;
    lawnCare: number;
    citq: number;
    waste: number;
    poolSpa: number;
    exterminator: number;
    applianceRepair: number;
    condoFees: number; // Monthly input, treated as monthly in calc
    fiddlerLakeFees: number;
    accounting: number;
    advertising: number;

    // Variable Expenses
    cleaningCostPerStay: number;
    managementRate: number;
    maintenanceRate: number;
    miscellaneousRate: number;

    // Partnership
    partnerCapital: number;
    partnerShare: number;
    managerShare: number;

    // Growth
    incomeGrowth: number;
    expenseGrowth: number;
    appreciation: number;
}

export type AnnualResult = {
    year: number;
    revenue: number;
    expenses: number;
    noi: number;
    mortgagePayment: number;
    cashflow: number;

    // Partner Metrics
    partnerCashflow: number;
    partnerPrincipalPaydown: number;
    partnerAppreciation: number;
    partnerTotalRoi: number;

    // Manager Metrics
    totalManagerBenefit: number;
};

export const calculateProjections = (data: PropertyData, years = 5): AnnualResult[] => {
    const results: AnnualResult[] = [];

    // 1. Calculate Base Revenue (Year 1)
    const revenueLowWeekend = data.revLowWeekendPrice * data.revLowWeekendCount;
    const revenueLowWeek = data.revLowWeekPrice * data.revLowWeekCount;
    const revenueHighWeekend = data.revHighWeekendPrice * data.revHighWeekendCount;
    const revenueHighWeek = data.revHighWeekPrice * data.revHighWeekCount;

    const potentialGrossIncome = revenueLowWeekend + revenueLowWeek + revenueHighWeekend + revenueHighWeek;
    const badDebt = potentialGrossIncome * (data.badDebtPercent / 100);
    let currentIncome = potentialGrossIncome - badDebt;

    // 2. Calculate Base Expenses (Year 1)
    const totalBookings = data.revLowWeekendCount + data.revLowWeekCount + data.revHighWeekendCount + data.revHighWeekCount;
    const annualCleaning = data.cleaningCostPerStay * totalBookings;

    const annualCondoFees = data.condoFees * 12;

    // Fixed Expenses Sum
    const fixedExpenses =
        data.taxMunicipal +
        data.taxSchool +
        data.taxWater +
        data.insurance +
        data.electricity +
        data.heating +
        data.wood +
        data.waterHeating +
        data.cableInternet +
        data.snowRemoval +
        data.lawnCare +
        data.citq +
        data.waste +
        data.poolSpa +
        data.exterminator +
        data.applianceRepair +
        annualCondoFees +
        data.fiddlerLakeFees +
        data.accounting +
        data.advertising;

    // Initial value for growth loop
    let currentFixedExpenses = fixedExpenses;
    let currentCleaning = annualCleaning;
    let currentPropertyValue = data.purchasePrice;
    let mortgageBalance = data.mortgageAmount;

    // Mortgage Constants
    const monthlyRate = (data.mortgageInterestRate / 100) / 12;
    const numPayments = data.amortizationYears * 12;
    const monthlyMortgagePayment = (monthlyRate === 0)
        ? mortgageBalance / numPayments
        : (mortgageBalance * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
    const annualMortgagePayment = monthlyMortgagePayment * 12;

    for (let y = 1; y <= years; y++) {
        // Variable Expenses (depend on currentIncome)
        const managementFees = currentIncome * (data.managementRate / 100);
        const maintenanceFees = currentIncome * (data.maintenanceRate / 100);
        const miscFees = currentIncome * (data.miscellaneousRate / 100);

        const totalVariableExpenses = managementFees + maintenanceFees + miscFees + currentCleaning;

        const totalExpenses = currentFixedExpenses + totalVariableExpenses;

        const noi = currentIncome - totalExpenses;

        // Mortgage Principal Paydown
        let annualPrincipalPaydown = 0;

        for (let m = 0; m < 12; m++) {
            const interest = mortgageBalance * monthlyRate;
            const principal = monthlyMortgagePayment - interest;
            if (mortgageBalance > 0) {
                annualPrincipalPaydown += principal;
                mortgageBalance -= principal;
            }
        }

        const cashflow = noi - annualMortgagePayment;

        // Partner Metrics
        const partnerCashflow = cashflow * (data.partnerShare / 100);
        const partnerAppreciation = (currentPropertyValue * (data.appreciation / 100)) * (data.partnerShare / 100);
        const partnerPrincipalPaydown = annualPrincipalPaydown * (data.partnerShare / 100);

        const totalPartnerReturn = partnerCashflow + partnerAppreciation + partnerPrincipalPaydown;
        const partnerTotalRoi = (totalPartnerReturn / (data.partnerCapital || 1)) * 100;

        // Manager Metrics (Simple view)
        const managerCashflow = cashflow * (data.managerShare / 100);
        const totalManagerBenefit = managerCashflow; // Simplified

        results.push({
            year: y,
            revenue: currentIncome,
            expenses: totalExpenses,
            noi,
            mortgagePayment: annualMortgagePayment,
            cashflow,
            partnerCashflow,
            partnerPrincipalPaydown,
            partnerAppreciation,
            partnerTotalRoi,
            totalManagerBenefit
        });

        // Growth for next year
        currentIncome *= (1 + data.incomeGrowth / 100);
        currentFixedExpenses *= (1 + data.expenseGrowth / 100);
        currentCleaning *= (1 + data.expenseGrowth / 100);
        currentPropertyValue *= (1 + data.appreciation / 100);
    }

    return results;
};

export const defaultPropertyData: PropertyData = {
    date: new Date().toISOString().split('T')[0],
    mlsNumber: "",
    address: "433 Ioan",
    city: "Wentworth-Nord",
    cadastre: "",

    purchasePrice: 650000,
    mortgageAmount: 500000,
    mortgageInterestRate: 6.0,
    amortizationYears: 25,

    revLowWeekendPrice: 1000,
    revLowWeekendCount: 15,
    revLowWeekPrice: 1500,
    revLowWeekCount: 5,
    revHighWeekendPrice: 1500,
    revHighWeekendCount: 20,
    revHighWeekPrice: 2000,
    revHighWeekCount: 10,

    badDebtPercent: 0,

    taxMunicipal: 4000,
    taxSchool: 500,
    taxWater: 0,
    insurance: 2500,
    electricity: 0,
    heating: 0,
    wood: 0,
    waterHeating: 0,
    cableInternet: 1200,
    snowRemoval: 800,
    lawnCare: 0,
    citq: 300,
    waste: 0,
    poolSpa: 1000,
    exterminator: 0,
    applianceRepair: 500,
    condoFees: 0,
    fiddlerLakeFees: 0,
    accounting: 0,
    advertising: 0,

    cleaningCostPerStay: 150,
    managementRate: 8,
    maintenanceRate: 5,
    miscellaneousRate: 1,

    partnerCapital: 150000,
    partnerShare: 50,
    managerShare: 50,

    incomeGrowth: 3,
    expenseGrowth: 3,
    appreciation: 5
};
