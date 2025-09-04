async function updateEmotionAndSong() {
        try {
          const response = await fetch("/current_emotion");
          if (!response.ok) throw new Error("Network response was not ok");
          const data = await response.json();
          
          for (let i = 1; i < 4; i++) {
            document.getElementById("emotion-label").textContent =
              "Emotion: " + data[0];
  
            const videoFrame = document.querySelectorAll(".song-video")[i-1];
  
            const newSrc = data[i].url
              ? data[i].url.replace("watch?v=", "embed/")
              : "";
              if (videoFrame.src !== newSrc) {
                videoFrame.src = newSrc;
              }
          }

        } catch (error) {
          console.error("Failed to update emotion and song:", error);
        }
      }

setInterval(updateEmotionAndSong, 1000); // update every 1 second
window.onload = updateEmotionAndSong;


document.querySelector("#chat-form").onsubmit = async function (e) {
  e.preventDefault();
  const input = document.getElementById("chat-input");
  const userMsg = input.value.trim();
  if (!userMsg) return;

  // Append user message
  const messagesDiv = document.getElementById("chat-messages");
  messagesDiv.innerHTML += `<div><b>You:</b> ${userMsg}</div>`;
  input.value = "";

  // Call the backend
  try {
    const response = await fetch("/chat", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({message: userMsg})
    });

    const data = await response.json();
    if (data.reply) {
      messagesDiv.innerHTML += `<div><b>Bot:</b> ${data.reply}</div>`;
      messagesDiv.scrollTop = messagesDiv.scrollHeight;
    } else if (data.error) {
      messagesDiv.innerHTML += `<div style="color:red;"><b>Error:</b> ${data.error}</div>`;
    }
  } catch (err) {
    messagesDiv.innerHTML += `<div style="color:red;"><b>Error communicating with chatbot.</b></div>`;
  }
};

document.querySelector(".chat-toggle").addEventListener("click", (e) => {
  chatbox = document.querySelector(".chatbox")  
  chatbox.style.display = chatbox.style.display === "none" ? "block" : "none";
})
