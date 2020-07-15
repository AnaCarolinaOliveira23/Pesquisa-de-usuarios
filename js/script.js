let inputSearch = null,
buttonSearch = null,
panelUsers = null,
panelStatistics = null,
users = [];

const formatter = Intl.NumberFormat('pt-BR');

window.addEventListener('load', async () => {
 
  mapElements();
 await fetchUsers();

 addEvents();
});

function mapElements (){
  inputSearch = document.querySelector('#inputSearch')
  buttonSearch = document.querySelector('#buttonSearch')
  panelUsers = document.querySelector('#panelUsers')
  panelStatistics = document.querySelector('#panelStatistics')
}

async function fetchUsers() {
  const res = await fetch(
    'https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo'
  );

  const json = await res.json();
users = json.results.map(({login, name, dob ,gender, picture }) => {
  const fullName =  `${name.first} ${name.last}`;
  return {
    id:login.uuid,
    name:fullName,
    nameLowerCase: fullName.toLowerCase(),
    age:dob.age,
    gender: gender,
    picture: picture.large,
      };
    }).sort((a,b) => {
      return a.name.localeCompare(b.name);
    })
   
  }

  function addEvents() {
    inputSearch.addEventListener('keyup', handleKeyUp);
  }

  function handleKeyUp(event) {
    const currentKey = event.key;

    if (currentKey !== 'Enter') {
      return;
    }
    const filterText = event.target.value;

    if(filterText.trim() !== ''){
      filterUsers(filterText);
    }
  }

    function filterUsers(filterText) {
      const filterTextLowercase = filterText.toLowerCase();
      
       const filterUsers = users.filter((user) => {
     return user.nameLowerCase.includes(filterTextLowercase);
   });

   renderUsers(filterUsers);
   renderStatistics(filterUsers);
    }

    function renderUsers(users) {
      panelUsers.innerHTML = '';

const h2 = document.createElement('h2');  
h2.textContent = `${users.length} usuario(s) encontrados(s)`;

const ul = document.createElement('ul');

users.forEach(user => {
  const li = document.createElement('li');
  li.classList.add('flex-row');
  li.classList.add('space-bottom');
 
  const img = `<img class="avatar" src="${user.picture}" alt="${user.name}" />`;
  const userData = `<span>${user.name}, ${user.age} anos</span>`;

  li.innerHTML = `${img}${userData}`;

  ul.appendChild(li);
})

panelUsers.appendChild(h2);
panelUsers.appendChild(ul);
}

function renderStatistics() {

  const countMale = users.filter(user => user.gender === 'male').length;
  const countFemale = users.filter(user => user.gender === 'female').length;
 
const sumAges = users.reduce((acumulator, current) => {
  return acumulator + current.age;
}, 0);

const averageAges = sumAges / users.length || 0;

  panelStatistics.innerHTML =
  `
  <h2>Estatisticas</h2>

  <ul>
  <li>sexo masculino:<strong> ${countMale}</strong> </li>
  <li>sexo feminino:<strong> ${countFemale}</strong> </li>
  <li>soma das idades:<strong>${formatAverage(sumAges)} </strong> </li>
  <li> média das idades:<strong>${formatAverage(averageAges)} </strong> </li>
  </ul>
  `;
}

function formatNumer(number){
  return formatter.format(number);
}

function formatAverage(number) {
  return number.toFixed(2).replace('.', ',');
}