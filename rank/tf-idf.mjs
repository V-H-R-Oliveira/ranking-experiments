import BaseScorer from "./base.mjs"
import { getTermsFrequencyMap, getArraySum } from "../utils/utils.mjs"

class TfIdf extends BaseScorer {
    constructor(corpus, topN = 5) {
        super(topN)
        this.corpus = corpus
        this.corpusLength = corpus.length
        this.documentsFrequencyMap = new Map() // idx:freqmap
        this.tfStrategiesMap = new Map()
        this.tfStrategy = undefined
    }

    #rawFrequencyStrategy(term, documentIdx) {
        const documentFrequencyMap = this.documentsFrequencyMap.get(documentIdx)
        return documentFrequencyMap.get(term) ?? 0
    }

    #booleanStrategy(term, documentIdx) {
        return Number(!!this.#rawFrequencyStrategy(term, documentIdx))
    }

    #adjustedFrequencyStrategy(term, documentIdx) {
        const termFrequency = this.#rawFrequencyStrategy(term, documentIdx)
        const allCorpusWords = getArraySum([...this.documentsFrequencyMap.get(documentIdx).values()])
        return termFrequency / allCorpusWords
    }

    #logStrategy(term, documentIdx) {
        const termFrequency = this.#rawFrequencyStrategy(term, documentIdx)
        return Math.log(1 + termFrequency)
    }

    #tf(term, documentIdx) {
        return this.tfStrategy(term, documentIdx)
    }

    #idf(term) {
        const totalTermFrequency = 1 + [...this.documentsFrequencyMap.values()].filter((values) => values.has(term)).length
        const idf = this.corpusLength / totalTermFrequency
        return Math.log(idf)
    }

    #score(term, documentIdx) {
        return this.#tf(term, documentIdx) * this.#idf(term)
    }

    fit() {
        for (const documentIdx in this.corpus) {
            const document = this.corpus[documentIdx]
            const documentFrequencyMap = getTermsFrequencyMap(document)
            this.documentsFrequencyMap.set(documentIdx, documentFrequencyMap)
        }

        this.tfStrategiesMap.set("log", this.#logStrategy)
        this.tfStrategiesMap.set("binary", this.#booleanStrategy)
        this.tfStrategiesMap.set("frequency", this.#rawFrequencyStrategy)
        this.tfStrategiesMap.set("adjustedFrequency", this.#adjustedFrequencyStrategy)

    }

    search(query, strategy) {
        const responseMap = new Map()
        this.tfStrategy = this.tfStrategiesMap.get(strategy)

        for (const corpusIdx in this.corpus) {
            const documentFrequencyMap = this.documentsFrequencyMap.get(corpusIdx)
            const filteredTerms = query.filter((term) => documentFrequencyMap.has(term))
            const allTermsScores = filteredTerms.map((term) => this.#score(term, corpusIdx))
            const finalScore = getArraySum(allTermsScores)
            responseMap.set(corpusIdx, finalScore)
        }

        const sortedResult = this.sortResult(responseMap)
        return this.showTopN(sortedResult)
    }
}

export default TfIdf