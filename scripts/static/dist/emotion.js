async function updateEmotionAndSong() {
        try {
          const response = await fetch("/current_emotion");
          if (!response.ok) throw new Error("Network response was not ok");
          const data = await response.json();
          
          for (let i = 1; i < 4; i++) {
            document.getElementById("emotion-label").textContent = "Emotion: " + data[0];
            
  
            const videoFrame = document.querySelectorAll(".song-video")[i-1];
  
            const newSrc = data[1][i].url
              ? data[1][i].url.replace("watch?v=", "embed/")
              : "";
              if (videoFrame.src !== newSrc) {
                videoFrame.src = newSrc;
              }
          }

        } catch (error) {
          console.error("Failed to update emotion and song:", error);
        }
}

// Initial load
updateEmotionAndSong();

// Update every 1 seconds
setInterval(updateEmotionAndSong, 1000);