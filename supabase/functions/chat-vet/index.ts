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

    const { messages, petContext } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: true, message: "No messages provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build dynamic system prompt from pet context
    let petInfo = "a pet";
    if (petContext) {
      const parts = [petContext.name || "a pet"];
      if (petContext.breed) parts.push(`a ${petContext.breed}`);
      if (petContext.age) parts.push(`age: ${petContext.age}`);
      if (petContext.weight) parts.push(`weight: ${petContext.weight}`);
      petInfo = parts.join(", ");
    }

    const systemPrompt = `You are Petia, a friendly, empathetic, and expert veterinary AI assistant. You are currently talking to the owner of ${petInfo}. Keep your answers concise, Gen-Z friendly, and highly practical. Always end your response with a brief note: "If symptoms persist or worsen, please consult a veterinarian."`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        max_completion_tokens: 500,
      }),
    });

    const data = await response.json();
    console.log("RAW OpenAI Response:", JSON.stringify(data));

    if (!response.ok || data.error) {
      return new Response(
        JSON.stringify({
          error: true,
          message: data?.error?.message || `OpenAI API error: ${response.status}`,
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const content = data.choices?.[0]?.message?.content;

    if (!content || (typeof content === "string" && content.trim().length === 0)) {
      return new Response(
        JSON.stringify({ error: true, message: "No response from AI" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ content }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("chat-vet error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
