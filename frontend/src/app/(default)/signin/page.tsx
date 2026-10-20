import LoginForm from "../../components/LoginForm";

export default function Signin() {
	return (
		<div className="card authCard">
			<h2 className="pageTitle">サインイン</h2>
			<LoginForm />
		</div>
	);
}