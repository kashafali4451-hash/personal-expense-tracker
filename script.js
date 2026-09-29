import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc,
    onSnapshot,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";


// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCFRl1oZhN0QPsc-6mtNUbCRGCN5xOdc7c",
    authDomain: "personal-expense-tracker-7a5c5.firebaseapp.com",
    projectId: "personal-expense-tracker-7a5c5",
    storageBucket: "personal-expense-tracker-7a5c5.firebasestorage.app",
    messagingSenderId: "7596929823",
    appId: "1:7596929823:web:9da1c61eb77e160ccf362a",
    measurementId: "G-2Z12BEYFC2"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Firestore
const db = getFirestore(app);


// Get HTML elements
const expenseTitle = document.getElementById("expenseTitle");
const amount = document.getElementById("amount");
const category = document.getElementById("category");
const date = document.getElementById("date");

const addExpenseBtn = document.getElementById("addExpenseBtn");

const expenseTableBody = document.getElementById("expenseTableBody");

const totalExpenses = document.getElementById("totalExpenses");
const totalAmount = document.getElementById("totalAmount");


// Add Expense
addExpenseBtn.addEventListener("click", async () => {

    const titleValue = expenseTitle.value.trim();
    const amountValue = amount.value;
    const categoryValue = category.value;
    const dateValue = date.value;


    // Validation
    if (
        titleValue === "" ||
        amountValue === "" ||
        categoryValue === "" ||
        dateValue === ""
    ) {
        alert("Please fill all fields.");
        return;
    }


    try {

        await addDoc(collection(db, "expenses"), {

            title: titleValue,

            amount: Number(amountValue),

            category: categoryValue,

            date: dateValue,

            createdAt: new Date()

        });


        alert("Expense added successfully!");


        // Clear form
        expenseTitle.value = "";
        amount.value = "";
        category.value = "";
        date.value = "";

    } catch (error) {

        console.error("Error adding expense:", error);

        alert("Error adding expense. Please try again.");

    }

});


// Display Expenses
onSnapshot(collection(db, "expenses"), (snapshot) => {

    expenseTableBody.innerHTML = "";

    let total = 0;
    let count = 0;


    snapshot.forEach((expense) => {

        const data = expense.data();

        count++;

        total += Number(data.amount);


        const row = document.createElement("tr");


        row.innerHTML = `
            <td>${data.title}</td>

            <td>Rs. ${Number(data.amount).toLocaleString()}</td>

            <td>${data.category}</td>

            <td>${data.date}</td>

            <td>
                <button 
                    class="delete-btn"
                    data-id="${expense.id}"
                >
                    Delete
                </button>
            </td>
        `;


        expenseTableBody.appendChild(row);

    });


    // Update summary
    totalExpenses.textContent = count;

    totalAmount.textContent = total.toLocaleString();


    // Delete buttons
    document.querySelectorAll(".delete-btn").forEach((button) => {

        button.addEventListener("click", async () => {

            const expenseId = button.getAttribute("data-id");


            const confirmDelete = confirm(
                "Are you sure you want to delete this expense?"
            );


            if (!confirmDelete) {
                return;
            }


            try {

                await deleteDoc(
                    doc(db, "expenses", expenseId)
                );

                alert("Expense deleted successfully!");

            } catch (error) {

                console.error("Error deleting expense:", error);

                alert("Error deleting expense.");

            }

        });

    });

});