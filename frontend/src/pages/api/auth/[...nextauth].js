import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "username", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        const payload = {
          username: credentials.username,
          password: credentials.password,
        };

        const url = process.env.NEXT_PUBLIC_SERVER_URL + "api/auth/login/";

        const res = await fetch(url, {
          method: "POST",
          mode: "cors",
          body: JSON.stringify(payload),
          headers: { "Content-Type": "application/json" },
        });

        const responseData = await res.json();
        let user = {};
        user.accessToken = responseData.key;

        if (res.ok && user) {
          return user;
        }
        if (!res.ok) {
          throw new Error(user.message);
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async signIn() {
      return true;
    },
    async redirect({ baseUrl }) {
      return baseUrl;
    },
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        const url =
          process.env.NEXT_PUBLIC_SERVER_URL + "api/user_account/details/";
        const response = await fetch(url, {
          method: "GET",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token.accessToken}`,
          },
        });
        const result = await response.json();
        token.name = result.username;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.name = token.name;
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
});
