import { APIGatewayProxyHandler } from "aws-lambda";
import { getTableSchema } from "../dynamoDB/dyanmoDB";

export const handler: APIGatewayProxyHandler = async (event, context) => {
    try {
        const tableName = event.queryStringParameters?.tableName;

        if (!tableName) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Table name is required.' })
            }
        }

        const schema = await getTableSchema(tableName);

        return {
            statusCode: 200,
            body: JSON.stringify(schema)
        }
    } catch(error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Failed to retrieve table schema.' }),
        }
    }

}


