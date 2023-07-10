console.log("hey");

let val = document.getElementById("val");
let input = document.querySelector("#points");

val.innerHTML = input.value;

input.addEventListener("input", function () {
	val.innerHTML = input.value;
});

const oseftag = document.querySelector("#tag_osef");
const othertags = document.querySelectorAll("#tag");

oseftag.addEventListener('change', (e) => {
    if (e.currentTarget.checked) {
        for(var i = 0; i < othertags.length; i++){
            othertags[i].checked = false;
        }
    }
});

othertags.every.addEventListener('change', (e) => {
    if (e.currentTarget.checked) {
        oseftag.checked = false;
    }
});