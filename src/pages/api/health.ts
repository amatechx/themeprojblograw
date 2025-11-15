import type { NextApiRequest, NextApiResponse } from 'next';

interface HealthCheckResponse {
  status: 'ok' | 'error';
  timestamp: string;
  uptime: number;
  version: string;
  environment: string;
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  services: {
    database: 'connected' | 'disconnected' | 'checking';
    redis: 'connected' | 'disconnected' | 'checking';
  };
  performance: {
    responseTime: number;
    loadTime: number;
  };
}

// Helper function to get memory usage
const getMemoryUsage = () => {
  const usage = process.memoryUsage();
  const total = usage.heapTotal;
  const used = usage.heapUsed;
  const percentage = Math.round((used / total) * 100);
  
  return {
    used: Math.round(used / 1024 / 1024), // MB
    total: Math.round(total / 1024 / 1024), // MB
    percentage,
  };
};

// Helper function to check database connection
const checkDatabaseConnection = async (): Promise<'connected' | 'disconnected' | 'checking'> => {
  try {
    // In a real implementation, you would check your actual database connection
    // For now, we'll simulate a database check
    await new Promise(resolve => setTimeout(resolve, 100));
    return 'connected';
  } catch (error) {
    return 'disconnected';
  }
};

// Helper function to check Redis connection
const checkRedisConnection = async (): Promise<'connected' | 'disconnected' | 'checking'> => {
  try {
    // In a real implementation, you would check your actual Redis connection
    // For now, we'll simulate a Redis check
    await new Promise(resolve => setTimeout(resolve, 50));
    return 'connected';
  } catch (error) {
    return 'disconnected';
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<HealthCheckResponse | { error: string }>
) {
  const startTime = Date.now();
  
  // Set CORS headers for health check endpoints
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // Only allow GET requests
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  
  try {
    // Get system information
    const memoryUsage = getMemoryUsage();
    const uptime = process.uptime();
    
    // Check external services in parallel
    const [databaseStatus, redisStatus] = await Promise.all([
      checkDatabaseConnection(),
      checkRedisConnection(),
    ]);
    
    // Calculate performance metrics
    const responseTime = Date.now() - startTime;
    
    // Create health check response
    const healthCheck: HealthCheckResponse = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: Math.round(uptime),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      memory: memoryUsage,
      services: {
        database: databaseStatus,
        redis: redisStatus,
      },
      performance: {
        responseTime,
        loadTime: Math.round((Date.now() - startTime) / 1000 * 100) / 100, // seconds
      },
    };
    
    // Determine overall health status
    const isHealthy = 
      healthCheck.services.database === 'connected' &&
      healthCheck.services.redis === 'connected' &&
      healthCheck.memory.percentage < 90; // Less than 90% memory usage
    
    // Set appropriate status code
    const statusCode = isHealthy ? 200 : 503;
    
    res.status(statusCode).json(healthCheck);
    
    // Log health check (in production, you might want to log this to a monitoring service)
    if (process.env.NODE_ENV === 'development') {
      console.log(`Health check: ${statusCode === 200 ? 'OK' : 'UNHEALTHY'} - `, {
        database: databaseStatus,
        redis: redisStatus,
        memory: memoryUsage.percentage,
        responseTime,
      });
    }
    
  } catch (error) {
    console.error('Health check failed:', error);
    
    // Return error response
    res.status(503).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      uptime: Math.round(process.uptime()),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      memory: getMemoryUsage(),
      services: {
        database: 'disconnected',
        redis: 'disconnected',
      },
      performance: {
        responseTime: Date.now() - startTime,
        loadTime: 0,
      },
    });
  }
}

// Enable edge runtime if needed
export const config = {
  api: {
    bodyParser: false,
  },
};