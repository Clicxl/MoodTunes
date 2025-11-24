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

document.querySelector("#emotion-detection-btn").addEventListener("click", async () => {
const btn = document.querySelector("#emotion-detection-btn");
btn.disabled = true;
btn.textContent = "Detecting emotion... (10s)";

let secondsLeft = 10;
const countdownInterval = setInterval(() => {
  if (secondsLeft > 0) {
    btn.textContent = `Detecting emotion... (${secondsLeft--}s)`;
  } else {
    clearInterval(countdownInterval);
  }
}, 1000);


  try {
      // Start emotion detection for 10 seconds
      const response = await fetch("/start_emotion_detection");
      const data = await response.json();
      
      // Redirect based on the response
      if (data.redirect) {
          window.location.href = data.redirect;
      }
  } catch (error) {
      console.error("Error during emotion detection:", error);
      btn.textContent = "Error - Try again";
  } finally {
      btn.disabled = false;
      btn.textContent = "Home";
  }
});