"use client";

import {useEffect, useMemo, useRef, useState} from "react";
import {useSearchParams} from "next/navigation";
import Link from "next/link";
import {fetchPlayers} from "@/ranking/lib/sheets";
import Filters from "@/ranking/components/Filters";
import RankingTable from "@/ranking/components/RankingTable";
import TopPlayersShowcase from "@/ranking/components/TopPlayersShowcase";

const COLUMN_INDEX = {
  NAME: 1, // Columna B
  POINTS: 2, // Columna C
  ELO: 3, // Columna D
  CATEGORY: 4, // Columna E
  PHOTO: 17, // Columna R
  NATIONALITY: 18, // Columna S
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

const parsePointsValue = (value) => {
  if (value === null || value === undefined) return 0;
  const digitsOnly = String(value).replace(/[^0-9]/g, "");
  const parsed = parseInt(digitsOnly, 10);
  return Number.isNaN(parsed) ? 0 : parsed;
};

const normalizeText = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const CATEGORY_OPTIONS = [
  "all",
  "PRO",
  "1ra",
  "2da",
  "3ra",
  "4ta",
  "5ta",
  "6ta",
];

export default function HomePageClient() {
  const basePath = "/ranking";
  const searchParams = useSearchParams();
  const [gender, setGender] = useState("masculino");
  const [category, setCategory] = useState("all");
  const [nationality, setNationality] = useState("all");
  const [sortBy, setSortBy] = useState("points");
  const [searchTerm, setSearchTerm] = useState("");
  const [showLegend, setShowLegend] = useState(false);
  const initializedRef = useRef(false);
  const storageKey = "rankingEloFilters";
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (initializedRef.current) return;

    const paramGender = searchParams?.get("gender");
    const paramCategory = searchParams?.get("category");
    const paramNationality = searchParams?.get("nationality");
    const paramSortBy = searchParams?.get("sortBy");

    let nextGender = paramGender || "masculino";
    let nextCategory = paramCategory || "all";
    let nextNationality = paramNationality || "all";
    let nextSortBy = paramSortBy || "points";
    let nextSearchTerm = "";

    if (!paramGender || !paramCategory || !paramNationality || !paramSortBy) {
      const stored = window.sessionStorage.getItem(storageKey);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (!paramGender && parsed?.gender) nextGender = parsed.gender;
          if (!paramCategory && parsed?.category)
            nextCategory = parsed.category;
          if (!paramNationality && parsed?.nationality)
            nextNationality = parsed.nationality;
          if (!paramSortBy && parsed?.sortBy) nextSortBy = parsed.sortBy;
          if (parsed?.searchTerm) nextSearchTerm = parsed.searchTerm;
        } catch {
          // ignore parse errors
        }
      }
    }

    setGender(nextGender);
    if (!CATEGORY_OPTIONS.includes(nextCategory)) {
      nextCategory = "all";
    }
    setCategory(nextCategory);
    setNationality(nextNationality);
    setSortBy(nextSortBy);
    setSearchTerm(nextSearchTerm);
    initializedRef.current = true;

    const params = new URLSearchParams(window.location.search);
    params.set("gender", nextGender);
    params.set("category", nextCategory);
    params.set("nationality", nextNationality);
    params.set("sortBy", nextSortBy);
    const query = params.toString();
    const nextUrl = query ? `${basePath}?${query}` : basePath;
    window.history.replaceState(null, "", nextUrl);
  }, [searchParams]);

  useEffect(() => {
    if (!initializedRef.current || typeof window === "undefined") return;
    window.sessionStorage.setItem(
      storageKey,
      JSON.stringify({gender, category, nationality, sortBy, searchTerm}),
    );

    const params = new URLSearchParams(window.location.search);
    params.set("gender", gender);
    params.set("category", category);
    params.set("nationality", nationality);
    params.set("sortBy", sortBy);
    const query = params.toString();
    const nextUrl = query ? `${basePath}?${query}` : basePath;

    window.history.replaceState(null, "", nextUrl);
  }, [gender, category, nationality, sortBy]);

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
            const pointsValue = getColumnValue(row, COLUMN_INDEX.POINTS);
            const categoryValue = getColumnValue(row, COLUMN_INDEX.CATEGORY);
            const eloValue = getColumnValue(row, COLUMN_INDEX.ELO);
            const photoValue = getColumnValue(row, COLUMN_INDEX.PHOTO);
            const nationalityValue = getColumnValue(
              row,
              COLUMN_INDEX.NATIONALITY,
            );
            return {
              NAME: name,
              POINTS: pointsValue,
              POINTS_NUM: parsePointsValue(pointsValue),
              CATEGORY: categoryValue,
              NATIONALITY: nationalityValue,
              ELO: parseEloValue(eloValue),
              ELO_DISPLAY: eloValue,
              FOTO: photoValue,
              gender,
              _raw: row,
            };
          })
          .filter((p) => p.NAME && p.NAME.trim() !== "");
        setPlayers(mapped);
        setLoading(false);
      })
      .catch(() => {
        if (!mounted) return;
        setPlayers([]);
        setLoading(false);
      });
    return () => (mounted = false);
  }, [gender]);

  const categories = useMemo(() => CATEGORY_OPTIONS, []);

  const visiblePlayers = useMemo(() => {
    let filtered = players;

    if (category !== "all") {
      filtered = filtered.filter((p) => (p.CATEGORY || "") === category);
    }

    if (nationality !== "all") {
      filtered = filtered.filter(
        (p) => normalizeText(p.NATIONALITY) === normalizeText(nationality),
      );
    }

    if (searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase();
      filtered = filtered.filter((p) =>
        (p.NAME || "").toLowerCase().includes(term),
      );
    }

    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === "points") {
        const pointsA =
          typeof a.POINTS_NUM === "number"
            ? a.POINTS_NUM
            : parsePointsValue(a.POINTS);
        const pointsB =
          typeof b.POINTS_NUM === "number"
            ? b.POINTS_NUM
            : parsePointsValue(b.POINTS);
        const pointsDiff = pointsB - pointsA;
        if (pointsDiff !== 0) return pointsDiff;
        const scoreA = parseFloat(a.ELO) || 0;
        const scoreB = parseFloat(b.ELO) || 0;
        return scoreB - scoreA;
      }
      const scoreA = parseFloat(a.ELO) || 0;
      const scoreB = parseFloat(b.ELO) || 0;
      const scoreDiff = scoreB - scoreA;
      if (scoreDiff !== 0) return scoreDiff;
      const pointsA =
        typeof a.POINTS_NUM === "number"
          ? a.POINTS_NUM
          : parsePointsValue(a.POINTS);
      const pointsB =
        typeof b.POINTS_NUM === "number"
          ? b.POINTS_NUM
          : parsePointsValue(b.POINTS);
      return pointsB - pointsA;
    });

    return sorted;
  }, [players, category, nationality, searchTerm, sortBy]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(to bottom, rgb(241, 245, 249) 0%, rgb(219, 234, 254) 50%, rgb(226, 232, 240) 100%)",
      }}
    >
      <div style={{maxWidth: "80rem", margin: "0 auto", padding: "3rem 1rem"}}>
        {/* Top Players Showcase */}
        {!loading && players.length > 0 && (
          <TopPlayersShowcase
            players={visiblePlayers}
            gender={gender}
            category={category}
          />
        )}

        <section
          style={{
            marginBottom: isMobile ? "1.2rem" : "2rem",
            backgroundColor: "rgb(15, 23, 42)",
            borderRadius: isMobile ? "0.75rem" : "1rem",
            padding: isMobile ? "0.9rem" : "1.5rem",
            color: "white",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: isMobile ? "0.65rem" : "1rem",
          }}
        >
          <div
            style={{
              fontSize: isMobile ? "0.80rem" : "1.25rem",
              fontWeight: "700",
            }}
          >
            Calcula tu categoria y consulta los limites ELO
          </div>
          <div
            style={{
              display: "flex",
              gap: isMobile ? "0.5rem" : "0.75rem",
              flexWrap: "wrap",
            }}
          >
            <Link
              href={`${basePath}/elo`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: isMobile ? "0.5rem 0.8rem" : "0.75rem 1.5rem",
                borderRadius: "9px",
                backgroundColor: "white",
                color: "rgb(15, 23, 42)",
                fontWeight: "700",
                fontSize: isMobile ? "0.78rem" : "0.95rem",
                textDecoration: "none",
              }}
            >
              Category Matchmaker
            </Link>
            <button
              type="button"
              onClick={() => setShowLegend(true)}
              style={{
                padding: isMobile ? "0.5rem 0.8rem" : "0.75rem 1.5rem",
                borderRadius: "9px",
                backgroundColor: "rgb(30, 41, 59)",
                color: "white",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                fontWeight: "700",
                fontSize: isMobile ? "0.78rem" : "0.95rem",
                cursor: "pointer",
              }}
            >
              ELO Limits
            </button>
          </div>
        </section>

        {/* Filters Section */}
        <section
          style={{marginBottom: "2rem", animation: "slideUp 0.5s ease-out"}}
        >
          <Filters
            gender={gender}
            onChangeGender={(g) => setGender(g)}
            categories={categories}
            category={category}
            onChangeCategory={(c) => setCategory(c)}
            nationality={nationality}
            onChangeNationality={(value) => setNationality(value)}
            sortBy={sortBy}
            onChangeSortBy={(value) => setSortBy(value)}
            searchTerm={searchTerm}
            onChangeSearchTerm={(term) => setSearchTerm(term)}
          />
        </section>

        {/* Stats Cards */}
        {!loading && (
          <section
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "1.5rem",
              marginBottom: "2rem",
            }}
          >
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
                    <h3
                      style={{
                        margin: 0,
                        fontSize: "1.25rem",
                        fontWeight: "700",
                      }}
                    >
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
                    <div
                      style={{display: "flex", justifyContent: "space-between"}}
                    >
                      <span>PRO</span>
                      <span>2201+</span>
                    </div>
                    <div
                      style={{display: "flex", justifyContent: "space-between"}}
                    >
                      <span>1ra</span>
                      <span>2001 – 2200</span>
                    </div>
                    <div
                      style={{display: "flex", justifyContent: "space-between"}}
                    >
                      <span>2da</span>
                      <span>1801 – 2000</span>
                    </div>
                    <div
                      style={{display: "flex", justifyContent: "space-between"}}
                    >
                      <span>3ra</span>
                      <span>1601 – 1800</span>
                    </div>
                    <div
                      style={{display: "flex", justifyContent: "space-between"}}
                    >
                      <span>4ta</span>
                      <span>1401 – 1600</span>
                    </div>
                    <div
                      style={{display: "flex", justifyContent: "space-between"}}
                    >
                      <span>5ta</span>
                      <span>1201 – 1400</span>
                    </div>
                    <div
                      style={{display: "flex", justifyContent: "space-between"}}
                    >
                      <span>6ta</span>
                      <span>1000 – 1200</span>
                    </div>
                    <div
                      style={{display: "flex", justifyContent: "space-between"}}
                    >
                      <span>7ma</span>
                      <span>Menos de 1000</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "0.75rem",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                padding: "1.5rem",
                transition: "box-shadow 0.3s ease-in-out",
                cursor: "pointer",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.boxShadow =
                  "0 10px 15px -3px rgba(0, 0, 0, 0.1)")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.boxShadow =
                  "0 4px 6px -1px rgba(0, 0, 0, 0.1)")
              }
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <p
                    style={{
                      color: "rgb(100, 116, 139)",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                    }}
                  >
                    Total de Jugadores
                  </p>
                  <p
                    style={{
                      fontSize: "2.25rem",
                      fontWeight: "bold",
                      color: "rgb(6, 182, 212)",
                    }}
                  >
                    {players.length}
                  </p>
                </div>
                <svg
                  style={{
                    width: "3rem",
                    height: "3rem",
                    color: "rgb(165, 243, 252)",
                  }}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                </svg>
              </div>
            </div>
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "0.75rem",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                padding: "1.5rem",
                transition: "box-shadow 0.3s ease-in-out",
                cursor: "pointer",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.boxShadow =
                  "0 10px 15px -3px rgba(0, 0, 0, 0.1)")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.boxShadow =
                  "0 4px 6px -1px rgba(0, 0, 0, 0.1)")
              }
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <p
                    style={{
                      color: "rgb(100, 116, 139)",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                    }}
                  >
                    Categorías
                  </p>
                  <p
                    style={{
                      fontSize: "2.25rem",
                      fontWeight: "bold",
                      color: "rgb(139, 92, 246)",
                    }}
                  >
                    {categories.length - 1}
                  </p>
                </div>
                <svg
                  style={{
                    width: "3rem",
                    height: "3rem",
                    color: "rgb(221, 214, 254)",
                  }}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "0.75rem",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                padding: "1.5rem",
                transition: "box-shadow 0.3s ease-in-out",
                cursor: "pointer",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.boxShadow =
                  "0 10px 15px -3px rgba(0, 0, 0, 0.1)")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.boxShadow =
                  "0 4px 6px -1px rgba(0, 0, 0, 0.1)")
              }
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <p
                    style={{
                      color: "rgb(100, 116, 139)",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                    }}
                  >
                    Visibles
                  </p>
                  <p
                    style={{
                      fontSize: "2.25rem",
                      fontWeight: "bold",
                      color: "rgb(234, 88, 12)",
                    }}
                  >
                    {visiblePlayers.length}
                  </p>
                </div>
                <svg
                  style={{
                    width: "3rem",
                    height: "3rem",
                    color: "rgb(254, 230, 204)",
                  }}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
              </div>
            </div>
          </section>
        )}

        {/* Ranking Table Section */}
        <section
          style={{
            backgroundColor: "white",
            borderRadius: "0",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
            overflow: "hidden",
            animation: "slideUp 0.5s ease-out",
          }}
        >
          {loading ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "3rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    animation: "spin 1s linear infinite",
                    borderRadius: "50%",
                    height: "3rem",
                    width: "3rem",
                    borderBottom: "2px solid rgb(6, 182, 212)",
                    marginBottom: "1rem",
                  }}
                ></div>
                <p style={{color: "rgb(71, 85, 105)", fontWeight: "500"}}>
                  Cargando jugadores…
                </p>
              </div>
            </div>
          ) : visiblePlayers.length > 0 ? (
            <RankingTable
              players={visiblePlayers}
              allPlayers={players}
              category={category}
            />
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "3rem",
              }}
            >
              <svg
                style={{
                  width: "4rem",
                  height: "4rem",
                  color: "rgb(203, 213, 225)",
                  marginBottom: "1rem",
                }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 009.172 13H7"
                />
              </svg>
              <p
                style={{
                  color: "rgb(71, 85, 105)",
                  fontSize: "1.125rem",
                  fontWeight: "500",
                }}
              >
                No hay jugadores para mostrar
              </p>
            </div>
          )}
        </section>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
