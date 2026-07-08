"use client";

import { useEffect, useState } from "react";
import { WritingChart } from "./WritingChart";

export function TaskChartPreview({ testId, taskNumber }) {
  const [chart, setChart] = useState(null);

  useEffect(() => {
    setChart(null);
    if (taskNumber !== 1 || !testId) return;
    fetch(`/api/tests/${testId}`)
      .then((res) => res.json())
      .then((data) => {
        const content = data.test?.content;
        if (content?.chartData) {
          setChart({ title: content.chartTitle, unit: content.chartUnit, data: content.chartData });
        }
      })
      .catch(() => {});
  }, [testId, taskNumber]);

  if (!chart) return null;

  return (
    <div className="mt-3 rounded-xl border border-slate-100 bg-slate-50 p-3">
      <WritingChart title={chart.title} unit={chart.unit} data={chart.data} />
    </div>
  );
}
