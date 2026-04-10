import type { AIAnalysisResult } from '../types'
import {
    getAnalysisPrompt,
    getTextAnalysisPrompt,
    getRefinementPrompt,
} from './prompts'

type InputTextPart = { type: 'input_text'; text: string }
type InputImagePart = { type: 'input_image'; image_url: string }
type ContentPart = InputTextPart | InputImagePart

export async function analyzeWithOpenAI(
    apiKey: string,
    model: string,
    images: string[],
    textPrompt?: string,
    previousResult?: AIAnalysisResult,
): Promise<AIAnalysisResult> {
    const parts: ContentPart[] = []

    // Refinement mode: pass previous result + user correction
    if (previousResult && textPrompt) {
        parts.push({
            type: 'input_text',
            text: getRefinementPrompt(previousResult, textPrompt),
        })
    } else if (textPrompt && images.length === 0) {
        // Text-only analysis
        parts.push({
            type: 'input_text',
            text: getTextAnalysisPrompt(textPrompt),
        })
    } else {
        parts.push({ type: 'input_text', text: getAnalysisPrompt(textPrompt) })
    }

    // Attach images (not needed for refinement)
    for (const img of images) {
        const url = img.startsWith('data:')
            ? img
            : `data:image/jpeg;base64,${img}`
        parts.push({ type: 'input_image', image_url: url })
    }

    const response = await fetch('https://api.openai.com/v1/responses', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model,
            input: [{ role: 'user', content: parts }],
            tools: [{ type: 'web_search_preview' }],
            max_output_tokens: 5000,
        }),
    })

    if (!response.ok) {
        const error = await response.text()
        throw new Error(`OpenAI API error: ${response.status} - ${error}`)
    }

    const data = await response.json()

    const messageOutput = data.output?.find(
        (item: { type: string }) => item.type === 'message',
    )
    const content = messageOutput?.content?.find(
        (c: { type: string }) => c.type === 'output_text',
    )?.text

    if (!content) {
        console.error('Unexpected Responses API shape:', JSON.stringify(data, null, 2))
        throw new Error('No response content from OpenAI')
    }

    return parseAIResponse(content)
}

function parseAIResponse(content: string): AIAnalysisResult {
    const jsonMatch =
        content.match(/```(?:json)?\s*([\s\S]*?)```/) ||
        content.match(/(\{[\s\S]*\})/)

    if (!jsonMatch?.[1]) {
        throw new Error('Could not parse AI response as JSON')
    }

    const parsed = JSON.parse(jsonMatch[1].trim())

    if (!parsed.foods || !Array.isArray(parsed.foods)) {
        throw new Error('Invalid AI response structure: missing foods array')
    }

    return {
        foods: parsed.foods.map((food: Record<string, unknown>) => ({
            name: String(food.name || 'Unknown food'),
            calories: Number(food.calories) || 0,
            protein: Number(food.protein) || 0,
            carbs: Number(food.carbs) || 0,
            fat: Number(food.fat) || 0,
            servingSize: String(
                food.servingSize || food.serving_size || '1 serving',
            ),
        })),
        confidence: parsed.confidence || 'medium',
        notes: parsed.notes,
    }
}
