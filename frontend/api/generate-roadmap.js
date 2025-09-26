import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function cleanAIresponse(content) {
  if (!content) return "";

  const match = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);

  if (match && match[1]) {
    return match[1].trim();
  }

  const arrayMatch = content.match(/\[\s*\{[\s\S]*?\}\s*\]/);
  if (arrayMatch && arrayMatch[0]) {
    return arrayMatch[1].trim();
  }

  throw new Error("No valid JSON block found in response");
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `You are an expert product strategist and professional roadmap architect with 15+ years of experience in tech project planning, stakeholder alignment, and Agile execution.\nYur job is to generate the roadmap for: ${req.body.topic}.\nAnd, format as JSON array, Here is the sample structure {title:\"XYZ\",description:\"Lorem Ipsem....\",id:\"1\",estimated_time:\"14 hours\"}.\nImportant Note: Kindly adhere to the JSON structure provided to you as sample structure.`,
        },
      ],
      model: "openai/gpt-oss-20b",
    });

    let aiContent = chatCompletion.choices[0]?.message?.content;
    const cleanContent = await cleanAIresponse(aiContent);
    let roadmap;

    try {
      roadmap = await JSON.parse(cleanContent);
    } catch (jsonerror) {
      return res.status(500).json({
        error: "AI response was not valid JSON",
        message: jsonerror.message,
      });
    }

    res.status(200).json(roadmap);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
