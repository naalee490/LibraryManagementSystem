#!/bin/bash

# Local startup helper
# Set DB_PASSWORD and JWT_SECRET before running.

set -e

cd "$(dirname "$0")"

: "${DB_PASSWORD:?ERROR: Set DB_PASSWORD before running}"
: "${JWT_SECRET:?ERROR: Set JWT_SECRET before running}"

export DB_PASSWORD JWT_SECRET

echo "Starting Spring Boot on http://localhost:8080 ..."
./mvnw spring-boot:run
