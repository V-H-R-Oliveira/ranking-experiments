import TfIdf from "./rank/tf-idf.mjs"
import BM25 from "./rank/bm25.mjs"
import CorpusProcessor from "./text/textCleaner.mjs"
import { cleanPreviousResults, showResults } from "./utils/dom.mjs"
import { englishBibleCorpus } from "./corpus/all-corpus.mjs"
import { getTokenizedQuery } from "./utils/utils.mjs"

const corpusCleaner = new CorpusProcessor()
const cleanCorpus = corpusCleaner.cleanAndTokenize(englishBibleCorpus)

const searchForm = document.getElementById("search-form")
const queryInput = document.getElementById("query")
const rankingAlgorithm = document.getElementById("ranking-algorithm")
const strategySelect = document.getElementById("tf-strategy")
const k1Selector = document.getElementById("k1")
const bSelector = document.getElementById("b")

const fitAndScore = (rankingAlgorithm, query, strategy) => {
    const tokenizedQuery = getTokenizedQuery(corpusCleaner, query)
    rankingAlgorithm.fit()
    return rankingAlgorithm.search(tokenizedQuery, strategy)
}

const onSubmitHandler = (event) => {
    event.preventDefault()

    const query = queryInput?.value

    if (!query) {
        alert("Need a query")
        return
    }

    const algorithm = rankingAlgorithm?.value
    let rankAlgorithm

    if (algorithm == "bm25") {
        const bm25 = new BM25(cleanCorpus)
        bm25.k1 = Number(k1Selector.value)
        bm25.b = Number(bSelector.value)
        rankAlgorithm = bm25
    } else {
        const tfIdf = new TfIdf(cleanCorpus)
        rankAlgorithm = tfIdf
    }

    const strategy = strategySelect?.value
    const result = fitAndScore(rankAlgorithm, query, strategy)

    cleanPreviousResults()
    showResults(englishBibleCorpus, result)
}

searchForm.addEventListener("submit", onSubmitHandler)