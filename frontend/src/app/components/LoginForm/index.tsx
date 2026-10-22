"use client";
import { useForm } from "react-hook-form";
import { LoginRequest } from "@/app/types/Login/LoginReqest";
import { LoginResponse } from "@/app/types/Login/LoginResponse";
import { useLoginData } from "@/app/hooks/useLoginData";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./loginForm.module.css";

export default function LoginForm() {
	const router = useRouter();
	const { setLoginData } = useLoginData();
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<LoginRequest>();
	const onSubmit = handleSubmit(async (request: LoginRequest) => {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/signin`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email: request.email,
					password: request.password,
				}),
			},
		);
		const data: LoginResponse = await response.json();
		if (data.token) {
			// トークンの保持
			setLoginData(data);
			router.push("/");
		} else {
			reset();
		}
	});
	return (
		<form onSubmit={onSubmit} className={styles.loginForm}>
			<div className="field">
				<label htmlFor="email" className="label">
					メールアドレス
				</label>
				<input
					id="email"
					type="email"
					className="input"
					autoComplete="email"
					{...register("email")}
				/>
			</div>

			<div className="field">
				<label htmlFor="password" className="label">
					パスワード
				</label>
				<input
					id="password"
					type="password"
					className="input"
					autoComplete="current-password"
					{...register("password")}
				/>
			</div>

			<button type="submit" className="btn btn-primary">
				サインイン
			</button>
			<p className="authLink">
				アカウントをお持ちでない方は <Link href="/signup">新規登録</Link>
			</p>
		</form>
	);
}