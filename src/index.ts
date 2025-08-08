export interface Env {
  // If you set another name in the Wrangler config file as the value for 'binding',
  // replace "AI" with the variable name you defined.
  AI: Ai;
}

export default {
  async fetch(request, env): Promise<Response> {
		if (request.method === 'POST') {
			try {
				const data = await request.json();
				const response = await env.AI.run("@cf/google/gemma-7b-it-lora", {
					prompt: data.message,
				});
				return new Response( JSON.stringify(response),
					{
						status: 200,
						headers: { 'Content-Type': 'application/json' }
					}
				);
			} catch (err) {
				return new Response('Invalid JSON', { status: 400 })
			}
		}
    return new Response('Only POST allow', { status: 405 });
  },
} satisfies ExportedHandler<Env>;