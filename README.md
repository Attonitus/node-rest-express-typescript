# NODE RESTAPI

To run this project:

1. Install dependecies: `npm i`
2. Up docker database: `docker compose up -d`
3. Copypaste .env.template to create .env, fill the envs
4. Seed database: `npm run seed`
5. Run program with: `npm run dev`

## ENDPOINTS

localhost:PORT

### USERS

Register user
Method POST : /api/auth/register

Login user
Method POST : /api/auth/login

Verify Mail
Method GET : /api/auth/verifiedMail

### CATEGORIES

Get all categories
Method GET : /api/categories?page=1&limit=10

Get by id category
Method GET : /api/categories/:id

Create category
Method POST : /api/categories

Delete category
Method DELETE : /api/categories/:id

Update category
Method PUT : /api/categories/:id
