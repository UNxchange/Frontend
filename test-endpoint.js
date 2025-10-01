// Script para probar el endpoint manualmente
// Ejecutar en la consola del navegador después del login

const testConvocatoriasEndpoint = async () => {
  const token = localStorage.getItem('access_token');
  
  console.log('🧪 Testing Convocatorias Endpoint');
  console.log('Token:', token?.substring(0, 50) + '...');
  
  try {
    // Test GET first (simpler)
    const getResponse = await fetch('http://localhost:8008/convocatorias', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('GET Response Status:', getResponse.status);
    console.log('GET Response Headers:', Object.fromEntries(getResponse.headers.entries()));
    
    if (getResponse.ok) {
      const data = await getResponse.json();
      console.log('GET Response Data:', data);
    } else {
      const errorText = await getResponse.text();
      console.log('GET Error Response:', errorText);
    }
    
    // Test Auth endpoint for comparison
    const authResponse = await fetch('http://localhost:8080/api/v1/auth/users', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Auth Service Status:', authResponse.status);
    console.log('Auth Service OK:', authResponse.ok);
    
  } catch (error) {
    console.error('Test Error:', error);
  }
};

// Para ejecutar: testConvocatoriasEndpoint()
console.log('Script cargado. Ejecuta: testConvocatoriasEndpoint()');