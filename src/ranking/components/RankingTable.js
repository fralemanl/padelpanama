"use client";

import {useEffect, useState} from "react";
import Link from "next/link";
import {
  buildGoogleDriveImageUrl,
  buildGoogleDriveThumbnailUrl,
} from "@/ranking/lib/sheets";

export default function RankingTable({players, allPlayers = [], category}) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getFoto = (p) => (p?.FOTO || p?.Foto || p?.foto || "").trim();

  const normalizeText = (value) =>
    String(value || "")
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  const getFlagImagePath = (nationality) => {
    const key = normalizeText(nationality);
    if (!key) return "";
    if (key === "panama") return "/flags/pa.png";
    if (key === "colombia") return "/flags/co.png";
    if (key === "argentina") return "/flags/ar.png";
    if (key === "espana") return "/flags/es.png";
    if (key === "paraguay") return "/flags/py.png";
    if (key === "venezuela") return "/flags/ve.png";
    if (key === "mexico") return "/flags/mx.png";
    if (key === "costa rica") return "/flags/cr.png";
    if (key === "brasil") return "/flags/br.png";
    if (key === "chile" || key.startsWith("chil")) return "/flags/cl.png";
    return "";
  };

  const sortedPlayers = [...players].sort((a, b) => {
    const pointsA =
      typeof a.POINTS_NUM === "number"
        ? a.POINTS_NUM
        : parseFloat(a.POINTS) || 0;
    const pointsB =
      typeof b.POINTS_NUM === "number"
        ? b.POINTS_NUM
        : parseFloat(b.POINTS) || 0;
    const pointsDiff = pointsB - pointsA;
    if (pointsDiff !== 0) return pointsDiff;
    const scoreA = parseFloat(a.ELO) || 0;
    const scoreB = parseFloat(b.ELO) || 0;
    return scoreB - scoreA;
  });

  // Calcular el ranking global por puntos y ELO
  const globalSortedPlayers = [
    ...(allPlayers.length > 0 ? allPlayers : players),
  ].sort((a, b) => {
    const pointsA =
      typeof a.POINTS_NUM === "number"
        ? a.POINTS_NUM
        : parseFloat(a.POINTS) || 0;
    const pointsB =
      typeof b.POINTS_NUM === "number"
        ? b.POINTS_NUM
        : parseFloat(b.POINTS) || 0;
    const pointsDiff = pointsB - pointsA;
    if (pointsDiff !== 0) return pointsDiff;
    const scoreA = parseFloat(a.ELO) || 0;
    const scoreB = parseFloat(b.ELO) || 0;
    return scoreB - scoreA;
  });

  const getGlobalRank = (player) => {
    return (
      globalSortedPlayers.findIndex((p) => p.NAME === player.NAME) + 1 || "—"
    );
  };

  const categoryRankMap = sortedPlayers.reduce((acc, player) => {
    const key = (player.CATEGORY || "").trim() || "—";
    if (!acc[key]) acc[key] = [];
    acc[key].push(player);
    return acc;
  }, {});

  Object.keys(categoryRankMap).forEach((key) => {
    categoryRankMap[key].sort((a, b) => {
      const pointsA =
        typeof a.POINTS_NUM === "number"
          ? a.POINTS_NUM
          : parseFloat(a.POINTS) || 0;
      const pointsB =
        typeof b.POINTS_NUM === "number"
          ? b.POINTS_NUM
          : parseFloat(b.POINTS) || 0;
      const pointsDiff = pointsB - pointsA;
      if (pointsDiff !== 0) return pointsDiff;
      const scoreA = parseFloat(a.ELO) || 0;
      const scoreB = parseFloat(b.ELO) || 0;
      return scoreB - scoreA;
    });
  });

  const getCategoryRank = (player) => {
    const key = (player.CATEGORY || "").trim() || "—";
    const list = categoryRankMap[key] || [];
    return list.findIndex((p) => p.NAME === player.NAME) + 1 || "—";
  };

  const getMedalEmoji = (index) => {
    return null;
  };

  const tableStyles = {
    wrapper: {
      overflowX: isMobile ? "hidden" : "auto",
      width: "100%",
    },
    table: {
      width: "100%",
      minWidth: "100%",
      tableLayout: isMobile ? "fixed" : "auto",
      borderCollapse: "collapse",
    },
    thead: {
      background:
        "linear-gradient(to right, rgb(6, 182, 212), rgb(139, 92, 246))",
      color: "white",
      borderBottom: "4px solid rgb(8, 145, 178)",
    },
    th: {
      padding: isMobile ? "0.55rem 0.35rem" : "1.5rem 1.5rem",
      textAlign: "left",
      fontSize: isMobile ? "0.66rem" : "0.875rem",
      fontWeight: "600",
    },
    tbody: {
      borderSpacing: "0",
    },
    tr: {
      borderBottom: "1px solid rgb(226, 232, 240)",
      transition: "background-color 0.3s ease-in-out",
    },
    trHover: {
      backgroundColor: "rgb(219, 234, 254)",
    },
    td: {
      padding: isMobile ? "0.48rem 0.3rem" : "1.5rem 1.5rem",
      fontSize: isMobile ? "0.72rem" : "0.95rem",
    },
    rankCell: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      fontSize: isMobile ? "0.92rem" : "1.125rem",
      fontWeight: "bold",
    },
    playerCell: {
      display: "flex",
      alignItems: "center",
      gap: isMobile ? "0.2rem" : "0.75rem",
      minWidth: 0,
    },
    flagCell: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    flagImage: {
      width: "40px",
      height: "20px",
      objectFit: "cover",
      borderRadius: "4px",
      boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
    },
    playerImage: {
      width: isMobile ? "0" : "2.5rem",
      height: isMobile ? "0" : "2.5rem",
      borderRadius: "50%",
      objectFit: "cover",
      border: "2px solid rgb(186, 225, 247)",
      display: isMobile ? "none" : "block",
    },
    playerLink: {
      fontWeight: "600",
      fontSize: isMobile ? "0.72rem" : "0.95rem",
      color: "rgb(6, 182, 212)",
      textDecoration: "none",
      transition: "color 0.3s ease-in-out",
      whiteSpace: isMobile ? "nowrap" : "normal",
      overflow: isMobile ? "hidden" : "visible",
      textOverflow: isMobile ? "ellipsis" : "clip",
      display: "block",
      width: "100%",
    },
    playerLinkHover: {
      color: "rgb(8, 145, 178)",
      textDecoration: "underline",
    },
    badge: {
      display: "inline-block",
      backgroundColor: "rgb(165, 243, 252)",
      color: "rgb(8, 145, 178)",
      fontSize: isMobile ? "0.68rem" : "0.75rem",
      fontWeight: "600",
      padding: isMobile ? "0.2rem 0.6rem" : "0.25rem 0.75rem",
      borderRadius: "9999px",
    },
    scoreCell: {
      textAlign: "center",
      fontWeight: "bold",
      fontSize: isMobile ? "0.74rem" : "1.125rem",
      color: "rgb(15, 23, 42)",
    },
  };

  return (
    <div style={tableStyles.wrapper}>
      <table style={tableStyles.table}>
        <thead style={tableStyles.thead}>
          <tr>
            <th style={{...tableStyles.th, width: isMobile ? "20%" : "auto"}}>
              Posición
            </th>
            {!isMobile && (
              <th style={{...tableStyles.th, textAlign: "center"}}>
                Nacionalidad
              </th>
            )}
            <th style={{...tableStyles.th, width: isMobile ? "44%" : "auto"}}>
              Jugador
            </th>
            {!isMobile && (
              <th style={{...tableStyles.th, textAlign: "center"}}>
                <div
                  style={{display: "flex", flexDirection: "column", gap: "0.15rem"}}
                >
                  <span>Categoría/</span>
                  <span style={{fontSize: "0.9rem", opacity: 0.9}}>
                    Posición en Categoría
                  </span>
                </div>
              </th>
            )}
            <th style={{...tableStyles.th, textAlign: "center", width: isMobile ? "18%" : "auto"}}>
              ELO
            </th>
            <th style={{...tableStyles.th, textAlign: "center", width: isMobile ? "18%" : "auto"}}>
              Puntos
            </th>
          </tr>
        </thead>
        <tbody style={tableStyles.tbody}>
          {sortedPlayers.map((player, index) => {
            const fotoValue = getFoto(player);
            const fotoSrc =
              buildGoogleDriveImageUrl(fotoValue) ||
              buildGoogleDriveThumbnailUrl(fotoValue, 120);
            const medal = getMedalEmoji(index);
            const categoryRank = getCategoryRank(player);
            const flagPath = getFlagImagePath(player.NATIONALITY);

            return (
              <tr
                key={player.INDEX || index}
                style={tableStyles.tr}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = "rgb(219, 234, 254)")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                <td style={tableStyles.td}>
                  <span
                    style={{
                      backgroundColor: "rgb(34, 197, 94)",
                      color: "white",
                      padding: isMobile ? "0.2rem 0.6rem" : "0.25rem 0.75rem",
                      borderRadius: "0.5rem",
                      fontSize: isMobile ? "0.82rem" : "0.95rem",
                      fontWeight: "bold",
                    }}
                  >
                    #{getGlobalRank(player)}
                  </span>
                </td>
                {!isMobile && (
                  <td style={{...tableStyles.td, textAlign: "center"}}>
                    <div style={tableStyles.flagCell}>
                      {flagPath ? (
                        <img
                          src={flagPath}
                          alt={
                            player.NATIONALITY
                              ? `Bandera ${player.NATIONALITY}`
                              : "Bandera"
                          }
                          style={tableStyles.flagImage}
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <span style={{color: "rgb(148, 163, 184)"}}>—</span>
                      )}
                    </div>
                  </td>
                )}
                <td style={tableStyles.td}>
                  <div style={tableStyles.playerCell}>
                    {fotoSrc && (
                      <img
                        src={fotoSrc}
                        alt={player.NAME}
                        style={tableStyles.playerImage}
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          const thumb = buildGoogleDriveThumbnailUrl(
                            fotoValue,
                            120,
                          );
                          if (thumb && e.currentTarget.src !== thumb) {
                            e.currentTarget.src = thumb;
                            return;
                          }
                          e.currentTarget.onerror = null;
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    )}
                    <Link
                      href={`/ranking/player/${encodeURIComponent(
                        player.NAME,
                      )}?gender=${encodeURIComponent(
                        player.gender,
                      )}&category=${encodeURIComponent(category || "all")}`}
                      style={tableStyles.playerLink}
                      onMouseOver={(e) => {
                        e.currentTarget.style.color = "rgb(8, 145, 178)";
                        e.currentTarget.style.textDecoration = "underline";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.color = "rgb(6, 182, 212)";
                        e.currentTarget.style.textDecoration = "none";
                      }}
                    >
                      {player.NAME}
                    </Link>
                  </div>
                </td>
                {!isMobile && (
                  <td style={{...tableStyles.td, textAlign: "center"}}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.25rem",
                      }}
                    >
                      <span style={tableStyles.badge}>
                        {player.CATEGORY || "—"}
                      </span>
                      <span style={tableStyles.badge}>#{categoryRank}</span>
                      {medal && <span style={{fontSize: "1.1rem"}}>{medal}</span>}
                    </div>
                  </td>
                )}
                <td style={tableStyles.scoreCell}>
                  {player.ELO_DISPLAY || player.ELO || 0}
                </td>
                <td style={tableStyles.scoreCell}>{player.POINTS || "—"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
