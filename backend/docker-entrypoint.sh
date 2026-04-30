#!/bin/sh
set -e

echo "Waiting for PostgreSQL..."
until pg_isready -h postgres -U leadz -d leadz > /dev/null 2>&1; do
  sleep 1
done

php bin/console doctrine:migrations:migrate --no-interaction
php bin/console app:seed-templates

exec php -S 0.0.0.0:8000 -t public public/router.php
