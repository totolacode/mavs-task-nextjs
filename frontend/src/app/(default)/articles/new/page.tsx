import ArticleForm from "../../../components/ArticleForm";

export default function ArticleNew() {
	return (
		<div>
			<div className="pageHeader">
				<h2 className="pageTitle">メモ新規作成</h2>
			</div>
			<ArticleForm />
		</div>
	);
}