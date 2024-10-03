const axios = require('axios');

exports.handler = async (event, context) => {
  // 클라이언트에서 전달된 쿼리 파라미터를 추출
  const { location, radius, keyword, type } = event.queryStringParameters;

  // Google Places API URL 생성
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=${radius}&keyword=${keyword}&type=${type}&key=${process.env.REACT_APP_GOOGLE_API_KEY}`;

  try {
    // Google API에 요청
    const response = await axios.get(url);
    
    return {
      statusCode: 200,
      body: JSON.stringify(response.data),
    };
  } catch (error) {
    return {
      statusCode: error.response?.status || 500,
      body: JSON.stringify({ message: error.message }),
    };
  }
};
