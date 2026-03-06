import { createServerFn } from '@tanstack/react-start'
import { GoogleGenAI } from '@google/genai'
import { checkRateLimit } from './rate-limit'
import { getRequestIP } from '@tanstack/react-start/server'
import { z } from 'zod'

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY ?? '' })

export type ScanResult = {
    name: string
    calories: number
    protein: number
    carbs: number
    fat: number
}

const analyzeFoodInputSchema = z.object({
    base64: z.string().min(1),
    mimeType: z.string().min(1),
})

export const analyzeFood = createServerFn({ method: 'POST' })
    .inputValidator(analyzeFoodInputSchema)
    .handler(async ({ data: input }) => {
        const allowedTypes = [
            'image/jpeg',
            'image/png',
            'image/webp',
            'image/heic',
            'image/heif',
            'application/pdf',
        ]
        if (!allowedTypes.includes(input.mimeType)) {
            throw new Error(
                `Unsupported file type: ${input.mimeType}. Supported: ${allowedTypes.join(', ')}`,
            )
        }

        // 10MB max (base64 is ~33% larger than raw)
        const sizeInBytes = (input.base64.length * 3) / 4
        if (sizeInBytes > 10 * 1024 * 1024) {
            throw new Error('File too large. Maximum size is 10MB.')
        }

        // Rate limiting
        let ip = '127.0.0.1'
        try {
            ip = getRequestIP() ?? '127.0.0.1'
        } catch {
            // fallback if not in request context
        }
        const rateLimit = checkRateLimit(ip)

        if (!rateLimit.allowed) {
            throw new Error(
                `Rate limit exceeded. Try again in ${Math.ceil(rateLimit.retryAfterMs / 1000)} seconds.`,
            )
        }

        if (!process.env.GEMINI_API_KEY) {
            throw new Error('GEMINI_API_KEY is not configured on the server.')
        }

        const prompt = `You are a nutrition analysis expert. Analyze this food product image or nutrition label.

Extract or estimate the following nutritional information PER 100g of the product:
- Product name
- Calories (kcal)
- Protein (grams)
- Carbohydrates (grams)
- Fat (grams)

If the image shows a nutrition label, extract the values and convert them to per 100g if they aren't already.
If the image shows food without a label, estimate the macros based on what you see.

You MUST respond with ONLY a valid JSON object in this exact format, with no additional text:
{"name": "Product Name", "calories": 0, "protein": 0, "carbs": 0, "fat": 0}

All numeric values must be numbers (not strings). Round to 1 decimal place.`

        try {
            const response = await genAI.models.generateContent({
                model: 'gemini-2.0-flash',
                contents: [
                    {
                        role: 'user',
                        parts: [
                            { text: prompt },
                            {
                                inlineData: {
                                    mimeType: input.mimeType,
                                    data: input.base64,
                                },
                            },
                        ],
                    },
                ],
            })

            const text = response.text?.trim()
            if (!text) {
                throw new Error('Empty response from AI')
            }

            // Extract JSON from response (handle markdown code blocks)
            let jsonStr = text
            const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/)
            if (jsonMatch) {
                jsonStr = jsonMatch[1].trim()
            }

            const parsed = JSON.parse(jsonStr) as ScanResult

            // Validate the parsed result
            if (
                typeof parsed.name !== 'string' ||
                typeof parsed.calories !== 'number' ||
                typeof parsed.protein !== 'number' ||
                typeof parsed.carbs !== 'number' ||
                typeof parsed.fat !== 'number'
            ) {
                throw new Error('Invalid response structure from AI')
            }

            return {
                success: true as const,
                data: {
                    name: parsed.name,
                    calories: Math.round(parsed.calories * 10) / 10,
                    protein: Math.round(parsed.protein * 10) / 10,
                    carbs: Math.round(parsed.carbs * 10) / 10,
                    fat: Math.round(parsed.fat * 10) / 10,
                },
                remaining: rateLimit.remaining,
            }
        } catch (error) {
            if (error instanceof SyntaxError) {
                throw new Error(
                    'Failed to parse AI response. Please try again with a clearer image.',
                )
            }
            throw error
        }
    })
