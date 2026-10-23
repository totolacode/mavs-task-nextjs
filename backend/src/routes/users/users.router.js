import AuthService from '../../services/auth/AuthService.js';
import UserService from '../../services/users/UserService.js';
import express from 'express';

const router = express.Router();
const userService = new UserService();
const authService = new AuthService();

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * ユーザー登録の入力チェック
 * @return エラーメッセージ（問題がない場合は null）
 */
const validateUser = (name, email, password) => {
  // 全項目必須（空白だけも不可）
  if (
    typeof name !== 'string' ||
    typeof email !== 'string' ||
    typeof password !== 'string' ||
    name.trim() === '' ||
    email.trim() === '' ||
    password.trim() === ''
  ) {
    return 'ユーザー名・メールアドレス・パスワードは必須です。';
  }
  if (name.length > 255) {
    return 'ユーザー名は255文字以内で入力してください。';
  }
  if (email.length > 255 || !EMAIL_PATTERN.test(email)) {
    return 'メールアドレスの形式が正しくありません。';
  }
  if (password.length < 8) {
    return 'パスワードは8文字以上で入力してください。';
  }
  return null;
};

const DUPLICATE_EMAIL_MESSAGE = 'このメールアドレスは既に登録されています。';

/**
 * ユーザー新規登録
 */
router.post('/', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const message = validateUser(name, email, password);
    if (message) return res.status(400).json({ message });

    // メールアドレスの重複チェック
    const resSearchUser = await userService.searchUser('', '', email);
    if (resSearchUser.length) {
      return res.status(409).json({ message: DUPLICATE_EMAIL_MESSAGE });
    }

    const user = await userService.createUser({ name, email, password });

    // そのままログインできるようトークンを発行する
    const token = authService.createToken(user);

    res.status(201).json({ id: user.id, name: user.name, email: user.email, token });
  } catch (error) {
    // 同時登録などで UNIQUE 制約に違反した場合も重複として扱う
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: DUPLICATE_EMAIL_MESSAGE });
    }
    console.error(error);
    res.status(500).json({});
  }
});

export default router;
