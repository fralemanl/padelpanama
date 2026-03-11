"use client";

import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";

export default function PlayerRadar({ player }) {
  const legendMap = {
    MNT: "Mentalidad",
    FIS: "Físico",
    TEC: "Técnica",
    ATA: "Ataque",
    DEF: "Defensa",
    TAC: "Táctica",
  };

  const rawData =
    Array.isArray(player?.RADAR_STATS) && player.RADAR_STATS.length > 0
      ? player.RADAR_STATS
      : [
          { stat: "FIS", value: parseFloat(player.FIS || 0) || 0 },
          { stat: "TEC", value: parseFloat(player.TEC || 0) || 0 },
          { stat: "TAC", value: parseFloat(player.TAC || 0) || 0 },
          { stat: "ATA", value: parseFloat(player.ATA || 0) || 0 },
          { stat: "DEF", value: parseFloat(player.DEF || 0) || 0 },
          { stat: "MNT", value: parseFloat(player.MNT || 0) || 0 },
        ];

  const isOvrStat = (stat) => {
    const normalized = String(stat || "").trim().toLowerCase();
    return normalized === "ovr" || normalized === "overall";
  };

  const ovrStat = rawData.find((item) => isOvrStat(item?.stat));
  const data = rawData
    .filter((item) => !isOvrStat(item?.stat))
    .map((item) => {
      const code = String(item?.stat || "").trim().toUpperCase();
      const numericValue = Number(item?.value) || 0;
      const baseLabel = legendMap[code] || item?.stat || "";
      return {
        ...item,
        value: numericValue,
        stat: baseLabel,
        statLabel: `${baseLabel} (${Math.round(numericValue)})`,
      };
    });
  const ovrValue = ovrStat ? Number(ovrStat.value) || 0 : null;

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexWrap: "wrap",
        gap: "1rem",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ width: "100%", maxWidth: 360, height: 300, flex: "0 1 360px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart
            data={data}
            margin={{ top: 8, right: 36, bottom: 8, left: 36 }}
            outerRadius="62%"
          >
            <PolarGrid stroke="#374151" />
            <PolarAngleAxis
              dataKey="statLabel"
              tick={{ fontSize: 12, fill: "#334155", fontWeight: 700 }}
            />
            <Radar
              name="Stats"
              dataKey="value"
              stroke="#667eea"
              fill="#667eea"
              fillOpacity={0.6}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {ovrValue !== null && (
        <div
          style={{
            flex: "0 0 auto",
            display: "flex",
            alignItems: "center",
          }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, rgb(15, 23, 42), rgb(51, 65, 85))",
              color: "white",
              borderRadius: "0.7rem",
              padding: "0.55rem 0.75rem",
              minWidth: "86px",
              textAlign: "center",
              boxShadow: "0 6px 14px rgba(15, 23, 42, 0.25)",
            }}
          >
            <div style={{ fontSize: "0.68rem", opacity: 0.8, fontWeight: 700 }}>
              OVERALL
            </div>
            <div style={{ fontSize: "1.15rem", fontWeight: 800 }}>
              {ovrValue}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
