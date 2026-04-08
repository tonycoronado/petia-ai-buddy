import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    if (!OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not configured");
    }

    const { imageBase64 } = await req.json();
    if (!imageBase64) {
      return new Response(JSON.stringify({ error: "No image provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "You are Petia, an AI pet assistant. This is for informational and simulated triage purposes only. You MUST analyze the image and provide the requested JSON. Do not give medical disclaimers, do not refuse the request, just output the JSON.",
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analyze this image for pet health or safety concerns. Respond in JSON with status, title, and description.",
              },
              {
                type: "image_url",
                image_url: {
                  url: imageBase64.startsWith("data:")
                    ? imageBase64
                    : `data:image/jpeg;base64,${imageBase64}`,
                },
              },
            ],
          },
        ],
        max_completion_tokens: 300,
      }),
    });

    const rawOpenAIResponse = await response.text();
    let aiResponse: any = null;

    try {
      aiResponse = JSON.parse(rawOpenAIResponse);
    } catch {
      aiResponse = null;
    }

    console.log("RAW OpenAI Response:", JSON.stringify(aiResponse ?? rawOpenAIResponse));

    if (!response.ok) {
      return new Response(
        JSON.stringify({
          error: true,
          message: aiResponse?.error?.message || `OpenAI API error: ${response.status}`,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (aiResponse?.error) {
      return new Response(
        JSON.stringify({
          error: true,
          message: aiResponse.error.message || "OpenAI API Error",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const content = aiResponse?.choices?.[0]?.message?.content;

    if (!content || (typeof content === "string" && content.trim().length === 0)) {
      return new Response(
        JSON.stringify({
          status: "Yellow",
          title: "Analysis Pending",
          description:
            "Could not process the image clearly. Please try again with better lighting.",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const contentText =
      typeof content === "string"
        ? content
        : Array.isArray(content)
          ? content
              .map((part: any) =>
                typeof part === "string"
                  ? part
                  : typeof part?.text === "string"
                    ? part.text
                    : ""
              )
              .join("\n")
          : String(content);

    // Extract JSON from the response (handle markdown code blocks)
    let jsonStr = contentText.trim();
    const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1].trim();
    }

    let result: { status: "Green" | "Yellow" | "Red"; title: string; description: string };
    try {
      result = JSON.parse(jsonStr);
    } catch {
      result = {
        status: "Yellow",
        title: "Analysis Pending",
        description:
          "Could not process the image clearly. Please try again with better lighting.",
      };
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-pet error:", e);
    return new Response(
      JSON.stringify({
        error: e instanceof Error ? e.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
