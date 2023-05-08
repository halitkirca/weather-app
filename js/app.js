const form = document.querySelector(".top-banner form");
const input = document.querySelector("input");
const cityUl = document.querySelector(".cities");
const message = document.querySelector(".msg");

let cityList = [];

let inputText = "";
let appid = "596e03b588840c09a9a7f0ac11cb5c5c"; // first method for apiKey
let lang = "en";

localStorage.setItem(
  //sessionStorage could also be used
  "apiKey",
  EncryptStringAES("596e03b588840c09a9a7f0ac11cb5c5c")
); // Encrypted data (Chipher Text)

const apiKey = DecryptStringAES(localStorage.getItem("apiKey"));

form.onsubmit = (event) => {
  event.preventDefault();
}

document.querySelector(".submit").onclick = async (event) => {
  inputText =
    input.value.trim()[0].toUpperCase() +
    input.value.trim().slice(1).toLowerCase();

  event.preventDefault();
  
  try {
    

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${inputText}&appid=${apiKey}&units=metric&lang=${lang}`
    );

    const datas = await response.json();

    if (!response.ok) {
      wrongInput(inputText);
    } else {
      showCity(datas);
    }
  } catch (error) {
    console.log(error);
  }
  input.value = "";
};

document.querySelector(".localLocation").onclick =  (event) => {

  event.preventDefault();

  navigator.geolocation?.getCurrentPosition(async ({ coords }) => {
    const { latitude, longitude } = coords;
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric&lang=${lang}`
    ).then((x) => x.json());
    showCity(response);
  });
};

const showCity = (data) => {
  const { name, sys, main, weather } = data;

  if (cityList.includes(name)) {
    if (lang == "en") message.textContent = `${name} is already shown below! 😂`;
    if (lang == "de") message.textContent = `${name} ist schon unten angezeigt! 😂`;

    setTimeout(() => {
      message.textContent = "";
    }, 3000);
  } else {
    cityList.push(name);

    console.log(cityList);

    cityUl.innerHTML =
      `
        <li class="city">
            <button class="singleClear">X</button>
            <h2 class="city-name">
            <span>${name}</span>
            <sup>${sys.country}<sup>
            </h2>

            <div class="city-temp">
            ${Math.round(main.temp)}                
            <sup>°C<sup> 
            </div>

            <figure>
                <img class="city-icon" src="http://openweathermap.org/img/wn/${
                  weather[0].icon
                }@2x.png">
                <figcaption>${weather[0].description}</figcaption>
                </figure>
            </li>
            ` + cityUl.innerHTML;

    document.querySelectorAll(".singleClear").forEach((btn) => {
      btn.onclick = () => {
        btn.closest(".city").remove();
        delete cityList[
          cityList.indexOf(
            btn.closest(".city").querySelector("span").textContent
          )
        ];
        console.log(cityList);
      };
    });
  }

  console.log(data);
};

const wrongInput = (value) => {
    if(lang == "en") message.textContent = `${value} is not a city! 😥`;
    if(lang == "de") message.textContent = `${value} ist kein Stadt! 😥`;

  setTimeout(() => {
    message.textContent = "";
  }, 3000);
};

document.querySelector(".clearAll").onclick = () => {
  cityUl.innerHTML = "";
  cityList = [];
};

document.querySelector(".germanBtn").onclick = () => {
    lang = "de";
    document.querySelector(".clearAll").textContent = "Alles Löschen";
    document.querySelector(".submit").textContent = "Suche";
    input.setAttribute("placeholder", "Suche nach einer Stadt");
}

document.querySelector(".englishBtn").onclick = () => {
    lang = "en";
    document.querySelector(".clearAll").textContent = "Clear All";
    document.querySelector(".submit").textContent = "Search";
    input.setAttribute("placeholder", "Search for a city");
}