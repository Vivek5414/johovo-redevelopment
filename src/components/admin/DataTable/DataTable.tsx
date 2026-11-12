"use client";

import { useState, useMemo, type ReactNode } from "react";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import styles from "./DataTable.module.css";

export type ColumnDef<T> = {
  header: string;
  accessorKey?: keyof T;
  cell?: (row: T) => ReactNode;
};

type DataTableProps<T> = {
  columns: ColumnDef<T>[];
  data: T[];
  searchPlaceholder?: string;
  searchFilter?: (item: T, query: string) => boolean;
  pageSize?: number;
  emptyMessage?: string;
};

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  searchPlaceholder = "Search records...",
  searchFilter,
  pageSize = 10,
  emptyMessage = "No records found.",
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredData = useMemo(() => {
    if (!search.trim()) return data;
    const query = search.trim().toLowerCase();

    if (searchFilter) {
      return data.filter((item) => searchFilter(item, query));
    }

    return data.filter((item) =>
      Object.values(item).some(
        (val) => val && String(val).toLowerCase().includes(query)
      )
    );
  }, [data, search, searchFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);

  const pageData = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, safePage, pageSize]);

  return (
    <div className={styles.container}>
      {/* Search Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <SearchRoundedIcon className={styles.searchIcon} />
          <input
            className={styles.searchInput}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder={searchPlaceholder}
            type="text"
            value={search}
          />
        </div>
        <span className={styles.recordCount}>
          Showing <strong>{pageData.length}</strong> of{" "}
          <strong>{filteredData.length}</strong> {filteredData.length === 1 ? "entry" : "entries"}
        </span>
      </div>

      {/* Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              {columns.map((col, idx) => (
                <th key={col.header || idx}>{col.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageData.length === 0 ? (
              <tr>
                <td className={styles.emptyState} colSpan={columns.length}>
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              pageData.map((row, rowIdx) => (
                <tr key={(row.id as string | number) || rowIdx}>
                  {columns.map((col, colIdx) => (
                    <td key={col.header || colIdx}>
                      {col.cell
                        ? col.cell(row)
                        : col.accessorKey
                          ? String(row[col.accessorKey] ?? "-")
                          : "-"}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <span className={styles.pageInfo}>
            Page {safePage} of {totalPages}
          </span>
          <div className={styles.pageControls}>
            <button
              aria-label="Previous page"
              className={styles.pageBtn}
              disabled={safePage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              type="button"
            >
              <ArrowBackIosNewRoundedIcon style={{ fontSize: "0.75rem" }} />
            </button>
            {Array.from({ length: totalPages }).map((_, i) => {
              const p = i + 1;
              return (
                <button
                  className={`${styles.pageBtn} ${p === safePage ? styles.pageBtnActive : ""}`}
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  type="button"
                >
                  {p}
                </button>
              );
            })}
            <button
              aria-label="Next page"
              className={styles.pageBtn}
              disabled={safePage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              type="button"
            >
              <ArrowForwardIosRoundedIcon style={{ fontSize: "0.75rem" }} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
