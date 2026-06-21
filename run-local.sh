#!/bin/bash
# Local startup helper — set your MySQL password before running:
#   export DB_PASSWORD='your_mysql_password'
#   export jwt.key='mySecretKeyForJwtMustBeLongEnough123'
#   ./run-local.sh

set -e
cd "$(dirname "$0")"

if [ -z "$DB_PASSWORD" ]; then
  echo "ERROR: Set DB_PASSWORD first, e.g.:"
  echo "  export DB_PASSWORD='your_mysql_password'"
  exit 1
fi

if [ -z "$jwt.key" ]; then
  export jwt.key='mySecretKeyForJwtMustBeLongEnough123'
fi

echo "Starting Spring Boot on http://localhost:8080 ..."
./mvnw spring-boot:run
