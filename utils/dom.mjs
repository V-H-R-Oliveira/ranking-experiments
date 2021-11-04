const showCorpus = (corpus) => {
    const corpusUl = document.getElementById("corpus")

    for (const document of corpus) {
        corpusUl.innerHTML += `<li>${document}</li>`
    }
}

const scoreUl = document.getElementById("score")

const cleanPreviousResults = () => {
    scoreUl.innerHTML = ""
}

const showResults = (corpus, searchResult) => {
    for (const [corpusIdx, score] of searchResult) {
        const document = corpus[corpusIdx]
        scoreUl.innerHTML += `<li class="score text-center">Score for: "${document}": ${score.toFixed(4)}</li>`
    }
}

export { showCorpus, cleanPreviousResults, showResults }