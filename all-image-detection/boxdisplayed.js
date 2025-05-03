import { FilesetResolver, ObjectDetector } from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/vision_bundle.js";

let objectDetector;

async function initializeObjectDetector() {
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
  setupAllProcessing();
}

function setupAllProcessing() {
  const processAllBtn = document.getElementById("process-all-btn");
  processAllBtn.addEventListener("click", () => {
    processAllImages();
  });
}

async function processAllImages() {
  try {
    const response = await fetch("data.json");
    const imageData = await response.json();

    const results = [];

    for (const imgInfo of imageData) {
      const imgPath = imgInfo.thumbnail_link;

      const imgElement = await loadImage(imgPath);
      const detectionResult = await objectDetector.detect(imgElement);

      const detectionSummary = detectionResult.detections.map(det => ({
        label: det.categories[0].categoryName,
        confidence: +(det.categories[0].score * 100).toFixed(2),
        bbox: {
          x: det.boundingBox.originX,
          y: det.boundingBox.originY,
          width: det.boundingBox.width,
          height: det.boundingBox.height
        }
      }));

      results.push({
        image: imgInfo.id,
        title: imgInfo.title,
        detections: detectionSummary
      });

      console.log(`Processed: ${imgInfo.id}`);
    }

    downloadJSON(results, "detection_results.json");

  } catch (err) {
    console.error("Error processing all images:", err);
  }
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function downloadJSON(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();

  URL.revokeObjectURL(url);
}

initializeObjectDetector();
