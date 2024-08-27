const { buildSchema } = require('graphql');
import { stitchSchemas } from '@graphql-tools/stitch';
import { ResponseStructure } from '../common/Types';

export { }

// response
export type EmployeeResponse = ResponseStructure & {
  data?: { list: Employee[] };
}

// 入力+返回 Type
type Employee = {
  id?: number;
  name?: string;
  nickName?: string;
  gender?: string;
  key?: string;
};

// buildSchema
const schema = buildSchema(`
  input EmployeeInput {
    id: Int,
    name: String,
    nickName: String,
    gender: String,
    key: String
  }

  type List {
    list: [Employee]
  }

  type Employee {
    id: Int,
    name: String,
    nickName: String,
    gender: String,
    key: String
  }

  type ResponseStructure {
    success: String,
    errorCode: Int,
    data: List,
    errorMessage: String
  }

  type Query {
    queryEmployeeList(condition: EmployeeInput): ResponseStructure
  }
`);

var findEmployees = async (employee: any) => {
  return new Promise((resolve, reject) => {
    employee.find({}, (err: any, docs: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(docs);
      }
    });
  });
};

const root = {
  queryEmployeeList: async (args: { condition: Employee }, context: any): Promise<EmployeeResponse> => {

    // 从NeDB读取员工信息
    const employee = context.dbManager.employee;

    try {
      const result = await findEmployees(employee);

      // (备忘: @ts-ignore)
      return { success: true, errorCode: 0, data: { list: result as Employee[] } };
    } catch (error) {

      console.error(error);
      return { success: false, errorCode: 1 };
    }
  }
};

module.exports = {
  'ALL /api/employInfo': {
    schema: schema,
    rootValue: root,
  }
};
