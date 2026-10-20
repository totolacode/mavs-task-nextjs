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
   * メモ削除
   * @param user_id
   * @param article_id
   * @return 削除件数（0の場合は対象なし）
   */
  async deleteArticle(user_id, article_id) {
    // ユーザーIDと記事IDをキーにメモを削除する
    const deleteCount = await db.Articles.destroy({
      where: { author_id: user_id, id: article_id },
    });

    return deleteCount;
  }

  /**
   * メモ新規登録
   * @param user_id ログインユーザーID
   * @param title タイトル
   * @param content 本文
   * @return 登録したメモ情報
   */
  async createArticle(user_id, title, content) {
    // ログインユーザーを作成者として、メモを登録する
    const row = await db.Articles.create({
      title: title,
      content: content,
      author_id: user_id,
    });

    // 登録したデータを返却形式に整形して返却する
    const resData = {
      id: row.dataValues.id,
      title: row.dataValues.title,
      content: row.dataValues.content,
      created_at: row.dataValues.created_at,
      updated_at: row.dataValues.updated_at,
    };
    return resData;
  }

  /**
   * メモ情報取得
   * @param user_id ログインユーザーID
   * @param article_id メモID
   * @return メモ情報（対象なしの場合は null）
   */
  async getArticle(user_id, article_id) {
    // 持ち主がログインユーザーのメモだけを取得する
    const row = await db.Articles.findOne({
      where: { id: article_id, author_id: user_id },
    });
    if (!row) return null;

    // 取得したデータを返却形式に整形して返却する
    const resData = {
      id: row.dataValues.id,
      title: row.dataValues.title,
      content: row.dataValues.content,
      created_at: row.dataValues.created_at,
      updated_at: row.dataValues.updated_at,
    };
    return resData;
  }

  /**
   * メモ更新
   * @param user_id ログインユーザーID
   * @param article_id メモID
   * @param title タイトル
   * @param content 本文
   * @return 更新件数（0の場合は対象なし）
   */
  async updateArticle(user_id, article_id, title, content) {
    // 持ち主がログインユーザーのメモだけを更新する
    const [updatedCount] = await db.Articles.update(
      { title: title, content: content },
      { where: { id: article_id, author_id: user_id } },
    );
    return updatedCount;
  }
}

export default ArticleService;
