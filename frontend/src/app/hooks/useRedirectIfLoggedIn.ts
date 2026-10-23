import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLoginData } from "@/app/hooks/useLoginData";

// ログイン済みの場合は、メモ一覧へ移動する（サインイン・新規登録画面用）
// 戻り値は、ログイン済みかどうか（移動中の表示のちらつき防止に使う）
export const useRedirectIfLoggedIn = () => {
	const router = useRouter();
	const { loginData, isLoaded } = useLoginData();
	const isLoggedIn = isLoaded && !!loginData;

	useEffect(() => {
		if (isLoggedIn) router.replace("/");
	}, [isLoggedIn, router]);

	return isLoggedIn;
};
