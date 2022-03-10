fetch(' https://gravel-few-bowler.glitch.me/expenses')
.then(response => response.json())
.then(data=>{
    displayExpensesInTable(data);
    showTotalExpenses (data);
    showDueFees (data);
    showAmountOfExpenesesByType(data);
    filterByIdandDate(data);
});

fetch('https://gravel-few-bowler.glitch.me/notices')
.then(response => response.json())
.then(data=> {
    console.log(data);
    displayNotices(data);
    sumOfNotices(data)
});


function showAmountOfExpenesesByType(data){
    const expensesTypes = ['Miscellaneous','n/a','Finance','PublicUtilities','Technology','Basic Industries','Consumer Services'];
    const financeExpeneses = data.filter(item => {
       return item.type ==='Finance';
    })
};


function displayExpensesInTable(expenses){
    const table = document.querySelector('tbody');
    table.innerHTML = "";
    const items = ["id","type","amount","isPaidStatus","email","date"];
    expenses.forEach(item=>{
        const newTr = table.insertRow();
        items.forEach(element =>{
            if(element==='isPaidStatus'&&item.isPaidStatus === false){
                const newTd = newTr.insertCell();
                const text = document.createElement('p');
                text.classList.add('red');
                text.textContent = item[element];
                newTd.appendChild(text);
            }else if(element==='isPaidStatus'&&item.isPaidStatus === true){
                const newTd = newTr.insertCell();
                const text = document.createElement('p');
                text.classList.add('green');
                text.textContent = item[element];
                newTd.appendChild(text);
            }else{
                const newTd = newTr.insertCell();
                newTd.textContent = item[element]; 
            };
            
        });
    });
};


function filterByIdandDate(data){
    const form = document.forms.search;
    form.addEventListener('submit',(e)=>{
        e.preventDefault();
        const id = Number(e.target.elements.searchById.value);
        const date = e.target.elements.searchByDate.value;
        let filteredData;
        if(date&&id){
            filteredData = data.filter(items => items.date === date && items.id === id);
            return 
        }if(date){
            filteredData = data.filter(items => items.date === date);
            return displayExpensesInTable(filteredData)
        } if(id){
            filteredData = data.filter(items => items.id === id);
            return displayExpensesInTable(filteredData)
        }else{
            return displayExpensesInTable(data)
        }
    });
    
    
    
}



function showTotalExpenses (data){
    const dashboardExpensesBox = document.getElementById("totalExpenses");
    const mappedData = data.map((item) =>{
        return Number(item.amount.split("$").pop());
    });
    const sum = (mappedData.reduce((a,b) => a+b)).toFixed(2);
    dashboardExpensesBox.textContent = `$ ${sum}`;
}




function showDueFees (data){
    const dueFees = document.getElementById('dueFees');
    let filteredData = data.filter(items =>{
        return !items.isPaidStatus;
    });
    filteredData = filteredData.map((item) =>{
        return Number(item.amount.split("$").pop());
    });
    const sum = filteredData.reduce((a,b)=>a+b);
    dueFees.textContent = `$${sum}`
};





function sumOfNotices(data){
    const numberOfNotices = document.getElementById('notices');
    numberOfNotices.textContent = data.length;
}



function displayNotices(notice){
    const reviews = document.querySelector(".reviews");
    reviews.innerHTML = '';
    notice.sort((a,b)=> b.timestamp - a.timestamp).forEach(item =>{
        const colors = ["yellow","red","blue","purple","green","skyblue","gold","crimson"];
        const randomNumber = Math.floor(Math.random()*colors.length);
        const timestampNow = Math.round((new Date()).getTime());
        const difference = timestampNow - item.timestamp;
        const daysAgo = Math.round(difference/1000/60/60/24);
        return reviews.innerHTML +=`
        <div class="review">
                    <p class="date"> ${new Date(item.timestamp*1).toLocaleDateString("en-US")}</p>
                    <span class="user" style ="color:${colors[randomNumber]}" >${item.first_name} ${item.last_name}</span><span class="time">${daysAgo} days ago</span>
                    <p>${item.content}</p>
        </div>
         `
    });
}
