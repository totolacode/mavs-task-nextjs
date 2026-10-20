"use client";
import {
	type ReactNode,
	createContext,
	useCallback,
	useEffect,
	useState,
} from "react";
import { LoginResponse } from "../types/Login/LoginResponse";

// localStorage に保存するときの名前
const STORAGE_KEY = "loginData";

export const LoginContext = createContext<{
	loginData: LoginResponse | undefined;
	setLoginData: (data: LoginResponse | undefined) => void;
	// localStorage の読み込みが終わったかどうか
	isLoaded: boolean;
}>({
	loginData: undefined,
	setLoginData: () => {},
	isLoaded: false,
});

export const LoginProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [loginData, setLoginDataState] = useState<LoginResponse | undefined>(
		undefined,
	);
	const [isLoaded, setIsLoaded] = useState(false);

	// 最初に表示したときに、保存済みのログイン情報を読み込む
	useEffect(() => {
		const saved = localStorage.getItem(STORAGE_KEY);
		if (saved) {
			try {
				setLoginDataState(JSON.parse(saved));
			} catch {
				// 壊れたデータの場合は削除する
				localStorage.removeItem(STORAGE_KEY);
			}
		}
		setIsLoaded(true);
	}, []);

	// ログイン情報を更新し、localStorage にも反映する
	const setLoginData = useCallback((data: LoginResponse | undefined) => {
		setLoginDataState(data);
		if (data) {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
		} else {
			localStorage.removeItem(STORAGE_KEY);
		}
	}, []);

	return (
		<LoginContext.Provider value={{ loginData, setLoginData, isLoaded }}>
			{children}
		</LoginContext.Provider>
	);
};