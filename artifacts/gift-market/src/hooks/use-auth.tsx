import { createContext, useContext, useEffect, useState } from "react";
import { useRegisterUser, useGetMe } from "@workspace/api-client-react";
import type { User } from "@workspace/api-client-react/src/generated/api.schemas";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
  refetchUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { mutate: registerUser } = useRegisterUser();
  const { data: meData, refetch, isFetching } = useGetMe({
    query: {
      enabled: false,
      retry: false
    }
  });

  const login = () => {
    // Get Telegram init data
    const tg = (window as any).Telegram?.WebApp;
    
    let initData = "";
    let mockUser = {
      telegramId: "dev_user_1",
      firstName: "Dev",
      lastName: "User",
      username: "devuser",
    };

    if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {
      initData = tg.initData;
      mockUser = {
        telegramId: tg.initDataUnsafe.user.id.toString(),
        firstName: tg.initDataUnsafe.user.first_name,
        lastName: tg.initDataUnsafe.user.last_name || "",
        username: tg.initDataUnsafe.user.username || "",
      };
    }

    registerUser(
      { data: { ...mockUser, initData } },
      {
        onSuccess: (data) => {
          setUser(data);
          setIsLoading(false);
        },
        onError: () => {
          setIsLoading(false);
        }
      }
    );
  };

  useEffect(() => {
    login();
  }, []);

  useEffect(() => {
    if (meData) {
      setUser(meData);
    }
  }, [meData]);

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, refetchUser: refetch }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
