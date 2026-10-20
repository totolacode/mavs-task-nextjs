import Link from "next/link";
import ArticleList from "../components/ArticleList";

export default function Home() {
	return (
		<>
			<div className="pageHeader">
				<h2 className="pageTitle">メモ一覧</h2>
				<Link href="/articles/new" className="btn btn-primary">
					＋ 新規作成
				</Link>
			</div>
			<ArticleList />
		</>
	);
}