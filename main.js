import TfIdf from "./rank/tf-idf.mjs"
import Bm25 from "./rank/bm25.mjs"
import CorpusProcessor from "./text/textCleaner.mjs"
import { cleanPreviousResults, showResults, getParameters } from "./utils/dom.mjs"
import { corpusMap } from "./corpus/all-corpus.mjs"
import { getTokenizedQuery } from "./utils/utils.mjs"
import { toggleParameters } from "./utils/dom.mjs"
import { BM25 } from "./utils/constants.mjs"

const searchForm = document.getElementById("search-form")
const selectedCorpus = document.getElementById("corpus")
const queryInput = document.getElementById("query")
const rankingAlgorithm = document.getElementById("ranking-algorithm")

rankingAlgorithm.addEventListener("change", toggleParameters)

const corpusCleaner = new CorpusProcessor()

const fitAndScore = (rankAlgorithm, query, strategy) => {
    const tokenizedQuery = getTokenizedQuery(corpusCleaner, query)
    rankAlgorithm.fit()
    return rankAlgorithm.search(tokenizedQuery, strategy)
}

const getRankAlgorithm = (corpus, parameters) => {
    if (parameters.algorithm == BM25) {
        const bm25 = new Bm25(corpus)
        bm25.k1 = parameters.k1
        bm25.b = parameters.b
        return bm25
    }

    return new TfIdf(corpus)
}

const onSubmitHandler = (event) => {
    event.preventDefault()
    cleanPreviousResults()

    const query = queryInput?.value

    if (!query) {
        alert("Need a query")
        return
    }

    const corpus = corpusMap.get(selectedCorpus.value)
    const cleanCorpus = corpusCleaner.cleanAndTokenize(corpus)

    const parameters = getParameters()
    const rankAlgorithm = getRankAlgorithm(cleanCorpus, parameters)

    const startSearch = Date.now()
    const result = fitAndScore(rankAlgorithm, query, parameters?.tfStrategy)

    showResults(corpus, result, startSearch)
}

searchForm.addEventListener("submit", onSubmitHandler)