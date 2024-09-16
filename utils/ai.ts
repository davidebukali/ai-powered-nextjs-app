const { GoogleGenerativeAI } = require('@google/generative-ai')
import { StructuredOutputParser } from 'langchain/output_parsers'
import z from 'zod'
import { PromptTemplate } from '@langchain/core/prompts'
import { log } from 'console'

const genAI = new GoogleGenerativeAI(process.env.API_KEY)
const semanticAnalysisTemplate =
  'Analyze the following journal entry. Follow the intructions and format your response to match the format instructions, no matter what! \n{formatted_instructions}\n{entry}'
const ragTemplate =
  'You are a helpful assistant. You will be given context and a question. Your task is to answer the question based only on the provided context. Do not use any external knowledge or make assumptions. You can use synonyms when refering to the context in your responses or occasionally leave it out of your responses. \nContext:\n{context}\nQuery:{query}'
export const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

const parser = StructuredOutputParser.fromZodSchema(
  z.object({
    sentimentScore: z
      .number()
      .describe(
        'sentiment of the text and rated on a scale from -10 to 10, where -10 is extremely negative, 0 is neutral, and 10 is extremely positive.'
      ),
    mood: z
      .string()
      .describe('the mood of the person who wrote the journal entry.'),
    subject: z.string().describe('a creative subject of the journal entry.'),
    summary: z.string().describe('quick sumary of the entire entry.'),
    negative: z
      .boolean()
      .describe(
        'is the journal entry negative ? (i.e does it contain negative emotions?).'
      ),
    color: z
      .string()
      .describe(
        'a hexadecimal color code that represents the mood of the entry. exam ple #0101fe for blue representing happinness.'
      ),
  })
)

// ragTemplate requires content parameter to have context and query variables
// semanticAnalysisTemplate requires just entry to be included in the content parameter
const getPrompt = async (
  template: string,
  content: { entry: string } | { context: string; query: string },
  formatted_instructions?: string
) => {
  const promptData = {
    template,
    inputVariables: formatted_instructions ? ['entry'] : ['context', 'query'],
    ...(formatted_instructions && {
      partialVariables: { formatted_instructions },
    }),
  }
  const prompt = new PromptTemplate(promptData)

  return await prompt.format(content)
}

export const analyze = async (content: string) => {
  const input = await getPrompt(
    semanticAnalysisTemplate,
    {
      entry: content,
    },
    parser.getFormatInstructions()
  )
  const result = await model.generateContent(input)
  const response = await result.response
  const text = response.text()

  try {
    return parser.parse(text)
  } catch (error) {
    console.log(error)
  }
}

export const ragQuery = async (query: string, context: string) => {
  const input = await getPrompt(ragTemplate, {
    query,
    context,
  })
  const result = await model.generateContent(input)

  const response = await result.response

  const text = response.text()

  try {
    return text
  } catch (error) {
    console.log(error)
  }
}
