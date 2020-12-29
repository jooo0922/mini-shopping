'use strict';
/**
 * 지금 현재 상태에서 개발자도구에서 network 탭을 누르고, reload(ctrl+r) 해봐라
 * 우리가 만든 data.json 파일은 로드가 안되어있는 것을 볼 수 있다.
 * 따라서 js파일에서 json의 데이터를 불러온 뒤, 
 * 동적으로 html 문서에 데이터를 뿌려주는 것을 해볼 것입니다.
 * 
 * 그럼 일단 큰그림을 그려보자
 * 우선 우리의 main.js 파일이 실행되자마자 loadItems() 라는 함수가 실행되게 해야 한다.
 * 그리고 이 함수는 data.json에 있는 데이터를 읽어와서 item을 전달해줄거에요.
 * data.json을 동적으로 읽어와야 되니까 시간이 걸리는 작업이기 때문에
 * 그냥 return하는 것이 아니라 promise를 이용해서 return할 것!
 * 비동기로 data.json을 받아옴과 동시에 js파일도 읽을 수 있게 하려고 처리하는 거지요.
 * 
 * 그래서 promise가 성공적으로 되면(resolve) then()으로 아이템들(items)를 받아오고 
 * 받아오는 데 실패하면(reject) catch()로 에러메시지를 보여준다던가, items list대신 경고문구나 메시지를 사용자에게 보여줄 것
 * 
 * 또 받아오는 데 성공하면 items를 displayItems(items) 즉, 아이템을 화면에 보여주는 콜백함수에 받아온 
 * item 데이터들을 인자로 전달해서 호출할 것입니다.
 * 
 * 또 button을 누를때마다 list를 필터링해서 보여줄 수 있는 함수에도 값들을 전달해줘서 처리해야 하니까
 * addEventListener()를 등록할 수 있도록 setEventListeners(items)라는 콜백함수도 호출해줄 겁니다.
 * 
 * 이렇게 아직 정의되지 않았지만, 받아온 data.json을 처리하는 3개의 함수를 호출해놓고
 * 조금씩조금씩 메꿔가면서 완성을 할 겁니다.
 */

// Fetch the items from the JSON file 
// json파일로부터 아이템을 동적으로 받아올 함수입니다.
// 쉽게 할 수 있는 방법은 브라우저 API중 하나인 fetch()를 쓰는 것입니다. 아주 간단하게 사용 가능.
function loadItems(){
  return fetch('data/data.json') // ()에 해당하는 파일의 경로나 url을 작성하면 간단하게 데이터를 네트워크를 통해서 받아올 수 있습니다.
  .then(response => response.json())
  // fetch()는 데이터를 성공적으로 받아오면 response라는 object를 포함한 promise를 return하는 것입니다.
  // 그니까 fetch()를 사용한 것 자체가 promise를 사용했다고 봐야하는 것이죠. 
  // 이거는 어디서 볼 수 있냐면, data.json클릭해보면, response탭 눌러보면 우리가 data.json에서 만든 object가 보임.
  // 근데 여기서 받은 promise는 실제 JSON이 아니라, HTTP response라고 함.
  // 그래서 이 HTTP response를 인자로 받아와서, json()이라는 API를 이용해서 실제 JSON으로 변환한 겁니다.
  .then(json => json.items);
  // response.json()로 변환된 JSON을 console.log(json)로 출력해서 확인해보면 json으로 변환했기 때문에 우리가 data.json에서 정의한 item들이 출력됩니다.
  // 우리에게 필요한 것은 이 JSOB중에서도 items라는 array만 return하면 되겠지요? '__proto__' 얘는 필요없으니까
}

// Update the list with given items
function displayItems(items){
  const container = document.querySelector('.items');

  // innerHTML을 이용해서 우리가 받아온 items를 <li>그룹으로 만들어서 container에 추가해줄 거에요.
  // 참고로 innerHTML은 요소(element) 내에 포함 된 HTML 또는 XML 마크업을 가져오거나 설정합니다.
  container.innerHTML = items.map(item => createHTMLString(item)).join('');
  // 이제 items라는 array를 html의 <li> 라는 요소로 된 array로 변환하고 싶음.
  // 한 가지의 array 형태를 다른 형태의 array로 변환해주는 배열 api? array.map()를 이용하면 됨.
  // createHTMLString(item)는 items배열 내의 각각의 item을 인자로 받아 <li>요소로, html 문자열로 변환하는 함수를 만들어 호출합니다.
  // join('') 은 새롭게 변환된 array에 있는 각각의 string들을 `하나의 string`으로 병합해주는 함수입니다.
  /* 
  왜 join()을 써야하나? 
  array가 분명 items = ["<li class="item"></li>", "<li class="item"></li>"] 이렇게 변환되서 return될텐데
  이걸 그대로 innerHTML로 변환해서 container 즉, ul태그에다가 넣어버리면 html문서에 ", " 이것도 같이 들어가버림
  그래서 이걸 지워주려면 items = ["<li class="item"></li> <li class="item"></li>"] 요렇게 묶어줘야겠지?
  
  console.log(items.map(item => createHTMLString(item)).join('')); 
  요걸로 확인해볼것.
  */
}

