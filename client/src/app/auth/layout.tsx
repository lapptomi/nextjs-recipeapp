import { redirect } from "next/navigation";

import { getSession } from "@/lib/actions/auth";

import styles from "./layout.module.css";

const PageLayout = async ({ children }: any) => {
  const session = await getSession();
  if (session?.user) {
    redirect('/');
  }

  return (
    <div className="flex h-screen">
      <div className={styles.maingrid} />
      <div className="flex flex-col items-center bg-white p-8">
        {children}
      </div>
    </div>
  );
};

export default PageLayout;