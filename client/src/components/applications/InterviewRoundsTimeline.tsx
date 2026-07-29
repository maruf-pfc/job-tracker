import React, { useState } from "react";
import type { InterviewRoundDto, InterviewResultType } from "@/services/interviewRoundService";
import { InterviewResult, interviewRoundService } from "@/services/interviewRoundService";
import { Calendar, CheckCircle2, XCircle, Clock, Ban, Plus, Trash2 } from "lucide-react";

interface InterviewRoundsTimelineProps {
  jobApplicationId: string;
  initialRounds?: InterviewRoundDto[];
}

export const InterviewRoundsTimeline: React.FC<InterviewRoundsTimelineProps> = ({
  jobApplicationId,
  initialRounds = [],
}) => {
  const [rounds, setRounds] = useState<InterviewRoundDto[]>(initialRounds);
  const [showAddForm, setShowAddForm] = useState(false);
  const [roundName, setRoundName] = useState("");
  const [roundDate, setRoundDate] = useState("");
  const [experience, setExperience] = useState("");
  const [result, setResult] = useState<InterviewResultType>(InterviewResult.Pending);

  const handleAddRound = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roundName.trim()) return;

    try {
      const newRound = await interviewRoundService.create(jobApplicationId, {
        roundName,
        roundDate: roundDate || new Date().toISOString(),
        experience,
        result,
      });

      setRounds((prev) => [...prev, newRound]);
      setRoundName("");
      setRoundDate("");
      setExperience("");
      setResult(InterviewResult.Pending);
      setShowAddForm(false);
    } catch (err) {
      console.error("Failed to add interview round:", err);
    }
  };

  const handleDeleteRound = async (roundId: string) => {
    try {
      await interviewRoundService.delete(roundId);
      setRounds((prev) => prev.filter((r) => r.id !== roundId));
    } catch (err) {
      console.error("Failed to delete interview round:", err);
    }
  };

  const getResultBadge = (res: InterviewResultType) => {
    switch (res) {
      case InterviewResult.Passed:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" /> Passed
          </span>
        );
      case InterviewResult.Failed:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-500/10 text-rose-600 dark:text-rose-400">
            <XCircle className="w-3.5 h-3.5" /> Failed
          </span>
        );
      case InterviewResult.Cancelled:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-500/10 text-zinc-600 dark:text-zinc-400">
            <Ban className="w-3.5 h-3.5" /> Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Clock className="w-3.5 h-3.5" /> Pending
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <Calendar className="w-4 h-4 text-indigo-500" /> Interview Rounds Timeline
        </h3>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
        >
          <Plus className="w-3.5 h-3.5" /> Add Round
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddRound} className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700 space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">Round Name</label>
            <input
              type="text"
              value={roundName}
              onChange={(e) => setRoundName(e.target.value)}
              placeholder="e.g. Technical Screening, System Design"
              className="mt-1 w-full text-xs rounded border border-slate-300 px-3 py-1.5 dark:bg-slate-900 dark:border-slate-700"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">Date</label>
              <input
                type="date"
                value={roundDate}
                onChange={(e) => setRoundDate(e.target.value)}
                className="mt-1 w-full text-xs rounded border border-slate-300 px-3 py-1.5 dark:bg-slate-900 dark:border-slate-700"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">Result</label>
              <select
                value={result}
                onChange={(e) => setResult(Number(e.target.value) as InterviewResultType)}
                className="mt-1 w-full text-xs rounded border border-slate-300 px-3 py-1.5 dark:bg-slate-900 dark:border-slate-700"
              >
                <option value={InterviewResult.Pending}>Pending</option>
                <option value={InterviewResult.Passed}>Passed</option>
                <option value={InterviewResult.Failed}>Failed</option>
                <option value={InterviewResult.Cancelled}>Cancelled</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">Experience Notes</label>
            <textarea
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              placeholder="Key questions asked, personal notes..."
              rows={2}
              className="mt-1 w-full text-xs rounded border border-slate-300 px-3 py-1.5 dark:bg-slate-900 dark:border-slate-700"
            />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1 text-xs text-slate-600 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1 text-xs bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Save Round
            </button>
          </div>
        </form>
      )}

      {rounds.length === 0 ? (
        <p className="text-xs text-slate-500 italic">No interview rounds added yet.</p>
      ) : (
        <div className="relative border-l-2 border-slate-200 dark:border-slate-700 ml-3 space-y-4 py-1">
          {rounds.map((r) => (
            <div key={r.id} className="relative pl-6">
              <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-indigo-500" />
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-slate-800 dark:text-slate-200">{r.roundName}</h4>
                  <p className="text-xs text-slate-500">
                    {new Date(r.roundDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {getResultBadge(r.result)}
                  <button
                    onClick={() => handleDeleteRound(r.id)}
                    className="text-slate-400 hover:text-rose-500"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              {r.experience && (
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 p-2 rounded">
                  {r.experience}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
