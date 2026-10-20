"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./articleList.module.css";
import { useLoginData } from "@/app/hooks/useLoginData";
import type { Article } from "@/app/types/Article/Article";


export default function ArticleList() {
	const router = useRouter();
	const { loginData, setLoginData, isLoaded } = useLoginData();

	// 取得前は undefined、取得後はメモの配列
	const [articles, setArticles] = useState<Article[] | undefined>(undefined);
	const [errorMessage, setErrorMessage] = useState("");

	useEffect(() => {
		// ログイン情報の読み込みが終わるまで待つ
		if (!isLoaded) return;

		// ログインしていない場合はサインイン画面へ移動する
		if (!loginData) {
			router.push("/signin");
			return;
		}

		const fetchArticles = async () => {
			try {
				const response = await fetch(
					`${process.env.NEXT_PUBLIC_API_BASE_URL}/articles`,
					{
						headers: {
							Authorization: loginData.token,
						},
					},
				);

				// トークンが無効・期限切れの場合は、ログアウトしてサインイン画面へ移動する
				if (response.status === 401) {
					setLoginData(undefined);
					router.push("/signin");
					return;
				}

				// それ以外のエラー（500 など）
				if (!response.ok) {
					setErrorMessage("メモの取得に失敗しました。");
					return;
				}

				const data: Article[] = await response.json();
				setArticles(data);
			} catch (error) {
				// API に接続できない場合
				console.error(error);
				setErrorMessage("サーバーに接続できませんでした。");
			}
		};
		fetchArticles();
	}, [isLoaded, loginData, router, setLoginData]);

  	// メモを削除する
	const handleDelete = async (id: number) => {
		if (!loginData) {
			router.push("/signin");
			return;
		}

		// 誤操作を防ぐため、確認する
		if (!window.confirm("このメモを削除しますか？")) return;

		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_BASE_URL}/articles/${id}`,
				{
					method: "DELETE",
					headers: {
						Authorization: loginData.token,
					},
				},
			);

			// トークンが無効・期限切れの場合は、ログアウトしてサインイン画面へ移動する
			if (response.status === 401) {
				setLoginData(undefined);
				router.push("/signin");
				return;
			}

			if (!response.ok) {
				alert("削除に失敗しました。");
				return;
			}

			// 削除したメモを、画面の一覧から取り除く
			setArticles((prev) => prev?.filter((article) => article.id !== id));
		} catch (error) {
			// API に接続できない場合
			console.error(error);
			alert("サーバーに接続できませんでした。");
		}
	};

	if (errorMessage) {
		return <p className={styles.articleList_error}>{errorMessage}</p>;
	}

	if (!articles) {
		return <p>読み込み中...</p>;
	}

	if (articles.length === 0) {
		return <p>メモがありません。</p>;
	}

	return (
		<ul className={styles.articleList}>
			{articles.map((article) => (
				<li key={article.id} className={styles.articleList_item}>
					<h3>{article.title}</h3>
					<p>{article.content}</p>
					<p>作成日時：{new Date(article.created_at).toLocaleString("ja-JP")}</p>
					<p>更新日時：{new Date(article.updated_at).toLocaleString("ja-JP")}</p>
					<Link href={`/articles/${article.id}/edit`}>編集</Link>
          <button onClick={() => handleDelete(article.id)}>削除</button>
				</li>
			))}
		</ul>
	);
}