// Import MediaPipe classes
import { FilesetResolver, ObjectDetector } from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/vision_bundle.js";

let objectDetector;
let detectionButtonInitialized = false; // Track if event listener was already added

async function initializeObjectDetector() {
  try {
    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
    );

    objectDetector = await ObjectDetector.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: `https://storage.googleapis.com/mediapipe-tasks/object_detector/efficientdet_lite0_uint8.tflite`
      },
      scoreThreshold: 0.3,
      runningMode: "IMAGE"
    });

    console.log("Model loaded successfully!");

    // Only perform detection setup after model is loaded
    setupDetection();

  } catch (error) {
    console.error("Error initializing object detector:", error);
  }
}

function setupDetection() {
  const btn = document.getElementById("detection-btn");

  if (!detectionButtonInitialized) {
    btn.addEventListener("click", async () => {
      const images = document.querySelectorAll(".detected-image");
      for (const image of images) {
        await displayDetections(image);
      }
    });
    detectionButtonInitialized = true;
  }
}

// Function to display bounding boxes
async function displayDetections(image) {
  const wrapper = image.parentElement;

  // Remove previous boxes for this image
  wrapper.querySelectorAll('.detection-box').forEach(box => box.remove());

  const detectionResult = await objectDetector.detect(image);

  detectionResult.detections.forEach(detection => {
    const boundingBox = detection.boundingBox;

    const box = document.createElement("div");
    box.className = "detection-box";
    box.style.left = `${boundingBox.originX}px`;
    box.style.top = `${boundingBox.originY}px`;
    box.style.width = `${boundingBox.width}px`;
    box.style.height = `${boundingBox.height}px`;

    // Label
    const label = document.createElement("div");
    label.className = "detection-label";
    label.textContent = `${detection.categories[0].categoryName} ${Math.round(detection.categories[0].score * 100)}%`;
    label.style.top = "-20px";
    label.style.left = "0";

    box.appendChild(label);
    wrapper.appendChild(box);
  });
}

// Start everything
initializeObjectDetector();

console.log("App started");
