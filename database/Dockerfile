FROM postgres:15-alpine

# Copy initialization scripts
COPY init.sql /docker-entrypoint-initdb.d/

# Set default environment variables
ENV POSTGRES_DB=studygenie
ENV POSTGRES_USER=studygenie_user
ENV POSTGRES_PASSWORD=studygenie_pass
