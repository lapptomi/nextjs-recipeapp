import { redirect } from "next/navigation";

import { getSession } from "@/lib/actions/auth";

import styles from "./layout.module.css";

const PageLayout = async ({ children }: any) => {
  const session = await getSession();
  if (session?.user) {
    redirect('/');
  }

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div className={styles.maingrid} />
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: '32px',
      }}>
        {children}
      </div>
    </div>
  );
};

export default PageLayout;