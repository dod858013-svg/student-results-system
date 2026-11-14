
class Student {
    /** @type {number} */
    #grade1;

    /** @type {number} */
    #grade2;

    /** @type {number} */
    #grade3;

    /** @type {number} */
    #attendance;

    /**
     * @param {string} name
     * @param {number|string} grade1
     * @param {number|string} grade2
     * @param {number|string} grade3
     * @param {number|string} attendance
     */
    constructor(name, grade1, grade2, grade3, attendance) {
        this.name = name;
        this.grade1 = grade1;
        this.grade2 = grade2;
        this.grade3 = grade3;
        this.attendance = attendance;
    }

    /** @param {number|string} value */
    set grade1(value) {
        if (value === "" || value === null || value === undefined)
            throw new Error("من فضلك أدخل الدرجة الأولى");

        value = Number(value);

        if (!Number.isFinite(value) || value < 0 || value > 100)
            throw new Error("الدرجة الأولى يجب أن تكون من 0 إلى 100");

        this.#grade1 = value;
    }

    get grade1() {
        return this.#grade1;
    }

    /** @param {number|string} value */
    set grade2(value) {
        if (value === "" || value === null || value === undefined)
            throw new Error("من فضلك أدخل الدرجة الثانية");

        value = Number(value);

        if (!Number.isFinite(value) || value < 0 || value > 100)
            throw new Error("الدرجة الثانية يجب أن تكون من 0 إلى 100");

        this.#grade2 = value;
    }

    get grade2() {
        return this.#grade2;
    }

    /** @param {number|string} value */
    set grade3(value) {
        if (value === "" || value === null || value === undefined)
            throw new Error("من فضلك أدخل الدرجة الثالثة");

        value = Number(value);

        if (!Number.isFinite(value) || value < 0 || value > 100)
            throw new Error("الدرجة الثالثة يجب أن تكون من 0 إلى 100");

        this.#grade3 = value;
    }

    get grade3() {
        return this.#grade3;
    }

    /** @param {number|string} value */
    set attendance(value) {
        if (value === "" || value === null || value === undefined)
            throw new Error("من فضلك أدخل نسبة الحضور");

        value = Number(value);

        if (!Number.isFinite(value) || value < 0 || value > 100)
            throw new Error("نسبة الحضور يجب أن تكون من 0 إلى 100");

        this.#attendance = value;
    }

    get attendance() {
        return this.#attendance;
    }

    get average() {
        return (this.#grade1 + this.#grade2 + this.#grade3) / 3;
    }

    get result() {
        if (this.average >= 85) return "ممتاز";
        if (this.average >= 75) return "جيد جداً";
        if (this.average >= 65) return "جيد";
        if (this.average >= 60) return "مقبول";
        return "راسب";
    }
}

/** @type {Student[]} */
const studentsList = [];

const STORAGE_KEY = "studentsData";

const studentNameInput = document.getElementById("studentName");
const grade1Input = document.getElementById("grade1");
const grade2Input = document.getElementById("grade2");
const grade3Input = document.getElementById("grade3");
const attendanceInput = document.getElementById("attendance");

const addStudentBtn = document.getElementById("addStudentBtn");
const mercyBtn = document.getElementById("mercyBtn");
const errorBox = document.getElementById("errorBox");
const studentsDisplay = document.getElementById("studentsList");
const reportBox = document.getElementById("reportBox");

/** @param {Student} student */
function displayStudent(student) {
    const studentRow = document.createElement("p");

    studentRow.textContent =
        `اسم الطالب: ${student.name} - المتوسط: ${student.average.toFixed(2)} - الحضور: ${student.attendance}%`;

    studentsDisplay.appendChild(studentRow);
}

/** @returns {void} */
function saveStudents() {
    const data = studentsList.map(student => ({
        name: student.name,
        grade1: student.grade1,
        grade2: student.grade2,
        grade3: student.grade3,
        attendance: student.attendance
    }));

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

/** @returns {void} */
function loadStudents() {
    try {
        const savedData = JSON.parse(
            localStorage.getItem(STORAGE_KEY) || "[]"
        );

        if (!Array.isArray(savedData)) {
            throw new Error("بيانات التخزين غير صحيحة");
        }

        savedData.forEach(data => {
            const student = new Student(
                data.name,
                data.grade1,
                data.grade2,
                data.grade3,
                data.attendance
            );

            studentsList.push(student);
            displayStudent(student);
        });

    } catch (error) {
        studentsList.length = 0;
        studentsDisplay.textContent = "";
        errorBox.textContent = "تعذر استرجاع بيانات الطلاب";
        console.error(error);
    }
}

// استرجاع الطلاب عند فتح الصفحة
loadStudents();

// إضافة طالب
addStudentBtn.addEventListener("click", function () {
    try {
        errorBox.textContent = "";

        const name = studentNameInput.value.trim();

        if (name === "") {
            throw new Error("من فضلك أدخل اسم الطالب");
        }

        const student = new Student(
            name,
            grade1Input.value,
            grade2Input.value,
            grade3Input.value,
            attendanceInput.value
        );

        studentsList.push(student);

        displayStudent(student);
        saveStudents();

        studentNameInput.value = "";
        grade1Input.value = "";
        grade2Input.value = "";
        grade3Input.value = "";
        attendanceInput.value = "";

    } catch (error) {
        errorBox.textContent =
            error instanceof Error ? error.message : "حدث خطأ";
    }
});

// لجنة الرأفة
mercyBtn.addEventListener("click", function () {
    reportBox.innerHTML = "";

    if (studentsList.length === 0) {
        reportBox.textContent = "لا يوجد طلاب مسجلون";
        return;
    }

    // 1- Filter: استخراج الطلاب من 40 إلى 49
    const mercyStudents = studentsList.filter(student =>
        student.average >= 40 && student.average <= 49
    );

    // التأكد من وجود طلاب متعثرين
    if (mercyStudents.length === 0) {
        reportBox.innerHTML = `
            <h4>التقرير النهائي للجنة الرأفة</h4>
            <p>عدد الطلاب المتعثرين: 0</p>
            <p>لا يوجد طلاب مستحقون لدرجات الرأفة</p>
            <p>المتوسط العام بعد الرأفة: 0</p>
        `;
        return;
    }

    // 2- Map: إضافة 5 درجات رأفة لكل طالب
    const updatedStudents = mercyStudents.map(student => ({
        name: student.name,
        newAverage: student.average + 5
    }));

    // 3- Reduce: جمع المتوسطات الجديدة
    const totalAfterMercy = updatedStudents.reduce(
        (sum, student) => sum + student.newAverage,
        0
    );

    // حساب المتوسط العام بعد الرأفة
    const generalAverageAfterMercy =
        totalAfterMercy / updatedStudents.length;

    // 4- عرض التقرير النهائي
    reportBox.innerHTML = `
        <h4>التقرير النهائي للجنة الرأفة</h4>

        <p>عدد الطلاب المتعثرين:
        ${mercyStudents.length}</p>

        <p>أسماء الطلاب ومتوسطاتهم بعد الرأفة:</p>

        ${updatedStudents.map(student => `
            <p>
                ${student.name} -
                المتوسط بعد الرأفة:
                ${student.newAverage.toFixed(2)}
            </p>
        `).join("")}

        <h5>
            المتوسط العام بعد الرأفة:
            ${generalAverageAfterMercy.toFixed(2)}
        </h5>
    `;
});
