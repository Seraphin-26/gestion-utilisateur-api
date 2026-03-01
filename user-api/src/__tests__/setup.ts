// En CI (GitHub Actions), la BDD est sur le port 5432
// En local, ta BDD Docker est sur le port 5433
// On laisse la variable DATABASE_URL du workflow CI prendre le dessus
// et on met le port 5433 seulement si pas déjà défini

process.env.DATABASE_URL = process.env.DATABASE_URL || 
  'postgresql://postgres:postgres@localhost:5433/userapi_test'

process.env.JWT_SECRET = 'test_jwt_secret_key_for_testing_only'
process.env.JWT_EXPIRES_IN = '15m'
process.env.JWT_REFRESH_SECRET = 'test_refresh_secret_key_for_testing_only'
process.env.JWT_REFRESH_EXPIRES_IN = '7d'
process.env.PORT = '3001'
process.env.CLIENT_URL = 'http://localhost:5173'
process.env.UPLOAD_DIR = 'uploads_test'
process.env.MAX_FILE_SIZE = '5242880'