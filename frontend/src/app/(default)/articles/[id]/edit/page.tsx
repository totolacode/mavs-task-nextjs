import ArticleForm from "@/app/components/ArticleForm";

export default function ArticleEdit({ params }: { params: { id: string } }) {
	return (
		<div>
			<h2>メモ編集</h2>
			<ArticleForm articleId={params.id} />
		</div>
	);
}