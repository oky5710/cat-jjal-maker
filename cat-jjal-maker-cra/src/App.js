import React from "react";
import "./App.css";
import Title from "./components/Title";
const jsonLocalStorage = {
  setItem: (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  getItem: (key) => {
    return JSON.parse(localStorage.getItem(key));
  },
};
const fetchCat = async (text) => {
  const OPEN_API_DOMAIN = "https://cataas.com";
  const response = await fetch(`${OPEN_API_DOMAIN}/cat/says/${text}?json=true`);
  const responseJson = await response.json();
  return `${OPEN_API_DOMAIN}/${responseJson.url}`;
};
function CatItem(props) {
  return (
    <li>
      <img src={props.img} style={{ width: "150px" }} />
    </li>
  );
}
function Favorites({ favorites }) {
  if (favorites.length === 0) {
    return <div>사진 위 하트를 눌러 고양이 사진을 저장해봐요!</div>;
  } else {
    return (
      <ul className="favorites">
        {favorites.map((cat) => (
          <CatItem img={cat} key={cat} />
        ))}
      </ul>
    );
  }
}
const MainCard = (props) => {
  const heartIcon = props.alreadyFavorite ? "💖" : "🤍";
  return (
    <div className="main-card">
      <img src={props.img} alt={props.alt} width={props.width} />
      <button onClick={props.onHandleHeartClick}>{heartIcon}</button>
    </div>
  );
};

const Form = (props) => {
  const [value, setValue] = React.useState("");
  const includesHangul = (text) => /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/i.test(text);
  const [errorMessage, setErrorMessage] = React.useState("");
  function handleInputChange(e) {
    const userValue = e.target.value;
    setErrorMessage("");
    if (includesHangul(userValue)) {
      setErrorMessage("한글을 입력할 수 없습니다.");
    }
    setValue(userValue.toUpperCase());
  }
  function handleFormSubmit(e) {
    e.preventDefault();
    setErrorMessage("");
    if (value === "") {
      setErrorMessage("빈 값으로 만들 수 없습니다.");
      return;
    }
    props.updateMainCat(value);
  }
  return (
    <form onSubmit={handleFormSubmit}>
      <input
        type="text"
        name="name"
        placeholder="영어 대사를 입력해주세요"
        onChange={handleInputChange}
        value={value}
      />
      <button type="submit">생성</button>
      <p style={{ color: "red" }}>{errorMessage}</p>
    </form>
  );
};
const App = () => {
  const [counter, setCounter] = React.useState(() => {
    return jsonLocalStorage.getItem("counter");
  });
  const [img, setMainImg] = React.useState("");
  const [favorites, setFavorites] = React.useState(() => {
    return jsonLocalStorage.getItem("favorites") || [];
  });
  const alreadyFavorite = favorites.includes(img);
  async function setInitialCat() {
    const newCat = await fetchCat("First cat");
    setMainImg(newCat);
  }
  React.useEffect(() => {
    setInitialCat();
  }, []);
  async function updateMainCat(value) {
    const newCat = await fetchCat(value);
    setMainImg(newCat);

    setCounter((prev) => {
      const nextCounter = prev + 1;
      jsonLocalStorage.setItem("counter", nextCounter);
      return nextCounter;
    });
  }
  function handleHeartClick() {
    const nextFavorites = [...favorites, img];
    setFavorites(nextFavorites);
    jsonLocalStorage.setItem("favorites", nextFavorites);
  }
  const title = counter === null ? "" : counter + "번째 ";
  return (
    <div>
      <Title>{title}고양이 가라사대</Title>
      <Form updateMainCat={updateMainCat} />
      <MainCard
        img={img}
        alt="고양이"
        width="400"
        onHandleHeartClick={handleHeartClick}
        alreadyFavorite={alreadyFavorite}
      />
      <Favorites favorites={favorites} />
    </div>
  );
};

export default App;
