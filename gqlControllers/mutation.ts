export { }
const { buildSchema } = require('graphql');


const schema = buildSchema(`
  input AccountInput {
    name: String
    age: Int
    sex: String
    department: String
  }
  type Account {
    name: String
    age: Int
    sex: String
    department: String
  }
  type Mutation {
    createAccount(input: AccountInput): Account
    updateAccount(id: ID!, input: AccountInput): Account
  }
  type Query {
    accounts: [Account]
  }
`)

const fakeDb: { [key: string]: object } = {};

const root = {
  accounts: () => {
    var arr = [];
    for (const key in fakeDb) {
      arr.push(fakeDb[key])
    }
    return arr;
  },

  createAccount: ({ input }: any) => {
    fakeDb[input.name] = input;
    // @ts-ignore
    return fakeDb[input.name];
  },

  updateAccount: ({ id, input }: any) => {
    const updataAccount = Object.assign({}, fakeDb[id], input);
    fakeDb[id] = updataAccount;

    return updataAccount;
  },
};

module.exports = {
  'GET /api/useGqlMutation': {
    schema: schema,
    rootValue: root,
  }
};
