# Utilise l'image officielle PostgreSQL
FROM postgres:16

# Définir des variables d’environnement pour initialiser la base
ENV POSTGRES_USER=admin
ENV POSTGRES_PASSWORD=admin123
ENV POSTGRES_DB=project_bolt_db

# Copier des scripts d'initialisation SQL (facultatif)
# COPY init.sql /docker-entrypoint-initdb.d/

# Le port par défaut PostgreSQL
EXPOSE 5432
