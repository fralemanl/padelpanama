"use client";

import {useEffect, useMemo, useState} from "react";
import Link from "next/link";
import {
  fetchPlayers,
  fetchCategoryTable,
  buildGoogleDriveImageUrl,
  buildGoogleDriveThumbnailUrl,
} from "@/ranking/lib/sheets";

const COLUMN_INDEX = {
  NAME: 1, // B
  ELO: 3, // D
  CATEGORY: 4, // E
  PHOTO: 17, // R
};

const getColumnValue = (row, index) => {
  if (!row) return "";
  if (Array.isArray(row)) return row[index] || "";
  if (row.__values) return row.__values[index] || "";
  return "";
};

const parseEloValue = (value) => {
  if (value === null || value === undefined) return 0;
  const digitsOnly = String(value).replace(/[^0-9]/g, "");
  const parsed = parseInt(digitsOnly, 10);
  return Number.isNaN(parsed) ? 0 : parsed;
};

export default function ComparePage() {
  const [gender, setGender] = useState("masculino");
  const [players, setPlayers] = useState([]);
  const [leftPlayerName, setLeftPlayerName] = useState("");
  const [rightPlayerName, setRightPlayerName] = useState("");
  const [leftSearch, setLeftSearch] = useState("");
  const [rightSearch, setRightSearch] = useState("");
  const [leftCategorySearch, setLeftCategorySearch] = useState("all");
  const [rightCategorySearch, setRightCategorySearch] = useState("all");
  const [loading, setLoading] = useState(true);
  const [categoryTable, setCategoryTable] = useState([]);
  const [tableLoading, setTableLoading] = useState(true);
  const [calculated, setCalculated] = useState(false);
  const [showLegend, setShowLegend] = useState(false);

  const CATEGORY_TABLE_GID = "639425194";

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchPlayers(gender)
      .then((data) => {
        if (!mounted) return;
        const mapped = data
          .filter(Boolean)
          .map((row) => {
            const name = getColumnValue(row, COLUMN_INDEX.NAME);
            const eloValue = getColumnValue(row, COLUMN_INDEX.ELO);
            const categoryValue = getColumnValue(row, COLUMN_INDEX.CATEGORY);
            const photoValue = getColumnValue(row, COLUMN_INDEX.PHOTO);
            return {
              NAME: name,
              ELO: parseEloValue(eloValue),
              ELO_DISPLAY: eloValue,
              CATEGORY: categoryValue,
              FOTO: photoValue,
              _raw: row,
            };
          })
          .filter((p) => p.NAME && p.NAME.trim() !== "");

        const uniqueByName = new Map();
        mapped.forEach((p) => {
          const key = p.NAME.trim();
          if (!uniqueByName.has(key)) {
            uniqueByName.set(key, p);
          }
        });

        const uniquePlayers = Array.from(uniqueByName.values()).sort((a, b) =>
          a.NAME.localeCompare(b.NAME),
        );

        setPlayers(uniquePlayers);
        setLeftPlayerName("");
        setRightPlayerName("");
        setLeftSearch("");
        setRightSearch("");
        setLeftCategorySearch("all");
        setRightCategorySearch("all");
        setCalculated(false);
        setLoading(false);
      })
      .catch(() => {
        if (!mounted) return;
        setPlayers([]);
        setLoading(false);
      });
    return () => (mounted = false);
  }, [gender]);

  useEffect(() => {
    let mounted = true;
    setTableLoading(true);
    fetchCategoryTable(CATEGORY_TABLE_GID)
      .then((rows) => {
        if (!mounted) return;
        setCategoryTable(rows || []);
        setTableLoading(false);
      })
      .catch(() => {
        if (!mounted) return;
        setCategoryTable([]);
        setTableLoading(false);
      });
    return () => (mounted = false);
  }, []);

  const leftPlayer = useMemo(
    () => players.find((p) => p.NAME === leftPlayerName) || null,
    [players, leftPlayerName],
  );
  const rightPlayer = useMemo(
    () => players.find((p) => p.NAME === rightPlayerName) || null,
    [players, rightPlayerName],
  );

  const filteredLeftPlayers = useMemo(() => {
    const nameTerm = leftSearch.trim().toLowerCase();
    const categoryTerm = leftCategorySearch.trim().toLowerCase();
    if (!nameTerm && (categoryTerm === "all" || !categoryTerm)) return players;
    return players.filter((p) => {
      const nameMatch = nameTerm
        ? (p.NAME || "").toLowerCase().includes(nameTerm)
        : true;
      const categoryMatch =
        categoryTerm === "all"
          ? true
          : (p.CATEGORY || "").toLowerCase().includes(categoryTerm);
      return nameMatch && categoryMatch;
    });
  }, [players, leftSearch, leftCategorySearch]);

  const filteredRightPlayers = useMemo(() => {
    const nameTerm = rightSearch.trim().toLowerCase();
    const categoryTerm = rightCategorySearch.trim().toLowerCase();
    if (!nameTerm && (categoryTerm === "all" || !categoryTerm)) return players;
    return players.filter((p) => {
      const nameMatch = nameTerm
        ? (p.NAME || "").toLowerCase().includes(nameTerm)
        : true;
      const categoryMatch =
        categoryTerm === "all"
          ? true
          : (p.CATEGORY || "").toLowerCase().includes(categoryTerm);
      return nameMatch && categoryMatch;
    });
  }, [players, rightSearch, rightCategorySearch]);

  useEffect(() => {
    if (calculated) setCalculated(false);
  }, [leftPlayerName, rightPlayerName, gender]);

  const averageElo = useMemo(() => {
    if (!calculated || !leftPlayer || !rightPlayer) return null;
    const left = parseFloat(leftPlayer.ELO) || 0;
    const right = parseFloat(rightPlayer.ELO) || 0;
    return (left + right) / 2;
  }, [leftPlayer, rightPlayer, calculated]);

  const resolveCategory = (elo) => {
    if (elo === null || Number.isNaN(elo)) return "—";
    if (elo > 2200) return "PRO";
    if (elo > 2000) return "1ra";
    if (elo > 1800) return "2da";
    if (elo > 1600) return "3ra";
    if (elo > 1400) return "4ta";
    if (elo > 1200) return "5ta";
    if (elo >= 1000) return "6ta";
    if (elo < 1000) return "7ma";

    return "—";
  };

  const averageCategory = useMemo(
    () => resolveCategory(averageElo),
    [averageElo, categoryTable],
  );

  const globalRankMap = useMemo(() => {
    const sorted = [...players].sort((a, b) => (b.ELO || 0) - (a.ELO || 0));
    const map = new Map();
    sorted.forEach((p, index) => map.set(p.NAME, index + 1));
    return map;
  }, [players]);

  const categoryRankMap = useMemo(() => {
    const map = new Map();
    const grouped = new Map();
    players.forEach((p) => {
      const key = (p.CATEGORY || "").trim();
      if (!grouped.has(key)) grouped.set(key, []);
      grouped.get(key).push(p);
    });

    grouped.forEach((group) => {
      group.sort((a, b) => (b.ELO || 0) - (a.ELO || 0));
      group.forEach((p, index) => map.set(p.NAME, index + 1));
    });

    return map;
  }, [players]);

  const renderPlayerCard = (player) => {
    if (!player) {
      return (
        <div
          style={{
            backgroundColor: "#f0f0f0",
            borderRadius: "0.5rem",
            padding: "1.5rem",
            textAlign: "center",
          }}
        >
          <p style={{color: "rgb(100, 116, 139)"}}>Selecciona un jugador</p>
        </div>
      );
    }

    const fotoValue = (player.FOTO || "").trim();
    const fotoSrc =
      buildGoogleDriveImageUrl(fotoValue) ||
      buildGoogleDriveThumbnailUrl(fotoValue, 400);

    return (
      <div>
        <div
          style={{
            backgroundColor: "#4a6cf7",
            borderRadius: "0.75rem",
            padding: "0.75rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "0.75rem",
          }}
        >
          {fotoSrc ? (
            <img
              src={fotoSrc}
              alt={player.NAME}
              style={{
                width: "180px",
                height: "220px",
                objectFit: "cover",
                borderRadius: "0.75rem",
              }}
              referrerPolicy="no-referrer"
              onError={(e) => {
                const thumb = buildGoogleDriveThumbnailUrl(fotoValue, 400);
                if (thumb && e.currentTarget.src !== thumb) {
                  e.currentTarget.src = thumb;
                  return;
                }
                e.currentTarget.onerror = null;
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <div style={{color: "white", fontWeight: "600"}}>FOTO</div>
          )}
        </div>

        <div
          style={{
            backgroundColor: "#4a6cf7",
            color: "white",
            padding: "0.5rem",
            borderRadius: "0.5rem",
            textAlign: "center",
            fontWeight: "600",
            marginBottom: "0.5rem",
          }}
        >
          ELO: {player.ELO_DISPLAY || player.ELO || 0}
        </div>

        <div
          style={{
            backgroundColor: "#4a6cf7",
            color: "white",
            padding: "0.5rem",
            borderRadius: "0.5rem",
            textAlign: "center",
            fontWeight: "600",
            marginBottom: "0.5rem",
          }}
        >
          CATEGORIA: {player.CATEGORY || "—"}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: "0.5rem",
          }}
        >
          <div
            style={{
              backgroundColor: "#4a6cf7",
              color: "white",
              padding: "0.5rem",
              borderRadius: "0.5rem",
              textAlign: "center",
              fontWeight: "600",
              fontSize: "0.85rem",
            }}
          >
            POSICION GLOBAL
            <div style={{fontSize: "1rem", marginTop: "0.25rem"}}>
              #{globalRankMap.get(player.NAME) || "—"}
            </div>
          </div>
          <div
            style={{
              backgroundColor: "#4a6cf7",
              color: "white",
              padding: "0.5rem",
              borderRadius: "0.5rem",
              textAlign: "center",
              fontWeight: "600",
              fontSize: "0.85rem",
            }}
          >
            POSICION CATEGORIA
            <div style={{fontSize: "1rem", marginTop: "0.25rem"}}>
              #{categoryRankMap.get(player.NAME) || "—"}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(to bottom, rgb(241, 245, 249) 0%, rgb(219, 234, 254) 50%, rgb(226, 232, 240) 100%)",
        padding: "2.5rem 1rem",
      }}
    >
      <div style={{maxWidth: "62rem", margin: "0 auto"}}>
        <div
          style={{
            marginBottom: "2.5rem",
            padding: "1.5rem",
            borderRadius: "1rem",
            background:
              "linear-gradient(135deg, rgba(15, 23, 42, 0.08), rgba(59, 130, 246, 0.08))",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: "2.4rem",
              fontWeight: "800",
              color: "rgb(15, 23, 42)",
              letterSpacing: "0.02em",
            }}
          >
            Calcula tu categoría
          </h1>
          <div
            style={{
              width: "120px",
              height: "4px",
              borderRadius: "999px",
              backgroundColor: "rgb(6, 182, 212)",
              margin: "0.75rem auto 0",
            }}
          />
          <div
            style={{
              marginTop: "1rem",
              display: "flex",
              justifyContent: "center",
              gap: "0.75rem",
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              onClick={() => setShowLegend(true)}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "rgb(15, 23, 42)",
                borderRadius: "999px",
                border: "1px solid rgb(15, 23, 42)",
                color: "white",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              ELO Limits
            </button>
            <Link
              href="/ranking"
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "white",
                borderRadius: "999px",
                border: "1px solid #cfcfcf",
                color: "#0f172a",
                fontWeight: "600",
                textDecoration: "none",
              }}
            >
              Volver al ranking
            </Link>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "0.75rem",
            marginBottom: "2rem",
          }}
        >
          <span
            style={{
              padding: "0.5rem 1.5rem",
              backgroundColor: "#e2e2e2",
              borderRadius: "0.25rem",
              border: "1px solid #cfcfcf",
              fontWeight: "700",
              letterSpacing: "0.08em",
            }}
          >
            GENERO
          </span>
          <div style={{minWidth: "220px"}}>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              style={{
                width: "100%",
                padding: "0.5rem",
                borderRadius: "0.25rem",
              }}
            >
              <option value="masculino">Masculino ♂</option>
              <option value="femenino">Femenino ♀</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div style={{textAlign: "center", padding: "2rem"}}>
            Cargando jugadores...
          </div>
        ) : (
          <div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "2rem",
              }}
            >
              <div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "2fr 1fr",
                    gap: "0.5rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: "#e2e2e2",
                      textAlign: "center",
                      padding: "0.4rem",
                      fontWeight: "700",
                    }}
                  >
                    NOMBRE
                  </div>
                  <div
                    style={{
                      backgroundColor: "#e2e2e2",
                      textAlign: "center",
                      padding: "0.4rem",
                      fontWeight: "700",
                    }}
                  >
                    CATEGORIA
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "2fr 1fr",
                    gap: "0.5rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  <input
                    type="text"
                    value={leftSearch}
                    onChange={(e) => setLeftSearch(e.target.value)}
                    placeholder="Buscar nombre"
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      borderRadius: "0.25rem",
                      border: "1px solid #cfcfcf",
                    }}
                  />
                  <select
                    value={leftCategorySearch}
                    onChange={(e) => setLeftCategorySearch(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      borderRadius: "0.25rem",
                    }}
                  >
                    <option value="all">Todas</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                  </select>
                </div>

                <select
                  value={leftPlayerName}
                  onChange={(e) => setLeftPlayerName(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    borderRadius: "0.25rem",
                    marginBottom: "1rem",
                  }}
                >
                  <option value="">Seleccionar jugador</option>
                  {filteredLeftPlayers.map((p) => (
                    <option key={p.NAME} value={p.NAME}>
                      {p.NAME}
                    </option>
                  ))}
                </select>
                {renderPlayerCard(leftPlayer)}
              </div>
              <div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "2fr 1fr",
                    gap: "0.5rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: "#e2e2e2",
                      textAlign: "center",
                      padding: "0.4rem",
                      fontWeight: "700",
                    }}
                  >
                    NOMBRE
                  </div>
                  <div
                    style={{
                      backgroundColor: "#e2e2e2",
                      textAlign: "center",
                      padding: "0.4rem",
                      fontWeight: "700",
                    }}
                  >
                    CATEGORIA
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "2fr 1fr",
                    gap: "0.5rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  <input
                    type="text"
                    value={rightSearch}
                    onChange={(e) => setRightSearch(e.target.value)}
                    placeholder="Buscar nombre"
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      borderRadius: "0.25rem",
                      border: "1px solid #cfcfcf",
                    }}
                  />
                  <select
                    value={rightCategorySearch}
                    onChange={(e) => setRightCategorySearch(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      borderRadius: "0.25rem",
                    }}
                  >
                    <option value="all">Todas</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                  </select>
                </div>

                <select
                  value={rightPlayerName}
                  onChange={(e) => setRightPlayerName(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    borderRadius: "0.25rem",
                    marginBottom: "1rem",
                  }}
                >
                  <option value="">Seleccionar jugador</option>
                  {filteredRightPlayers.map((p) => (
                    <option key={p.NAME} value={p.NAME}>
                      {p.NAME}
                    </option>
                  ))}
                </select>
                {renderPlayerCard(rightPlayer)}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "1.5rem",
              }}
            >
              <button
                type="button"
                onClick={() => {
                  if (leftPlayer && rightPlayer) {
                    setCalculated(true);
                  }
                }}
                style={{
                  padding: "0.6rem 2rem",
                  backgroundColor: "#4a6cf7",
                  color: "white",
                  border: "none",
                  borderRadius: "0.5rem",
                  fontWeight: "700",
                  letterSpacing: "0.08em",
                  cursor: leftPlayer && rightPlayer ? "pointer" : "not-allowed",
                  opacity: leftPlayer && rightPlayer ? 1 : 0.6,
                }}
                disabled={!leftPlayer || !rightPlayer}
              >
                CALCULAR
              </button>
            </div>

            {calculated && (
              <div
                style={{
                  display: "grid",
                  gap: "1rem",
                  marginTop: "2rem",
                }}
              >
                <div
                  style={{
                    backgroundColor: "#e2e2e2",
                    borderRadius: "0.25rem",
                    padding: "1rem",
                    textAlign: "center",
                    fontWeight: "700",
                    fontSize: "2rem",
                  }}
                >
                  ELO PROMEDIO: {averageElo !== null ? averageElo : "—"}
                </div>
                <div
                  style={{
                    backgroundColor: "#e2e2e2",
                    borderRadius: "0.25rem",
                    padding: "1rem",
                    textAlign: "center",
                    fontWeight: "700",
                    fontSize: "2rem",
                  }}
                >
                  CATEGORIA MÍNIMA:{" "}
                  {tableLoading ? "Cargando..." : averageCategory}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {showLegend && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(15, 23, 42, 0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem",
            zIndex: 50,
          }}
          onClick={() => setShowLegend(false)}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "1rem",
              padding: "2rem",
              maxWidth: "36rem",
              width: "100%",
              boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "1rem",
              }}
            >
              <h3 style={{margin: 0, fontSize: "1.25rem", fontWeight: "700"}}>
                Categorias por Ranking ELO
              </h3>
              <button
                type="button"
                onClick={() => setShowLegend(false)}
                style={{
                  border: "none",
                  background: "transparent",
                  fontSize: "1.25rem",
                  cursor: "pointer",
                  color: "rgb(71, 85, 105)",
                }}
                aria-label="Cerrar"
              >
                ✕
              </button>
            </div>
            <div style={{display: "grid", gap: "0.5rem"}}>
              <div style={{display: "flex", justifyContent: "space-between"}}>
                <span>PRO</span>
                <span>2201+</span>
              </div>
              <div style={{display: "flex", justifyContent: "space-between"}}>
                <span>1ra</span>
                <span>2001 – 2200</span>
              </div>
              <div style={{display: "flex", justifyContent: "space-between"}}>
                <span>2da</span>
                <span>1801 – 2000</span>
              </div>
              <div style={{display: "flex", justifyContent: "space-between"}}>
                <span>3ra</span>
                <span>1601 – 1800</span>
              </div>
              <div style={{display: "flex", justifyContent: "space-between"}}>
                <span>4ta</span>
                <span>1401 – 1600</span>
              </div>
              <div style={{display: "flex", justifyContent: "space-between"}}>
                <span>5ta</span>
                <span>1201 – 1400</span>
              </div>
              <div style={{display: "flex", justifyContent: "space-between"}}>
                <span>6ta</span>
                <span>1000 – 1200</span>
              </div>
              <div style={{display: "flex", justifyContent: "space-between"}}>
                <span>7ma</span>
                <span>Menos de 1000</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
