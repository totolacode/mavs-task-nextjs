import AuthService from '../../services/auth/AuthService.js';
import UserService from '../../services/users/UserService.js';
import express from 'express';

const router = express.Router();
const userService = new UserService();
const authService = new AuthService();

/**
 * サインイン
 */
router.post('/signin', async (req, res, next) => {
  try {
    // リクエストパラメーター
    const { email, password } = req.body;

    // メールアドレスとパスワードの両方が一致するユーザーを探す
    const user = await userService.authenticate(email, password);

    // 認証できない場合は再ログインを促すため、空で返却する
    if (!user) return res.status(200).json({});

    // トークンを発行する
    const resCreateToken = await authService.createToken(user);

    // 返却用データを生成
    const body = {
      id: user.id,
      name: user.name,
      email: user.email,
      token: resCreateToken,
    };

    res.status(200).json(body);
  } catch (error) {
    console.error(error);
    res.status(500).json({});
  }
});

export default router;
