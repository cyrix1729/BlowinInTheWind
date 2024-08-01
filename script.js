window.onload = function() {
    const numberOfImages = 26; // Set the number of images here
    const gallery = document.querySelector(".gallery");
    const previewImageContainer = document.querySelector(".preview-img");
    const previewImage = previewImageContainer.querySelector("img");
    const expandShrinkButton = document.getElementById("expand-shrink-btn");
    const darkModeButton = document.getElementById("dark-mode-btn");

    let isExpanded = false;
    let originalScale = 1;

    // Use Unicode symbols for expand (⤢) and shrink (⤡)
    expandShrinkButton.innerHTML = "<i class='fas fa-expand'></i>";

    expandShrinkButton.addEventListener("click", function() {
        if (isExpanded) {
            // Shrink the container and image back to the original size
            previewImageContainer.style.transform = `translate(-50%, -50%) scale(${originalScale})`;
            expandShrinkButton.style.transform = `scale(1)`;
            expandShrinkButton.innerHTML = "<i class='fas fa-expand'></i>"; // Expand symbol
        } else {
            // Scale the container and image to 3 times its original size
            originalScale = getComputedStyle(previewImageContainer).transform === 'none' ? 1 : getComputedStyle(previewImageContainer).transform.split('(')[1].split(',')[0];
            previewImageContainer.style.transform = `translate(-50%, -50%) scale(6)`;
            expandShrinkButton.style.transform = `scale(0.33)`; // Scale button down by a factor of 3
            expandShrinkButton.innerHTML = "<i class='fas fa-compress'></i>"; // Shrink symbol
        }
        isExpanded = !isExpanded;
    });

    darkModeButton.addEventListener("click", function() {
        document.body.classList.toggle("dark-mode");
        if (document.body.classList.contains("dark-mode")) {
            darkModeButton.innerHTML = "<i class='fas fa-sun'></i>"; // Sun icon for light mode
        } else {
            darkModeButton.innerHTML = "<i class='fas fa-moon'></i>"; // Moon icon for dark mode
        }
    });

    document.addEventListener("mousemove", function(event) {
        const x = event.clientX;
        const y = event.clientY;

        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        const percentX = (x - centerX) / centerX;
        const percentY = (y - centerY) / centerY;

        const rotateX = 55 + percentY * 2;
        const rotateY = percentX * 2;

        gsap.to(gallery, {
            duration: 1,
            ease: "power2.out",
            rotateX: rotateX,
            rotateY: rotateY,
            overwrite: "auto",
        });
    });

    const totalItems = Math.floor(150 / numberOfImages) * numberOfImages;

    for (let i = 0; i < totalItems; i++) {
        const item = document.createElement("div");
        item.className = "item";
        const img = document.createElement("img");
        img.src = "./assets/img" + ((i % numberOfImages) + 1) + ".jpg";
        item.appendChild(img);
        gallery.appendChild(item);
    }

    const items = document.querySelectorAll(".item");
    const numberOfItems = items.length;
    const angleIncrement = 360 / numberOfItems;

    items.forEach((item, index) => {
        gsap.set(item, {
            rotationY: 90,
            rotationZ: index * angleIncrement - 90,
            transformOrigin: "50% 400px",
        });

        item.addEventListener("mouseover", function() {
            const imgInsideItem = item.querySelector("img");
            previewImage.src = imgInsideItem.src;

            gsap.to(item, {
                x: 10,
                z: 10,
                y: 10,
                ease: "power2.out",
                duration: 0.5,
            });
        });

        item.addEventListener("mouseout", function() {
            gsap.to(item, {
                x: 0,
                y: 0,
                z: 0,
                ease: "power2.out",
                duration: 0.5,
            });
        });
    });

    ScrollTrigger.create({
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 2,
        onRefresh: setupRotation,
        onUpdate: (self) => {
            const rotationProgress = self.progress * 360 * 1;
            items.forEach((item, index) => {
                const currentAngle = index * angleIncrement - 90 + rotationProgress;
                gsap.to(item, {
                    rotationZ: currentAngle,
                    duration: 1,
                    ease: "power3.out",
                    overwrite: "auto",
                });
            });
        },
    });
};

function setupRotation() {}