import db from '../../models/index.js';

// クラス
class ArticleService {
  /**
   * 記事一覧取得
   * @param user_id
   * @return ログインユーザーのメモ一覧
   */
  async getArticleList(user_id) {
    // ユーザーIDをキーにメモ一覧を取得する
    const rows = await db.Articles.findAll({
      where: { author_id: user_id },
      order: [['updated_at', 'DESC']],
    });

    // 取得したデータを返却形式に整形して格納し返却する
    const resDataList = [];
    for (const row of rows) {
      resDataList.push({
        id: row.dataValues.id,
        title: row.dataValues.title,
        content: row.dataValues.content,
        created_at: row.dataValues.created_at,
        updated_at: row.dataValues.updated_at,
      });
    }

    return resDataList;
  }

  /**
   * 記事情報取得
   * @param user_id
   * @return ランダム値
   */
  getArticle(user_id, article_id) {
    return {};
  }
}

export default ArticleService;
