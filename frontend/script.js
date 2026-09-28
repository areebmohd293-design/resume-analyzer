const form =
    document.getElementById("resumeForm");

const resumeInput =
    document.getElementById("resume");

const dropZone =
    document.getElementById("dropZone");

const uploadText =
    document.getElementById("uploadText");

const jobDescription =
    document.getElementById("jobDescription");

const characterCount =
    document.getElementById("characterCount");

const analyzeButton =
    document.getElementById("analyzeButton");

const sampleJob =
    document.getElementById("sampleJob");

const themeButton =
    document.getElementById("themeButton");

const loading =
    document.getElementById("loading");

const results =
    document.getElementById("results");

const error =
    document.getElementById("error");

const score =
    document.getElementById("score");

const scoreProgress =
    document.getElementById("scoreProgress");

const matchingKeywords =
    document.getElementById("matchingKeywords");

const missingKeywords =
    document.getElementById("missingKeywords");

const aiFeedback =
    document.getElementById("aiFeedback");

const analyzeAnother =
    document.getElementById("analyzeAnother");


/* =========================
   FILE UPLOAD
========================= */


resumeInput.addEventListener(
    "change",
    function () {

        const file =
            resumeInput.files[0];

        if (!file) {
            return;
        }

        handleFile(file);

    }
);


function handleFile(file) {

    if (
        file.type !==
        "application/pdf"
    ) {

        showError(
            "Please upload a PDF file."
        );

        resumeInput.value = "";

        return;
    }


    uploadText.innerText =
        file.name;

    dropZone.classList.add(
        "dragover"
    );

}


/* =========================
   DRAG AND DROP
========================= */


dropZone.addEventListener(
    "dragover",
    function (event) {

        event.preventDefault();

        dropZone.classList.add(
            "dragover"
        );

    }
);


dropZone.addEventListener(
    "dragleave",
    function () {

        dropZone.classList.remove(
            "dragover"
        );

    }
);


dropZone.addEventListener(
    "drop",
    function (event) {

        event.preventDefault();

        dropZone.classList.remove(
            "dragover"
        );


        const file =
            event.dataTransfer.files[0];


        if (!file) {
            return;
        }


        if (
            file.type !==
            "application/pdf"
        ) {

            showError(
                "Please drop a PDF file."
            );

            return;

        }


        resumeInput.files =
            event.dataTransfer.files;

        handleFile(file);

    }
);


/* =========================
   CHARACTER COUNTER
========================= */


jobDescription.addEventListener(
    "input",
    function () {

        const length =
            jobDescription.value.length;

        characterCount.innerText =
            `${length.toLocaleString()} characters`;

    }
);


/* =========================
   SAMPLE JOB
========================= */


sampleJob.addEventListener(
    "click",
    function () {

        jobDescription.value =
`Software Engineer Intern

We are looking for a motivated software engineering intern to join our development team.

Requirements:
- Python programming
- Data Structures and Algorithms
- SQL
- REST APIs
- FastAPI
- Git and GitHub
- Problem solving
- Basic understanding of AI and machine learning

Responsibilities:
- Develop and maintain software applications
- Build REST APIs
- Work with databases
- Write clean and maintainable code
- Collaborate with developers
- Debug and test applications`;

        jobDescription.dispatchEvent(
            new Event("input")
        );

    }
);


/* =========================
   FORM SUBMISSION
========================= */


form.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const resume =
            resumeInput.files[0];

        const job =
            jobDescription.value.trim();


        if (!resume) {

            showError(
                "Please upload your resume PDF."
            );

            return;

        }


        if (!job) {

            showError(
                "Please enter a job description."
            );

            return;

        }


        const formData =
            new FormData();


        formData.append(
            "resume",
            resume
        );


        formData.append(
            "job_description",
            job
        );


        loading.classList.remove(
            "hidden"
        );

        results.classList.add(
            "hidden"
        );

        error.classList.add(
            "hidden"
        );

        analyzeButton.disabled = true;


        try {

            const response =
                await fetch(
                    "/analyze",
                    {
                        method: "POST",
                        body: formData
                    }
                );


            const data =
                await response.json();


            if (!data.success) {

                throw new Error(
                    data.message
                );

            }


            displayResults(data);


        } catch (err) {

            showError(
                err.message ||
                "Something went wrong."
            );

        }


        loading.classList.add(
            "hidden"
        );

        analyzeButton.disabled = false;

    }
);


/* =========================
   DISPLAY RESULTS
========================= */


function displayResults(data) {

    const percentage =
        Number(data.score) || 0;


    score.innerText =
        `${percentage}%`;


    animateScore(
        percentage
    );


    displayKeywords(
        matchingKeywords,
        data.matching_keywords
    );


    displayKeywords(
        missingKeywords,
        data.missing_keywords
    );


    aiFeedback.innerText =
        data.ai_feedback;


    results.classList.remove(
        "hidden"
    );


    results.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}


/* =========================
   SCORE ANIMATION
========================= */


function animateScore(value) {

    const circumference =
        314;


    const offset =
        circumference -
        (value / 100) *
        circumference;


    scoreProgress.style.strokeDashoffset =
        offset;

}


/* =========================
   KEYWORDS
========================= */


function displayKeywords(
    element,
    keywords
) {

    element.innerHTML = "";


    if (
        !keywords ||
        keywords.length === 0
    ) {

        element.innerText =
            "None found.";

        return;

    }


    keywords.forEach(
        function (keyword) {

            const span =
                document.createElement(
                    "span"
                );


            span.className =
                "keyword";


            span.innerText =
                keyword;


            element.appendChild(
                span
            );

        }
    );

}


/* =========================
   ERROR
========================= */


function showError(message) {

    error.innerText =
        message;

    error.classList.remove(
        "hidden"
    );

    error.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

}


/* =========================
   ANALYZE ANOTHER
========================= */


analyzeAnother.addEventListener(
    "click",
    function () {

        results.classList.add(
            "hidden"
        );

        resumeInput.value = "";

        jobDescription.value = "";

        uploadText.innerText =
            "Drop your resume here";

        characterCount.innerText =
            "0 characters";

        scoreProgress.style.strokeDashoffset =
            "314";

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }
);


/* =========================
   THEME TOGGLE
========================= */


themeButton.addEventListener(
    "click",
    function () {

        document.body.classList.toggle(
            "light"
        );


        if (
            document.body.classList.contains(
                "light"
            )
        ) {

            themeButton.innerText =
                "☾";

        } else {

            themeButton.innerText =
                "☀";

        }

    }
);