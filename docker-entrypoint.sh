#!/bin/sh
set -e

echo "Starting database initialization..."

# Generate Prisma Client
echo "Generating Prisma Client..."
npx prisma generate

# Reset the database and apply migrations
echo "Setting up database..."
if [ "$NODE_ENV" = "production" ]; then
    # Try to push the schema first
    npx prisma db push --accept-data-loss || true
    
    # Then try to run migrations
    npx prisma migrate deploy || true
else
    npx prisma migrate reset --force
fi

echo "Database setup completed."
echo "Starting the application..."

# Execute main command
exec "$@" 