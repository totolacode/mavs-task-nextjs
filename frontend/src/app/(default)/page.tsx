import Link from "next/link";
import ArticleList from "../components/ArticleList";

export default function Home() {
	return (
		<div>
			<h2>メモ一覧</h2>
			<Link href="/articles/new">＋ 新規作成</Link>
			<ArticleList />
		</div>
	);
}