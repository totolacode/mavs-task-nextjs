"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./header.module.css";
import { useLoginData } from "@/app/hooks/useLoginData";

export default function Header() {
	const router = useRouter();
	const { loginData, setLoginData, isLoaded } = useLoginData();

	const logout = () => {
		setLoginData(undefined);
		router.push("/");
	};

	return (
		<header className={styles.header}>
			<div className={styles.header_inner}>
				<Link href="/" className={styles.header_logo}>メモアプリ</Link>

				{/* ログイン情報の読み込みが終わってから表示する */}
				{isLoaded && (
					<div className={styles.header_user}>
						{loginData ? (
							<>
								<span className={styles.header_email}>
									{loginData.name || loginData.email} さん
								</span>
								<button className="btn btn-secondary btn-small" onClick={logout}>
									ログアウト
								</button>
							</>
						) : (
							<>
								<Link href="/signup" className="btn btn-secondary btn-small">
									新規登録
								</Link>
								<Link href="/signin" className="btn btn-primary btn-small">
									サインイン
								</Link>
							</>
						)}
					</div>
				)}
			</div>
		</header>
	);
}