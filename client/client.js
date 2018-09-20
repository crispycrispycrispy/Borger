const form = document.querySelector('form');
const loading = document.querySelector('.loading');
const borgiElement = document.querySelector('.borgis')

const API_URL = window.location.hostname === 'localhost' ? "http://localhost:5000/borgi" : "https://borger-api.now.sh/borgi";

loading.style.display="";

listAllBorgis();

form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const name = formData.get("name");
    const content = formData.get("content");
    const borgs = {
        name,content
    };
    form.style.display="none";
    loading.style.display="";
    
    fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(borgs),
        headers: {
            'content-type': 'application/json'
        }
    }).then(response => response.json())
    .then(createdBorg => {
        form.reset();
        setTimeout(() => {
            form.style.display="";
        }, 10000);
        loading.style.display="none";
        listAllBorgis();
    });
})

function listAllBorgis(){
    borgiElement.innerHTML = '';
    fetch(API_URL)
    .then(response => response.json())
    .then(fetchedBorgs => {
        fetchedBorgs.reverse();
        fetchedBorgs.forEach(borgi => {
            const div = document.createElement('div');
            const header = document.createElement('h4');
            header.textContent = borgi.name;
            const content = document.createElement('p');
            content.textContent = borgi.content;
            const date = document.createElement('small');
            date.textContent = borgi.created;

            div.appendChild(header);
            div.appendChild(content);
            div.appendChild(date);

            borgiElement.appendChild(div);
        });
        //console.log(fetchedBorgs)
        loading.style.display="none";
    });
}