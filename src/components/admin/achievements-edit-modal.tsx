"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trophy, Plus, Trash2 } from "lucide-react";
import { useAdmin, type MetricItem, type AchievementCardItem } from "@/context/admin-context";

interface AchievementsEditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AchievementsEditModal({
  isOpen,
  onClose,
}: AchievementsEditModalProps) {
  const {
    statMetrics,
    updateStatMetric,
    achievementCards,
    updateAchievementCard,
    addAchievementCard,
    deleteAchievementCard,
  } = useAdmin();

  const [metrics, setMetrics] = useState<MetricItem[]>(statMetrics);
  const [cards, setCards] = useState<AchievementCardItem[]>(achievementCards);

  useEffect(() => {
    if (isOpen) {
      setMetrics(statMetrics);
      setCards(achievementCards);
    }
  }, [isOpen, statMetrics, achievementCards]);

  const handleMetricChange = (
    index: number,
    field: keyof MetricItem,
    val: string | number
  ) => {
    const list = [...metrics];
    list[index] = {
      ...list[index],
      [field]: field === "value" ? Number(val) || 0 : val,
    };
    setMetrics(list);
  };

  const handleCardChange = (
    index: number,
    field: keyof AchievementCardItem,
    val: string
  ) => {
    const list = [...cards];
    list[index] = { ...list[index], [field]: val };
    setCards(list);
  };

  const handleAddNewCard = () => {
    setCards([
      ...cards,
      {
        emoji: "⭐",
        title: "New Honor / Achievement",
        description: "Achievement details and highlights...",
        tag: "AWARD 2026",
      },
    ]);
  };

  const handleRemoveCard = (index: number) => {
    setCards(cards.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    // Save metrics
    metrics.forEach((m, idx) => updateStatMetric(idx, m));
    // Save cards
    cards.forEach((c, idx) => {
      if (idx < achievementCards.length) {
        updateAchievementCard(idx, c);
      } else {
        addAchievementCard(c);
      }
    });
    // Remove if any deleted
    if (cards.length < achievementCards.length) {
      for (let i = achievementCards.length - 1; i >= cards.length; i--) {
        deleteAchievementCard(i);
      }
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 15 }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-7 shadow-2xl border border-zinc-200 z-10"
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 h-8 w-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500 hover:text-zinc-900 cursor-pointer"
            >
              <X size={16} />
            </button>

            {/* Header */}
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-semibold font-geist mb-2">
                <Trophy size={13} />
                <span>Honors &amp; Trophies Editor</span>
              </div>
              <h3 className="font-geist text-xl font-bold text-zinc-950 tracking-tight">
                Edit Honors, Trophies &amp; Metric Counts
              </h3>
              <p className="font-geist text-xs text-zinc-500">
                Change counter values for hackathons, certifications, internships, freelance projects, and edit trophy cards.
              </p>
            </div>

            <div className="space-y-6">
              {/* 1. Stat Counters */}
              <div>
                <label className="block text-xs font-bold font-mono tracking-wider text-zinc-900 uppercase mb-2">
                  Animated Stat Counters (Numbers &amp; Labels)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {metrics.map((metric, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl border border-zinc-200 bg-zinc-50/70 space-y-2"
                    >
                      <div className="grid grid-cols-3 gap-2">
                        <div className="col-span-2">
                          <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase">
                            Count Value
                          </span>
                          <input
                            type="number"
                            value={metric.value}
                            onChange={(e) =>
                              handleMetricChange(idx, "value", e.target.value)
                            }
                            className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-200 text-sm font-mono font-bold text-zinc-900 bg-white"
                          />
                        </div>
                        <div>
                          <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase">
                            Suffix
                          </span>
                          <input
                            type="text"
                            value={metric.suffix}
                            onChange={(e) =>
                              handleMetricChange(idx, "suffix", e.target.value)
                            }
                            placeholder="+"
                            className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-200 text-sm font-mono font-bold text-zinc-900 bg-white text-center"
                          />
                        </div>
                      </div>
                      <div>
                        <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase">
                          Label
                        </span>
                        <input
                          type="text"
                          value={metric.label}
                          onChange={(e) =>
                            handleMetricChange(idx, "label", e.target.value)
                          }
                          className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-200 text-xs font-geist text-zinc-700 bg-white uppercase tracking-wider"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. Achievement Cards */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold font-mono tracking-wider text-zinc-900 uppercase">
                    Honor &amp; Trophy Cards
                  </label>
                  <button
                    type="button"
                    onClick={handleAddNewCard}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
                  >
                    <Plus size={13} />
                    <span>Add Honor Card</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {cards.map((card, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl border border-zinc-200 bg-white shadow-xs space-y-3 relative"
                    >
                      {cards.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveCard(idx)}
                          className="absolute top-3 right-3 p-1.5 text-zinc-400 hover:text-red-600 rounded-md transition-colors cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}

                      <div className="grid grid-cols-12 gap-3">
                        <div className="col-span-3 sm:col-span-2">
                          <label className="block text-[10px] font-mono font-bold text-zinc-500 uppercase mb-1">
                            Emoji
                          </label>
                          <input
                            type="text"
                            value={card.emoji}
                            onChange={(e) =>
                              handleCardChange(idx, "emoji", e.target.value)
                            }
                            className="w-full text-center px-2 py-1.5 rounded-lg border border-zinc-200 text-base"
                          />
                        </div>

                        <div className="col-span-9 sm:col-span-6">
                          <label className="block text-[10px] font-mono font-bold text-zinc-500 uppercase mb-1">
                            Title
                          </label>
                          <input
                            type="text"
                            value={card.title}
                            onChange={(e) =>
                              handleCardChange(idx, "title", e.target.value)
                            }
                            className="w-full px-3 py-1.5 rounded-lg border border-zinc-200 text-xs font-geist font-bold text-zinc-900"
                          />
                        </div>

                        <div className="col-span-12 sm:col-span-4">
                          <label className="block text-[10px] font-mono font-bold text-zinc-500 uppercase mb-1">
                            Badge Tag
                          </label>
                          <input
                            type="text"
                            value={card.tag}
                            onChange={(e) =>
                              handleCardChange(idx, "tag", e.target.value)
                            }
                            className="w-full px-3 py-1.5 rounded-lg border border-zinc-200 text-xs font-mono font-semibold uppercase text-zinc-700"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono font-bold text-zinc-500 uppercase mb-1">
                          Description
                        </label>
                        <input
                          type="text"
                          value={card.description}
                          onChange={(e) =>
                            handleCardChange(idx, "description", e.target.value)
                          }
                          className="w-full px-3 py-1.5 rounded-lg border border-zinc-200 text-xs font-geist text-zinc-600"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 mt-7 pt-4 border-t border-zinc-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold font-geist text-zinc-600 hover:text-zinc-900 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-5 py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-semibold font-geist transition-all shadow-sm cursor-pointer"
              >
                Save Honors &amp; Counts
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
