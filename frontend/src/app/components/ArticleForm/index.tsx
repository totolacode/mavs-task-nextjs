"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import styles from "./articleForm.module.css";
import { useLoginData } from "@/app/hooks/useLoginData";
import type { ArticleRequest } from "@/app/types/Article/ArticleRequest";

export default function ArticleForm() {
	const router = useRouter();
	const { loginData, setLoginData } = useLoginData();
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<ArticleRequest>();

	// ログインしていない場合は、サインイン画面へ移動する
	useEffect(() => {
		if (!loginData) {
			router.push("/signin");
		}
	}, [loginData, router]);

	const onSubmit = handleSubmit(async (request: ArticleRequest) => {
		if (!loginData) return;

		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_BASE_URL}/articles`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: loginData.token,
					},
					body: JSON.stringify({
						title: request.title,
						content: request.content,
					}),
				},
			);

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