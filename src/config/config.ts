import {config} from './dev.config';

const env = process.env.NODE_ENV || 'development';
console.log('\nenv *****', env);

if (env === 'development' || env === 'test') {
    console.log('MADE');
    const envConfig = config[env];
    Object.keys(envConfig).forEach((key) => {
        process.env[key] = envConfig[key];
    });
}