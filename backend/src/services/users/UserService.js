// import nanoid from 'nanoid';
import db from '../../models/index.js';
import AuthService from '../auth/AuthService.js';

const authService = new AuthService();

// クラス
class UserService {
  /**
   * ユーザー情報取得
   * @param ユーザーID
   * @return ユーザー情報
   */
  async getUser(user_id) {
    // ユーザーIDをキーにユーザー情報を取得する
    const rows = await db.Users.findOne({ where: { id: user_id } });
    console.log(rows.dataValues);
    // 取得したデータを返却形式に整形して格納し返却する
    const resData = {
      id: rows.dataValues.id,
      name: rows.dataValues.name,
      email: rows.dataValues.email,
    };
    return resData;
  }
  /**
   * ユーザー新規登録
   * @param 登録内容（name, email, password）
   * @return 登録したユーザー情報
   */
  async createUser({ name, email, password }) {
    // パスワードはハッシュ化して保存する（サインイン時の照合と同じ方式）
    const row = await db.Users.create({
      name,
      email,
      password: authService.hashSha256(password),
    });
    return {
      id: row.dataValues.id,
      name: row.dataValues.name,
      email: row.dataValues.email,
    };
  }
  /**
   * ユーザー情報検索
   * @param 検索条件
   * @return ユーザー情報リスト
   */
  async searchUser(id, name, email, password) {
    const where = {};
    // IDが指定されている場合はIDを条件へ追加する
    if (id) {
      where.id = id;
    }
    // 名前が指定されている場合は名前を条件へ追加する
    if (name) {
      where.name = name;
    }
    // メールアドレスが指定されている場合はメールアドレスを条件へ追加する
    if (email) {
      where.email = email;
    }
    // パスワードが指定されている場合はパスワードを条件へ追加する
    if (password) {
      const hash_password = authService.hashSha256(password);
      where.password = hash_password;
    }

    // 検索実行
    const rows = await db.Users.findAll({ where });

    // 取得したデータを返却形式に整形して格納し返却する
    const resDataList = [];
    for (const row of rows) {
      const resData = {
        id: row.dataValues.id,
        name: row.dataValues.name,
        email: row.dataValues.email,
      };
      // 返却用リストへ格納する
      resDataList.push(resData);
    }

    return resDataList;
  }
}

export default UserService;
