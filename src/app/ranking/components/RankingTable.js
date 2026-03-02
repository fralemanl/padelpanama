"use client";

import Link from "next/link";

export default function RankingTable({
  players = [],
  scoreType = "SUM_OF_POINTS_GLOBAL",
}) {
  const scoreLabel = {
    SUM_OF_POINTS_HISTORICO: "Puntaje Histórico",
    SUM_OF_POINTS_GLOBAL: "Puntaje Global",
    SUM_OF_POINTS_RACE: "Puntaje Race",
  }[scoreType];

  const tournamentKey = scoreType.replace(
    "SUM_OF_POINTS",
    "SUM_OF_TOURNAMENTS",
  );

  const sortedPlayers = [...players].sort((a, b) => {
    const scoreA = parseFloat(a[scoreType]) || 0;
    const scoreB = parseFloat(b[scoreType]) || 0;
    return scoreB - scoreA;
  });

  return (
    <div className="ranking-table">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>{scoreLabel}</th>
            <th>Promedio</th>
            <th>Torneos</th>
          </tr>
        </thead>
        <tbody>
          {sortedPlayers.map((player, index) => {
            const averageKey = scoreType.replace(
              "SUM_OF_POINTS",
              "AVERAGE_OF_POINTS",
            );
            const playerGender = player.gender || "masculino";
            return (
              <tr key={player.INDEX || player.NAME || index}>
                <td className="rank">{index + 1}</td>
                <td>
                  <Link
                    href={`/ranking/player/${encodeURIComponent(
                      player.NAME,
                    )}?gender=${encodeURIComponent(playerGender)}`}
                    style={{textDecoration: "none", color: "#667eea"}}
                  >
                    {player.NAME}
                  </Link>
                </td>
                <td>{player.CATEGORY || "-"}</td>
                <td>
                  <strong>{player[scoreType] || 0}</strong>
                </td>
                <td>{parseFloat(player[averageKey] || 0).toFixed(2)}</td>
                <td>{player[tournamentKey] || 0}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
