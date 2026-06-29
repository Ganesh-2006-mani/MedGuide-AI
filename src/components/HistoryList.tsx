import React from "react";
import { HistoryItem } from "../types";
import { Trash2, Calendar, Eye, X, RefreshCw } from "lucide-react";

interface HistoryListProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
  onClose: () => void;
}

export default function HistoryList({
  history,
  onSelect,
  onDelete,
  onClearAll,
  onClose,
}: HistoryListProps) {
  return (
    <div className="flex flex-col h-full space-y-4" id="history-panel-container">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div>
          <h3 className="font-bold text-slate-800 dark:text-white text-sm flex items-center gap-1.5">
            <RefreshCw className="h-4 w-4 text-emerald-500 dark:text-cyan-400 animate-spin-slow" />
            Search Assessment History
          </h3>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
            Your recent reports stored locally in browser sandbox.
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          id="btn-close-history"
          title="Close History Panel"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* History Items list */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[450px]" id="history-items-list">
        {history.length === 0 ? (
          <div className="text-center py-10 space-y-2">
            <p className="text-xs text-slate-500">No recent reports found.</p>
            <p className="text-[10px] text-slate-600">Reports you generate will be stored here temporarily.</p>
          </div>
        ) : (
          history.map((item) => {
            const formattedDate = new Date(item.timestamp).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });
            return (
              <div
                key={item.id}
                className="group relative rounded-xl border border-slate-200 bg-white/70 p-3.5 hover:border-emerald-500/30 dark:border-slate-800 dark:bg-slate-950/40 hover:dark:border-slate-700 hover:dark:bg-slate-900/30 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-semibold text-slate-800 dark:text-white truncate max-w-[150px]">
                      {item.result?.possible_conditions?.[0]?.name || item.input.symptomDescription}
                    </span>
                    {item.isEmergency && (
                      <span className="shrink-0 px-1.5 py-0.5 rounded bg-red-500/10 text-red-500 dark:text-red-400 border border-red-500/20 text-[8px] font-bold uppercase">
                        Emergency
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1.5 leading-relaxed italic">
                    "{item.input.symptomDescription}"
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3 w-3" />
                    <span>{formattedDate}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelect(item)}
                      className="text-emerald-600 dark:text-cyan-400 hover:text-emerald-500 dark:hover:text-cyan-300 font-semibold flex items-center gap-1 cursor-pointer"
                      title="Load and View Report"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      View
                    </button>
                    <button
                      onClick={() => onDelete(item.id)}
                      className="text-slate-400 hover:text-red-500 p-1 rounded hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Delete entry"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Bottom actions */}
      {history.length > 0 && (
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={onClearAll}
            className="w-full flex items-center justify-center gap-1.5 rounded-lg border border-red-500/20 hover:border-red-500/40 bg-red-500/5 hover:bg-red-500/10 py-2 text-xs font-semibold text-red-400 transition-all cursor-pointer"
            id="btn-clear-all-history"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Wipe Search History
          </button>
        </div>
      )}
    </div>
  );
}
