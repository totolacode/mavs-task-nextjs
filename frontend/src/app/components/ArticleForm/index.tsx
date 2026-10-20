"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import styles from "./articleForm.module.css";
import { useLoginData } from "@/app/hooks/useLoginData";
import type { Article } from "@/app/types/Article/Article";
import type { ArticleRequest } from "@/app/types/Article/ArticleRequest";

type Props = {
	// 編集のときだけ指定する（指定がない場合は新規作成）
	articleId?: string;
};

export default function ArticleForm({ articleId }: Props) {
	const router = useRouter();
	const { loginData, setLoginData } = useLoginData();
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<ArticleRequest>();
	const isEdit = articleId !== undefined;

	useEffect(() => {
		// ログインしていない場合は、サインイン画面へ移動する
		if (!loginData) {
			router.push("/signin");
			return;
		}
		// 新規作成の場合は、初期値の取得は不要
		if (!isEdit) return;

		// 編集の場合は、今のメモの内容を取得して、フォームに入れる
		const fetchArticle = async () => {
			try {
				const response = await fetch(
					`${process.env.NEXT_PUBLIC_API_BASE_URL}/articles/${articleId}`,
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

				if (!response.ok) {
					alert("メモが見つかりませんでした。");
					router.push("/");
					return;
				}

				const data: Article = await response.json();
				reset({ title: data.title, content: data.content });
			} catch (error) {
				// API に接続できない場合
				console.error(error);
				alert("サーバーに接続できませんでした。");
			}
		};
		fetchArticle();
	}, [loginData, router, setLoginData, isEdit, articleId, reset]);

	const onSubmit = handleSubmit(async (request: ArticleRequest) => {
		if (!loginData) return;

		// 新規作成は POST /articles、編集は PUT /articles/:id
		const url = isEdit
			? `${process.env.NEXT_PUBLIC_API_BASE_URL}/articles/${articleId}`
			: `${process.env.NEXT_PUBLIC_API_BASE_URL}/articles`;
		const method = isEdit ? "PUT" : "POST";

		try {
			const response = await fetch(url, {
				method: method,
				headers: {
					"Content-Type": "application/json",
					Authorization: loginData.token,
				},
				body: JSON.stringify({
					title: request.title,
					content: request.content,
				}),
			});

			// トークンが無効・期限切れの場合は、ログアウトしてサインイン画面へ移動する
			if (response.status === 401) {
				setLoginData(undefined);
				router.push("/signin");
				return;
			}

			if (!response.ok) {
				alert("保存に失敗しました。");
				return;
			}

			// 保存できたら一覧へ戻る
			router.push("/");
		} catch (error) {
			// API に接続できない場合
			console.error(error);
			alert("サーバーに接続できませんでした。");
		}
	});

	return (
		<form onSubmit={onSubmit} className={styles.articleForm}>
			<label className={styles.articleForm_label}>
				タイトル
				<input
					className={styles.articleForm_input}
					{...register("title", {
						required: "タイトルを入力してください。",
						validate: (value) =>
							value.trim() !== "" || "タイトルを入力してください。",
						maxLength: {
							value: 255,
							message: "タイトルは255文字以内で入力してください。",
						},
					})}
				/>
			</label>
			{errors.title && (
				<p className={styles.articleForm_error}>{errors.title.message}</p>
			)}

			<label className={styles.articleForm_label}>
				本文
				<textarea
					className={styles.articleForm_input}
					rows={8}
					{...register("content", {
						required: "本文を入力してください。",
						validate: (value) =>
							value.trim() !== "" || "本文を入力してください。",
					})}
				/>
			</label>
			{errors.content && (
				<p className={styles.articleForm_error}>{errors.content.message}</p>
			)}

			<button type="submit" disabled={isSubmitting}>
				{isSubmitting ? "保存中..." : "保存"}
			</button>
		</form>
	);
}