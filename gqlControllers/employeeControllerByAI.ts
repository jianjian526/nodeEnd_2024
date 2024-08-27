import { GraphQLSchema } from 'graphql';
import { stitchSchemas } from '@graphql-tools/stitch';

export { }

/**
 * merge相关的Schema和Root
 * 
 * @param path 子schema定义的文件夹
 */
const setSchemaRoot = (path: string) => {
    const { schemaArray, rootArray } = getSubSchemaRoot(path);

    // merge schemas
    const subschemas: { schema: GraphQLSchema }[] = [];
    schemaArray.forEach((subSchema) => {
        subschemas.push({ schema: subSchema });
    })
    const schema: GraphQLSchema = stitchSchemas({
        subschemas: subschemas,
    });

    // merge roots
    const root = rootArray.reduce(function (result, currentObject) {
        // 遍历当前对象的所有属性
        return Object.assign(result, currentObject);
    }, {});

    return { schema, root }
}

/**
 * 取得所有Schema和Root
 * 
 * @param path 子schema定义的文件夹
 */
const getSubSchemaRoot = (path: string): { schemaArray: GraphQLSchema[], rootArray: Object[] } => {
    // Schema集合
    const schemaArray: GraphQLSchema[] = [];
    // Root集合
    const rootArray: Object[] = [];

    const fs = require('fs');
    fs.readdirSync(path).filter((f: any) => {
        return f.endsWith('.ts') && f != 'Types.ts';
    }).forEach((f: any) => {
        console.log(`process gql definde: ${f}...`);
        let { schema: subSchema, root: subRoot } = require(path + f);
        // 保存
        if (subSchema && subRoot) {
            schemaArray.push(subSchema);
            rootArray.push(subRoot);
        }
    });

    return { schemaArray, rootArray }
}

const { schema, root } = setSchemaRoot(__dirname + '/employee/');
module.exports = {
    'ALL /api/employInfoByAI': {
        schema: schema,
        rootValue: root,
    }
};
