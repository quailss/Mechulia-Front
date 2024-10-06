const axios = require('axios');

exports.handler = async (event) => {
    const { endpoint, name } = event.queryStringParameters;
    const apiUrl = `http://openapi.foodsafetykorea.go.kr/api/${endpoint}/xml/1/10/RCP_NM=${name}`;

    try {
        const response = await axios.get(apiUrl);
        return {
            statusCode: 200,
            body: response.data,
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: '데이터를 가져오는 중 오류 발생' }),
        };
    }
};
