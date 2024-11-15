import 'dotenv/config'
import { get } from 'env-var'


export const envs = {
    PORT: get('PORT').required().asPortNumber(),
    MONGO_URL: get('MONGO_URL').required().asString(),
    MONGO_DB_NAME: get('MONGO_DB_NAME').required().asString(),
    JWT_SECRET_KEY: get('JWT_SECRET_KEY').required().asString(),
    MAILER_SERVICE: get('MAILER_SERVICE').required().asString(),
    MAILER_EMAIL: get('MAILER_EMAIL').required().asString(),
    MAILER_SECRET_KEY: get('MAILER_SECRET_KEY').required().asString(),
    WEBSITE_URL: get('WEBSITE_URL').required().asString(),
    DEV_MAIL: get('DEV_MAIL').default('true').asBool(),
    CLOUD_NAME: get('CLOUD_NAME').required().asString(),
    API_KEY : get('API_KEY').required().asString(),
    API_SECRET : get('API_SECRET').required().asString(),
}