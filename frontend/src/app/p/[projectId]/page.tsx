"use client";

import { useAuth, SignInButton, UserButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export default function Home() {
  const { isSignedIn, getToken } = useAuth();
  const [token, setToken] = useState<string | null>(null);

  const fetchToken = async () => {
    const t = await getToken();
    console.log("TOKEN:", t);
    setToken(t);
  };

  return (
    <div style={{ padding: "40px" }}>
      {!isSignedIn ? (
        <SignInButton />
      ) : (
        <>
          <UserButton />
          <button onClick={fetchToken} style={{ marginTop: "20px" }}>
            Get Token
          </button>

          {token && (
            <div style={{ marginTop: "20px" }}>
              <h3>Token:</h3>
              <textarea
                value={token}
                readOnly
                rows={10}
                cols={80}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}