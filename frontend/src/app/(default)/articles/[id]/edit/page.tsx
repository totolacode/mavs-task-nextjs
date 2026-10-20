import ArticleForm from "@/app/components/ArticleForm";

export default function ArticleEdit({ params }: { params: { id: string } }) {
	return (
		<div>
			<div className="pageHeader">
				<h2 className="pageTitle">メモ編集</h2>
			</div>
			<ArticleForm articleId={params.id} />
		</div>
	);
}