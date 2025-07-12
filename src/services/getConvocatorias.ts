import axios from 'axios';

const getConvocatorias = async () => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    },
    withCredentials: true
  };

  try {
    const apiUrl = (import.meta as any).env.VITE_CONVOCATORIAS_API_URL;
    if (!apiUrl) {
      throw new Error('CONVOCATORIAS API URL is not defined');
    }
    
    const response = await axios.get(apiUrl, config);
    console.log('Convocatorias Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching convocatorias:', error);
    throw error;
  }
};

export default getConvocatorias;
