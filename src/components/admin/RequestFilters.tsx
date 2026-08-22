import React from 'react';
import { Search, Filter, RotateCcw, X } from 'lucide-react';
import { FilterOptions } from '../../hooks/useRequests';
import { Button } from '../ui/Button';

export interface RequestFiltersProps {
  filters: FilterOptions;
  setFilters: React.Dispatch<React.SetStateAction<FilterOptions>>;
  onReset: () => void;
  departments?: string[];
}

export function RequestFilters({
  filters,
  setFilters,
  onReset,
  departments = [
    'DevOps & Cloud',
    'IT Infrastructure',
    'Core Engineering',
    'Cybersecurity',
    'Billing & Finance',
    'Customer Operations',
  ],
}: RequestFiltersProps) {
  const isAnyFilterActive =
    filters.search ||
    filters.department !== 'ALL' ||
    filters.priority !== 'ALL' ||
    filters.status !== 'ALL' ||
    filters.riskLevel !== 'ALL';

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 space-y-3.5 backdrop-blur-md">
      
      {/* Top row: Search and Reset */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        
        {/* Search Bar */}
        <div className="relative w-full sm:max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={filters.search}
            onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
            placeholder="Search by ticket #, keyword, department, or assignee..."
            className="w-full rounded-xl border border-slate-700/80 bg-slate-950/80 pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
          {filters.search && (
            <button
              onClick={() => setFilters(prev => ({ ...prev, search: '' }))}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Reset Filters */}
        {isAnyFilterActive && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            leftIcon={<RotateCcw className="h-3.5 w-3.5" />}
            className="text-xs text-slate-400 hover:text-white"
          >
            Clear All Filters
          </Button>
        )}
      </div>

      {/* Second row: Filter dropdowns & quick pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
        
        {/* Department Filter */}
        <div>
          <select
            value={filters.department}
            onChange={e => setFilters(prev => ({ ...prev, department: e.target.value }))}
            className="w-full rounded-xl border border-slate-700/80 bg-slate-950/80 px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="ALL">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        {/* Priority Filter */}
        <div>
          <select
            value={filters.priority}
            onChange={e => setFilters(prev => ({ ...prev, priority: e.target.value }))}
            className="w-full rounded-xl border border-slate-700/80 bg-slate-950/80 px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="ALL">All Priorities</option>
            <option value="P1_CRITICAL">P1 Critical</option>
            <option value="P2_HIGH">P2 High</option>
            <option value="P3_MEDIUM">P3 Medium</option>
            <option value="P4_LOW">P4 Low</option>
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={filters.status}
            onChange={e => setFilters(prev => ({ ...prev, status: e.target.value }))}
            className="w-full rounded-xl border border-slate-700/80 bg-slate-950/80 px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active Only</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="TRIAGED">Triaged</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>

        {/* Risk Level Filter */}
        <div>
          <select
            value={filters.riskLevel}
            onChange={e => setFilters(prev => ({ ...prev, riskLevel: e.target.value }))}
            className="w-full rounded-xl border border-slate-700/80 bg-slate-950/80 px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="ALL">All Risk Levels</option>
            <option value="CRITICAL">Critical Risk (&gt;80%)</option>
            <option value="HIGH">High Risk (60-79%)</option>
            <option value="MEDIUM">Medium Risk (35-59%)</option>
            <option value="LOW">Low Risk (&lt;35%)</option>
          </select>
        </div>

      </div>

    </div>
  );
}
