import { APIGatewayProxyHandler } from "aws-lambda";
import { DynamoDB } from 'aws-sdk';

const dynamoDB = new DynamoDB;

/**
 *  US48 is the total energy in the US at that hour
 *  Also includes Reigons, need to find the 37 
 */

async function getAllDataFromEIATable(tableName: string, startDate: Date, endDate: Date, respondents: string[]): Promise<any[]> {
    const params: DynamoDB.QueryInput = {
        TableName: tableName,
    }
    let allData: any[] = [];

    let queryResult;

    // Get all EIA data
    do {
        queryResult = await dynamoDB.scan(params).promise();
        allData = allData.concat(queryResult.Items || []);
        params.ExclusiveStartKey = queryResult.LastEvaluatedKey;
    } while (queryResult.LastEvaluatedKey);

    
    do {
        if (respondents.length == 0) {
            // Get all loactions
            getRespondentLocations(tableName, respondents);
        } else {
            //Get Selected locations
            getRespondentLocations(tableName, respondents);
        }
        
    } while(date <= endDate && date >= startDate)
    
    return allData;
}

async function getRespondentLocations(tableName: string, respondents: string[]): Promise<any[]> {
    const params: DynamoDB.QueryInput = {
        TableName: tableName,
        AttributesToGet: respondents,
    }

    let allData: any[] = [];

    return allData
}

export const handler: APIGatewayProxyHandler = async (event, context) => {
    try {
        const tableName = event.queryStringParameters?.tableName;
        const startData = event.queryStringParameters?.startDate;

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

        

        return {

        }
    } catch(error) {
        return {

        }
    }

}
