//DOM variables
const search = document.getElementById('search')
const submit = document.getElementById('submit')
const random = document.getElementById('random')
const recipesEle = document.getElementById('recipes')
const resultHeading = document.getElementById('result-heading')
const singleRecipeEle = document.getElementById('single-recipe')

//Functions
const searchRecipe = async (e) => {
  console.log('submitted')
  e.preventDefault()

  singleRecipeEle.innerHTML = ''

  const term = search.value

  if (term.trim()) {
    const res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`
    )
    const data = await res.json()
    // console.log(data)
    resultHeading.innerHTML = `<h2>Search results for '${term}':</h2>`
    if (data.meals === null) {
      resultHeading.innerHTML = `<p>No recipes found, please try again!</p>`
    } else {
      recipesEle.innerHTML = data.meals
        .map(
          (meal) => `<div class="recipe">
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
        <div class="recipe-info" data-recipeid="${meal.idMeal}">
        <h3>${meal.strMeal}</h3>
        </div>
        </div>
      `
        )
        .join('')
    }
    search.value = ''
  } else {
    alert('Please input a search term')
  }
}

const processSingleRecipe = (e) => {
  const recipeInfo = e.path.find((item) => {
    if (item.classList) {
      return item.classList.contains('recipe-info')
    } else {
      return false
    }
  })

  if (recipeInfo) {
    const recipeId = recipeInfo.getAttribute('data-recipeid')
    getRecipeById(recipeId)
  }
}

const getRecipeById = async (rId) => {
  const res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${rId}`
  )
  console.log(res)
  const data = await res.json()
  const recipe = data.meals[0]
  addRecipeToDom(recipe)
}

const addRecipeToDom = (recipe) => {
  const ingredients = []

  for (let i = 1; i <= 20; i++) {
    if (recipe[`strIngredient${i}`]) {
      ingredients.push(
        `${recipe[`strIngredient${i}`]} : ${recipe[`strMeasure${i}`]}`
      )
    } else {
      break
    }
  }

  singleRecipeEle.innerHTML = `<div class=single-recipe> <h1>${
    recipe.strMeal
  }</h1>
  <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}" />
  <div class="single-recipe-info">
  ${recipe.strCategory ? `<p>${recipe.strCategory}</p>` : ''}
  ${recipe.strArea ? `<p>${recipe.strArea}</p>` : ''}
  </div>
  <div class="instructions">
  <p>${recipe.strInstructions}</p>
  <h2>Ingredients</h2>
  <ul>
  ${ingredients.map((ing) => `<li>${ing}</li>`).join('')}
  </ul>
  </div>
  </div>`

  singleRecipeEle.scrollIntoView()
}

const randomRecipe = async () => {
  recipesEle.innerHTML = ''
  resultHeading.innerHTML = ''
  const res = await fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
  const data = await res.json()
  const recipe = data.meals[0]
  addRecipeToDom(recipe)
}

//Listners
submit.addEventListener('submit', searchRecipe)
recipesEle.addEventListener('click', processSingleRecipe)
random.addEventListener('click', randomRecipe)
