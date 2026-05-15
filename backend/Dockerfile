# Backend Dockerfile
# Multi-stage build: installs Python (for ML) + Node.js (for API)

FROM python:3.11-slim AS base

# Install Node.js 20 LTS
RUN apt-get update && apt-get install -y curl gnupg && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Python ML dependencies
WORKDIR /app
COPY requirements.txt ./
RUN pip install --no-cache-dir --default-timeout=1000 -r requirements.txt

# Install Node.js dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy application code
COPY . .

# Expose backend port
EXPOSE 5000

# Start Node.js API server
# We use npm start because it now includes the training step
CMD ["npm", "start"]
