import { FilesetResolver, ObjectDetector } from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/vision_bundle.js";

let objectDetector;

async function initializeObjectDetector() {
    try {
      // Load necessary files for vision tasks
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );
  
      // Create an instance of ObjectDetector with specified options
      objectDetector = await ObjectDetector.createFromOptions(
        vision, {
          baseOptions: {
            // Specify the path to the object detection model
            modelAssetPath: `https://storage.googleapis.com/mediapipe-tasks/object_detector/efficientdet_lite0_uint8.tflite`
          },
          scoreThreshold: 0.1, // Set the threshold for detection accuracy
          runningMode: "IMAGE" // Set the detection mode to IMAGE
        }
      );
  
      console.log("Model Loaded Successfully");
  
      // Execute detection after the model is loaded. Explaind in the next step
      performDetection();
  
    } catch (error) {
      console.error("Error initializing object detector:", error);
    }
  }

  function performDetection(){
    const imageContainer = document.getElementById("image");
    const imageElement = imageContainer.querySelector("img");
    const detections = objectDetector.detect(imageElement);
  
    console.log("Detections:", detections);
  }

  initializeObjectDetector();