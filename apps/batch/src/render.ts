/**
 * Chart → PDF for the emailed batch. Spike S3 (WS8 with WS7, due 9 Oct) picks the route:
 *  (a) HTML → PDF via Utilities/Drive conversion — check that 中文 renders and the grid holds;
 *  (b) fill a Google Slides chart template and export it as PDF (the fallback).
 * WS7 owns the chart renderer; if route (a) wins, share one `chartHtml(chart)` with the web app.
 */
import { todo, type ChartResult } from '@bazi/engine';

export function renderChartPdf(chart: ChartResult, label: string): GoogleAppsScript.Base.Blob {
  return todo('WS8', `renderChartPdf("${label}", day master ${chart.dayMaster}) — spike S3`);
}
