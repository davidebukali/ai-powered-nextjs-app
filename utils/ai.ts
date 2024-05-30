const { GoogleGenerativeAI } = require('@google/generative-ai')
import { StructuredOutputParser } from 'langchain/output_parsers'
import z from 'zod'
import { PromptTemplate } from '@langchain/core/prompts'

const parser = StructuredOutputParser.fromZodSchema(
  z.object({
    mood: z
      .string()
      .describe('the mood of the person who wrote the journal entry.'),
    subject: z.string().describe('a creative subject of the journal entry.'),
    summary: z.string().describe('quick sumary of the entire entry.'),
    negative: z
      .boolean()
      .describe(
        'is the journal entry negative ? (i.e does it containe negative emotions?).'
      ),
    color: z
      .string()
      .describe(
        'a hexadecimal color code that represents the mood of the entry. exam ple #0101fe for blue representing happinness.'
      ),
  })
)

const genAI = new GoogleGenerativeAI(process.env.API_KEY)

const getPrompt = async (content) => {
  const formatted_instructions = parser.getFormatInstructions()
  const prompt = new PromptTemplate({
    template:
      'Analyze the following journal entry. Follow the intructions and format your response to match the format instructions, no matter what! \n{formatted_instructions}\n{entry}',
    inputVariables: ['entry'],
    partialVariables: { formatted_instructions },
  })

  const input = await prompt.format({
    entry: content,
  })

  console.log(input)

  return input
}

export const analyze = async (content: string) => {
  const input = await getPrompt(content)
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
  const result = await model.generateContent(input)
  const response = await result.response
  const text = response.text()

  try {
    return parser.parse(text)
  } catch (error) {
    console.log(error)
  }
}
