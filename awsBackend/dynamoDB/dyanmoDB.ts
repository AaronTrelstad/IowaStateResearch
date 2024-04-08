import { DynamoDB }from 'aws-sdk';

const dynamoDB = new DynamoDB;

export async function getTableSchema(tableName: string): Promise<DynamoDB.DescribeTableOutput> {
    try {
        const params: DynamoDB.DescribeTableInput = {
            TableName: tableName,
        };

        const data = await dynamoDB.describeTable(params).promise();
        return data;
    } catch (error) {
        console.error('Error retrieving Schema data: ', error);
        throw error; 
    }
}


