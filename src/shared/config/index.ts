export interface IConfig {
  port: number;
  db: IDatabaseConfig;
  jwt_secret: string;
  jwt_expiration: string;
}

export interface IDatabaseConfig {
  db_url: string;
  host: string;
  port: number;
  name: string;
  user: string;
  password: string;
}

export default (): IConfig => ({
  port: parseInt(process.env.PORT, 10),
  db: {
    db_url: process.env.DB_URL,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
  jwt_secret: process.env.JWT_SECRET,
  jwt_expiration: process.env.JWT_EXPIRATION,
});
