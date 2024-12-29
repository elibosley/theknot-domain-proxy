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
			element(element) {
				element.append(
					` 
					<style>
					#keyboard-cat-container {
						position: relative;
						width: 100%;
						text-align: center;
					}

					#keyboard-cat {
						width: 200px;
						height: auto;
						animation: typing 2s infinite;
					}

					@keyframes typing {
						0% {
						transform: rotate(0deg);
						}
						50% {
						transform: rotate(-5deg);
						}
						100% {
						transform: rotate(0deg);
						}
					}
					</style>
					<script>
						// Trigger animation as you type
						document.addEventListener('keydown', function() {
							const cat = document.getElementById('keyboard-cat');
							if (cat) {
							cat.style.animation = 'typing 2s infinite';
							}
						});

						const newContent = document.createElement('div');
						const container = document.createElement('div');
						container.id = "keyboard-cat-container";

						const img = document.createElement('img');
						img.src = "";
						img.alt = "Keyboard Cat";
						img.id = "keyboard-cat";
						container.appendChild(img);
						newContent.appendChild(container);


						// Function to add the event listener to existing links
						function addEventListeners() {
							document.querySelectorAll('a[href="/us/taylor-woloszynski-and-elijah-bosley-sep-2025/rsvp"]').forEach(link => {
							const newLink = link.cloneNode(true); // Clone the <a> tag with all attributes
							newLink.href = 'https://theknot.com/us/taylor-woloszynski-and-elijah-bosley-sep-2025/rsvp'; // Change the href to the new URL
							newLink.target = '_blank'; // Open the link in a new tab
							// Replace the original link with the new one, preserving the inner content and styles
							link.parentNode.replaceChild(newLink, link);
							});


							// Select all divs inside the second footer
							const divs = document.querySelectorAll('footer > div');
							const secondDiv = divs.length >=2 ? divs[1] : null
							if (secondDiv) {
							// Remove all children from the second div
							while (secondDiv.firstChild) {
								secondDiv.removeChild(secondDiv.firstChild);
							}
							secondDiv.appendChild(newContent);
							}
						}

						

						// Observe DOM changes to catch dynamically added links
						const observer = new MutationObserver(addEventListeners);
						observer.observe(document.body, { childList: true, subtree: true });

						// Run the function once for the existing links on page load
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
