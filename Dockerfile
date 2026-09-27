# Stage 1: Build Frontend (Vite + React)
FROM node:20-alpine as frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Build Backend (FastAPI + Uvicorn)
FROM python:3.11-slim
WORKDIR /app

# Install dependencies
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source code
COPY backend/ ./

# Copy compiled frontend static assets from Stage 1 into backend/static
COPY --from=frontend-build /app/frontend/dist ./static

EXPOSE 8000

ENV PORT=8000
ENV HOST=0.0.0.0
ENV ENVIRONMENT=production

CMD ["python", "run.py"]
