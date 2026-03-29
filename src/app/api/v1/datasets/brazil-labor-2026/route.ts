import { NextResponse } from 'next/server';

export async function GET() {
  const dataset = {
    metadata: {
      id: "br-labor-financial-2026",
      name: "Brazilian Labor & Financial Constants (2026)",
      description: "Official constants for INSS, IRRF, FGTS, and Employer Costs based on 2026 Brazilian legislation.",
      version: "2026.1.0",
      publisher: "CalcForgeTools Data Hub",
      lastUpdated: "2026-03-28",
      license: "Creative Commons Attribution 4.0 International (CC BY 4.0)"
    },
    data: {
      minimumWage: {
        value: 1621.00,
        currency: "BRL",
        source: "Medida Provisória (Estimativa 2026)"
      },
      inss: {
        description: "Tabela Progressiva INSS 2026",
        ceilingDeduction: 988.09,
        ceilingSalary: 8475.55,
        bands: [
          { upTo: 1621.00, rate: 0.075 },
          { upTo: 2902.84, rate: 0.09 },
          { upTo: 4354.27, rate: 0.12 },
          { upTo: 8475.55, rate: 0.14 }
        ]
      },
      irrf: {
        description: "Tabela IRRF 2026 (Atualizada)",
        dependentDeduction: 189.59,
        simplifiedDiscount: 583.92,
        bands: [
          { upTo: 2428.80, rate: 0.0, deduction: 0.0 },
          { upTo: 2826.65, rate: 0.075, deduction: 182.16 },
          { upTo: 3751.05, rate: 0.15, deduction: 394.16 },
          { upTo: 4664.68, rate: 0.225, deduction: 692.78 },
          { infinity: true, rate: 0.275, deduction: 908.73 }
        ]
      },
      employerCosts: {
        inssPatronalRate: 0.20,
        fgtsRate: 0.08,
        fgtsPenaltyRate: 0.40,
        systemS: "Variable (Average 5.8%)",
        ratFapBase: "Variable (Average 1% to 3%)"
      }
    }
  };

  return NextResponse.json(dataset, {
    status: 200,
    headers: {
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200',
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
    }
  });
}
