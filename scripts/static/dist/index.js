
// Helper to convert YouTube URL to embed
function getEmbedUrl(url) {
  if (!url) return '';
  // Handles both youtu.be and youtube.com/watch?v= formats
  let videoIdMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([\w-]{11})/);
  if (!videoIdMatch) return '';
  return `https://www.youtube.com/embed/${videoIdMatch[1]}`;
}

let previousSongs = null;


async function updateSong() {
  try {
    const response = await fetch("/all_songs");
    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.json();
    console.log(data);
    
    // Check if the songs data has changed
    if (previousSongs && JSON.stringify(data) === JSON.stringify(previousSongs)) {
      return; // Skip update if data hasn't changed
    }

    const songContainer = document.querySelector("#song-container");
    songContainer.innerHTML = ""; // Clear only if we're actually updating

    for (let i = 0; i < 12; i++) {
      const songCard = document.createElement('div');
      songCard.className = 'bg-rose-700 rounded-xl shadow-lg overflow-hidden flex flex-col';
      songCard.innerHTML = `
        <div class="aspect-video relative">
          <iframe
            class="w-full h-full absolute inset-0"
            src="${getEmbedUrl(data[i].url)}"
            title="${data[i].title || 'YouTube video player'}"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
        <div class="p-6">
          <h3 class="text-xl font-bold text-pink-300">${data[i].title || 'YouTube video player'}</h3>
          <p class="text-white/80 mt-2">${data[i].desc || ''}</p>
        </div>
      `;
      songContainer.appendChild(songCard);
    };

    // Update previous songs after successful render
    previousSongs = data;
  } catch (error) {
    console.error("Failed to update songs:", error);
  }
}


// Initial load
updateSong();

// Update less frequently to prevent iframe flicker
setInterval(updateSong, 5000); // Check every 5 seconds

    document.querySelector("#chat-form").onsubmit = async function (e) {
      e.preventDefault();
      const input = document.getElementById("chat-input");
      const userMsg = input.value.trim();
      if (!userMsg) return;

      const messagesDiv = document.getElementById("chat-messages");
      messagesDiv.innerHTML += `<div><b>You:</b> ${userMsg}</div>`;
      input.value = "";

      try {
        const response = await fetch("/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: userMsg }),
        });
        const data = await response.json();
        if (data.response) {
          // Function to format YouTube links
        const formatYouTubeLinks = (text) => {
            const youtubePattern = /(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+/g;
            return text.replace(youtubePattern, (url) => {
                const fullUrl = url.startsWith('http') ? url : `https://${url.replace('www.', '')}`;
                return `<a href="${fullUrl}" class="text-pink-300 hover:underline" target="_blank">${url}</a>`;
            });
        };

        // Add the message with formatted links
        const formattedResponse = formatYouTubeLinks(data.response);
        messagesDiv.innerHTML += `<div class="bg-rose-700/50 rounded-lg p-3 mb-2"><b>Bot:</b> ${formattedResponse}</div>`;
        } else if (data.reply) {
          messagesDiv.innerHTML += `<div><b>Bot:</b> ${data.reply}</div>`;
        } else if (data.error) {
          messagesDiv.innerHTML += `<div style="color:red;"><b>Error:</b> ${data.error}</div>`;
        }
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
      } catch (err) {
        messagesDiv.innerHTML += `<div style="color:red;"><b>Error communicating with chatbot.</b></div>`;
      }
    };

      document.querySelector("#chat-toggle").addEventListener("click", () => {
      const chatBox = document.getElementById("chatbox");
      chatBox.style.display = chatBox.style.display === "none" ? "block" : "none";
    });

    document.querySelector("#chat-close").addEventListener("click", () => {
      const chatBox = document.getElementById("chatbox");
      chatBox.style.display = "none";
    });