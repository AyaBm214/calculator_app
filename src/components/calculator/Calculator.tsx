"use client";
import React, { useState, useEffect } from 'react';
import { InputSection } from './InputSection';
import { ResultsSection } from './ResultsSection';
import { PropertyData, defaultPropertyData, calculateProjections } from '../../lib/calculations';

export default function Calculator() {
    const [data, setData] = useState<PropertyData>(defaultPropertyData);
    const [results, setResults] = useState(calculateProjections(defaultPropertyData));

    useEffect(() => {
        const projected = calculateProjections(data);
        setResults(projected);
    }, [data]);

    return (
        <div className="grid lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 space-y-6">
                <InputSection data={data} onChange={setData} />
            </div>
            <div className="lg:col-span-8">
                <ResultsSection results={results} />
            </div>
        </div>
    );
}
