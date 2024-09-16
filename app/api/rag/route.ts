import { ragQuery } from '@/utils/ai'
import { prisma } from '@/utils/db'
import { neon } from '@neondatabase/serverless'
import { NextResponse, NextRequest } from 'next/server'
import PipelineSingleton from '../search/pipeline'

export const POST = async (request: NextRequest, { params }) => {
  const model = await PipelineSingleton.getInstance()
  const sql = neon(process.env.DATABASE_URL as string)

  try {
    const { query } = await request.json()

    const search_embedding_object = await model(query, {
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
      include: {
        analysis: true,
      },
    })

    const context = matched_entries
      .map((entry) => {
        return `Content:${entry.content} Mood:${entry.analysis?.mood} Summary:${entry.analysis?.summary} Created Date:${entry.analysis?.createdAt}`
      })
      .join('\n')

    const ai = await ragQuery(query, context)

    return NextResponse.json({
      data: {
        ai,
      },
    })
  } catch (err: any) {
    const error = err.message
    console.log(error)
    return NextResponse.json({
      data: {
        error,
      },
    })
  }
}
