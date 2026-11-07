set -e

echo "🔄 Pulling latest changes from repository..." && \
git pull && \
echo "📦 Installing dependencies..." && \
npm install && \
# npx prisma generate && \
# npm run db:force && \
# echo "🗃️ Deploying database changes..." && \
# npm run db:generate && \
# npm run db_deploy && \
# prisma db seed && \
echo "🔨 Building the application..." && \
rm -rf tsconfig.tsbuildinfo && \
rm -rf dist && \
npm run build && \
echo "♻️ Starting/Restarting PM2 server..." && \
pm2 startOrReload ecosystem.config.js && \
echo "✅ Deployment completed successfully!"