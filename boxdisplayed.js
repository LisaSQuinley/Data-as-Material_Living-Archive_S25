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
  const imageContainer = document.getElementById("image");
  const imageElement = imageContainer.querySelector("img");
  const btn = document.getElementById("detection-btn");

  if (!imageElement) {
    console.error("No image element found!");
    return;
  }

  // Add the click listener only once
  if (!detectionButtonInitialized) {
    btn.addEventListener('click', async () => {
      await displayDetections(imageElement);
    });
    detectionButtonInitialized = true;
  }
}

// Function to display bounding boxes
async function displayDetections(image) {
  const imageContainer = document.getElementById("image");

  // Clear any previous bounding boxes
  const existingBoxes = imageContainer.querySelectorAll(".detection-box");
  existingBoxes.forEach(box => box.remove());

  // Run detection
  const detectionResult = await objectDetector.detect(image);

  detectionResult.detections.forEach(detection => {
    const box = document.createElement("div");
    box.className = "detection-box";

    // Get coordinates relative to the image
    const boundingBox = detection.boundingBox;
    const imageRect = image.getBoundingClientRect();
    const containerRect = imageContainer.getBoundingClientRect();
    const offsetX = imageRect.left - containerRect.left;
    const offsetY = imageRect.top - containerRect.top;

    // Position the box relative to the image
    box.style.position = "absolute";
    box.style.left = (offsetX + boundingBox.originX) + "px";
    box.style.top = (offsetY + boundingBox.originY) + "px";
    box.style.width = boundingBox.width + "px";
    box.style.height = boundingBox.height + "px";
    box.style.border = "2px solid blue";

    // Add label
    const label = document.createElement("div");
    label.className = "detection-label";
    label.textContent = `${detection.categories[0].categoryName} ${Math.round(detection.categories[0].score * 100)}%`;
    label.style.position = "absolute";
    label.style.top = "-25px";
    label.style.left = "0px";
    label.style.color = "blue";
    label.style.fontWeight = "bold";

    box.appendChild(label);
    imageContainer.appendChild(box);
  });
}

// Start everything
initializeObjectDetector();

console.log("App started");
