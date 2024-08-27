const { buildSchema } = require('graphql');
const { mergeSchemas } = require('graphql-tools');
import { ResponseStructure, IdentityInfo } from '../common/Types';
import { generateToken } from '../common/auth';

export { }

export type IdentityResponse = ResponseStructure & {
    data?: IdentityInfo;
}

type LoginInfo = {
    userName: string;
    password: string;
};

export { IdentityInfo }

// buildSchema
const schema = buildSchema(`
  input LoginInput {
    userName: String,
    password: String
  }

  type IdentityInfo {
    useId: String,
    userName: String,
    permission: String,
    token: String
  }

  type ResponseStructure {
    success: String,
    errorCode: Int,
    data: IdentityInfo,
    errorMessage: String
  }

  type Query {
    getIdentityInfo(condition: LoginInput): ResponseStructure
  }
`);

var findUser = async (users: any, condition: LoginInfo): Promise<[IdentityInfo]> => {
    return new Promise((resolve, reject) => {
        const aa = condition;
        users.find({ ...condition }, (err: any, docs: any) => {
            if (err) {
                reject(err);
            } else {
                resolve(docs);
            }
        });
    });
};

const root = {
    getIdentityInfo: async (args: { condition: LoginInfo }, context: any): Promise<IdentityResponse> => {

        // 从NeDB读取员工信息
        const users = context.dbManager.users;

        try {
            const result = await findUser(users, args.condition);

            // 查不到结果
            if (!result.length) {
                return { success: false, errorCode: 1, errorMessage: '用户名或密码错误，请重新输入。' };
            }

            // 生成token
            const token: string = generateToken(result[0]);

            const { useId, userName, permission } = result[0];
            return { success: true, errorCode: 0, data: { useId, userName, permission, token } };
        } catch (error) {

            console.error(error);
            return { success: false, errorCode: 1, errorMessage: '用户名或密码错误，请重新输入。' };
        }
    }
};

module.exports = {
    'ALL /api/userInfo': {
        schema: schema,
        rootValue: root,
    }
};
