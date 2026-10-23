"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SignupRequest } from "@/app/types/Signup/SignupRequest";
import { LoginResponse } from "@/app/types/Login/LoginResponse";
import { useLoginData } from "@/app/hooks/useLoginData";
import { useRedirectIfLoggedIn } from "@/app/hooks/useRedirectIfLoggedIn";
import styles from "./signupForm.module.css";

export default function SignupForm() {
	const router = useRouter();
	const { setLoginData } = useLoginData();
	const isLoggedIn = useRedirectIfLoggedIn();
	const [apiError, setApiError] = useState("");
	const {
		register,
		handleSubmit,
		getValues,
		formState: { errors, isSubmitting },
	} = useForm<SignupRequest>();

	const onSubmit = handleSubmit(async (request: SignupRequest) => {
		setApiError("");
		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_BASE_URL}/users`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						name: request.name,
						email: request.email,
						password: request.password,
					}),
				},
			);
			if (response.status === 201) {
				// 登録したユーザーでそのままログインする
				const data: LoginResponse = await response.json();
				setLoginData(data);
				router.push("/");
				return;
			}
			if (response.status === 400 || response.status === 409) {
				const data: { message: string } = await response.json();
				setApiError(data.message);
				return;
			}
			setApiError("登録に失敗しました。");
		} catch {
			setApiError("サーバーに接続できませんでした。");
		}
	});

	// ログイン済みの場合は、メモ一覧へ移動するまで何も表示しない
	if (isLoggedIn) return null;

	return (
		<form onSubmit={onSubmit} className={styles.signupForm}>
			<div className="field">
				<label htmlFor="name" className="label">
					ユーザー名
				</label>
				<input
					id="name"
					type="text"
					className="input"
					autoComplete="username"
					{...register("name", {
						validate: (v) =>
							v.trim() !== "" || "ユーザー名を入力してください。",
						maxLength: {
							value: 255,
							message: "ユーザー名は255文字以内で入力してください。",
						},
					})}
				/>
				{errors.name && <p className="errorText">{errors.name.message}</p>}
			</div>

			<div className="field">
				<label htmlFor="email" className="label">
					メールアドレス
				</label>
				<input
					id="email"
					type="email"
					className="input"
					autoComplete="email"
					{...register("email", {
						required: "メールアドレスを入力してください。",
						maxLength: {
							value: 255,
							message: "メールアドレスは255文字以内で入力してください。",
						},
					})}
				/>
				{errors.email && <p className="errorText">{errors.email.message}</p>}
			</div>

			<div className="field">
				<label htmlFor="password" className="label">
					パスワード（8文字以上）
				</label>
				<input
					id="password"
					type="password"
					className="input"
					autoComplete="new-password"
					{...register("password", {
						required: "パスワードを入力してください。",
						minLength: {
							value: 8,
							message: "パスワードは8文字以上で入力してください。",
						},
					})}
				/>
				{errors.password && (
					<p className="errorText">{errors.password.message}</p>
				)}
			</div>

			<div className="field">
				<label htmlFor="passwordConfirm" className="label">
					パスワード（確認）
				</label>
				<input
					id="passwordConfirm"
					type="password"
					className="input"
					autoComplete="new-password"
					{...register("passwordConfirm", {
						validate: (v) =>
							v === getValues("password") || "パスワードが一致しません。",
					})}
				/>
				{errors.passwordConfirm && (
					<p className="errorText">{errors.passwordConfirm.message}</p>
				)}
			</div>

			{apiError && <p className="errorText">{apiError}</p>}

			<button type="submit" className="btn btn-primary" disabled={isSubmitting}>
				{isSubmitting ? "登録中..." : "登録する"}
			</button>
			<p className="authLink">
				アカウントをお持ちの方は <Link href="/signin">サインイン</Link>
			</p>
		</form>
	);
}
