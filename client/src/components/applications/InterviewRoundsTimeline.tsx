import React, { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { InterviewRoundDto, InterviewResultType } from "@/services/interviewRoundService";
import { InterviewResult, interviewRoundService } from "@/services/interviewRoundService";
import { Calendar, CheckCircle2, XCircle, Clock, Ban, Plus, Trash2, Loader2 } from "lucide-react";

interface InterviewRoundsTimelineProps {
  jobApplicationId: string;
  initialRounds?: InterviewRoundDto[];
}

export const InterviewRoundsTimeline: React.FC<InterviewRoundsTimelineProps> = ({
  jobApplicationId,
  initialRounds = [],
}) => {
  const [rounds, setRounds] = useState<InterviewRoundDto[]>(initialRounds);
  const [loading, setLoading] = useState(initialRounds.length === 0);
  const [showAddForm, setShowAddForm] = useState(false);
  const [roundName, setRoundName] = useState("");
  const [roundDate, setRoundDate] = useState("");
  const [experience, setExperience] = useState("");
  const [result, setResult] = useState<InterviewResultType>(InterviewResult.Pending);
  const queryClient = useQueryClient();

  useEffect(() => {
    let mounted = true;
    interviewRoundService
      .getByApplication(jobApplicationId)
      .then((data) => {
        if (mounted && Array.isArray(data)) setRounds(data);
      })
      .catch((err) => console.error("Failed to load interview rounds:", err))
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [jobApplicationId]);

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
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    } catch (err) {
      console.error("Failed to add interview round:", err);
    }
  };

  const handleDeleteRound = async (roundId: string) => {
    try {
      await interviewRoundService.delete(roundId);
      setRounds((prev) => prev.filter((r) => r.id !== roundId));
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    } catch (err) {
      console.error("Failed to delete interview round:", err);
    }
  };

  const getResultBadge = (res: InterviewResultType) => {
    switch (res) {
      case InterviewResult.Passed:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#edf6ee] text-[#22543b] border border-[#cbe1ce]">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#2e6e47]" /> Passed
          </span>
        );
      case InterviewResult.Failed:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#fff0ef] text-[#aa433b] border border-[#f3d0cc]">
            <XCircle className="w-3.5 h-3.5 text-[#b9443c]" /> Failed
          </span>
        );
      case InterviewResult.Cancelled:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#f0f2ef] text-[#637267] border border-[#dce0dc]">
            <Ban className="w-3.5 h-3.5 text-[#7a877e]" /> Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#fbf6ea] text-[#936622] border border-[#ecdec0]">
            <Clock className="w-3.5 h-3.5 text-[#b07c2a]" /> Pending
          </span>
        );
    }
  };

  return (
    <div className="space-y-4 font-['Inter',sans-serif] text-[#1c2c22]">
      {/* Top Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-[#e6ece3]">
        <h3 className="text-[15px] font-semibold text-[#18251e] flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#eaf4e8] text-[#27613f]">
            <Calendar size={17} strokeWidth={1.8} />
          </span>
          <span>Interview Rounds Timeline</span>
        </h3>
        <button
          type="button"
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-[#d7e4d4] bg-[#f4f9f2] px-3 py-1.5 text-xs font-semibold text-[#255b3a] transition-colors hover:bg-[#eaf4e8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#255b3a]"
        >
          <Plus size={14} /> Add round
        </button>
      </div>

      {/* Add Round Form */}
      {showAddForm && (
        <form onSubmit={handleAddRound} className="rounded-xl border border-[#dce6da] bg-[#f7f9f5] p-4 space-y-3.5 shadow-xs">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#355f44]">
              New Interview Round
            </h4>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#2a4032]">
              Round Name <span className="text-rose-600">*</span>
            </label>
            <input
              type="text"
              value={roundName}
              onChange={(e) => setRoundName(e.target.value)}
              placeholder="e.g. Technical Screening, System Design, Final Viva"
              className="mt-1 w-full rounded-lg border border-[#dce4dc] bg-white px-3 py-2 text-xs text-[#1c2c22] placeholder:text-[#93a296] outline-none transition focus:border-[#408660] focus:ring-2 focus:ring-[#408660]/15"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#2a4032]">Date</label>
              <input
                type="date"
                value={roundDate}
                onChange={(e) => setRoundDate(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[#dce4dc] bg-white px-3 py-2 text-xs text-[#1c2c22] outline-none transition focus:border-[#408660] focus:ring-2 focus:ring-[#408660]/15"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#2a4032]">Result / Status</label>
              <select
                value={result}
                onChange={(e) => setResult(Number(e.target.value) as InterviewResultType)}
                className="mt-1 w-full rounded-lg border border-[#dce4dc] bg-white px-3 py-2 text-xs text-[#1c2c22] outline-none transition focus:border-[#408660] focus:ring-2 focus:ring-[#408660]/15 cursor-pointer"
              >
                <option value={InterviewResult.Pending}>Pending</option>
                <option value={InterviewResult.Passed}>Passed</option>
                <option value={InterviewResult.Failed}>Failed</option>
                <option value={InterviewResult.Cancelled}>Cancelled</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#2a4032]">Experience Notes</label>
            <textarea
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              placeholder="Key topics covered, questions asked, difficulty, takeaways..."
              rows={2}
              className="mt-1 w-full rounded-lg border border-[#dce4dc] bg-white p-2.5 text-xs text-[#1c2c22] placeholder:text-[#93a296] outline-none transition focus:border-[#408660] focus:ring-2 focus:ring-[#408660]/15 leading-relaxed"
            />
          </div>

          <div className="flex justify-end gap-2 pt-1 border-t border-[#e3ebe1]">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="rounded-lg border border-[#dce4dc] bg-white px-3.5 py-1.5 text-xs font-medium text-[#55695b] hover:bg-[#f0f4ee] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[#255b3a] px-4 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-[#1a452d] transition-colors"
            >
              Save Round
            </button>
          </div>
        </form>
      )}

      {/* Timeline Content */}
      {loading ? (
        <div className="flex items-center justify-center py-8 text-xs text-[#6e7f72] gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-[#28593c]" /> Loading interview rounds...
        </div>
      ) : rounds.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#dfe6dc] bg-[#fafbf8] py-8 text-center text-xs text-[#758478] space-y-2">
          <Calendar className="mx-auto w-8 h-8 text-[#97a89b]" />
          <p>No interview rounds recorded yet.</p>
          <button
            type="button"
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center gap-1 font-semibold text-[#255b3a] hover:underline cursor-pointer"
          >
            <Plus size={13} /> Add the first round
          </button>
        </div>
      ) : (
        <div className="relative border-l-2 border-[#d9e5d6] ml-3.5 space-y-4 py-2">
          {rounds.map((r) => (
            <div key={r.id} className="relative pl-6">
              {/* Timeline Bullet */}
              <div className="absolute -left-[7px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-[#255b3a] ring-2 ring-[#cbe0cb]" />

              {/* Round Card */}
              <div className="rounded-xl border border-[#e2e8e0] bg-white p-3.5 shadow-[0_1px_3px_rgba(20,40,25,0.03)] hover:border-[#ccd9cb] transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-semibold text-[#18261e]">{r.roundName}</h4>
                    <p className="mt-0.5 text-[11px] font-medium text-[#7a887d] flex items-center gap-1.5">
                      <Calendar size={12} className="text-[#8e9d91]" />
                      {new Date(r.roundDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getResultBadge(r.result)}
                    <button
                      type="button"
                      onClick={() => handleDeleteRound(r.id)}
                      title="Delete round"
                      className="rounded-lg p-1.5 text-[#98a59b] hover:bg-[#fceeed] hover:text-[#b43d34] transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {r.experience && (
                  <div className="mt-2.5 rounded-lg border border-[#eef3ec] bg-[#f8faf6] p-2.5 text-xs leading-relaxed text-[#3a4d3f]">
                    <p className="font-medium text-[11px] text-[#67796c] mb-0.5">Notes & Questions:</p>
                    {r.experience}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
