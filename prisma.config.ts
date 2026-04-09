import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: env('postgresql://postgres.wqnjxafgzldzqpazzxaw:jZUZFER3ok9FXUMC@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres?schema=public'),
  },
})
