import axios from 'axios';
import { API_CONFIG } from '../config/api';

const getConvocatorias = async () => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    },
    withCredentials: true
  };

  try {
    // Usar la configuración centralizada en lugar de variable de entorno directa
    const apiUrl = `${API_CONFIG.CONVOCATORIAS_BASE_URL}${API_CONFIG.ENDPOINTS.CONVOCATORIAS.LIST}`;
    console.log('Fetching convocatorias from:', apiUrl);
    
    const response = await axios.get(apiUrl, config);
    console.log('Convocatorias Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching convocatorias:', error);
    throw error;
  }
};

export default getConvocatorias;
