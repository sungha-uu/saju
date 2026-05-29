#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";

const inputPath = process.argv[2] || "db/calendar-cache.sql";
const outputDir = process.argv[3] || "data/calendar";

const sql = await fs.readFile(inputPath, "utf8");
await fs.mkdir(outputDir, { recursive: true });

const rowPattern =
  /\('(\d{4}-\d{2}-\d{2})',\s*(\d+),\s*(\d+),\s*(\d+),\s*(\d+),\s*(\d+),\s*(\d+),\s*(true|false),\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*([^,]+),\s*(\d+),\s*'[^']*',\s*'[^']*'\)/g;

const byYear = new Map();
let match;

while ((match = rowPattern.exec(sql)) !== null) {
  const [
    ,
    date,
    solarYear,
    solarMonth,
    solarDay,
    lunarYear,
    lunarMonth,
    lunarDay,
    isLeapMonth,
    yearGanji,
    monthGanji,
    dayGanji,
    julianDay,
    weekday,
  ] = match;
  const year = solarYear;

  if (!byYear.has(year)) byYear.set(year, []);
  byYear.get(year).push({
    date,
    sy: Number(solarYear),
    sm: Number(solarMonth),
    sd: Number(solarDay),
    ly: Number(lunarYear),
    lm: Number(lunarMonth),
    ld: Number(lunarDay),
    leap: isLeapMonth === "true",
    yg: yearGanji,
    mg: monthGanji,
    dg: dayGanji,
    jd: julianDay === "NULL" ? null : Number(julianDay),
    wd: Number(weekday),
  });
}

for (const [year, rows] of byYear.entries()) {
  rows.sort((a, b) => a.date.localeCompare(b.date));
  await fs.writeFile(path.join(outputDir, `${year}.json`), JSON.stringify(rows), "utf8");
}

await fs.writeFile(
  path.join(outputDir, "manifest.json"),
  JSON.stringify({
    source: inputPath,
    years: [...byYear.keys()].map(Number).sort((a, b) => a - b),
    totalDays: [...byYear.values()].reduce((sum, rows) => sum + rows.length, 0),
    generatedAt: new Date().toISOString(),
  }),
  "utf8",
);

console.log(`Wrote ${byYear.size} yearly calendar JSON files to ${outputDir}`);
