import { NextRequest, NextResponse } from 'next/server'
import PipelineSingleton from './pipeline'
import { neon } from '@neondatabase/serverless'
import { prisma } from '@/utils/db'

export const POST = async (request: NextRequest, { params }) => {
  const model = await PipelineSingleton.getInstance()
  const sql = neon(process.env.DATABASE_URL as string)

  try {
    const { content } = await request.json()

    const search_embedding_object = await model(content, {
      pooling: 'mean',
      quantize: false,
    })
    const search_embedding_array = Object.values(search_embedding_object.data)

    const result = await sql(
      `SELECT * FROM "public"."JournalEntrySections" ORDER BY embedding::VECTOR <=> '[${search_embedding_array}]' LIMIT 5;`
    )

    const matched_entries = await prisma.journalEntry.findMany({
      where: {
        id: { in: result.map((entry) => entry.entryId) },
      },
    })

    return NextResponse.json({
      data: matched_entries,
    })
  } catch (error) {
    console.log(error)
  }
}
