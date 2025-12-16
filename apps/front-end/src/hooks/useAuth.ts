import { useState } from "react";
interface UseAuthOptions {
  path: string;
}
const url: string = import.meta.env.VITE_API_URL;
export function useAuth<TPayload>({ path }: UseAuthOptions) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (payload: TPayload) => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(url + path, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Auth failed");
      }

      if (data?.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
      }
      console.log("data", data);
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  };

  return {
    submit,
    loading,
    logout,
    error,
  };
}
