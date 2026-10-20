import ArticleService from '../../services/articles/ArticleService.js';
import express from 'express';
import authenticate from '../../middleware/authenticate.js';

const router = express.Router();
const articleService = new ArticleService();

/**
 * メモ一覧取得
 */
router.get('/', authenticate, async (req, res, next) => {
  try {
    // トークンからユーザーIDを取得する
    const userId = req.jwtPayload.id;

    // ログインユーザーのメモ一覧を取得する
    const resArticleList = await articleService.getArticleList(userId);

    res.status(200).json(resArticleList);
  } catch (error) {
    console.error(error);
    res.status(500).json({});
  }
});

/**
 * メモ新規登録
 */
router.get('/createArticle', authenticate, async (req, res, next) => {
  try {
    let body = {};

    res.status(200).json(body);
  } catch (error) {
    console.error(error);
    res.status(500).json({});
  }
});

export default router;
