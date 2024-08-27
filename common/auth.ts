const jwt = require('jsonwebtoken');
import { IdentityInfo } from '../common/Types';
import { expressjwt } from 'express-jwt';

const secret_key = 'secret2024';

// 生成JWT Token
const generateToken = (user: IdentityInfo): string => {
    // 在payload中存储用户信息
    const { useId, userName, permission } = user;

    const payload = {
        useId,
        userName,
        permission
    };

    // 使用密钥生成token  jwt.verify 方法不好用
    const token = jwt.sign(payload, secret_key, { expiresIn: '1h' });

    return token;
};

const verifyToken = (app: any) => {
    app.use(expressjwt({ secret: secret_key, algorithms: ['HS256'] }).unless({ path: [/^\/api\/userInfo/] }))
};

export { generateToken, verifyToken };