// Create HTML list item from the given date item
function createHTMLString(item){
  return `
  <li class="item">
    <img src="${item.image}" alt="${item.type}" class="item__thumbnail">
    <span class="item__description">${item.gender}, ${item.size}</span>
  </li>
  `;
  /**
   * 결국 이 함수는 items라는 array의 각각의 item을 인자로 받아서
   * ``string으로 만들어서 return해주고,
   * 위에 있는 items.map()이 return받은 string들로 새로운 형태의 array로 반환해주겠지요.
   * 그리고 이 각각의 string들을 하나의 string으로 묶어서 html문서안에 업데이트 하겠지요.
   * 그래서 그 array안에 string들을 container안에 업데이트된 html요소로 할당해주겠지요.
   * 그렇게 하면 array안에 모든 string들이 html <li>요소로 변환되서 화면에 나타날겁니다. 
   */
}

// 이렇게 이벤트를 처리하는 함수를 만들때는 on + '발생한 이벤트' 로 함수명을 지으면 어떤 이벤트를 처리하는 함수인지 한눈에 알기 쉬움.
function onButtonClick(event, items){
  /**
   * 일단 어떤 아이디어로 할거냐면
   * 버튼이 클릭되면, 티셔츠인지 팬츠인지 스커트인지 또는 색상코드를 알 수 있기 때문에
   * 클릭이 될 때 그 정보들을 이용해서 items를 filtering해서 새로운 배열을 return받고
   * 그래서 최종적으로 filter받은 배열들을
   * displayItems()에 전달 및 호출해서 최종적으로 filter된 아이들이 화면에 보여질 수 있도록 할 예정
   * 
   * 먼저, 그렇게 효율적으로 하려면 특정 버튼이 클릭됬을때 발생된 event의 오브젝트 안에 
   * 우리가 원하는 정보들이 들어있으면 유용하겠지?
   * 
   * 이걸 하려면 html에서 <button>이나 <img>에다가
   * custom property를 이용하면 좋다. 이게 뭔소리냐면
   * 해당 태그 오브젝트에 사용하고 싶은 이름을 붙여서 원하는대로 데이터를 정의할 수 있음.
   */
  console.log(event.target.dataset.key); // target은 이벤트가 발생한 대상, dataset은 우리가 html에서 button, img에 설정한 custom property들...
  console.log(event.target.dataset.value);
  const dataset = event.target.dataset; //요거는 밑에 const key, value에 값을 넣을때 저걸 다쓰기 귀찮으니까 반복해서 쓰라고 할당해준거임.
  const key = dataset.key;
  const value = dataset.value;

  if(key == null || value == null){
    return;
    /*
    즉, key와 value가 없는 event(예를 들어, 버튼이 아닌, 버튼을 감싼 section 부분을 클릭하면) 
    이것에 대한 event.target.dataset을 콘솔창에 찍어보면 undefined라고 나옴. 
    이런 경우에 if문에서 아무것도 하지않고, 아무 값도 리턴하지 않고 빨리 함수를 끝내겠다는 뜻.
    */ 
  } else {
    /*
    if에 해당하지 않는 경우, 즉 key, value가 들어있을 때에만 실행함
    우리가 배열에서 특정한 데이터들만 따로 추출해서 새로운 더 작은 배열로 만드는 api인 array.filter()를 사용함

    오브젝트도 배열에서 특정 index로 데이터에 접근하듯이, 
    array[index] 하듯이 object[key] 해서 특정 key의 value에 접근 가능했지?

    items array에 있는 모든 item들에 대해서 item[key] === value 
    즉, 각각의 item 오브젝트에 있는 어떤 key가 됬든 그 key에 해당하는 value가 있는 item들만 모아서 새로운 array를 만듦.

    왜 item['type'] === value로 안했을까?
    그건 당연하지. blue, yellow, red 이런 버튼을 누르면, value에는 색상에 대한 데이터가 들어갈텐데
    items array에 있는 각각의 오브젝트들 중에 type: "blue" 이런 애들이 없잖아. 
    color: "blue" 이런 애들은 있을지 몰라도.
    그니까 저 색상으로 필터링하는 버튼을 누르면 아예 새로운 array가 만들어지지 않음.

    그래서 item[key] === value로 한거야. 저 key는 type이 될수도 있고, color가 될수도 있으니까.
    */
    displayItems(items.filter(item => item[key] === value))
  }
}

function setEventListeners(items){
  const logo = document.querySelector('.logo');
  const buttons = document.querySelector('.buttons');
  /**
   * button이 들어있는 container 즉, <section class="buttons">에 eventListener를 등록한다고 함.
   * 이런 기법을 '이벤트 위임'이라고 함.
   * 버튼 하나하나마다 eventListener를 반복해서 등록하는 것보다
   * 버튼들이 들어있는 container에 eventListener를 등록해서 한곳에서만 handling 할 수 있도록 만든 방법.
   * 이것이 조금 더 효율적이겠죠 당연히?
   */

  logo.addEventListener('click', () => displayItems(items));
  // 로고를 클릭하면 전체 리스트를 보여주면 되는거기 때문에 displayItems를 호출하는 함수를 만들어주면 됩니다.

  buttons.addEventListener('click', (event) => onButtonClick(event, items));
  // 얘는 이벤트가 발생한 button과 items라는 array 2개를 인자로 전달해서 onButtonClick()을 호출하는 함수를 만들어주면 됩니다.
  // 여기서 event === 이벤트가 발생한 아이, 이벤트를 받은 버튼이 되겠지. 
}

// main
loadItems()
  .then(items => {
    console.log(items); // 이렇게 찍어보면 결국 array만 return받은 게 출력되는 것을 확인할 수 있습니다.
    displayItems(items);
    setEventListeners(items);
  })
  .catch(console.log);

