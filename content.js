// Wait for the player to load
function waitForPlayer() {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        const videoElement = document.querySelector("video");
        if (videoElement) {
          clearInterval(interval);
          resolve(videoElement);
        }
      }, 500);
    });
  }
  
  // Attach event listener for key presses
  async function setupKeyControls() {
    const videoElement = await waitForPlayer();
  
    // Ensure the duration is always correct
    const ensureValidDuration = () => {
      return new Promise((resolve) => {
        if (videoElement.duration > 0) {
          resolve(videoElement.duration);
        } else {
          videoElement.addEventListener(
            "loadedmetadata",
            () => resolve(videoElement.duration),
            { once: true }
          );
        }
      });
    };
  
    document.addEventListener("keydown", async (event) => {
      // Only respond to number keys 0–9 when no modifier keys are pressed
      if (
        event.key >= "0" &&
        event.key <= "9" &&
        !event.ctrlKey &&
        !event.altKey &&
        !event.metaKey
      ) {
        const duration = await ensureValidDuration(); // Wait for the correct duration
        const fraction = parseInt(event.key) / 10; // Convert key to fraction of duration
        const newTime = duration * fraction; // Calculate new time
        videoElement.currentTime = newTime; // Set new playback time
        console.log(
          `Skipped to ${Math.round(newTime)} seconds (${fraction * 100}% of the song)`
        );
      }
    });
  }
  
  // Initialize when the content script loads
  setupKeyControls();
  