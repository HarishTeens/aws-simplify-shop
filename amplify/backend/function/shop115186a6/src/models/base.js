const AWS = require('aws-sdk');

class BaseDB {
    static dynamoDB = new AWS.DynamoDB.DocumentClient();
    constructor(dbName) {
        this.tableName = dbName;
        if (process.env.ENV && process.env.ENV !== "NONE") {
            this.tableName = this.tableName + '-' + process.env.ENV;
        }
    }
    getTableName() {
        return this.tableName;
    }
    getRandomId() {
        return Math.random().toString(36).slice(2);
    }
    async getAll() {
        const data = BaseDB.dynamoDB.scan({
            TableName: this.tableName,
        })

        return (await data.promise()).Items;
    }
    /**
     * 
     * @param {AWS.DynamoDB.DocumentClient.Key} key takes the structure {HashKey: val}
     * @returns 
     */
    async getByKey(key) {
        return BaseDB.dynamoDB.get({
            TableName: this.tableName,
            Key: key
        }).promise();
    }
    /**
     * 
     * @param {AWS.DynamoDB.DocumentClient.KeyList} keys takes the structure [{HashKey: val}]
     * @returns 
     */
    async batchGetByKey(keys) {
        return BaseDB.dynamoDB.batchGet({
            RequestItems: {
                [this.tableName]: {
                    Keys: keys
                }
            }
        }).promise();
    }
    async insert(item) {
        const putItemParams = {
            TableName: this.tableName,
            Item: item
        }
        return BaseDB.dynamoDB.put(putItemParams).promise();
    }
};


module.exports = BaseDB;
