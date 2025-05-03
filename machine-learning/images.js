// Function to load images based on a specific category
function loadImagesForCategory(category) {
    // Set category name in the span
    const categoryNameSpan = document.getElementById("categoryName");
    categoryNameSpan.textContent = category;
  
    const imagesContainer = document.getElementById("images");
    imagesContainer.innerHTML = "";
  
    const filteredImages = detectionResults.filter(item => {
      return item.detections.some(detection => detection.label === category);
    });
  
    filteredImages.forEach(item => {
      const imageElement = document.createElement("img");
      imageElement.src = `./img/${item.image}.jpg`;
      imageElement.alt = item.title;
      imageElement.title = item.title;
  
      item.detections.forEach(detection => {
        if (detection.label === category) {
          const bbox = detection.bbox;
          const overlay = document.createElement("div");
          overlay.style.position = "absolute";
          overlay.style.left = `${bbox.x}px`;
          overlay.style.top = `${bbox.y}px`;
          overlay.style.width = `${bbox.width}px`;
          overlay.style.height = `${bbox.height}px`;
          overlay.style.border = "2px solid red";
          imageElement.style.position = "relative";
          imageElement.appendChild(overlay);
        }
      });
  
      imagesContainer.appendChild(imageElement);
    });
  
    if (filteredImages.length === 0) {
      imagesContainer.innerHTML = "<p>No images found for this category.</p>";
    }
  }
  
  // Function to handle category navigation (scrolling through images)
  let currentCategoryIndex = 0;
  const categories = ["potted plant", "vase", "kite", "umbrella", "bird", "bed", "teddy bear", "dining table",  "apple", "orange", "airplane", "boat", "scissors", "clock",  "sports ball", "cake", "horse", "tv", ]; // Example categories
  
  function showNextCategory() {
    currentCategoryIndex = (currentCategoryIndex + 1) % categories.length;
    loadImagesForCategory(categories[currentCategoryIndex]);
  }
  
  function showPreviousCategory() {
    currentCategoryIndex = (currentCategoryIndex - 1 + categories.length) % categories.length;
    loadImagesForCategory(categories[currentCategoryIndex]);
  }
  
  // Initialize images and category navigation on page load
  document.addEventListener("DOMContentLoaded", () => {
    // Fetch detection results (if not already fetched in main.js)
    fetch("./detection_results.json")
      .then(res => res.json())
      .then(data => {
        detectionResults = data;
        loadImagesForCategory(categories[currentCategoryIndex]); // Load initial category
      });
  
    // Add event listeners for buttons to navigate through categories
    document.getElementById("prevCategory").addEventListener("click", showPreviousCategory);
    document.getElementById("nextCategory").addEventListener("click", showNextCategory);
  });