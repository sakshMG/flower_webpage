const correctPassword = "secretflower";
const questions = [
    "What's your favorite color?",
    "What's your favorite animal?",
    "What's your favorite season?"
];

let currentQuestionIndex = 0;

const passwordSectionElement = document.getElementById("passwordSection");
const questionSectionElement = document.getElementById("questionSection");
const flowerSectionElement = document.getElementById("flowerSection");
const passwordInputElement = document.getElementById("passwordInput");
const submitPasswordButton = document.getElementById("submitPassword");
const questionTextElement = document.getElementById("questionText");
const answerInputElement = document.getElementById("answerInput");
const submitAnswerButton = document.getElementById("submitAnswer");
const flowerCanvasElement = document.getElementById("flowerCanvas");

submitPasswordButton.addEventListener("click", checkPassword);
submitAnswerButton.addEventListener("click", handleAnswer);

function checkPassword() {
    const enteredPassword = passwordInputElement.value;
    if (enteredPassword === correctPassword) {
        passwordSectionElement.style.display = "none";
        questionSectionElement.style.display = "block";
        showNextQuestion();
    } else {
        alert("Incorrect password. Please try again.");
    }
}

function showNextQuestion() {
    if (currentQuestionIndex < questions.length) {
        questionTextElement.textContent = questions[currentQuestionIndex];
        answerInputElement.value = "";
    } else {
        questionSectionElement.style.display = "none";
        flowerSectionElement.style.display = "block";
        drawFlowerAnimation();
    }
}

function handleAnswer() {
    currentQuestionIndex++;
    showNextQuestion();
}

function drawFlowerAnimation() {
    const ctx = flowerCanvasElement.getContext("2d");
    flowerCanvasElement.width = window.innerWidth;
    flowerCanvasElement.height = window.innerHeight;

    function drawPetal(x, y, radius, angle, color) {
        ctx.beginPath();
        ctx.ellipse(
            x + Math.cos(angle) * radius * 0.7,
            y + Math.sin(angle) * radius * 0.7,
            radius,
            radius * 0.6,
            angle,
            0,
            Math.PI * 2
        );
        ctx.fillStyle = color;
        ctx.fill();
    }

    function drawCamellia(x, y, petalRadius, rotation) {
        const numPetals = 15 + Math.floor(Math.random() * 5);
        const baseColor = Math.random() * 60 + 300; // Shades of pink to red
        
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        
        // Draw outer petals
        for (let i = 0; i < numPetals; i++) {
            const angle = (i / numPetals) * Math.PI * 2;
            const color = `hsl(${baseColor}, 80%, ${70 + Math.random() * 10}%)`;
            drawPetal(0, 0, petalRadius, angle, color);
        }
        
        // Draw inner petals
        for (let i = 0; i < numPetals / 2; i++) {
            const angle = (i / (numPetals / 2)) * Math.PI * 2;
            const color = `hsl(${baseColor}, 90%, ${80 + Math.random() * 10}%)`;
            drawPetal(0, 0, petalRadius * 0.7, angle, color);
        }
        
        // Draw center
        ctx.beginPath();
        ctx.arc(0, 0, petalRadius * 0.2, 0, Math.PI * 2);
        ctx.fillStyle = "yellow";
        ctx.fill();
        
        ctx.restore();
    }

    const numFlowers = 5;
    const flowers = [];
    const targetY = flowerCanvasElement.height * 0.6;

    for (let i = 0; i < numFlowers; i++) {
        const x = flowerCanvasElement.width * (0.3 + Math.random() * 0.4);
        const y = flowerCanvasElement.height + Math.random() * 100;
        const petalRadius = 30 + Math.random() * 20;
        const rotationSpeed = (Math.random() * 0.02 + 0.01) * (Math.random() < 0.5 ? 1 : -1);
        flowers.push({ x, y, petalRadius, targetY: targetY + Math.random() * 100 - 50, rotation: 0, rotationSpeed });
    }

    function animate() {
        ctx.clearRect(0, 0, flowerCanvasElement.width, flowerCanvasElement.height);
        
        let allFlowersInPlace = true;
        
        for (const flower of flowers) {
            if (flower.y > flower.targetY) {
                flower.y -= 2;
                allFlowersInPlace = false;
                
                // Reduce rotation speed as the flower rises
                flower.rotationSpeed *= 0.99;
            } else {
                flower.rotationSpeed *= 0.95; // Further reduce rotation speed when in place
            }
            
            flower.rotation += flower.rotationSpeed;
            drawCamellia(flower.x, flower.y, flower.petalRadius, flower.rotation);
        }
        
        if (allFlowersInPlace) {
            showLoveMessage();
        } else {
            requestAnimationFrame(animate);
        }
    }

    function showLoveMessage() {
        ctx.font = "bold 48px 'Brush Script MT', cursive";
        ctx.fillStyle = "#FF1493"; // Deep pink color
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("I love you", flowerCanvasElement.width / 2, flowerCanvasElement.height * 0.3);
    }

    animate();
}