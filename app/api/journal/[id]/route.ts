import { analyze } from '@/utils/ai'
import { getUserByClerkID } from '@/utils/auth'
import { prisma } from '@/utils/db'
import { NextResponse } from 'next/server'
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters'
import { Pool } from 'pg'
import { v4 as uuidv4 } from 'uuid'
import PipelineSingleton from '../../search/pipeline'

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 20,
  chunkOverlap: 1,
})

const model = await PipelineSingleton.getInstance()

const createEmbeddingsForJournalEntries = async (
  journalEntrySections,
  journalId
) => {
  let journalsections = [],
    len = journalEntrySections.length
  for (let index = 0; index < len; index++) {
    const embeddings = await model(journalEntrySections[index].pageContent, {
      pooling: 'mean',
      quantize: false,
    })
    journalsections.push({
      id: uuidv4(),
      entryId: journalId,
      embedding: Object.values(embeddings.data),
    })
  }
  return journalsections
}

export const PATCH = async (request, { params }) => {
  const { content } = await request.json()
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  })
  const client = await pool.connect()
  const user = await getUserByClerkID()
  const updatedEntry = await prisma.journalEntry.update({
    where: {
      userId_id: {
        userId: user.id,
        id: params.id,
      },
    },
    data: {
      content,
    },
  })

  const analysis = await analyze(updatedEntry.content)
  const updated = await prisma.analysis.upsert({
    where: {
      entryId: updatedEntry.id,
    },
    create: {
      userId: user.id,
      entryId: updatedEntry.id,
      ...analysis,
    },
    update: analysis,
  })

  const splitJournalEntry = await splitter.createDocuments([content])
  const journalEmbeddings = await createEmbeddingsForJournalEntries(
    splitJournalEntry,
    updatedEntry.id
  )

  try {
    await client.query(
      `DELETE FROM "public"."JournalEntrySections" WHERE "entryId" = $1`,
      [updatedEntry.id]
    )

    await client.query(
      `INSERT INTO "public"."JournalEntrySections" (
        id, "entryId", embedding
      )
      SELECT id, "entryId", embedding::VECTOR FROM jsonb_to_recordset($1::jsonb) AS t (id text, "entryId" text, embedding VECTOR)`,
      [JSON.stringify(journalEmbeddings)]
    )
  } catch (error) {
    console.error(`Error storing journalEmbeddings:`, error)
  } finally {
    client.release()
    await pool.end()
  }

  return NextResponse.json({
    data: {
      ...updatedEntry,
      analysis: updated,
    },
  })
}
