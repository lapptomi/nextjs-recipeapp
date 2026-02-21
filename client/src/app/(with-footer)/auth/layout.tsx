import { Box } from "@mui/material";
import { redirect } from "next/navigation";

import { getSession } from "@/lib/actions/auth";

import styles from "./layout.module.css";

const PageLayout = async ({ children }: any) => {
  const session = await getSession();
  if (session?.user) {
    redirect("/");
  }

  return (
    <Box className="flex h-screen">
      <Box className={styles.maingrid} />
      <Box className="flex flex-col items-center bg-white p-8">{children}</Box>
    </Box>
  );
};

export default PageLayout;
