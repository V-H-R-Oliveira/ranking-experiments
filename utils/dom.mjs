import { BM25 } from "../utils/constants.mjs"

const scoreUl = document.getElementById("score")
const resultElement = document.getElementById("result")
const rankingAlgorithm = document.getElementById("ranking-algorithm")
const strategySelect = document.getElementById("tf-strategy")
const k1Selector = document.getElementById("k1")
const bSelector = document.getElementById("b")

const cleanPreviousResults = () => {
    const elapsedTimeElement = document.getElementById("elapsedTime")

    scoreUl.innerHTML = ""

    if (elapsedTimeElement) {
        resultElement.removeChild(elapsedTimeElement)
    }
}

const getElapsedTimeElement = (previousTime) => {
    const element = document.createElement("p")

    element.id = "elapsedTime"
    element.classList.add("subtitle")
    element.textContent = `Elapsed search time: ${Date.now() - previousTime} ms`

    return element
}

const showResults = (corpus, searchResult, searchTime) => {
    for (const [corpusIdx, score] of searchResult) {
        const document = corpus[corpusIdx]
        scoreUl.innerHTML += `<li class="score">Score for "${document}": ${score.toFixed(4)}</li>`
    }

    const elapsedTimeElement = getElapsedTimeElement(searchTime)
    resultElement.insertAdjacentElement("afterbegin", elapsedTimeElement)
}

const toggleParameters = () => {
    const strategySelectParent = strategySelect.parentElement
    const k1SelectorParent = k1Selector.parentElement
    const bSelectorParent = bSelector.parentElement

    if (rankingAlgorithm.value == BM25) {
        strategySelectParent.classList.add("hidden")
        k1SelectorParent.classList.remove("hidden")
        bSelectorParent.classList.remove("hidden")
    } else {
        strategySelectParent.classList.remove("hidden")
        k1SelectorParent.classList.add("hidden")
        bSelectorParent.classList.add("hidden")
    }
}

const getParameters = () => {
    const algorithm = rankingAlgorithm.value
    const parameters = { algorithm }

    if (algorithm == BM25) {
        const k1 = Number(k1Selector.value)
        const b = Number(bSelector.value)

        Object.assign(parameters, { k1, b })
    } else {
        const tfStrategy = strategySelect.value
        Object.assign(parameters, { tfStrategy })
    }

    return parameters
}

export { cleanPreviousResults, showResults, toggleParameters, getParameters }