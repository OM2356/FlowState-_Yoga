import React, { useState } from "react";
import { Globe, Building2, TrendingDown, DollarSign, Calculator, ArrowUpRight } from "lucide-react";

export const StatsDashboardVisual: React.FC = () => {
  const [headcount, setHeadcount] = useState<number>(250);
  const [perEmployeeInvestment, setPerEmployeeInvestment] = useState<number>(20); // $20/month

  // ROI estimation based on $3.50 median return per $1 spent
  const totalMonthlySpend = headcount * perEmployeeInvestment;
  const projectedReturn = totalMonthlySpend * 3.5;

  return (
    <div className="w-full flex flex-col gap-4">
      {/* 4 McKinsey-Style Large Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Stat 1 */}
        <div className="bg-[#121620] border border-[#242D3D] p-4 rounded-2xl relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#FF9F1C] mb-2">
            <Globe className="w-5 h-5" />
            <ArrowUpRight className="w-4 h-4 text-[#8C9BAE]" />
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-mono font-bold text-[#FF9F1C] tracking-tight">
              $6.3T+
            </span>
            <h5 className="text-xs font-semibold text-[#F5F1E8] mt-1">Global Wellness Economy</h5>
            <p className="text-[10px] text-[#8C9BAE] mt-0.5">Mindfulness & recovery fastest growing segments.</p>
          </div>
          <span className="text-[9px] font-mono text-[#8C9BAE] mt-3 pt-2 border-t border-[#1F2736]">
            Global Wellness Institute (2024)
          </span>
        </div>

        {/* Stat 2 */}
        <div className="bg-[#121620] border border-[#242D3D] p-4 rounded-2xl relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#2EC4B6] mb-2">
            <Building2 className="w-5 h-5" />
            <ArrowUpRight className="w-4 h-4 text-[#8C9BAE]" />
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-mono font-bold text-[#2EC4B6] tracking-tight">
              $16B+
            </span>
            <h5 className="text-xs font-semibold text-[#F5F1E8] mt-1">India Ayurveda Market</h5>
            <p className="text-[10px] text-[#8C9BAE] mt-0.5">Surging domestic + global export adoption by 2026.</p>
          </div>
          <span className="text-[9px] font-mono text-[#8C9BAE] mt-3 pt-2 border-t border-[#1F2736]">
            Industry Market Estimates (2024)
          </span>
        </div>

        {/* Stat 3 */}
        <div className="bg-[#121620] border border-red-900/30 p-4 rounded-2xl relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between text-red-400 mb-2">
            <TrendingDown className="w-5 h-5" />
            <span className="text-[10px] font-mono bg-red-950/60 text-red-400 px-1.5 py-0.5 rounded">
              Deficit
            </span>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-mono font-bold text-red-400 tracking-tight">
              &lt; 9%
            </span>
            <h5 className="text-xs font-semibold text-[#F5F1E8] mt-1">90-Day App Retention</h5>
            <p className="text-[10px] text-[#8C9BAE] mt-0.5">Most apps abandon users due to decision fatigue.</p>
          </div>
          <span className="text-[9px] font-mono text-[#8C9BAE] mt-3 pt-2 border-t border-[#1F2736]">
            Mobile Wellness Industry Benchmark
          </span>
        </div>

        {/* Stat 4 */}
        <div className="bg-[#121620] border border-[#D4AF37]/40 p-4 rounded-2xl relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#D4AF37] mb-2">
            <DollarSign className="w-5 h-5" />
            <span className="text-[10px] font-mono bg-[#D4AF37]/15 text-[#D4AF37] px-1.5 py-0.5 rounded">
              Proven
            </span>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-mono font-bold text-[#D4AF37] tracking-tight">
              $1.50–$6
            </span>
            <h5 className="text-xs font-semibold text-[#F5F1E8] mt-1">Corporate Wellness ROI</h5>
            <p className="text-[10px] text-[#8C9BAE] mt-0.5">Returned per $1 invested via reduced absenteeism.</p>
          </div>
          <span className="text-[9px] font-mono text-[#8C9BAE] mt-3 pt-2 border-t border-[#1F2736]">
            Harvard Business / Workplace Studies
          </span>
        </div>
      </div>

      {/* Interactive Enterprise Wellness ROI Model */}
      <div className="bg-[#131822] border border-[#242D3D] rounded-2xl p-4 sm:p-5 shadow-xl">
        <div className="flex items-center justify-between mb-3 border-b border-[#242D3D] pb-3">
          <div className="flex items-center gap-2 text-xs font-mono text-[#2EC4B6]">
            <Calculator className="w-4 h-4" />
            <span>Interactive Enterprise ROI Projection</span>
          </div>
          <span className="text-[11px] text-[#8C9BAE]">B2B Wellness Channel Justification</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
          {/* Controls */}
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-[#8C9BAE]">Employee Headcount:</span>
                <span className="text-[#FF9F1C] font-bold">{headcount} Team Members</span>
              </div>
              <input
                type="range"
                min="50"
                max="2000"
                step="50"
                value={headcount}
                onChange={(e) => setHeadcount(Number(e.target.value))}
                className="w-full h-1.5 bg-[#242D3D] rounded-lg appearance-none cursor-pointer accent-[#FF9F1C]"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-[#8C9BAE]">Monthly Wellness Stipend / Employee:</span>
                <span className="text-[#2EC4B6] font-bold">${perEmployeeInvestment} / mo</span>
              </div>
              <input
                type="range"
                min="10"
                max="50"
                step="5"
                value={perEmployeeInvestment}
                onChange={(e) => setPerEmployeeInvestment(Number(e.target.value))}
                className="w-full h-1.5 bg-[#242D3D] rounded-lg appearance-none cursor-pointer accent-[#2EC4B6]"
              />
            </div>
          </div>

          {/* Outcome Projection Box */}
          <div className="p-4 rounded-xl bg-[#0F141E] border border-[#20293B] flex items-center justify-between">
            <div>
              <span className="text-[11px] uppercase font-mono text-[#8C9BAE] block">Projected Monthly Productivity Savings</span>
              <span className="text-2xl sm:text-3xl font-mono font-bold text-[#D4AF37]">
                ${projectedReturn.toLocaleString()}
              </span>
              <p className="text-[11px] text-[#8C9BAE] mt-1">
                Net gain: +${(projectedReturn - totalMonthlySpend).toLocaleString()}/mo on ${(totalMonthlySpend).toLocaleString()} spend
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono bg-[#2EC4B6]/20 text-[#2EC4B6] px-2.5 py-1 rounded-full border border-[#2EC4B6]/30">
                3.5x Est. Return
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
