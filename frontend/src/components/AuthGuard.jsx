import { useSession, signIn } from "next-auth/react";
import { useEffect } from "react";

const AuthGuard = ({ children }) => {
  const { data: session, status } = useSession();
  useEffect(() => {
    if (status == "unauthenticated") {
      signIn();
    }
  }, [status]);
  if (status == "loading") {
    return <h1>Loading...</h1>;
  }
  if (status == "authenticated") {
    return <>{children}</>;
  }
};

export default AuthGuard;
