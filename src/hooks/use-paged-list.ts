import { useEffect, useMemo, useState } from "react";

/** Client-side pagination over an already-fetched array — no server round-trip. */
export function usePagedList<T>(items: T[] | undefined, pageSize = 10) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil((items?.length ?? 0) / pageSize));

  // Keep `page` in range if the underlying list shrinks (e.g. the last row
  // on the last page gets deleted) so the admin isn't stranded on a blank page.
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const pageItems = useMemo(
    () => (items ?? []).slice((page - 1) * pageSize, page * pageSize),
    [items, page, pageSize],
  );

  return { pageItems, page, setPage, totalPages };
}
