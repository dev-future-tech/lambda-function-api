export const handler = async (event) => {
    // TODO implement
    console.log(event);
    const requestId = event.pathParameters.requestId;
    
    console.log(`Request Id is ${requestId}`);
    
    const body = {
      'request_id' : requestId,
      'name' : 'Green Gophers Brains',
      'brand' : 'Green Gophers',
      'size' : '400ml'
    };
    
    const response = {
      statusCode: 200,
      body: JSON.stringify(body),
      headers: {
        "Access-Control-Allow-Origin" : "http://localhost:3000",
        "Access-Control-Allow-Methods": "GET,OPTIONS,POST",
        "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token"
      }
    };
    return response;
  };
  