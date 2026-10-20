import ArticleService from '../../services/articles/ArticleService.js';
import express from 'express';
import authenticate from '../../middleware/authenticate.js';

const router = express.Router();
const articleService = new ArticleService();


/**
 * メモの入力チェック
 * @return エラーメッセージ（問題がない場合は null）
 */
const validateArticle = (title, content) => {
  // タイトル・本文は必須（空白だけも不可）
  if (
    typeof title !== 'string' ||
    typeof content !== 'string' ||
    title.trim() === '' ||
    content.trim() === ''
  ) {
    return 'タイトルと本文は必須です。';
  }
  // タイトルは255文字以内
  if (title.length > 255) {
    return 'タイトルは255文字以内で入力してください。';
  }
  return null;
};

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
 * メモ削除
 */
router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    // トークンからユーザーIDを取得する
    const userId = req.jwtPayload.id;
    // パスパラメータからメモIDを取得する
    const articleId = req.params.id;

    // ログインユーザーのメモを削除する
    const deleteCount = await articleService.deleteArticle(userId, articleId);

    // 削除件数が0の場合は、対象なしとして404を返す
    if (deleteCount === 0) {
      return res.status(404).json({ message: 'メモが見つかりませんでした。' });
    }

    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(500).json({});
  }
});

/**
 * メモ新規登録
 */
router.post('/', authenticate, async (req, res, next) => {
  try {
    // トークンからユーザーIDを取得する
    const userId = req.jwtPayload.id;
    // リクエストパラメーター
    const { title, content } = req.body;

    // 入力チェック
    const errorMessage = validateArticle(title, content);
    if (errorMessage) {
      return res.status(400).json({ message: errorMessage });
    }

    // メモを登録する
    const resArticle = await articleService.createArticle(userId, title, content);

    res.status(201).json(resArticle);
  } catch (error) {
    console.error(error);
    res.status(500).json({});
  }
});

/**
 * メモ情報取得
 */
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    // トークンからユーザーIDを取得する
    const userId = req.jwtPayload.id;
    // パスパラメータからメモIDを取得する
    const articleId = req.params.id;

    // ログインユーザーのメモを取得する
    const resArticle = await articleService.getArticle(userId, articleId);

    // 対象がない（または他人のメモの）場合は、404を返す
    if (!resArticle) {
      return res.status(404).json({ message: 'メモが見つかりませんでした。' });
    }

    res.status(200).json(resArticle);
  } catch (error) {
    console.error(error);
    res.status(500).json({});
  }
});

/**
 * メモ更新
 */
router.put('/:id', authenticate, async (req, res, next) => {
  try {
    // トークンからユーザーIDを取得する
    const userId = req.jwtPayload.id;
    // パスパラメータからメモIDを取得する
    const articleId = req.params.id;
    // リクエストパラメーター
    const { title, content } = req.body;

    // 入力チェック
    const errorMessage = validateArticle(title, content);
    if (errorMessage) {
      return res.status(400).json({ message: errorMessage });
    }

    // ログインユーザーのメモを更新する
    const updatedCount = await articleService.updateArticle(userId, articleId, title, content);

    // 対象がない（または他人のメモの）場合は、404を返す
    if (updatedCount === 0) {
      return res.status(404).json({ message: 'メモが見つかりませんでした。' });
    }

    // 更新後のメモを返す
    const resArticle = await articleService.getArticle(userId, articleId);
    res.status(200).json(resArticle);
  } catch (error) {
    console.error(error);
    res.status(500).json({});
  }
});

export default router;
