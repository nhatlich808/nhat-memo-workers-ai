export interface Env {
  // If you set another name in the Wrangler config file as the value for 'binding',
  // replace "AI" with the variable name you defined.
  AI: Ai;
}

export default {
  async fetch(request, env): Promise<Response> {
		const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
    };

		if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          ...corsHeaders
        },
      });
    }

		if (request.method === 'POST') {
			try {
				const data = await request.json();
				const response = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
					prompt: data.message,
				});
				return new Response( JSON.stringify(response),
					{
						status: 200,
						headers: {
							...corsHeaders,
							'Content-Type': 'application/json'
						}
					}
				);
			} catch (err) {
				return new Response('Invalid JSON', {
					status: 400,
					headers: {
						...corsHeaders
					}
				})
			}
		}
    return new Response('Only POST allow', {
			status: 405,
			headers: {
				...corsHeaders
			}
		});
  },
} satisfies ExportedHandler<Env>;