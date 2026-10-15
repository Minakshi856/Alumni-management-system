import React from 'react';

// Department Distribution Chart
export const DepartmentChart = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return <div className="text-center text-slate-400 py-8">No department data available</div>;
  }

  const colors = [
    { bg: 'bg-blue-500', text: 'text-blue-500' },
    { bg: 'bg-indigo-500', text: 'text-indigo-500' },
    { bg: 'bg-emerald-500', text: 'text-emerald-500' },
    { bg: 'bg-amber-500', text: 'text-amber-500' },
    { bg: 'bg-rose-500', text: 'text-rose-500' },
    { bg: 'bg-purple-500', text: 'text-purple-500' },
  ];

  return (
    <div className="space-y-4">
      {data.map((item, index) => {
        const color = colors[index % colors.length];
        return (
          <div key={item.name} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-slate-700">{item.name}</span>
              <span className="text-slate-500 font-semibold">
                {item.count} alumni ({item.percentage}%)
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full ${color.bg} rounded-full transition-all duration-700 ease-out`}
                style={{ width: `${Math.max(item.percentage, 5)}%` }}
              ></div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Batch-wise Graduation Chart
export const BatchChart = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return <div className="text-center text-slate-400 py-8">No batch records found</div>;
  }

  const maxCount = Math.max(...data.map(d => d.count), 1);

  return (
    <div className="pt-6">
      <div className="flex items-end justify-between gap-3 h-48 border-b border-slate-200 pb-2">
        {data.map((item) => {
          const heightPercent = Math.round((item.count / maxCount) * 100);
          return (
            <div key={item.batch} className="flex-1 flex flex-col items-center gap-2 group">
              {/* Tooltip / value */}
              <span className="text-xs font-bold text-blue-600 opacity-90 group-hover:scale-110 transition-transform">
                {item.count}
              </span>
              
              {/* Bar */}
              <div className="w-full max-w-[42px] bg-slate-100 rounded-t-lg flex items-end h-36 p-0.5">
                <div
                  className="w-full bg-gradient-to-t from-blue-600 to-indigo-500 rounded-t-md group-hover:from-blue-500 group-hover:to-indigo-400 transition-all duration-500"
                  style={{ height: `${Math.max(heightPercent, 12)}%` }}
                ></div>
              </div>

              {/* Label */}
              <span className="text-xs font-medium text-slate-600 group-hover:text-blue-600">
                '{item.batch.slice(-2)}
              </span>
            </div>
          );
        })}
      </div>
      <p className="text-center text-xs text-slate-400 mt-2 font-medium">Graduation Year (Batch)</p>
    </div>
  );
};

// Top Hiring Companies List
export const TopCompaniesList = ({ companies = [] }) => {
  if (!companies || companies.length === 0) {
    return <div className="text-center text-slate-400 py-6">No company data available</div>;
  }

  return (
    <div className="divide-y divide-slate-100">
      {companies.map((comp, idx) => (
        <div key={comp.name} className="py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-700 text-xs font-bold flex items-center justify-center border border-blue-100">
              {idx + 1}
            </span>
            <span className="font-semibold text-sm text-slate-800">{comp.name}</span>
          </div>
          <span className="text-xs font-medium bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full">
            {comp.count} {comp.count === 1 ? 'alumnus' : 'alumni'}
          </span>
        </div>
      ))}
    </div>
  );
};
