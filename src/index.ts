export default {
	async fetch(request, env) {
		// The target domain you want to proxy to
		const targetDomain = 'https://theknot.com/us/taylor-woloszynski-and-elijah-bosley-sep-2025'; // Include the default path if necessary

		// Parse the incoming request URL
		const incomingUrl = new URL(request.url);

		// Construct the target URL
		const targetUrl = new URL(targetDomain);
		targetUrl.pathname = incomingUrl.pathname === '/' ? targetUrl.pathname : incomingUrl.pathname;
		targetUrl.search = incomingUrl.search; // Preserve query parameters from the original request

		// Create a new request with the updated URL
		const modifiedRequest = new Request(targetUrl.toString(), {
			method: request.method,
			headers: request.headers,
			body: request.body,
		});

		class BodyRewriter {
			element(element: Element) {
				element.append(
					` 
					<style>
					#keyboard-cat-container {
						position: relative;
						width: 100%;
						text-align: center;
					}

					#keyboard-cat {
						width: 100px;
						height: auto;
					}

					</style>
					<script src="https://unpkg.com/freezeframe/dist/freezeframe.min.js"></script>
					<script>
						const newContent = document.createElement('div');
						const container = document.createElement('div');
						container.id = "keyboard-cat-container";

						const img = document.createElement('img');
						img.src = "https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif";
						img.alt = "Keyboard Cat";

						img.id = "keyboard-cat";
						container.appendChild(img);
						newContent.appendChild(container);



						// Function to add the event listener to existing links
						function addEventListeners() {
							document.querySelectorAll('a[href="/us/taylor-woloszynski-and-elijah-bosley-sep-2025/rsvp"]').forEach(link => {
								link.href = 'https://theknot.com/us/taylor-woloszynski-and-elijah-bosley-sep-2025/rsvp';
								link.target = '_blank';
							});

							const div = document.querySelector('footer > div:nth-of-type(2)');

							if (div) {
							    div.style.display = 'none';
								div.insertAdjacentElement('afterend', newContent);
							}
						}


						// MutationObserver to detect changes in the DOM
						const observer = new MutationObserver((mutationsList, observer) => {
							// Temporarily disconnect the observer to prevent the infinite loop
							observer.disconnect();

							try {
								// Your DOM modification code goes here
								addEventListeners(); // For example, calling your addEventListeners function
							} finally {
								// Reconnect the observer after modifications are done
								observer.observe(document.body, { childList: true, subtree: true });
							}
						});



												
						// Observe DOM changes
						observer.observe(document.body, { childList: true, subtree: true });
						addEventListeners();

						</script>
          `,
					{ html: true }
				);
			}
		}

		try {
			// Send the modified request to the target domain
			const response = await fetch(modifiedRequest);

			// Check if the response is HTML
			const contentType = response.headers.get('Content-Type');
			if (contentType && contentType.includes('text/html')) {
				// Use HTMLRewriter to inject the script into the <head>
				return new HTMLRewriter().on('body', new BodyRewriter()).transform(response);
			}

			// Create a new response to return to the original requester
			const proxiedResponse = new Response(response.body, {
				status: response.status,
				statusText: response.statusText,
				headers: response.headers,
			});

			return proxiedResponse;
		} catch (error) {
			// Handle errors gracefully
			return new Response('Error while proxying the request.', { status: 500 });
		}
	},
};
