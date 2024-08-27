const { buildSchema } = require('graphql');

export { }

const schema = buildSchema(`
  type Account {
    name: String,
    age: Int,
    sex: String,
    department: String,
    salary(city: String): Int
  }
  type Query {
    hello: String,
    account(username: String): Account,
    getClassMates(classNo: Int!): [String]
  }
`);

const root = {
  hello: () => {
    return 'Hello, GraphQL!'
  },
  account: ({ username }: { username: String }) => {
    return {
      name: username,
      age: 23,
      sex: '男',
      department: '开发中心',
      salary: ({ city }: { city: String }) => {
        if (city === '北京' || city === '上海') {
          return 10000;
        } else {
          return 3000;
        }
      }
    }
  },
  // @ts-ignore
  getClassMates: ({ classNo }) => {
    const obj = {
      31: ['张三', '李四'],
      32: ['王五', '赵六']
    }
    // @ts-ignore
    return obj[classNo];
  },


};

// const usegql = (app: any, url: string) => {

//   app.use(url,
//     graphqlHTTP({
//       schema: schema,
//       rootValue: root,
//       graphiql: true // 在浏览器中启用 GraphQL IDE
//     }));
// };

// module.exports = usegql;

module.exports = {
  'ALL /api/useGqlDemo': {
    schema: schema,
    rootValue: root,
  }
};
