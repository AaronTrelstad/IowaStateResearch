import { APIGatewayProxyHandler } from "aws-lambda";
import { DynamoDB } from 'aws-sdk';

const dynamoDB = new DynamoDB();

async function getAllDataFromTable(tableName: string): Promise<any[]> {
    try {
        const params: DynamoDB.ScanInput = {
            TableName: tableName,
        };

        let allData: any[] = [];
        let scanResult;
        do {
            scanResult = await dynamoDB.scan(params).promise();
            allData = allData.concat(scanResult.Items || []);
            params.ExclusiveStartKey = scanResult.LastEvaluatedKey;
        } while (scanResult.LastEvaluatedKey);

        return allData;
    } catch (error) {
        console.error('Error retrieving data: ', error);
        throw error;
    }
}

export const handler: APIGatewayProxyHandler = async (event, context) => {
    if (event.httpMethod.toUpperCase() == "OPTIONS") {
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Methods': '*'
            },
            body: ""
        }
    }
    
    try {
        const tableName = event.queryStringParameters?.tableName;

        if (!tableName) {
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': '*',
                    'Access-Control-Allow-Methods': '*'
                },
                body: JSON.stringify({ message: 'Table name is required.' })
            }
        }

        const allData = await getAllDataFromTable(tableName);

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Methods': '*'
            },
            body: JSON.stringify(allData)
        }
    } catch (error) {
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Methods': '*'
            },
            body: JSON.stringify({ message: 'Failed to retrieve data from table.' }),
        }
    }
}
