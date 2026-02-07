"use client";

import { ROUTES } from "@/types";
import { Pagination } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";

export default function RecipePagination({
  currentPage,
  totalPages,
}: {
  currentPage: number;
  totalPages: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(value));
    router.push(`${ROUTES.RECIPES}?${params.toString()}`);
  };

  return (
    <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} color="primary" />
  );
}
