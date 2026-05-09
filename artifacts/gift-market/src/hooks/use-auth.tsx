import { createContext, useContext, useEffect, useState } from "react";
import { useRegisterUser, setGlobalHeaders } from "@workspace/api-client-react";
import type { User } from "@workspace/api-client-react";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
  updateUser: (u: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { mutate: registerUser } = useRegisterUser();

  const login = () => {
    const tg = (window as any).Telegram?.WebApp;

    let mockUser = {
      telegramId: "dev_user_1",
      firstName: "Dev",
      lastName: "User",
      username: "devuser",
      photoUrl: undefined as string | undefined,
    };

    if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {
      const tgUser = tg.initDataUnsafe.user;
      mockUser = {
        telegramId: tgUser.id.toString(),
        firstName: tgUser.first_name,
        lastName: tgUser.last_name || "",
        username: tgUser.username || "",
        photoUrl: tgUser.photo_url || undefined,
      };
    }

    registerUser(
      { data: { ...mockUser, initData: "" } },
      {
        onSuccess: (data) => {
          setGlobalHeaders({ "x-telegram-id": data.telegramId });
          setUser(data);
          setIsLoading(false);
        },
        onError: () => {
          setIsLoading(false);
        },
      }
    );
  };

  useEffect(() => {
    login();
  }, []);

  const logout = () => setUser(null);
  const updateUser = (u: User) => {
    setGlobalHeaders({ "x-telegram-id": u.telegramId });
    setUser(u);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, updateUser }}>
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
